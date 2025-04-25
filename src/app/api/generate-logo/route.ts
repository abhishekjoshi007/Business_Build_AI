// app/api/generate-logo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import OpenAI from 'openai';
import { Configuration, OpenAIApi } from 'openai-edge';
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(request: NextRequest) {
  try {
    console.log("key" , process.env.OPENAI_API_KEY)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await import('@/app/lib/mongodb').then(mod => mod.default);
    const dbName = process.env.MONGODB_DB;
    const userCollection = client.db(dbName).collection('users');
    const user = await userCollection.findOne({ email: session.user?.email });

    if (!user || user.credits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    }

    const { prompt, seed, width = 512, height = 512 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Enhanced prompt construction
    const logoPrompt = `
      ${prompt}.
     `.replace(/\n\s+/g, ' ').trim();

    // Generate image with error handling
    let imageUrl;
    try {
      const imageResponse = await openai.createImage({
        prompt: logoPrompt,
        n: 1,
        size: "1024x1024",
        response_format: "url",
      });
      const imageData = await imageResponse.json()
      console.log(imageData)
      imageUrl = imageData.data[0]?.url;
      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      return NextResponse.json(
        { 
          error: 'Failed to generate logo',
          details: openaiError.error?.message || openaiError.message 
        },
        { status: 500 }
      );
    }

    // Deduct credit only after successful generation
    await userCollection.updateOne(
      { email: session.user?.email },
      { $inc: { credits: -1 } }
    );

    return NextResponse.json({
      imageUrl,
      seed: seed || Math.floor(Math.random() * 2147483647),
      creditsRemaining: user.credits - 1,
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}