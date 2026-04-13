import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function isAdmin() {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role;
  return role === "ADMIN" ? session : null;
}

export async function GET() {
  if (!(await isAdmin())) {
    return Response.json({ error: "Non autorisé" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      city: true,
      createdAt: true,
      _count: { select: { annonces: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(users);
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id, role } = await request.json();

  const user = await prisma.user.update({
    where: { id },
    data: { role },
  });

  return Response.json({ id: user.id, role: user.role });
}
