import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { rating, comment, targetUserId, annonceId } = await request.json();

    if (!rating || !targetUserId) {
      return Response.json({ error: "Note et utilisateur cible requis" }, { status: 400 });
    }

    if (targetUserId === session.user.id) {
      return Response.json({ error: "Vous ne pouvez pas vous noter" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment: comment || null,
        userId: session.user.id,
        targetUserId,
        annonceId: annonceId || null,
      },
      include: {
        user: { select: { name: true, avatar: true } },
      },
    });

    return Response.json(review, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
