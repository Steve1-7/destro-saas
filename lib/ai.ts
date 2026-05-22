// lib/ai.ts
import Anthropic from '@anthropic-ai/sdk';
import type { CaptionVariants } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const PLATFORM_PROMPTS: Record<keyof CaptionVariants, string> = {
  linkedin: `You are a LinkedIn content strategist. Rewrite the following caption for LinkedIn.
Guidelines:
- Professional, authoritative, and insight-driven tone
- Start with a strong hook (not a question)
- Use line breaks for readability
- Include 3-5 relevant hashtags at the end
- Max 1300 characters
- Focus on value delivered and lessons learned`,

  tiktok: `You are a TikTok content creator. Rewrite the following caption for TikTok.
Guidelines:
- Hook-heavy opening (first 3 words must grab attention)
- Casual, energetic, Gen-Z friendly tone
- Use emojis strategically (not excessively)
- Include trending hashtags (#fyp, #foryou etc.)
- Max 300 characters
- End with a call-to-action or question`,

  youtube: `You are a YouTube SEO specialist. Rewrite the following as a YouTube Short description.
Guidelines:
- SEO-optimized with primary keyword in first line
- Include relevant timestamps if applicable
- Add links section placeholder
- 3-5 keyword-rich hashtags
- Max 500 characters for the short description
- Include a subscribe CTA`,

  facebook: `You are a Facebook community manager. Rewrite the following for Facebook.
Guidelines:
- Casual, warm, conversational tone
- Encourage comments and shares
- Tell a micro-story or share a relatable moment
- Use 1-2 emojis max
- End with an open-ended question
- Max 500 characters`,
  instagram: `You are an Instagram content creator. Rewrite the following caption for Instagram.
Guidelines:
- Visual-first, short paragraph with emojis
- Include location or mention placeholders when relevant
- Use 3-7 hashtags at the end
- Max 2200 characters, but aim for shorter`,

  twitter: `You are a Twitter/X copywriter. Rewrite the following caption for Twitter.
Guidelines:
- Concise, punchy, and thread-friendly
- Use plain text, include 1-2 hashtags
- Max 280 characters per post
- If appropriate, suggest a short thread starter`,
};

export async function generateCaptionVariants(
  masterCaption: string
): Promise<CaptionVariants> {
  const platforms = ['linkedin', 'tiktok', 'youtube', 'facebook', 'instagram', 'twitter'] as const;

  const results = await Promise.all(
    platforms.map(async (platform) => {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${PLATFORM_PROMPTS[platform]}\n\n---\nMaster Caption:\n${masterCaption}\n---\n\nReturn ONLY the adapted caption. No preamble, no explanation.`,
          },
        ],
      });

      const text = message.content
        .filter((b) => b.type === 'text')
        .map((b) => (b as { type: 'text'; text: string }).text)
        .join('');

      return [platform, text] as const;
    })
  );

  return Object.fromEntries(results) as unknown as CaptionVariants;
}
