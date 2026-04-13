import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { haversineDistance, estimateDeliveryPrice, estimateDeliveryTime } from "@/lib/geo";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const role = (session.user as Record<string, unknown>).role as string;
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};

  // Livreurs see their assigned deliveries, buyers see their orders
  if (role === "LIVREUR") {
    where.livreurId = session.user.id;
  } else if (role === "ADMIN") {
    // Admin sees all
  } else {
    where.buyerId = session.user.id;
  }

  if (status) where.status = status;

  const livraisons = await prisma.livraison.findMany({
    where,
    include: {
      annonce: {
        select: { id: true, title: true, price: true, images: true, city: true },
      },
      buyer: { select: { id: true, name: true, phone: true, city: true } },
      livreur: {
        select: { id: true, name: true, phone: true, vehicleType: true, latitude: true, longitude: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(livraisons);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { annonceId, deliveryAddress, deliveryLat, deliveryLng, notes } =
      await request.json();

    if (!annonceId) {
      return Response.json({ error: "Annonce requise" }, { status: 400 });
    }

    // Get the annonce and seller info
    const annonce = await prisma.annonce.findUnique({
      where: { id: annonceId },
      include: {
        user: { select: { id: true, name: true, phone: true, latitude: true, longitude: true, city: true } },
      },
    });

    if (!annonce) {
      return Response.json({ error: "Annonce non trouvée" }, { status: 404 });
    }

    if (annonce.userId === session.user.id) {
      return Response.json({ error: "Vous ne pouvez pas acheter votre propre annonce" }, { status: 400 });
    }

    // Use annonce/seller location as pickup point
    const pickupLat = annonce.latitude || annonce.user.latitude;
    const pickupLng = annonce.longitude || annonce.user.longitude;

    // Find the nearest available livreur
    const livreurs = await prisma.user.findMany({
      where: {
        role: "LIVREUR",
        isAvailable: true,
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        latitude: true,
        longitude: true,
        vehicleType: true,
        isOnline: true,
      },
    });

    let nearestLivreur = null;
    let minDistance = Infinity;

    if (pickupLat && pickupLng) {
      for (const livreur of livreurs) {
        if (livreur.latitude && livreur.longitude) {
          const dist = haversineDistance(
            pickupLat,
            pickupLng,
            livreur.latitude,
            livreur.longitude
          );
          if (dist < minDistance) {
            minDistance = dist;
            nearestLivreur = livreur;
          }
        }
      }
    } else {
      // No GPS data, pick first available online livreur
      nearestLivreur = livreurs.find((l) => l.isOnline) || livreurs[0] || null;
      minDistance = 5; // Default 5km
    }

    // Calculate delivery distance (pickup to delivery)
    let totalDistance = minDistance;
    if (pickupLat && pickupLng && deliveryLat && deliveryLng) {
      totalDistance = haversineDistance(pickupLat, pickupLng, deliveryLat, deliveryLng);
    }

    const deliveryPrice = estimateDeliveryPrice(totalDistance);
    const estimatedTime = estimateDeliveryTime(totalDistance);

    // Create the livraison
    const livraison = await prisma.livraison.create({
      data: {
        annonceId,
        buyerId: session.user.id,
        livreurId: nearestLivreur?.id || null,
        status: nearestLivreur ? "PENDING" : "PENDING",
        deliveryPrice,
        distance: Math.round(totalDistance * 10) / 10,
        pickupAddress: annonce.address || annonce.city,
        deliveryAddress: deliveryAddress || null,
        pickupLat: pickupLat || null,
        pickupLng: pickupLng || null,
        deliveryLat: deliveryLat ? parseFloat(deliveryLat) : null,
        deliveryLng: deliveryLng ? parseFloat(deliveryLng) : null,
        notes: notes || null,
        estimatedTime,
      },
      include: {
        annonce: { select: { title: true, price: true } },
        livreur: { select: { name: true, phone: true, vehicleType: true } },
      },
    });

    // Notify the livreur
    if (nearestLivreur) {
      await prisma.notification.create({
        data: {
          type: "NEW_DELIVERY",
          title: "Nouvelle livraison",
          message: `Nouvelle commande à récupérer : ${annonce.title} (${annonce.city}). Distance : ${Math.round(totalDistance * 10) / 10} km.`,
          userId: nearestLivreur.id,
          link: "/livraisons",
        },
      });

      // Auto-send message from system to livreur
      await prisma.message.create({
        data: {
          content: `Nouvelle livraison assignée !\n\nProduit : ${annonce.title}\nVendeur : ${annonce.user.name} (${annonce.user.phone || "pas de tél."})\nAdresse récupération : ${annonce.address || annonce.city}\nDistance : ${Math.round(totalDistance * 10) / 10} km\nPrix livraison : ${deliveryPrice} FCFA\n\nContactez le vendeur pour organiser la récupération.`,
          senderId: session.user.id,
          receiverId: nearestLivreur.id,
          annonceId,
        },
      });

      // Notify the seller
      await prisma.notification.create({
        data: {
          type: "NEW_ORDER",
          title: "Nouvelle commande",
          message: `${session.user.name} a commandé votre produit "${annonce.title}". Le livreur ${nearestLivreur.name} (${nearestLivreur.phone}) va vous contacter pour la récupération.`,
          userId: annonce.userId,
          link: `/annonces/${annonce.id}`,
        },
      });

      // Auto-send message from livreur to seller
      await prisma.message.create({
        data: {
          content: `Bonjour ${annonce.user.name},\n\nJe suis ${nearestLivreur.name}, livreur TerangaHome. Un client a commandé votre produit "${annonce.title}". Je viendrai le récupérer.\n\nMon téléphone : ${nearestLivreur.phone}\nVéhicule : ${nearestLivreur.vehicleType || "Non spécifié"}\n\nMerci de préparer le colis.`,
          senderId: nearestLivreur.id,
          receiverId: annonce.userId,
          annonceId,
        },
      });
    }

    // Notify the buyer
    await prisma.notification.create({
      data: {
        type: "ORDER_CONFIRMED",
        title: "Commande confirmée",
        message: nearestLivreur
          ? `Votre commande "${annonce.title}" est confirmée. Le livreur ${nearestLivreur.name} est assigné. Temps estimé : ~${estimatedTime} min.`
          : `Votre commande "${annonce.title}" est en attente d'un livreur disponible.`,
        userId: session.user.id,
        link: "/livraisons",
      },
    });

    return Response.json(livraison, { status: 201 });
  } catch (err) {
    console.error("Livraison error:", err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
