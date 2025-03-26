import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.NEXT_PUBLIC_HF_API_KEY);

export async function POST(request: Request) {
  try {
    const { prompt, seed, width = 512, height = 512, steps = 4 } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { message: 'Prompt is required' },
        { status: 400 }
      );
    }

    // First translate if Korean
    let finalPrompt = prompt+seed;
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

    // Generate image
    console.log('Generating image with prompt:', finalPrompt);
    const response = await hf.textToImage({
      model: 'black-forest-labs/FLUX.1-schnell',
      inputs: finalPrompt,
      parameters: {
        width: Number(width),
        height: Number(height),
        num_inference_steps: Number(steps),
        guidance_scale: 0
      }
    });

    if (!response) {
      throw new Error('No response from textToImage');
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    
    return NextResponse.json({ 
      image: `data:image/png;base64,${base64Image}`,
      seed: seed || Math.floor(Math.random() * 2147483647)
    });
    
  } catch (error) {
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