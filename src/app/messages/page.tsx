"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { timeAgo } from "@/lib/utils";

interface Conversation {
  contact: { id: string; name: string; avatar: string | null };
  lastMessage: string;
  lastDate: string;
  unread: number;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { name: string; avatar: string | null };
  annonce?: { id: string; title: string } | null;
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Chargement...</div>}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(
    searchParams.get("contact")
  );
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/messages")
      .then((r) => r.json())
      .then(setConversations);
  }, [session]);

  useEffect(() => {
    if (!selectedContact || !session) return;
    fetch(`/api/messages?contactId=${selectedContact}`)
      .then((r) => r.json())
      .then((msgs) => {
        setMessages(msgs);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });

    // Poll for new messages
    const interval = setInterval(() => {
      fetch(`/api/messages?contactId=${selectedContact}`)
        .then((r) => r.json())
        .then(setMessages);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedContact, session]);

  async function handleSend() {
    if (!newMessage.trim() || !selectedContact) return;
    setSending(true);

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage, receiverId: selectedContact }),
    });

    setNewMessage("");
    setSending(false);

    // Refresh messages
    const res = await fetch(`/api/messages?contactId=${selectedContact}`);
    setMessages(await res.json());
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  if (status === "loading") return <div className="text-center py-12">Chargement...</div>;
  if (!session) return null;

  const selectedConv = conversations.find((c) => c.contact.id === selectedContact);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ height: "calc(100vh - 250px)" }}>
        <div className="flex h-full">
          {/* Conversations list */}
          <div className={`w-full md:w-80 border-r overflow-y-auto ${selectedContact ? "hidden md:block" : ""}`}>
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>Aucune conversation</p>
                <p className="text-sm mt-1">Contactez un vendeur depuis une annonce</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.contact.id}
                  onClick={() => setSelectedContact(conv.contact.id)}
                  className={`w-full text-left p-4 border-b hover:bg-gray-50 ${
                    selectedContact === conv.contact.id ? "bg-green-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {conv.contact.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">{conv.contact.name}</span>
                        <span className="text-xs text-gray-400">{timeAgo(conv.lastDate)}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col ${!selectedContact ? "hidden md:flex" : "flex"}`}>
            {selectedContact ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <button
                    className="md:hidden"
                    onClick={() => setSelectedContact(null)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {selectedConv?.contact.name[0] || "?"}
                  </div>
                  <span className="font-medium">{selectedConv?.contact.name}</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === session.user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          isMe
                            ? "bg-primary text-white rounded-br-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}>
                          {msg.annonce && (
                            <p className={`text-xs mb-1 ${isMe ? "text-green-200" : "text-gray-500"}`}>
                              Re: {msg.annonce.title}
                            </p>
                          )}
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isMe ? "text-green-200" : "text-gray-400"}`}>
                            {timeAgo(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Écrivez votre message..."
                      className="input flex-1"
                    />
                    <button
                      onClick={handleSend}
                      disabled={sending || !newMessage.trim()}
                      className="btn-primary disabled:opacity-50"
                    >
                      Envoyer
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <p>Sélectionnez une conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
