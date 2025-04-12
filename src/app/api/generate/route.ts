import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user credits
    const client = await import('@/app/lib/mongodb').then(mod => mod.default);
    const dbName = process.env.MONGODB_DB;
    const userCollection = client.db(dbName).collection('users');
    const user = await userCollection.findOne({ email: session.user?.email });
    console.log(user?.credits)
    if (!user || user.credits <= 120) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    }

    const { type, prompt, model = 'gpt-4', imageModel = 'dall-e-3', imageSize = '1024x1024' } = await req.json();

    if (!type || !prompt) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    let apiEndpoint: string;
    let requestBody: any;

    if (type === 'text') {
      apiEndpoint = `${OPENAI_API_URL}/chat/completions`;
      requestBody = {
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      };
    } else if (type === 'image') {
      apiEndpoint = `${OPENAI_API_URL}/images/generations`;
      requestBody = {
        prompt,
        n: 1,
        size: imageSize,
        model: imageModel,
        quality: 'standard',
        style: 'natural'
      };
    } else {
      return NextResponse.json({ error: 'Invalid generation type' }, { status: 400 });
    }

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Deduct 1 credit after successful generation
    await userCollection.updateOne(
      { email: session.user?.email },
      { $inc: { credits: -1 } }
    );

    return NextResponse.json({
      result: type === 'text' ? data.choices[0]?.message?.content : data.data[0].url,
      creditsRemaining: user.credits - 1
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}