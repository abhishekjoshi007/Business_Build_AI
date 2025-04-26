import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/authOptions';

const hf = new HfInference(process.env.NEXT_PUBLIC_HF_API_KEY);

const MAX_SEED = 2147483647; // Same as np.iinfo(np.int32).max
const MAX_IMAGE_SIZE = 2048;

export async function POST(request: Request) {
  try {
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

    const { prompt, seed = 42, randomizeSeed = false, width = 1024, height = 1024, steps = 4 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Handle seed randomization
    let finalSeed = seed;
    if (randomizeSeed) {
      finalSeed = Math.floor(Math.random() * MAX_SEED);
    }

    let finalPrompt = prompt;

    // Detect if Korean and translate
    if (/[\uAC00-\uD7A3]/.test(prompt)) {
      try {
        const translation = await hf.translation({
          model: 'Helsinki-NLP/opus-mt-ko-en',
          inputs: prompt
        });
        finalPrompt = translation.translation_text;
        console.log('Translated prompt:', finalPrompt);
      } catch (translationError) {
        console.warn('Translation failed, using original prompt:', translationError);
      }
    }

    console.log('Generating image with prompt:', finalPrompt);

    const response = await hf.textToImage({
      model: 'black-forest-labs/FLUX.1-schnell',
      inputs: finalPrompt,
      parameters: {
        width: Math.min(Number(width), MAX_IMAGE_SIZE),
        height: Math.min(Number(height), MAX_IMAGE_SIZE),
        num_inference_steps: Number(steps),
        guidance_scale: 0,
        seed: finalSeed
      }
    });

    if (!response) {
      throw new Error('No response from textToImage');
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    // Deduct 1 credit
    await userCollection.updateOne(
      { email: session.user?.email },
      { $inc: { credits: -1 } }
    );

    return NextResponse.json({
      image: `data:image/png;base64,${base64Image}`,
      seed: finalSeed,
      creditsRemaining: user.credits - 1
    });

  } catch (error: any) {
    console.error('Detailed Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return NextResponse.json(
      {
        message: 'Error generating logo',
        error: process.env.NODE_ENV === 'development' ? error.message : null
      },
      { status: 500 }
    );
  }
}
