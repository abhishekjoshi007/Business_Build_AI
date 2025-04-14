import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai-edge';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/authOptions';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get MongoDB client
    const client = await import('@/app/lib/mongodb').then(mod => mod.default);
    const dbName = process.env.MONGODB_DB;
    const userCollection = client.db(dbName).collection('users');
    
    // Check user and credits
    const user = await userCollection.findOne({ email: session.user?.email });
    if (!user || user.credits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    }

    const { title, contentType, description } = await request.json();
    
    if (!title || !contentType || !description) {
      return NextResponse.json(
        { message: 'Title, content type, and description are required' },
        { status: 400 }
      );
    }

    // Custom system prompts for each content type
    const systemPrompts = {
      "blog": `You are a professional blogger. Create a comprehensive blog post about "${title}" with:
              1. Engaging introduction with a hook
              2. 3-5 main sections with subheadings (H2)
              3. Bullet points or numbered lists where appropriate
              4. Conversational yet informative tone
              5. 800-1200 words total
              6. Conclusion with key takeaways
              7. Include 1-2 relevant examples or case studies`,
      
      "social-post": `You are a social media expert. Create an engaging post about "${title}" with:
              1. One attention-grabbing headline
              2. Caption of 4-8 lines maximum
              3. Include 2-4 relevant emojis
              4. Add 1-2 relevant hashtags
              5. Conversational, upbeat tone
              6. Possible CTA (like, share, comment)
              7. Character limit: 2200 (for LinkedIn/Twitter)`,
      
      "script": `You are a professional scriptwriter. Create a video/audio script about "${title}" with:
              1. Clear scene/setting description
              2. Natural dialogue format
              3. Speaker labels (Host:, Narrator:, etc.)
              4. Visual/sound cues in brackets
              5. Duration: 3-5 minutes
              6. Engaging hook in first 10 seconds
              7. Call-to-action at the end`,
      
      "article": `You are a journalist writing a professional article about "${title}" with:
              1. News-style lead paragraph (who, what, when, where, why)
              2. 500-800 words total
              3. Quotes or expert opinions if relevant
              4. Formal but accessible tone
              5. 3-5 paragraphs with clear structure
              6. Fact-based with verifiable information
              7. Conclusion summarizing key points`,
      
      "email": `You are a copywriter creating a marketing email about "${title}" with:
              1. Attention-grabbing subject line
              2. Personalized greeting
              3. Clear value proposition in opening
              4. 2-3 short paragraphs max
              5. Bullet points for key benefits
              6. Strong CTA button text
              7. Professional but friendly tone
              8. Mobile-optimized length (50-125 words)`
    };

    const maxTokens = {
      "blog": 2000,
      "social-post": 300,
      "script": 1500,
      "article": 1200,
      "email": 500
    }[contentType];

    const temperature = {
      "blog": 0.7,
      'social-post': 0.8,
      "script": 0.6,
      "article": 0.5,
      "email": 0.65
    }[contentType];

    // Generate content
    const contentResponse = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompts[contentType]
        },
        {
          role: 'user',
          content: description,
        },
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    });
    console.log(contentResponse)
    const contentData = await contentResponse.json();
    const content = contentData.choices[0]?.message?.content;
    console.log(content)
    if (!content) {
      throw new Error('No content generated');
    }

    // Generate image prompt
    const imagePromptStyles = {
      "blog": "professional digital illustration, detailed, informative style",
      "social-post": "vibrant colors, trendy social media graphic, Instagram aesthetic",
      "script": "cinematic still, movie scene composition, dramatic lighting",
      "article": "photojournalism style, realistic, DSLR photo quality",
      "email": "clean marketing graphic, minimalist design, product-focused"
    };

    const imagePromptResponse = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Create an image prompt for ${contentType} about "${title}":
          1. Describe main visual elements (3-5 key items)
          2. Specify style: ${imagePromptStyles[contentType]}
          3. Mood/atmosphere matching the content
          4. Keep under 80 words
          5. Format for DALL-E generation`
        },
        {
          role: 'user',
          content: `Title: ${title}\nContent: ${content.substring(0, 1000)}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.5,
    });
 
    const imagePromptData = await imagePromptResponse.json();
    let imagePrompt = imagePromptData.choices[0]?.message?.content;

    if (!imagePrompt) {
      imagePrompt = `professional ${contentType} image about ${title}`;
    }

    // Generate image
    const imageResponse = await openai.createImage({
      prompt: `${imagePrompt.trim()}, high resolution, 8k, trending on artstation`,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });

    const imageData = await imageResponse.json();
    const imageUrl = imageData.data[0]?.url;

    if (!imageUrl) {
      throw new Error('No image generated');
    }

    // Deduct 1 credit after successful generation
    await userCollection.updateOne(
      { email: session.user?.email },
      { $inc: { credits: -1 } }
    );
    
    return NextResponse.json({
      content,
      imageUrl,
      creditsRemaining: user.credits - 1
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { 
        message: 'Error generating content',
        error: process.env.NODE_ENV === 'development' ? error.message : null
      },
      { status: 500 }
    );
  }
}