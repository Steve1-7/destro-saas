import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Phone, ArrowLeft, PhoneOff, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useTwilioVoice } from "@/lib/twilio";

export const Route = createFileRoute("/app/chat/$conversationId")({
  head: () => ({ meta: [{ title: "Chat — Omni-Commute" }] }),
  component: ChatPage,
});

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
};

type Conversation = {
  id: string;
  participant_a: string;
  participant_b: string;
};

function ChatPage() {
  const { conversationId } = Route.useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { state: callState, makeCall, acceptCall, rejectCall, endCall } = useTwilioVoice(user?.id);

  const load = useCallback(async () => {
    const { data: conv } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .maybeSingle();
    setConversation(conv as Conversation | null);

    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(100);
    setMessages((msgs as Message[]) ?? []);
  }, [conversationId]);

  useEffect(() => {
    load();
  }, [load]);

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !user) return;
    setSending(true);
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: newMsg.trim(),
    });
    setNewMsg("");
    setSending(false);
  };

  const otherParticipant =
    conversation?.participant_a === user?.id
      ? conversation.participant_b
      : conversation?.participant_a;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <Link to="/app/messages" className="text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="text-sm font-medium">Chat</div>
          <div className="text-xs text-muted-foreground font-mono">
            {otherParticipant?.slice(0, 8)}…
          </div>
        </div>
        <button
          onClick={() => {
            // For now, we'd need the other user's phone number from profiles
            // Using a placeholder Twilio number format for demo
            makeCall(`client:${otherParticipant}`);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/15 text-primary border border-primary/30 text-sm font-medium hover:bg-primary/25 transition"
        >
          <Phone className="h-3.5 w-3.5" /> Call
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-none">
        {messages.map((m) => {
          const isMine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMine
                    ? "bg-primary/15 text-foreground border border-primary/20"
                    : "bg-white/[0.04] text-foreground border border-white/5"
                }`}
              >
                <div>{m.content}</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 pt-3 border-t border-white/5">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
        />
        <button
          type="submit"
          disabled={sending || !newMsg.trim()}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground glow-primary hover:opacity-95 transition disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {/* Call overlay */}
      {callState !== "idle" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="glass rounded-3xl p-8 text-center space-y-6 max-w-sm mx-4">
            <div className="h-20 w-20 rounded-full bg-primary/15 border border-primary/30 grid place-items-center mx-auto animate-pulse">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">
                {callState === "ringing"
                  ? "Calling..."
                  : callState === "connected"
                    ? "Connected"
                    : "Call Ended"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{otherParticipant?.slice(0, 8)}…</p>
            </div>
            <div className="flex items-center justify-center gap-4">
              {callState === "ringing" && (
                <>
                  <button
                    onClick={acceptCall}
                    className="h-14 w-14 rounded-full bg-primary text-primary-foreground grid place-items-center hover:bg-primary/80 transition"
                  >
                    <Phone className="h-6 w-6" />
                  </button>
                  <button
                    onClick={rejectCall}
                    className="h-14 w-14 rounded-full bg-destructive text-destructive-foreground grid place-items-center hover:bg-destructive/80 transition"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </>
              )}
              {callState === "connected" && (
                <button
                  onClick={endCall}
                  className="h-14 w-14 rounded-full bg-destructive text-destructive-foreground grid place-items-center hover:bg-destructive/80 transition"
                >
                  <PhoneOff className="h-6 w-6" />
                </button>
              )}
              {callState === "ended" && (
                <button
                  onClick={() => endCall()}
                  className="px-6 py-3 rounded-xl bg-white/[0.1] text-foreground hover:bg-white/[0.2] transition"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
