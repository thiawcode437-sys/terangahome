import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get("contactId");

  if (contactId) {
    // Get conversation with specific user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: contactId },
          { senderId: contactId, receiverId: session.user.id },
        ],
      },
      include: {
        sender: { select: { name: true, avatar: true } },
        annonce: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    // Mark as read
    await prisma.message.updateMany({
      where: {
        senderId: contactId,
        receiverId: session.user.id,
        read: false,
      },
      data: { read: true },
    });

    return Response.json(messages);
  }

  // Get conversations list
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id },
      ],
    },
    include: {
      sender: { select: { id: true, name: true, avatar: true } },
      receiver: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group by conversation partner
  const conversationsMap = new Map<string, {
    contact: { id: string; name: string; avatar: string | null };
    lastMessage: string;
    lastDate: Date;
    unread: number;
  }>();

  for (const msg of messages) {
    const isMe = msg.senderId === session.user.id;
    const contact = isMe ? msg.receiver : msg.sender;

    if (!conversationsMap.has(contact.id)) {
      conversationsMap.set(contact.id, {
        contact,
        lastMessage: msg.content,
        lastDate: msg.createdAt,
        unread: 0,
      });
    }

    if (!isMe && !msg.read) {
      const conv = conversationsMap.get(contact.id)!;
      conv.unread++;
    }
  }

  return Response.json(Array.from(conversationsMap.values()));
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { content, receiverId, annonceId } = await request.json();

    if (!content || !receiverId) {
      return Response.json({ error: "Contenu et destinataire requis" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId,
        annonceId: annonceId || null,
      },
      include: {
        sender: { select: { name: true, avatar: true } },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        type: "NEW_MESSAGE",
        title: "Nouveau message",
        message: `${session.user.name} vous a envoyé un message`,
        userId: receiverId,
        link: `/messages?contact=${session.user.id}`,
      },
    });

    return Response.json(message, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
