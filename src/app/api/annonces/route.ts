import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12;

  const where: Record<string, unknown> = { status: "ACTIVE" };

  if (category) where.category = category;
  if (city) where.city = { contains: city };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
    if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
  }
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { city: { contains: q } },
    ];
  }

  const [annonces, total] = await Promise.all([
    prisma.annonce.findMany({
      where,
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.annonce.count({ where }),
  ]);

  return Response.json({
    annonces,
    total,
    pages: Math.ceil(total / limit),
    page,
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const annonce = await prisma.annonce.create({
      data: {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        city: data.city,
        address: data.address || null,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        images: JSON.stringify(data.images || []),
        videos: JSON.stringify(data.videos || []),
        rooms: data.rooms ? parseInt(data.rooms) : null,
        surface: data.surface ? parseFloat(data.surface) : null,
        status: "ACTIVE",
        userId: session.user.id,
      },
    });

    return Response.json(annonce, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
