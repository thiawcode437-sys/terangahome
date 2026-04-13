import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function isAdmin() {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role;
  return role === "ADMIN" ? session : null;
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const annonces = await prisma.annonce.findMany({
    where: status ? { status } : undefined,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(annonces);
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id, status } = await request.json();

  const annonce = await prisma.annonce.update({
    where: { id },
    data: { status },
  });

  return Response.json(annonce);
}
