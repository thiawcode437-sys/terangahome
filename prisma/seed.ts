import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { hash } from "bcryptjs";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@terangahome.sn" },
    update: {},
    create: {
      name: "Admin TerangaHome",
      email: "admin@terangahome.sn",
      phone: "+221 77 000 00 00",
      password: adminPassword,
      role: "ADMIN",
      city: "Dakar",
      latitude: 14.6928,
      longitude: -17.4467,
      isOnline: true,
      lastSeenAt: new Date(),
    },
  });
  console.log("Admin créé:", admin.email);

  // Create sample agent
  const agentPassword = await hash("agent123", 12);
  const agent = await prisma.user.upsert({
    where: { email: "moussa@terangahome.sn" },
    update: {},
    create: {
      name: "Moussa Diop",
      email: "moussa@terangahome.sn",
      phone: "+221 77 111 11 11",
      password: agentPassword,
      role: "AGENT",
      city: "Dakar",
      latitude: 14.7167,
      longitude: -17.4677,
      isOnline: true,
      lastSeenAt: new Date(),
      bio: "Agent immobilier certifié avec 10 ans d'expérience à Dakar",
    },
  });

  // Create sample seller
  const sellerPassword = await hash("seller123", 12);
  const seller = await prisma.user.upsert({
    where: { email: "fatou@terangahome.sn" },
    update: {},
    create: {
      name: "Fatou Sow",
      email: "fatou@terangahome.sn",
      phone: "+221 77 222 22 22",
      password: sellerPassword,
      role: "VENDEUR",
      city: "Thiès",
      latitude: 14.7910,
      longitude: -16.9359,
      isOnline: false,
      lastSeenAt: new Date(Date.now() - 3600000),
    },
  });

  // Create livreurs
  const livreurPassword = await hash("livreur123", 12);
  await prisma.user.upsert({
    where: { email: "ibrahima.livreur@terangahome.sn" },
    update: {},
    create: {
      name: "Ibrahima Fall",
      email: "ibrahima.livreur@terangahome.sn",
      phone: "+221 77 312 45 67",
      password: livreurPassword,
      role: "LIVREUR",
      city: "Dakar",
      vehicleType: "MOTO",
      deliveryZone: "Dakar",
      latitude: 14.6937,
      longitude: -17.4441,
      isOnline: true,
      isAvailable: true,
      lastSeenAt: new Date(),
    },
  });

  await prisma.user.upsert({
    where: { email: "abdou.livreur@terangahome.sn" },
    update: {},
    create: {
      name: "Abdou Diallo",
      email: "abdou.livreur@terangahome.sn",
      phone: "+221 78 456 78 90",
      password: livreurPassword,
      role: "LIVREUR",
      city: "Dakar",
      vehicleType: "VOITURE",
      deliveryZone: "Dakar",
      latitude: 14.7256,
      longitude: -17.4542,
      isOnline: true,
      isAvailable: true,
      lastSeenAt: new Date(),
    },
  });

  // Delete existing annonces first (for re-seeding)
  await prisma.annonce.deleteMany({});

  // Create sample annonces with photos
  const annonces = [
    {
      title: "Bel appartement 3 pièces - Dakar Plateau",
      description: "Magnifique appartement de 3 pièces situé au coeur du Plateau. Lumineux, climatisation centralisée, parking sécurisé. Salon spacieux, cuisine équipée, 2 salles de bain. Idéal pour famille ou professionnel.",
      price: 350000, category: "LOCATION", city: "Dakar", address: "Rue Carnot, Plateau",
      rooms: 3, surface: 95, status: "ACTIVE", userId: agent.id,
      images: JSON.stringify([
        "https://picsum.photos/seed/appart-dakar1/800/600",
        "https://picsum.photos/seed/appart-dakar2/800/600",
        "https://picsum.photos/seed/appart-dakar3/800/600",
      ]),
    },
    {
      title: "Villa luxueuse avec piscine - Almadies",
      description: "Villa moderne de standing avec 5 chambres, piscine, jardin tropical. Vue sur mer. Double garage, personnel de maison. Quartier résidentiel calme et sécurisé.",
      price: 250000000, category: "VENTE", city: "Dakar", address: "Les Almadies",
      rooms: 5, surface: 350, status: "ACTIVE", userId: agent.id,
      images: JSON.stringify([
        "https://picsum.photos/seed/villa-almadies1/800/600",
        "https://picsum.photos/seed/villa-almadies2/800/600",
        "https://picsum.photos/seed/villa-almadies3/800/600",
        "https://picsum.photos/seed/villa-almadies4/800/600",
      ]),
    },
    {
      title: "Terrain 500m² - Zone résidentielle Thiès",
      description: "Terrain viabilisé de 500m² dans une zone résidentielle calme. Titre foncier disponible. Eau et électricité à proximité. Accès goudronné. Idéal pour construction de villa.",
      price: 15000000, category: "TERRAIN", city: "Thiès",
      surface: 500, status: "ACTIVE", userId: seller.id,
      images: JSON.stringify([
        "https://picsum.photos/seed/terrain-thies1/800/600",
        "https://picsum.photos/seed/terrain-thies2/800/600",
      ]),
    },
    {
      title: "Studio meublé - Sacré Coeur",
      description: "Studio entièrement meublé et équipé prêt à habiter. Wifi haut débit inclus. Climatisation, cuisine américaine, salle de bain moderne. Gardien 24h/24.",
      price: 180000, category: "LOCATION", city: "Dakar", address: "Sacré Coeur 3",
      rooms: 1, surface: 35, status: "ACTIVE", userId: agent.id,
      images: JSON.stringify([
        "https://picsum.photos/seed/studio-sc1/800/600",
        "https://picsum.photos/seed/studio-sc2/800/600",
        "https://picsum.photos/seed/studio-sc3/800/600",
      ]),
    },
    {
      title: "Maison 4 chambres - Mbour",
      description: "Belle maison familiale de 4 chambres avec cour intérieure. Construction récente, bon état général. Quartier calme et sécurisé. Proche plage et commerces.",
      price: 45000000, category: "VENTE", city: "Mbour",
      rooms: 4, surface: 200, status: "ACTIVE", userId: seller.id,
      images: JSON.stringify([
        "https://picsum.photos/seed/maison-mbour1/800/600",
        "https://picsum.photos/seed/maison-mbour2/800/600",
        "https://picsum.photos/seed/maison-mbour3/800/600",
      ]),
    },
    {
      title: "iPhone 14 Pro - Comme neuf",
      description: "iPhone 14 Pro 256Go, couleur noire. Acheté il y a 6 mois, en parfait état. Avec boîte et accessoires d'origine. Batterie à 97%. Facture disponible.",
      price: 450000, category: "PRODUIT", city: "Dakar",
      status: "ACTIVE", userId: seller.id,
      images: JSON.stringify([
        "https://picsum.photos/seed/iphone14-pro1/800/600",
        "https://picsum.photos/seed/iphone14-pro2/800/600",
      ]),
    },
    {
      title: "Canapé salon moderne 7 places",
      description: "Canapé en cuir synthétique 7 places, très confortable. Couleur beige. État impeccable, acheté il y a 3 mois. Livraison possible à Dakar et banlieue.",
      price: 280000, category: "PRODUIT", city: "Dakar",
      status: "ACTIVE", userId: seller.id,
      images: JSON.stringify([
        "https://picsum.photos/seed/canape-salon1/800/600",
        "https://picsum.photos/seed/canape-salon2/800/600",
        "https://picsum.photos/seed/canape-salon3/800/600",
      ]),
    },
    {
      title: "Appartement F4 standing - Mermoz",
      description: "Superbe appartement 4 pièces au 3ème étage avec ascenseur. Vue dégagée, balcon, 2 salles de bain, cuisine équipée. Résidence sécurisée avec piscine.",
      price: 85000000, category: "VENTE", city: "Dakar", address: "Mermoz",
      rooms: 4, surface: 140, status: "ACTIVE", userId: agent.id,
      images: JSON.stringify([
        "https://picsum.photos/seed/f4-mermoz1/800/600",
        "https://picsum.photos/seed/f4-mermoz2/800/600",
        "https://picsum.photos/seed/f4-mermoz3/800/600",
        "https://picsum.photos/seed/f4-mermoz4/800/600",
      ]),
    },
    {
      title: "Terrain 1000m² bord de mer - Saly",
      description: "Parcelle exceptionnelle de 1000m² en front de mer à Saly. Titre foncier. Zone touristique, idéal pour projet hôtelier ou résidence de vacances.",
      price: 75000000, category: "TERRAIN", city: "Mbour",
      surface: 1000, status: "ACTIVE", userId: seller.id,
      images: JSON.stringify([
        "https://picsum.photos/seed/terrain-saly1/800/600",
        "https://picsum.photos/seed/terrain-saly2/800/600",
      ]),
    },
    {
      title: "MacBook Pro M3 - Occasion",
      description: "MacBook Pro 14 pouces, puce M3, 16Go RAM, 512Go SSD. Acheté en janvier 2025, sous garantie Apple. Parfait état, zéro rayure. Chargeur MagSafe inclus.",
      price: 850000, category: "PRODUIT", city: "Dakar",
      status: "ACTIVE", userId: agent.id,
      images: JSON.stringify([
        "https://picsum.photos/seed/macbook-m3-1/800/600",
        "https://picsum.photos/seed/macbook-m3-2/800/600",
      ]),
    },
    {
      title: "Chambre meublée - Ouakam",
      description: "Chambre spacieuse dans colocation. Meublée, climatisée, wifi inclus. Quartier calme, proche transport. Charges comprises dans le loyer.",
      price: 85000, category: "LOCATION", city: "Dakar", address: "Ouakam",
      rooms: 1, surface: 18, status: "ACTIVE", userId: seller.id,
      images: JSON.stringify([
        "https://picsum.photos/seed/chambre-ouakam1/800/600",
        "https://picsum.photos/seed/chambre-ouakam2/800/600",
      ]),
    },
    {
      title: "Réfrigérateur Samsung 350L",
      description: "Réfrigérateur Samsung double porte, 350 litres. No Frost, classe énergétique A+. Très bon état, fonctionne parfaitement. Raison de vente : déménagement.",
      price: 165000, category: "PRODUIT", city: "Dakar",
      status: "ACTIVE", userId: seller.id,
      images: JSON.stringify([
        "https://picsum.photos/seed/frigo-samsung1/800/600",
        "https://picsum.photos/seed/frigo-samsung2/800/600",
      ]),
    },
  ];

  for (const annonce of annonces) {
    await prisma.annonce.create({ data: annonce });
  }
  console.log(`${annonces.length} annonces créées`);

  console.log("\nSeed terminé !");
  console.log("Comptes de test:");
  console.log("  Admin:   admin@terangahome.sn / admin123");
  console.log("  Agent:   moussa@terangahome.sn / agent123");
  console.log("  Vendeur: fatou@terangahome.sn / seller123");
  console.log("  Livreur: ibrahima.livreur@terangahome.sn / livreur123");
  console.log("  Livreur: abdou.livreur@terangahome.sn / livreur123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
