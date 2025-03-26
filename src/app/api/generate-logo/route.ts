import { NextResponse } from 'next/server'

export async function POST(req: NextResponse) {
  // Only allow POST requests
  console.log(req.json())
  // Validate request body
  const { prompt, parameters } = req.json()
  console.log("prompt ", prompt)
  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'Valid prompt is required' })
  }

  // Validate environment variable
  const HF_API_KEY = process.env.HF_API_KEY
  if (!HF_API_KEY) {
    console.error('Hugging Face API key is not configured')
    return NextResponse.json({ error: 'Server configuration error' })
  }

  // Configure API endpoint
  const API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0'

  try {
    // Make request to Hugging Face API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          seed: parameters?.seed || Math.floor(Math.random() * 1000000),
          guidance_scale: parameters?.guidance_scale || 12,
          num_inference_steps: parameters?.num_inference_steps || 60,
          height: parameters?.height || 512,
          width: parameters?.width || 512,
          negative_prompt: `
            text, words, letters, signature, watermark, date, 
            blurry, low quality, distorted, noisy, grainy,
            photo, realistic, 3d render, painting, drawing, sketch,
            complex, busy, messy, crowded, cluttered,
            asymmetrical, unbalanced, off-center,
            person, face, people, animal, object, product,
            background, scene, landscape, building
          `.replace(/\n\s+/g, ' ').trim()
        }
      })
    })

    // Handle Hugging Face API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Hugging Face API error:', errorData)
      throw new Error(errorData.error || 'Failed to generate image')
    }

    // Convert image to base64
    const imageBlob = await response.blob()
    const buffer = await imageBlob.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString('base64')

    // Return success response
    return NextResponse.json({ 
      image: `data:image/png;base64,${base64Image}` 
    })

  } catch (error) {
    console.error('Logo generation error:', error)
    return NextResponse.json("Error generating")
  }
}