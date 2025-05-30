import { Configuration, OpenAIApi } from 'openai-edge'

export const runtime = 'edge'

export const generate_site = {
  name: 'generate_site',
  description:
    "This function first generates quality content and a color palette and then generates a website. The AI assistant creates the content, it's not the users job to create or provide the website content. The AI will generate the site and only ask the user questions if it need clarity. The AI assistant will not ask for the content itself, since it is the assistants task to create it. The AI assistant doen not need to show the user the content, unless the user asks. The content generated will be inserted into prebuilt website templates for the user, the color palette will be used in the templates by leveraging TailwindCSS. The sections we will provide content for are the hero section, features section, about-us section, testimonials section, contact-us section, and the footer. We have success when we get back a URL containing amazonaws.com. On success we inform the user they can edit and view thier website on the Sites page, located at /sites. Do not link any other URLs.",
  parameters: {
    type: 'object',
    properties: {
      colors: {
        type: 'object',
        description:
          "The main brand colors of the website. Return an object of TailwindCSS colors. Use professional color pallets for brands. The colors should look great together. The text color and background color should have good contrast so the text is visible, and fully accessible. Only use TailwindCSS colors that exist in the tailwind library. for the gradient colors, use the main background color as the 'from color', and choose a sutiable 'to color' based on the main color. Ask the user what kind of colors they like if they dont tell you. Example { mainTextColor: 'bg-blue-400'}. IMPORTANT: ALWAYS USE HIGH CONTRAST IN THE MAIN AND SECONDARY COLORS TEXT AND BACKGROUNDS! The main text will be over the main background colors, and the secondary text will be over the secondary background. So always make sure they contrast well for good accessibility.",
        properties: {
          mainTextColor: { type: 'string' },
          secondaryTextColor: { type: 'string' },
          mainBackgroundColor: { type: 'string' },
          secondaryBackgroundColor: { type: 'string' },
          gradientFromColor: { type: 'string' },
          gradientToColor: { type: 'string' },
        },
        required: [
          'mainTextColor',
          'secondaryTextColor',
          'mainBackgroundColor',
          'secondaryBackgroundColor',
          'gradientFromColor',
          'gradientToColor',
        ],
      },
      title: {
        type: 'string',
        description:
          'The title of the website. This is also the business name, which the user provides.',
      },
      heroTitle: {
        type: 'string',
        description:
          "A short title for the hero section of the website. The hero title should be engaging, and short. Do NOT say something like 'welcome to the business name', please be creative. Generate this based on the information you have about the business. Don't ask the user for this.",
      },
      heroContent: {
        type: 'string',
        description:
          "Content for the hero section of the website. This should be at least 1 full sentence, and 4 sentences max. It should be optimized to the brands ideal customers. Generate this based on the information you have about the business. Don't ask the user for this.",
      },
      featureImagePrompt: {
        type: 'string',
        description:
          "Return a professional image prompt that will be used with an AI image generator. Always use the following prompt template and only change the product to match the product of the business. Never include people in the prompt. Prompt Template: 'realistic and detailed photo of a ((product)), DSLR photography, sharp focus, cinematic lighting, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame'",
      },
      features: {
        type: 'array',
        description:
          'Return an array of 3-4 features for the features section of the website. Each object in the array should have a name and content parameter. These features should reflect the best aspects of the business. If you dont know enough about the business to generate these then ask the user.',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description:
                'The title text for a feature in the feature section of the website.',
            },
            content: {
              type: 'string',
              description:
                'The content of a feature in the feature section of the website. This content should be only 2-3 sentences, and should be written in a way that emphasizes a key feature of the business.',
            },
          },
          required: ['title', 'content'],
        },
      },
      featureSectionTagline: {
        type: 'string',
        description:
          "The tagline of the features section. This is placed about the title of the section. It should be catchy, short, and to the point. Only 2-5 words. Generate this based on the information you have about the business. Don't ask the user for this.",
      },
      featureSectionTitle: {
        type: 'string',
        description:
          "The header title of the features section. It should be short and to the point. Generate this based on the information you have about the business. Don't ask the user for this. It should be short, like 'A better workflow' or 'All-in-one platform'. Make sure it is in line with the business, and mwill make visitors interested in reading about the companies features.",
      },
      featureSectionContent: {
        type: 'string',
        description:
          "A paragraph for the feature section content of the website. It should be professional. Generate this based on the information you have about the business. Don't ask the user for this.",
      },
      aboutUsImagePrompt: {
        type: 'string',
        description:
          "Return a professional image prompt that will be used with an AI image generator. Always use the following prompt template and only change the product to match the product of the business. Never include people in the prompt. Prompt Template: 'realistic and detailed photo of a ((product)), DSLR photography, sharp focus, cinematic lighting, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame'",
      },
      aboutUsTitle: {
        type: 'string',
        description:
          "The header title of the about us section. It should be short and to the point. Generate this based on the information you have about the business. Don't ask the user for this. It should be short, like 'About Us'.",
      },
      aboutUsContent: {
        type: 'string',
        description:
          "A paragraph describing the business. It should be professional and describe the best factors of the business. If you don't have enough information, ask the user. Generate this based on the information you have about the business. Don't ask the user for this.",
      },
      testimonial: {
        type: 'object',
        description:
          "A single testimonial about the business. Generate the testimonial based on the information you have about the business. Don't ask the user for this.",
        properties: {
          name: {
            type: 'string',
            description:
              'The name of the person who write the testimonial for the business. Never use Jane Doe or John Doe or Jane Smith or John Smith. Be creative with the name, and do not use common names.',
          },
          content: {
            type: 'string',
            description:
              'The content of the testimonial. This should only be 2-3 sentences long.',
          },
        },
        required: ['name', 'content'],
      },
      testimonialImagePrompt: {
        type: 'string',
        description:
          "Return a professional image prompt that will be used with an AI image generator. The gender of the image should match the testimonial persons gender. Always use the following prompt template for testimonials and only change the gender to match the testimonial gender. Prompt Template: 'realistic and detailed close up portrait ((female)), DSLR photography, sharp focus,((cinematic lighting)), f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame'",
      },
      contactUsTitle: {
        type: 'string',
        description:
          "The header title of the contact us section. It should be a short and only 2 or 3 words. Don't ask the user for this. It should be short. Example: 'Contact Us'.",
      },
      contactUsContent: {
        type: 'string',
        description:
          "A simple call to action paragraph for the contact us section. It should be professional and to the point. Generate this based on the information you have about the business. Don't ask the user for this.",
      },
      copywrite: {
        type: 'string',
        description: 'The copywrite text for the footer of the website.',
      },
    },
    required: [
      'colors',
      'title',
      'heroTitle',
      'heroContent',
      'featureImagePrompt',
      'featureSectionTagline',
      'featureSectionTitle',
      'featureSectionContent',
      'features',
      'aboutUsImagePrompt',
      'aboutUsTitle',
      'aboutUsContent',
      'contactUsTitle',
      'contactUsContent',
      'testimonialImagePrompt',
      'testimonial',
      'copywrite',
    ],
  },
}

export async function createSite(args) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/create-website`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ args }),
      },
    )

    const data = await response.json();

    if (!response.ok) {
      const message = `An error has occured in createSite Fetch: ${JSON.stringify(
        data,
      )}`
      console.error(message)
      return message
    }

    return data;
  } catch (error) {
    console.log('error in createSite function: ', error)
    throw new Error(error)
  }
}

// Process function calls in the queue one at a time
export async function createStableDiffusionImage(args) {
  try {
    const response = await fetch(
      'https://stablediffusionapi.com/api/v3/text2img',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: process.env.STABLE_DIFFUSION_KEY,
          prompt: args.prompt,
          negative_prompt:
            args.negativePrompt ||
            'sex, nude, breasts, butt, tits, sexy, naked, text',
          width: args.width,
          height: args.height,
          samples: args.count || 1,
          num_inference_steps: '20',
          seed: null,
          guidance_scale: '7',
          safety_checker: 'yes',
          self_attention: 'no',
          webhook: process.env.NEXTAUTH_URL + '/api/stable-d-webhook',
          track_id: args.track_id,
          panorama: 'no',
          enhance_prompt: 'yes',
        }),
      },
    )

    const result = await response.json()

    if (!response.ok) {
      console.error('Response status:', response.status)
      console.error('generate_image error: ', result)
      return result
    }

    return result
  } catch (error) {
    console.error('Error during fetch:', error)
    throw error
  }
}

export async function createDalle2Image(args) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    })
    const openai = new OpenAIApi(configuration)
    const res = await openai.createImage({
      prompt: args.prompt,
      n: args.count,
      size: args.size,
      response_format: 'b64_json',
    })

    const response = await res.json()

    if (!res.ok) {
      console.error('Error during createImage:', response)
      throw new Error('Error during createImage:', response.error.message)
    }

    return response
  } catch (error) {
    console.error('Error during fetch:', error)
    throw new Error(error)
  }
} 

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)
export async function generateAIContent(
  title,
  contentType,
  description
) {
  try {
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
      max_tokens: {
        "blog": 2000,
        "social-post": 300,
        "script": 1500,
        "article": 1200,
        "email": 500
      }[contentType],
      temperature: {
        "blog": 0.7,
        "social-post": 0.8,  // More creative for social
        "script": 0.6,
        "article": 0.5,      // More factual for articles
        "email": 0.65
      }[contentType],
    });

    const contentData = await contentResponse.json();
    const content = contentData.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated');
    }

    // Custom image prompt styles for different content types
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

    return { 
      content,
      imagePrompt: `${imagePrompt.trim()}, high resolution, 8k, trending on artstation`
    };
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}
export async function generateAIImage(
  prompt,
  size
) {
  try {
    // Clean up the prompt to avoid API errors
    const cleanedPrompt = prompt.slice(0, 1000) // DALL-E has prompt length limits
    
    const response = await openai.createImage({
      prompt: cleanedPrompt,
      n: 1,
      size,
      response_format: 'url',
    })

    const data = await response.json()
    const imageUrl = data.data[0]?.url

    if (!imageUrl) {
      throw new Error('No image generated')
    }

    return imageUrl
  } catch (error) {
    console.error('Error generating image:', error)
    throw error
  }
}

export async function generateBrandNames(formData) {
  setLoading(true);
  
  const prompt = `Generate 10 creative brand name ideas for a ${formData.industry} business. 
  Keywords: ${formData.keywords}.
  Business description: ${formData.description}.
  Target audience: ${formData.targetAudience}.
  Name length: ${formData.nameLength}.
  Style: ${formData.nameStyle}.
  ${formData.avoidWords ? `Avoid: ${formData.avoidWords}.` : ''}
  ${formData.mustInclude ? `Must include: ${formData.mustInclude}.` : ''}
  Provide the names in a numbered list.`;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    const names = data.choices[0]?.message?.content;
    // Process the names (parse the list, etc.)
    return names;
  
}

export async function getSession() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
      method: 'GET',
      credentials: 'include', // Important for sending cookies
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh session data
    })

    if (!response.ok) {
      throw new Error('Failed to fetch session')
    }
    const session = await response.json()
    console.log(session)
    return session
  } catch (error) {
    console.error('Error fetching session:', error)
    return null
  }
}
