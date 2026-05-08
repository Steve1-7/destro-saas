// app/api/ai/repurpose/route.ts
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { RepurposedContent } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { sourceUrl, contentType } = await request.json();

    if (!sourceUrl || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create prompts for different platforms
    const systemPrompt = `You are an expert content strategist who repurposes content for multiple social media platforms.
Given a ${contentType} URL or description, create platform-optimized content for:
- TikTok (short, hook-heavy, Gen-Z friendly)
- LinkedIn (professional, insight-driven)
- YouTube Shorts (SEO-optimized, engaging)
- Facebook (community-focused, conversational)
- Twitter/X (concise, thread-friendly)

Also generate: hook ideas, title suggestions, and CTA suggestions.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Repurpose this ${contentType} content into multiple platform versions:
Source: ${sourceUrl}

Return a JSON object with these exact keys:
{
  "tiktok_captions": ["caption 1", "caption 2", "caption 3"],
  "linkedin_posts": ["post 1", "post 2"],
  "youtube_shorts_captions": ["caption 1", "caption 2"],
  "facebook_posts": ["post 1"],
  "twitter_posts": ["tweet 1", "tweet 2", "tweet 3"],
  "hook_ideas": ["hook 1", "hook 2", "hook 3", "hook 4", "hook 5"],
  "title_suggestions": ["title 1", "title 2", "title 3", "title 4", "title 5"],
  "cta_suggestions": ["cta 1", "cta 2", "cta 3", "cta 4", "cta 5"]
}`,
        },
      ],
    });

    const text = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('');

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const repurposedContent: RepurposedContent = {
      original_type: contentType,
      original_url: sourceUrl,
      ...JSON.parse(jsonMatch[0]),
    };

    return NextResponse.json(repurposedContent);
  } catch (error) {
    console.error('AI repurpose error:', error);
    return NextResponse.json(
      { error: 'Failed to repurpose content' },
      { status: 500 }
    );
  }
}
