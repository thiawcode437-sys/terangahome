import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { hash } from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
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
    },
  });
  console.log("Admin cr\u00e9\u00e9:", admin.email);

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
      bio: "Agent immobilier certifi\u00e9 avec 10 ans d'exp\u00e9rience \u00e0 Dakar",
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
      city: "Thi\u00e8s",
    },
  });

  // Create sample annonces
  const annonces = [
    {
      title: "Bel appartement 3 pi\u00e8ces - Dakar Plateau",
      description: "Magnifique appartement de 3 pi\u00e8ces situ\u00e9 au c\u0153ur du Plateau. Lumineux, climatisation centralis\u00e9e, parking s\u00e9curis\u00e9. Proche de toutes commodit\u00e9s.",
      price: 350000,
      category: "LOCATION",
      city: "Dakar",
      address: "Rue Carnot, Plateau",
      rooms: 3,
      surface: 95,
      status: "ACTIVE",
      userId: agent.id,
    },
    {
      title: "Villa luxueuse avec piscine - Almadies",
      description: "Villa moderne de standing avec 5 chambres, piscine, jardin tropical. Vue sur mer. Id\u00e9al pour famille ou repr\u00e9sentation.",
      price: 250000000,
      category: "VENTE",
      city: "Dakar",
      address: "Les Almadies",
      rooms: 5,
      surface: 350,
      status: "ACTIVE",
      userId: agent.id,
    },
    {
      title: "Terrain 500m\u00b2 - Zone r\u00e9sidentielle Thi\u00e8s",
      description: "Terrain viabilis\u00e9 de 500m\u00b2 dans une zone r\u00e9sidentielle calme. Titre foncier disponible. Eau et \u00e9lectricit\u00e9 \u00e0 proximit\u00e9.",
      price: 15000000,
      category: "TERRAIN",
      city: "Thi\u00e8s",
      surface: 500,
      status: "ACTIVE",
      userId: seller.id,
    },
    {
      title: "Studio meubl\u00e9 - Sacr\u00e9 C\u0153ur",
      description: "Studio enti\u00e8rement meubl\u00e9 et \u00e9quip\u00e9 pr\u00eat \u00e0 habiter. Wifi inclus. Id\u00e9al \u00e9tudiant ou jeune professionnel.",
      price: 180000,
      category: "LOCATION",
      city: "Dakar",
      address: "Sacr\u00e9 C\u0153ur 3",
      rooms: 1,
      surface: 35,
      status: "ACTIVE",
      userId: agent.id,
    },
    {
      title: "Maison 4 chambres - Mbour",
      description: "Belle maison familiale de 4 chambres avec cour int\u00e9rieure. Construction r\u00e9cente, bon \u00e9tat g\u00e9n\u00e9ral. Quartier calme et s\u00e9curis\u00e9.",
      price: 45000000,
      category: "VENTE",
      city: "Mbour",
      rooms: 4,
      surface: 200,
      status: "ACTIVE",
      userId: seller.id,
    },
    {
      title: "iPhone 14 Pro - Comme neuf",
      description: "iPhone 14 Pro 256Go, couleur noire. Achet\u00e9 il y a 6 mois, en parfait \u00e9tat. Avec bo\u00eete et accessoires d'origine.",
      price: 450000,
      category: "PRODUIT",
      city: "Dakar",
      status: "ACTIVE",
      userId: seller.id,
    },
    {
      title: "Canap\u00e9 salon moderne 7 places",
      description: "Canap\u00e9 en cuir synth\u00e9tique 7 places, tr\u00e8s confortable. Couleur beige. Livraison possible \u00e0 Dakar.",
      price: 280000,
      category: "PRODUIT",
      city: "Dakar",
      status: "ACTIVE",
      userId: seller.id,
    },
  ];

  for (const annonce of annonces) {
    await prisma.annonce.create({ data: annonce });
  }
  console.log(`${annonces.length} annonces cr\u00e9\u00e9es`);

  console.log("\nSeed termin\u00e9 !");
  console.log("Comptes de test:");
  console.log("  Admin: admin@terangahome.sn / admin123");
  console.log("  Agent: moussa@terangahome.sn / agent123");
  console.log("  Vendeur: fatou@terangahome.sn / seller123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
