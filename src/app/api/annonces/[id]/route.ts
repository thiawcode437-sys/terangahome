import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const annonce = await prisma.annonce.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, avatar: true, role: true, city: true } },
      reviews: {
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { favorites: true } },
    },
  });

  if (!annonce) {
    return Response.json({ error: "Annonce non trouvée" }, { status: 404 });
  }

  // Increment views
  await prisma.annonce.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  return Response.json(annonce);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const annonce = await prisma.annonce.findUnique({ where: { id } });

  if (!annonce || annonce.userId !== session.user.id) {
    return Response.json({ error: "Non autorisé" }, { status: 403 });
  }

  const data = await request.json();
  const updated = await prisma.annonce.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category,
      city: data.city,
      address: data.address,
      rooms: data.rooms ? parseInt(data.rooms) : null,
      surface: data.surface ? parseFloat(data.surface) : null,
      images: data.images ? JSON.stringify(data.images) : undefined,
    },
  });

  return Response.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const annonce = await prisma.annonce.findUnique({ where: { id } });
  const role = (session.user as Record<string, unknown>).role;

  if (!annonce || (annonce.userId !== session.user.id && role !== "ADMIN")) {
    return Response.json({ error: "Non autorisé" }, { status: 403 });
  }

  await prisma.annonce.delete({ where: { id } });
  return Response.json({ success: true });
}
