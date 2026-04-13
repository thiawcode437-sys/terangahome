import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { hash } from "bcryptjs";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding TerangaHome database avec données réelles du marché sénégalais...\n");

  // ============================================
  // USERS
  // ============================================

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
  console.log("✅ Admin créé:", admin.email);

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
      bio: "Agent immobilier certifié avec 10 ans d'expérience à Dakar. Spécialiste Almadies, Mermoz, Plateau.",
    },
  });

  const agent2Password = await hash("agent123", 12);
  const agent2 = await prisma.user.upsert({
    where: { email: "aminata@terangahome.sn" },
    update: {},
    create: {
      name: "Aminata Ndiaye",
      email: "aminata@terangahome.sn",
      phone: "+221 78 543 21 00",
      password: agent2Password,
      role: "AGENT",
      city: "Thiès",
      latitude: 14.7910,
      longitude: -16.9359,
      isOnline: true,
      lastSeenAt: new Date(),
      bio: "Agente immobilière spécialisée Petite Côte : Saly, Somone, Mbour, Ngaparou. 7 ans d'expérience.",
    },
  });

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
      city: "Dakar",
      latitude: 14.6937,
      longitude: -17.4441,
      isOnline: true,
      lastSeenAt: new Date(),
      bio: "Vendeuse de produits high-tech et électroménager. Livraison Dakar et banlieue.",
    },
  });

  const seller2Password = await hash("seller123", 12);
  const seller2 = await prisma.user.upsert({
    where: { email: "ousmane@terangahome.sn" },
    update: {},
    create: {
      name: "Ousmane Ba",
      email: "ousmane@terangahome.sn",
      phone: "+221 76 890 12 34",
      password: seller2Password,
      role: "VENDEUR",
      city: "Dakar",
      latitude: 14.7256,
      longitude: -17.4542,
      isOnline: false,
      lastSeenAt: new Date(Date.now() - 7200000),
      bio: "Boutique multimédia Plateau. Téléphones, ordinateurs, accessoires. Garantie sur tous les produits.",
    },
  });

  const seller3Password = await hash("seller123", 12);
  const seller3 = await prisma.user.upsert({
    where: { email: "aissatou@terangahome.sn" },
    update: {},
    create: {
      name: "Aissatou Diallo",
      email: "aissatou@terangahome.sn",
      phone: "+221 77 654 32 10",
      password: seller3Password,
      role: "VENDEUR",
      city: "Mbour",
      latitude: 14.4167,
      longitude: -16.9667,
      isOnline: true,
      lastSeenAt: new Date(),
      bio: "Spécialiste ameublement et décoration. Livraison disponible sur toute la Petite Côte.",
    },
  });

  // Livreurs
  const livreurPassword = await hash("livreur123", 12);
  const livreur1 = await prisma.user.upsert({
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
      bio: "Livreur rapide en moto. Zone Dakar centre, Plateau, Médina, Fann.",
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
      bio: "Livraison en voiture pour colis volumineux. Dakar, Pikine, Guédiawaye, Rufisque.",
    },
  });

  await prisma.user.upsert({
    where: { email: "cheikh.livreur@terangahome.sn" },
    update: {},
    create: {
      name: "Cheikh Mbaye",
      email: "cheikh.livreur@terangahome.sn",
      phone: "+221 70 123 45 67",
      password: livreurPassword,
      role: "LIVREUR",
      city: "Thiès",
      vehicleType: "CAMION",
      deliveryZone: "Thiès",
      latitude: 14.7910,
      longitude: -16.9359,
      isOnline: true,
      isAvailable: true,
      lastSeenAt: new Date(),
      bio: "Transport et livraison gros colis. Thiès, Mbour, Saly, Somone.",
    },
  });

  console.log("✅ Utilisateurs créés (3 agents, 3 vendeurs, 3 livreurs, 1 admin)\n");

  // ============================================
  // DELETE EXISTING ANNONCES
  // ============================================
  await prisma.annonce.deleteMany({});
  console.log("🗑️  Anciennes annonces supprimées\n");

  // ============================================
  // ANNONCES — DONNÉES RÉELLES DU MARCHÉ SÉNÉGALAIS
  // ============================================

  const annonces = [
    // ──────────────────────────────────────────
    // LOCATION (Appartements à louer)
    // ──────────────────────────────────────────
    {
      title: "Appartement F4 moderne - Mermoz",
      description: "Superbe appartement moderne et lumineux à Mermoz. 3 chambres avec placards, salon et salle à manger avec balcon, cuisine équipée, buanderie, WC visiteurs. Ascenseur, sécurité 24h/24, parking. Résidence haut standing.",
      price: 1350000, category: "LOCATION", city: "Dakar", address: "Mermoz, Dakar",
      rooms: 4, surface: 150, status: "ACTIVE", userId: agent.id,
      latitude: 14.7050, longitude: -17.4700,
      images: JSON.stringify([
        "https://picsum.photos/seed/mermoz-f4-1/800/600",
        "https://picsum.photos/seed/mermoz-f4-2/800/600",
        "https://picsum.photos/seed/mermoz-f4-3/800/600",
        "https://picsum.photos/seed/mermoz-f4-4/800/600",
      ]),
    },
    {
      title: "Appartement F3 - Ngor Almadies",
      description: "Bel appartement 2 chambres aux Almadies. Salon et salle à manger avec balcon vue mer, cuisine équipée, 2 salles de bain. Résidence sécurisée avec parking et ascenseur. Quartier calme et résidentiel.",
      price: 750000, category: "LOCATION", city: "Dakar", address: "Almadies, Ngor",
      rooms: 3, surface: 110, status: "ACTIVE", userId: agent.id,
      latitude: 14.7500, longitude: -17.5130,
      images: JSON.stringify([
        "https://picsum.photos/seed/almadies-f3-1/800/600",
        "https://picsum.photos/seed/almadies-f3-2/800/600",
        "https://picsum.photos/seed/almadies-f3-3/800/600",
      ]),
    },
    {
      title: "Appartement F4 standing - Sacré-Cœur",
      description: "Appartement haut standing F4 à Sacré-Cœur. 200m², 3 chambres avec SDB privative, grand salon, cuisine américaine équipée. Résidence avec piscine chauffée, salle de sport, sécurité 24h/24, parking, groupe électrogène.",
      price: 1000000, category: "LOCATION", city: "Dakar", address: "Sacré-Cœur, Dakar",
      rooms: 4, surface: 200, status: "ACTIVE", userId: agent.id,
      latitude: 14.7230, longitude: -17.4620,
      images: JSON.stringify([
        "https://picsum.photos/seed/sc-f4-1/800/600",
        "https://picsum.photos/seed/sc-f4-2/800/600",
        "https://picsum.photos/seed/sc-f4-3/800/600",
        "https://picsum.photos/seed/sc-f4-4/800/600",
      ]),
    },
    {
      title: "F3 meublé bord de mer - Ngaparou",
      description: "F3 neuf, spacieux et lumineux, entièrement meublé à Ngaparou. 2 chambres avec SDB privative, cuisine équipée, salon. Résidence sécurisée à 5 minutes de la plage. Idéal expatriés ou vacanciers.",
      price: 550000, category: "LOCATION", city: "Mbour", address: "Ngaparou, Petite Côte",
      rooms: 3, surface: 90, status: "ACTIVE", userId: agent2.id,
      latitude: 14.3500, longitude: -16.9500,
      images: JSON.stringify([
        "https://picsum.photos/seed/ngaparou-f3-1/800/600",
        "https://picsum.photos/seed/ngaparou-f3-2/800/600",
        "https://picsum.photos/seed/ngaparou-f3-3/800/600",
      ]),
    },
    {
      title: "Studio meublé - Ngor",
      description: "Studio pour location longue durée à Ngor. Kitchenette équipée, salle de bain, climatisation. Bâtiment sécurisé, quartier calme proche de la plage. Wifi et charges comprises.",
      price: 250000, category: "LOCATION", city: "Dakar", address: "Ngor, Dakar",
      rooms: 1, surface: 30, status: "ACTIVE", userId: agent.id,
      latitude: 14.7480, longitude: -17.5100,
      images: JSON.stringify([
        "https://picsum.photos/seed/ngor-studio-1/800/600",
        "https://picsum.photos/seed/ngor-studio-2/800/600",
      ]),
    },
    {
      title: "Appartement F3 - Médina",
      description: "Appartement F3 bien situé en plein cœur de la Médina. 2 chambres avec SDB privative, salon, balcon. Accès facile aux transports. Quartier vivant et commerçant. Idéal pour jeune couple ou professionnel.",
      price: 400000, category: "LOCATION", city: "Dakar", address: "Médina, Dakar",
      rooms: 3, surface: 75, status: "ACTIVE", userId: agent.id,
      latitude: 14.6800, longitude: -17.4450,
      images: JSON.stringify([
        "https://picsum.photos/seed/medina-f3-1/800/600",
        "https://picsum.photos/seed/medina-f3-2/800/600",
      ]),
    },
    {
      title: "F4 avec terrasse - Grand Dakar",
      description: "Appartement F4 spacieux à Grand Dakar. 3 chambres, salon, cuisine, salle de bain. Grande terrasse. Quartier résidentiel calme. Proche marché et transport en commun.",
      price: 300000, category: "LOCATION", city: "Dakar", address: "Grand Dakar",
      rooms: 4, surface: 100, status: "ACTIVE", userId: agent.id,
      latitude: 14.6900, longitude: -17.4500,
      images: JSON.stringify([
        "https://picsum.photos/seed/gd-f4-1/800/600",
        "https://picsum.photos/seed/gd-f4-2/800/600",
        "https://picsum.photos/seed/gd-f4-3/800/600",
      ]),
    },

    // ──────────────────────────────────────────
    // VENTE (Immobilier)
    // ──────────────────────────────────────────
    {
      title: "Villa luxueuse avec piscine - Almadies",
      description: "Villa prestigieuse de 600m² aux Almadies. 10 chambres, multiple salons, piscine. Adaptée pour usage institutionnel, bureaux de standing ou résidence de luxe. Titre foncier. Quartier le plus prisé de Dakar.",
      price: 950000000, category: "VENTE", city: "Dakar", address: "Les Almadies, Dakar",
      rooms: 10, surface: 600, status: "ACTIVE", userId: agent.id,
      latitude: 14.7450, longitude: -17.5200,
      images: JSON.stringify([
        "https://picsum.photos/seed/villa-almadies-1/800/600",
        "https://picsum.photos/seed/villa-almadies-2/800/600",
        "https://picsum.photos/seed/villa-almadies-3/800/600",
        "https://picsum.photos/seed/villa-almadies-4/800/600",
      ]),
    },
    {
      title: "Immeuble R+4 moderne - Ngor",
      description: "Immeuble moderne R+4 à Ngor avec 7 appartements. Taux d'occupation 100%. Ascenseur, groupe électrogène, finitions haut de gamme. Excellent investissement locatif. Revenus locatifs garantis.",
      price: 750000000, category: "VENTE", city: "Dakar", address: "Ngor, Dakar",
      rooms: 7, surface: 1000, status: "ACTIVE", userId: agent.id,
      latitude: 14.7480, longitude: -17.5080,
      images: JSON.stringify([
        "https://picsum.photos/seed/immeuble-ngor-1/800/600",
        "https://picsum.photos/seed/immeuble-ngor-2/800/600",
        "https://picsum.photos/seed/immeuble-ngor-3/800/600",
      ]),
    },
    {
      title: "Villa vue mer avec piscine - Popenguine",
      description: "Magnifique villa sur les hauteurs de Popenguine avec vue panoramique sur l'océan et la réserve naturelle. 5 chambres, piscine, multiples espaces de vie. Terrain de 3000m², construction 585m². Calme absolu.",
      price: 525000000, category: "VENTE", city: "Thiès", address: "Popenguine, Petite Côte",
      rooms: 5, surface: 585, status: "ACTIVE", userId: agent2.id,
      latitude: 14.5500, longitude: -17.1000,
      images: JSON.stringify([
        "https://picsum.photos/seed/villa-popenguine-1/800/600",
        "https://picsum.photos/seed/villa-popenguine-2/800/600",
        "https://picsum.photos/seed/villa-popenguine-3/800/600",
        "https://picsum.photos/seed/villa-popenguine-4/800/600",
      ]),
    },
    {
      title: "Maison duplex R+1 - Saint-Louis",
      description: "Maison duplex R+1 avenue des Grands Hommes à Saint-Louis. 8 chambres, 413m². Titre foncier individuel. Architecture coloniale rénovée. Quartier historique, proche du fleuve.",
      price: 160000000, category: "VENTE", city: "Saint-Louis", address: "Avenue des Grands Hommes, Saint-Louis",
      rooms: 8, surface: 413, status: "ACTIVE", userId: agent.id,
      latitude: 16.0200, longitude: -16.4900,
      images: JSON.stringify([
        "https://picsum.photos/seed/duplex-stlouis-1/800/600",
        "https://picsum.photos/seed/duplex-stlouis-2/800/600",
        "https://picsum.photos/seed/duplex-stlouis-3/800/600",
      ]),
    },
    {
      title: "Villa R+1 rénovée - Cité Djily Mbaye, Yoff",
      description: "Charmante villa R+1 entièrement rénovée en 2024 à la Cité Djily Mbaye, Yoff. 3 chambres avec SDB intérieure chacune. 228m². Titre foncier. Quartier résidentiel calme. Proche commerces et transport.",
      price: 170000000, category: "VENTE", city: "Dakar", address: "Yoff, Cité Djily Mbaye",
      rooms: 3, surface: 228, status: "ACTIVE", userId: agent.id,
      latitude: 14.7600, longitude: -17.4900,
      images: JSON.stringify([
        "https://picsum.photos/seed/villa-yoff-1/800/600",
        "https://picsum.photos/seed/villa-yoff-2/800/600",
        "https://picsum.photos/seed/villa-yoff-3/800/600",
      ]),
    },
    {
      title: "Villa avec piscine - Somone",
      description: "Maison 5 chambres à Somone Extension. Installation solaire complète, caméras de surveillance, terrain aménagé avec possibilité piscine. 280m² habitable. Cadre verdoyant et paisible.",
      price: 160000000, category: "VENTE", city: "Mbour", address: "Somone Extension",
      rooms: 5, surface: 280, status: "ACTIVE", userId: agent2.id,
      latitude: 14.4800, longitude: -17.0700,
      images: JSON.stringify([
        "https://picsum.photos/seed/villa-somone-1/800/600",
        "https://picsum.photos/seed/villa-somone-2/800/600",
        "https://picsum.photos/seed/villa-somone-3/800/600",
      ]),
    },
    {
      title: "Villa bord de mer - Warang",
      description: "Villa pieds dans l'eau à Warang avec piscine. 6 chambres, 600m² de terrain. Vue imprenable sur l'océan. Emplacement idéal entre les stations balnéaires. Parfait pour résidence secondaire ou guesthouse.",
      price: 180000000, category: "VENTE", city: "Mbour", address: "Warang, Petite Côte",
      rooms: 6, surface: 600, status: "ACTIVE", userId: agent2.id,
      latitude: 14.3800, longitude: -16.9600,
      images: JSON.stringify([
        "https://picsum.photos/seed/villa-warang-1/800/600",
        "https://picsum.photos/seed/villa-warang-2/800/600",
        "https://picsum.photos/seed/villa-warang-3/800/600",
        "https://picsum.photos/seed/villa-warang-4/800/600",
      ]),
    },
    {
      title: "Villa Cité Port - Kounoune",
      description: "Villa neuve 2 chambres à Cité Port Kounoune. 150m², espaces commerciaux. Titre foncier individuel. Dispositifs anti-incendie. Construction récente, bon état. Prix très attractif pour premier achat.",
      price: 50000000, category: "VENTE", city: "Dakar", address: "Kounoune, Rufisque",
      rooms: 2, surface: 150, status: "ACTIVE", userId: agent.id,
      latitude: 14.7600, longitude: -17.2800,
      images: JSON.stringify([
        "https://picsum.photos/seed/villa-kounoune-1/800/600",
        "https://picsum.photos/seed/villa-kounoune-2/800/600",
      ]),
    },

    // ──────────────────────────────────────────
    // TERRAIN
    // ──────────────────────────────────────────
    {
      title: "Terrain 200m² - Zone Recasement Almadies",
      description: "Terrain 200m² en zone de recasement 2 Almadies/BOA. Bail. Emplacement stratégique dans le quartier le plus prisé de Dakar. Idéal pour construction villa ou immeuble de standing.",
      price: 115000000, category: "TERRAIN", city: "Dakar", address: "Almadies, Zone Recasement 2",
      surface: 200, status: "ACTIVE", userId: agent.id,
      latitude: 14.7450, longitude: -17.5100,
      images: JSON.stringify([
        "https://picsum.photos/seed/terrain-almadies-1/800/600",
        "https://picsum.photos/seed/terrain-almadies-2/800/600",
      ]),
    },
    {
      title: "Terrain 300m² vue mer - Yène",
      description: "Terrain viabilisé de 300m² avec vue sur mer à Yène, près de Toubab Dialaw. Papier délibération signature en règle. Eau et électricité à proximité. Zone en plein développement. Prix négociable.",
      price: 7000000, category: "TERRAIN", city: "Dakar", address: "Yène, Dakar",
      surface: 300, status: "ACTIVE", userId: seller.id,
      latitude: 14.5600, longitude: -17.1000,
      images: JSON.stringify([
        "https://picsum.photos/seed/terrain-yene-1/800/600",
        "https://picsum.photos/seed/terrain-yene-2/800/600",
      ]),
    },
    {
      title: "Terrain 225m² - Kiniambour, Thiès",
      description: "Terrain de 225m² entre l'aéroport AIBD de Diass et le futur port de Ndayane. Zone stratégique en plein essor. Facilité de paiement sur 2 ans possible. Documents en règle.",
      price: 5000000, category: "TERRAIN", city: "Thiès", address: "Kiniambour, Thiès",
      surface: 225, status: "ACTIVE", userId: seller.id,
      latitude: 14.7000, longitude: -17.0500,
      images: JSON.stringify([
        "https://picsum.photos/seed/terrain-kiniambour-1/800/600",
        "https://picsum.photos/seed/terrain-kiniambour-2/800/600",
      ]),
    },
    {
      title: "Terrain 150m² - Keur Ndiaye Lo",
      description: "Terrain 150m² à 5 minutes de la Sortie 10 du Péage. Zone résidentielle en développement rapide. Facilités de paiement disponibles. Titre foncier. Idéal pour construction maison familiale.",
      price: 11900000, category: "TERRAIN", city: "Dakar", address: "Keur Ndiaye Lo, Dakar",
      surface: 150, status: "ACTIVE", userId: agent.id,
      latitude: 14.7800, longitude: -17.3000,
      images: JSON.stringify([
        "https://picsum.photos/seed/terrain-kndl-1/800/600",
        "https://picsum.photos/seed/terrain-kndl-2/800/600",
      ]),
    },
    {
      title: "Terrain 225m² - Lélo, Thiès",
      description: "Terrain de 225m² à Lélo dans une zone en forte expansion. Proche des stations TER et de l'aéroport AIBD. Infrastructures en cours de développement. Excellent investissement à long terme.",
      price: 6000000, category: "TERRAIN", city: "Thiès", address: "Lélo, Thiès",
      surface: 225, status: "ACTIVE", userId: seller.id,
      latitude: 14.7900, longitude: -16.9500,
      images: JSON.stringify([
        "https://picsum.photos/seed/terrain-lelo-1/800/600",
        "https://picsum.photos/seed/terrain-lelo-2/800/600",
      ]),
    },
    {
      title: "Terrain 1543m² - Nguérigné Bambara",
      description: "Lot exceptionnel de 1543m² à Nguérigné Bambara dans une zone en pleine croissance. Idéal pour projet immobilier ou agricole. Documents en règle. Accès facile route principale.",
      price: 32000000, category: "TERRAIN", city: "Thiès", address: "Nguérigné Bambara, Thiès",
      surface: 1543, status: "ACTIVE", userId: agent2.id,
      latitude: 14.5000, longitude: -16.9000,
      images: JSON.stringify([
        "https://picsum.photos/seed/terrain-nguerigne-1/800/600",
        "https://picsum.photos/seed/terrain-nguerigne-2/800/600",
      ]),
    },
    {
      title: "Terrains clôturés - Popenguine",
      description: "3 parcelles clôturées et viabilisées près de la Réserve de Popenguine. Total 3000m². Idéal pour villas de vacances ou éco-lodge. Cadre naturel exceptionnel entre mer et réserve naturelle.",
      price: 45000000, category: "TERRAIN", city: "Thiès", address: "Popenguine, Petite Côte",
      surface: 3000, status: "ACTIVE", userId: agent2.id,
      latitude: 14.5500, longitude: -17.1100,
      images: JSON.stringify([
        "https://picsum.photos/seed/terrain-popenguine-1/800/600",
        "https://picsum.photos/seed/terrain-popenguine-2/800/600",
      ]),
    },

    // ──────────────────────────────────────────
    // PRODUIT (Marketplace — Données réelles Sénégal)
    // ──────────────────────────────────────────

    // Téléphones
    {
      title: "iPhone 16 Pro Max 256 Go - Noir",
      description: "iPhone 16 Pro Max 256Go couleur noire. Neuf sous emballage. Puce A18 Pro, écran Super Retina XDR 6.9 pouces, caméra 48MP. Garantie 1 an. Facture disponible. Livraison possible Dakar.",
      price: 645000, category: "PRODUIT", city: "Dakar", address: "Plateau, Dakar",
      status: "ACTIVE", userId: seller2.id,
      latitude: 14.6700, longitude: -17.4400,
      images: JSON.stringify([
        "https://picsum.photos/seed/iphone16pm-1/800/600",
        "https://picsum.photos/seed/iphone16pm-2/800/600",
        "https://picsum.photos/seed/iphone16pm-3/800/600",
      ]),
    },
    {
      title: "Samsung Galaxy Z Fold 7 - Neuf",
      description: "Samsung Galaxy Z Fold7 dernière génération. Puissance et élégance réunies. Triple caméra arrière, grand écran pliable AMOLED. Neuf sous emballage avec garantie. Livraison gratuite Dakar.",
      price: 850000, category: "PRODUIT", city: "Dakar", address: "Plateau, Dakar",
      status: "ACTIVE", userId: seller2.id,
      latitude: 14.6700, longitude: -17.4400,
      images: JSON.stringify([
        "https://picsum.photos/seed/galaxy-fold7-1/800/600",
        "https://picsum.photos/seed/galaxy-fold7-2/800/600",
      ]),
    },
    {
      title: "iPhone 14 Pro Max 256 Go - Occasion",
      description: "iPhone 14 Pro Max 256Go, venant d'Allemagne authentique. Batterie +85%, en très bon état. Livraison possible dans tout Dakar. Vendu avec boîte et câble de charge. Garantie 3 mois.",
      price: 450000, category: "PRODUIT", city: "Dakar", address: "Médina, Dakar",
      status: "ACTIVE", userId: seller.id,
      latitude: 14.6800, longitude: -17.4500,
      images: JSON.stringify([
        "https://picsum.photos/seed/iphone14pm-1/800/600",
        "https://picsum.photos/seed/iphone14pm-2/800/600",
      ]),
    },
    {
      title: "Google Pixel 10a - Neuf",
      description: "Google Pixel 10a neuf. Caméra incroyable qualité professionnelle, ultra fluide, bonne autonomie. Intelligence artificielle Google intégrée. Parfait pour les amateurs de photo. Garantie constructeur.",
      price: 390000, category: "PRODUIT", city: "Dakar", address: "Médina, Dakar",
      status: "ACTIVE", userId: seller2.id,
      latitude: 14.6800, longitude: -17.4500,
      images: JSON.stringify([
        "https://picsum.photos/seed/pixel10a-1/800/600",
        "https://picsum.photos/seed/pixel10a-2/800/600",
      ]),
    },
    {
      title: "Samsung Galaxy A07 neuf 128Go",
      description: "Samsung Galaxy A07 neuf. Dual SIM 4G LTE, écran HD 6.7 pouces, caméra 50 mégapixels, batterie 5000mAh longue durée, 128Go stockage, 4Go RAM. Parfait rapport qualité-prix. Garantie 1 an.",
      price: 65000, category: "PRODUIT", city: "Dakar", address: "Parcelles Assainies, Dakar",
      status: "ACTIVE", userId: seller.id,
      latitude: 14.7600, longitude: -17.4300,
      images: JSON.stringify([
        "https://picsum.photos/seed/galaxy-a07-1/800/600",
        "https://picsum.photos/seed/galaxy-a07-2/800/600",
      ]),
    },

    // Électroménager
    {
      title: "Machine à laver ASTECH 7kg A+++",
      description: "Machine à laver ASTECH chargement frontal, 7kg, classe énergétique A+++. Finition gris métallisé. Neuve sous emballage. Plusieurs programmes de lavage. Garantie 2 ans. Livraison et installation gratuites Dakar.",
      price: 168500, category: "PRODUIT", city: "Dakar", address: "Plateau, Dakar",
      status: "ACTIVE", userId: seller.id,
      latitude: 14.6700, longitude: -17.4400,
      images: JSON.stringify([
        "https://picsum.photos/seed/astech-laver-1/800/600",
        "https://picsum.photos/seed/astech-laver-2/800/600",
        "https://picsum.photos/seed/astech-laver-3/800/600",
      ]),
    },
    {
      title: "Réfrigérateur MIDEA Side-by-Side 632L",
      description: "Réfrigérateur MIDEA Side-by-Side, 632L brut / 424L net. Compresseur inverter silencieux (40dB). Distributeur d'eau. Classe A+. Design moderne inox. Idéal grande famille. Livraison Dakar et banlieue.",
      price: 625000, category: "PRODUIT", city: "Dakar", address: "Plateau, Dakar",
      status: "ACTIVE", userId: seller.id,
      latitude: 14.6700, longitude: -17.4400,
      images: JSON.stringify([
        "https://picsum.photos/seed/midea-frigo-1/800/600",
        "https://picsum.photos/seed/midea-frigo-2/800/600",
      ]),
    },
    {
      title: "Cuisinière BEKO 6 feux 90x60",
      description: "Cuisinière à gaz BEKO avec 6 brûleurs et 2 plaques inox. Four 108 litres avec grill. Classe énergétique A. Dimensions 90x60cm. Neuve avec garantie 2 ans. Parfaite pour cuisine professionnelle ou familiale.",
      price: 405000, category: "PRODUIT", city: "Dakar", address: "Plateau, Dakar",
      status: "ACTIVE", userId: seller.id,
      latitude: 14.6700, longitude: -17.4400,
      images: JSON.stringify([
        "https://picsum.photos/seed/beko-cuisiniere-1/800/600",
        "https://picsum.photos/seed/beko-cuisiniere-2/800/600",
      ]),
    },
    {
      title: "Congélateur Enduro 580 litres",
      description: "Congélateur coffre Enduro 580 litres, gris foncé. Double ouverture pour accès pratique. Idéal pour restaurant, boutique ou grande famille. Faible consommation électrique. Livraison possible.",
      price: 300000, category: "PRODUIT", city: "Dakar", address: "Liberté 5, Dakar",
      status: "ACTIVE", userId: seller3.id,
      latitude: 14.6900, longitude: -17.4500,
      images: JSON.stringify([
        "https://picsum.photos/seed/enduro-congelateur-1/800/600",
        "https://picsum.photos/seed/enduro-congelateur-2/800/600",
      ]),
    },
    {
      title: "Machine à laver Sharp 10kg Inverter",
      description: "Machine à laver SHARP chargement frontal, 10kg. Moteur inverter pour lavage silencieux et économique. Idéale pour famille nombreuse. Multiples programmes. Très bon état. Garantie 1 an.",
      price: 290000, category: "PRODUIT", city: "Dakar", address: "Plateau, Dakar",
      status: "ACTIVE", userId: seller.id,
      latitude: 14.6700, longitude: -17.4400,
      images: JSON.stringify([
        "https://picsum.photos/seed/sharp-laver-1/800/600",
        "https://picsum.photos/seed/sharp-laver-2/800/600",
      ]),
    },

    // Informatique
    {
      title: "MacBook Pro M3 14 pouces - Occasion",
      description: "MacBook Pro 14 pouces puce M3, 16Go RAM, 512Go SSD. Acheté en janvier 2025, sous garantie Apple. Parfait état, zéro rayure. Chargeur MagSafe inclus. Batterie 95%. Idéal développeur ou créatif.",
      price: 850000, category: "PRODUIT", city: "Dakar", address: "Plateau, Dakar",
      status: "ACTIVE", userId: seller2.id,
      latitude: 14.6700, longitude: -17.4400,
      images: JSON.stringify([
        "https://picsum.photos/seed/macbook-m3-pro-1/800/600",
        "https://picsum.photos/seed/macbook-m3-pro-2/800/600",
        "https://picsum.photos/seed/macbook-m3-pro-3/800/600",
      ]),
    },
    {
      title: "Apple Studio Display 27\" 5K",
      description: "Apple Studio Display 27 pouces résolution 5K Retina. Écran nano-texturé anti-reflets. Caméra 12MP avec Cadrage centré. 6 haut-parleurs avec audio spatial. Neuf sous emballage. Câble Thunderbolt inclus.",
      price: 750000, category: "PRODUIT", city: "Dakar", address: "Plateau, Dakar",
      status: "ACTIVE", userId: seller2.id,
      latitude: 14.6700, longitude: -17.4400,
      images: JSON.stringify([
        "https://picsum.photos/seed/apple-display-1/800/600",
        "https://picsum.photos/seed/apple-display-2/800/600",
      ]),
    },

    // Mobilier
    {
      title: "Lit superposé 3 places - Neuf",
      description: "Lit superposé 3 places en métal robuste, état neuf. Idéal pour chambres d'enfants ou petits espaces. Facile à monter. Matelas non inclus. Livraison possible dans Dakar.",
      price: 150000, category: "PRODUIT", city: "Dakar", address: "Grand Dakar",
      status: "ACTIVE", userId: seller3.id,
      latitude: 14.6900, longitude: -17.4500,
      images: JSON.stringify([
        "https://picsum.photos/seed/lit-superpose-1/800/600",
        "https://picsum.photos/seed/lit-superpose-2/800/600",
      ]),
    },
    {
      title: "Canapé salon 7 places cuir - Beige",
      description: "Canapé en cuir synthétique haut de gamme, 7 places. Couleur beige, design moderne. État impeccable, acheté il y a 3 mois. Très confortable. Livraison possible Dakar et banlieue.",
      price: 280000, category: "PRODUIT", city: "Dakar", address: "Sacré-Cœur, Dakar",
      status: "ACTIVE", userId: seller3.id,
      latitude: 14.7230, longitude: -17.4620,
      images: JSON.stringify([
        "https://picsum.photos/seed/canape-7places-1/800/600",
        "https://picsum.photos/seed/canape-7places-2/800/600",
        "https://picsum.photos/seed/canape-7places-3/800/600",
      ]),
    },

    // Véhicules (en produit)
    {
      title: "Peugeot 5008 2016 - Automatique",
      description: "Peugeot 5008 année 2016, boîte automatique. Import d'occasion en bon état. Climatisation, 7 places. Papiers complets. Visite technique à jour. Idéal pour famille nombreuse.",
      price: 6500000, category: "PRODUIT", city: "Dakar", address: "Mermoz, Dakar",
      status: "ACTIVE", userId: seller.id,
      latitude: 14.7050, longitude: -17.4700,
      images: JSON.stringify([
        "https://picsum.photos/seed/peugeot5008-1/800/600",
        "https://picsum.photos/seed/peugeot5008-2/800/600",
        "https://picsum.photos/seed/peugeot5008-3/800/600",
      ]),
    },
    {
      title: "Ford Escape 2015 - Automatique",
      description: "Ford Escape 2015, 2.5L essence automatique. Climatisation, papier complet. Import USA en bon état général. Consommation raisonnable. Visite technique récente. Négociable.",
      price: 3800000, category: "PRODUIT", city: "Dakar", address: "VDN, Dakar",
      status: "ACTIVE", userId: seller.id,
      latitude: 14.7300, longitude: -17.4600,
      images: JSON.stringify([
        "https://picsum.photos/seed/ford-escape-1/800/600",
        "https://picsum.photos/seed/ford-escape-2/800/600",
      ]),
    },

    // Micro-ondes
    {
      title: "Micro-ondes Enduro 25L multifonction",
      description: "Micro-ondes Enduro 25 litres compact et multifonctionnel. Coloris noir. Timer digital. Plusieurs niveaux de puissance. Parfait pour réchauffer, décongeler et cuisiner. Neuf sous emballage.",
      price: 60000, category: "PRODUIT", city: "Dakar", address: "Liberté 5, Dakar",
      status: "ACTIVE", userId: seller3.id,
      latitude: 14.6900, longitude: -17.4500,
      images: JSON.stringify([
        "https://picsum.photos/seed/microonde-enduro-1/800/600",
        "https://picsum.photos/seed/microonde-enduro-2/800/600",
      ]),
    },

    // Réfrigérateur occasion
    {
      title: "Réfrigérateur Hisense 8kg - Occasion",
      description: "Machine à laver Hisense 8kg chargement frontal. Excellent état, peu utilisée. Multiples programmes de lavage. Livraison possible Dakar. Raison de la vente : déménagement.",
      price: 230000, category: "PRODUIT", city: "Dakar", address: "Ouakam, Dakar",
      status: "ACTIVE", userId: seller.id,
      latitude: 14.7300, longitude: -17.4900,
      images: JSON.stringify([
        "https://picsum.photos/seed/hisense-laver-1/800/600",
        "https://picsum.photos/seed/hisense-laver-2/800/600",
      ]),
    },

    // iPhone 17
    {
      title: "iPhone 17 Pro Max 512Go - Neuf",
      description: "iPhone 17 Pro Max 512Go, dernier modèle Apple. Puissance et style inégalés. Performance et design unique. Excellente autonomie batterie. Neuf sous emballage, garantie Apple 1 an. Le top du top.",
      price: 980000, category: "PRODUIT", city: "Dakar", address: "Plateau, Dakar",
      status: "ACTIVE", userId: seller2.id,
      latitude: 14.6700, longitude: -17.4400,
      images: JSON.stringify([
        "https://picsum.photos/seed/iphone17pm-1/800/600",
        "https://picsum.photos/seed/iphone17pm-2/800/600",
        "https://picsum.photos/seed/iphone17pm-3/800/600",
      ]),
    },

    // Réfrigérateur combiné
    {
      title: "Réfrigérateur ENDURO Combiné 600L",
      description: "Réfrigérateur ENDURO combiné 600 litres, 3 tiroirs. Technologie No Frost. Full options, classe A+. Finition beige élégante. Neuf avec garantie 2 ans. Livraison et installation gratuites à Dakar.",
      price: 440000, category: "PRODUIT", city: "Dakar", address: "Plateau, Dakar",
      status: "ACTIVE", userId: seller.id,
      latitude: 14.6700, longitude: -17.4400,
      images: JSON.stringify([
        "https://picsum.photos/seed/enduro-frigo-600-1/800/600",
        "https://picsum.photos/seed/enduro-frigo-600-2/800/600",
      ]),
    },
  ];

  for (const annonce of annonces) {
    await prisma.annonce.create({ data: annonce });
  }

  const locationCount = annonces.filter((a) => a.category === "LOCATION").length;
  const venteCount = annonces.filter((a) => a.category === "VENTE").length;
  const terrainCount = annonces.filter((a) => a.category === "TERRAIN").length;
  const produitCount = annonces.filter((a) => a.category === "PRODUIT").length;

  console.log(`✅ ${annonces.length} annonces créées:`);
  console.log(`   📍 ${locationCount} locations`);
  console.log(`   🏠 ${venteCount} ventes immobilières`);
  console.log(`   🌍 ${terrainCount} terrains`);
  console.log(`   📦 ${produitCount} produits marketplace`);

  console.log("\n🎉 Seed terminé avec succès !");
  console.log("\n📋 Comptes de test:");
  console.log("  👑 Admin:    admin@terangahome.sn / admin123");
  console.log("  🏢 Agent 1:  moussa@terangahome.sn / agent123");
  console.log("  🏢 Agent 2:  aminata@terangahome.sn / agent123");
  console.log("  🛒 Vendeur:  fatou@terangahome.sn / seller123");
  console.log("  🛒 Vendeur:  ousmane@terangahome.sn / seller123");
  console.log("  🛒 Vendeur:  aissatou@terangahome.sn / seller123");
  console.log("  🚚 Livreur:  ibrahima.livreur@terangahome.sn / livreur123");
  console.log("  🚚 Livreur:  abdou.livreur@terangahome.sn / livreur123");
  console.log("  🚚 Livreur:  cheikh.livreur@terangahome.sn / livreur123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
