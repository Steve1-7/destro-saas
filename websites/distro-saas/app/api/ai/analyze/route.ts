// app/api/ai/analyze/route.ts
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { CaptionAnalysis } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { caption } = await request.json();

    if (!caption) {
      return NextResponse.json(
        { error: 'Caption is required' },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are an expert social media content analyzer. Analyze the given caption and return a JSON object with:
- engagement_score: number (0-100)
- readability_score: number (0-100) 
- sentiment: "positive" | "neutral" | "negative"
- suggested_hashtags: string[] (5 relevant hashtags)
- optimization_tips: string[] (3 actionable tips)

Be objective and constructive in your analysis.`,
      messages: [
        {
          role: 'user',
          content: `Analyze this caption and return ONLY a JSON object:

${caption}`,
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

    const analysis: CaptionAnalysis = {
      ...JSON.parse(jsonMatch[0]),
      word_count: caption.trim().split(/\s+/).filter(Boolean).length,
      char_count: caption.length,
    };

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('AI analyze error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze caption' },
      { status: 500 }
    );
  }
}
