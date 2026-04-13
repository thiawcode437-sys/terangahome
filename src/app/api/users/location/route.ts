import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const city = searchParams.get("city");

  const where: Record<string, unknown> = {
    latitude: { not: null },
    longitude: { not: null },
  };

  if (role) where.role = role;
  if (city) where.city = { contains: city };

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      role: true,
      city: true,
      phone: true,
      avatar: true,
      bio: true,
      latitude: true,
      longitude: true,
      isOnline: true,
      lastSeenAt: true,
      _count: { select: { annonces: true } },
    },
    orderBy: { lastSeenAt: "desc" },
  });

  return Response.json(users);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { latitude, longitude } = await request.json();

  if (latitude == null || longitude == null) {
    return Response.json(
      { error: "Latitude et longitude requises" },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      isOnline: true,
      lastSeenAt: new Date(),
    },
  });

  return Response.json({
    id: user.id,
    latitude: user.latitude,
    longitude: user.longitude,
  });
}
