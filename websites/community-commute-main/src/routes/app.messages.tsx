import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Phone, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/messages")({
  component: MessagesPage,
});

type Conversation = {
  id: string;
  participant_a: string;
  participant_b: string;
  created_at: string;
};

type LastMessage = {
  content: string;
  created_at: string;
  sender_id: string;
};

function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<(Conversation & { lastMsg?: LastMessage })[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
      .order("created_at", { ascending: false });
    const convs = (data as Conversation[]) ?? [];

    // Fetch last message for each conversation
    const enriched = await Promise.all(
      convs.map(async (c) => {
        const { data: msgs } = await supabase
          .from("messages")
          .select("content, created_at, sender_id")
          .eq("conversation_id", c.id)
          .order("created_at", { ascending: false })
          .limit(1);
        return { ...c, lastMsg: (msgs as LastMessage[])?.[0] };
      }),
    );
    setConversations(enriched);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">
          Messages
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Messages</h1>
        <p className="text-muted-foreground mt-1">
          Talk to drivers and riders without sharing personal numbers.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground font-mono">Loading conversations…</div>
      ) : conversations.length === 0 ? (
        <div className="glass-strong rounded-3xl p-12 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center mx-auto">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold mt-4">No conversations yet</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            Conversations start automatically when you request or accept a ride.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-xs font-mono text-primary">
            <Lock className="h-3 w-3" /> E2E ENCRYPTED
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((c) => {
            const otherId = c.participant_a === user?.id ? c.participant_b : c.participant_a;
            return (
              <Link
                key={c.id}
                to="/app/chat/$conversationId"
                params={{ conversationId: c.id }}
                className="flex items-center gap-3 p-4 rounded-2xl glass hover:border-primary/30 border border-transparent transition"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 border border-primary/20 grid place-items-center">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{otherId.slice(0, 8)}…</div>
                  {c.lastMsg && (
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {c.lastMsg.content}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {c.lastMsg && (
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(c.lastMsg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                  <button className="p-2 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-primary/15 hover:border-primary/30 transition">
                    <Phone className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
