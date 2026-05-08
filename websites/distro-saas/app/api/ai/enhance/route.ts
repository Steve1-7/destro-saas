// app/api/ai/enhance/route.ts
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { Platform, CaptionTone } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const TONE_PROMPTS: Record<CaptionTone, string> = {
  founder: 'Write as an authentic founder building in public. Be honest, transparent, and share real insights.',
  tech: 'Use technical language and developer-friendly terms. Include code references or technical details.',
  casual: 'Keep it conversational and relaxed. Use everyday language and emojis naturally.',
  corporate: 'Professional and business-appropriate tone. Focus on business value and ROI.',
  viral: 'Hook-heavy, attention-grabbing. Use pattern interrupts and create curiosity gaps.',
  educational: 'Teach and provide value. Break down complex concepts into digestible pieces.',
};

export async function POST(request: Request) {
  try {
    const { caption, tone, options, platform } = await request.json();

    let systemPrompt = `You are an expert social media copywriter. ${TONE_PROMPTS[tone as CaptionTone]}`;
    
    if (options?.makeViral) {
      systemPrompt += ' Make this caption viral-worthy with strong hooks and engagement triggers.';
    }
    if (options?.makeProfessional) {
      systemPrompt += ' Polish this to be more professional and authoritative.';
    }
    if (options?.makeShorter) {
      systemPrompt += ' Make this concise and punchy - remove fluff.';
    }
    if (options?.addCTA) {
      systemPrompt += ' Add a compelling call-to-action at the end.';
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Rewrite this caption for ${platform || 'social media'}:

${caption}

Return ONLY the improved caption, no explanation.`,
        },
      ],
    });

    const text = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('');

    return NextResponse.json({ caption: text });
  } catch (error) {
    console.error('AI enhance error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance caption' },
      { status: 500 }
    );
  }
}
