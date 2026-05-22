// app/api/status/[postId]/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Server-Sent Events endpoint for real-time distribution status.
 * Subscribes to Supabase Realtime on the distributions table.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      // Send initial state
      supabase
        .from('distributions')
        .select('*')
        .eq('post_id', postId)
        .then(({ data }) => {
          if (data) send({ type: 'init', distributions: data });
        });

      // Subscribe to realtime changes
      const channel = supabase
        .channel(`distributions:${postId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'distributions',
            filter: `post_id=eq.${postId}`,
          },
          (payload) => {
            send({ type: 'update', distribution: payload.new });
          }
        )
        .subscribe();

      // Cleanup on disconnect
      req.signal.addEventListener('abort', () => {
        supabase.removeChannel(channel);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
