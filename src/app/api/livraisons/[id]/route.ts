import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  const livraison = await prisma.livraison.findUnique({
    where: { id },
    include: {
      annonce: { select: { title: true } },
      buyer: { select: { id: true, name: true } },
      livreur: { select: { id: true, name: true } },
    },
  });

  if (!livraison) {
    return Response.json({ error: "Livraison non trouvée" }, { status: 404 });
  }

  const role = (session.user as Record<string, unknown>).role as string;

  // Only livreur assigned or admin can update
  if (livraison.livreurId !== session.user.id && role !== "ADMIN") {
    return Response.json({ error: "Non autorisé" }, { status: 403 });
  }

  const updateData: Record<string, unknown> = { status };

  if (status === "ACCEPTED") {
    updateData.acceptedAt = new Date();
  } else if (status === "PICKED_UP") {
    updateData.pickedUpAt = new Date();
  } else if (status === "DELIVERED") {
    updateData.deliveredAt = new Date();
  }

  const updated = await prisma.livraison.update({
    where: { id },
    data: updateData,
  });

  // Notify buyer on status change
  const statusMessages: Record<string, string> = {
    ACCEPTED: `Le livreur ${livraison.livreur?.name} a accepté la livraison de "${livraison.annonce.title}".`,
    PICKED_UP: `Le livreur a récupéré "${livraison.annonce.title}" chez le vendeur. En route vers vous.`,
    IN_TRANSIT: `Votre commande "${livraison.annonce.title}" est en cours de livraison.`,
    DELIVERED: `Votre commande "${livraison.annonce.title}" a été livrée avec succès !`,
    CANCELLED: `La livraison de "${livraison.annonce.title}" a été annulée.`,
  };

  if (statusMessages[status]) {
    await prisma.notification.create({
      data: {
        type: `DELIVERY_${status}`,
        title: status === "DELIVERED" ? "Livraison effectuée" : "Mise à jour livraison",
        message: statusMessages[status],
        userId: livraison.buyerId,
        link: "/livraisons",
      },
    });
  }

  return Response.json(updated);
}
