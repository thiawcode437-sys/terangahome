import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      annonce: {
        include: { user: { select: { name: true, avatar: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(favorites);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { annonceId } = await request.json();

  // Toggle favorite
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_annonceId: {
        userId: session.user.id,
        annonceId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return Response.json({ favorited: false });
  }

  await prisma.favorite.create({
    data: { userId: session.user.id, annonceId },
  });

  return Response.json({ favorited: true });
}
