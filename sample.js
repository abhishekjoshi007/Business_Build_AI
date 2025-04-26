const axios = require('axios');
const fs = require('fs');

// IMPORTANT: Updated API endpoint format
const API_URL = 'https://fantaxy-ofai-flx-logo.hf.space/api/predict/';

async function generateLogo(prompt, seed, randomizeSeed, width, height, steps, filename) {
  try {
    console.log(`Generating logo with prompt: "${prompt}"...`);
    
    const response = await axios.post(API_URL, {
      data: [
        prompt,
        seed,
        randomizeSeed,
        width,
        height,
        steps
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }

    const base64Data = response.data.data[0];
    const buffer = Buffer.from(base64Data.split(',')[1] || base64Data, 'base64');
    fs.writeFileSync(filename, buffer);
    
    console.log(`✅ Successfully saved ${filename}`);
    return true;
  } catch (error) {
    console.error('❌ Error:', {
      message: error.message,
      response: error.response?.data,
      config: {
        url: error.config?.url,
        data: error.config?.data
      }
    });
    return false;
  }
}

async function testEndpoint() {
  // First test if endpoint is reachable
  try {
    const healthCheck = await axios.get(API_URL.replace('/predict', '/info'));
    console.log('ℹ️ API Info:', healthCheck.data);
    return true;
  } catch (error) {
    console.error('❌ Failed to reach API endpoint:', {
      url: API_URL,
      error: error.message
    });
    return false;
  }
}

async function main() {
  console.log('Starting logo generation tests...\n');

  // 1. Verify endpoint is accessible
  if (!await testEndpoint()) {
    console.log('\nPlease check:');
    console.log('1. The Space is running (not in "Sleep" mode)');
    console.log('2. The URL is correct (should look like: https://username-spacename.hf.space/)');
    console.log('3. The Space has API enabled in its settings');
    return;
  }

  // 2. Test logo generation
  const tests = [
    {
      prompt: '[Style: Modern] [Color: Red and Black] [Concept: Restaurant] [Text: TASTY HOUSE]',
      seed: 42,
      randomizeSeed: false,
      width: 1024,
      height: 1024,
      steps: 4,
      filename: 'english-logo.png'
    },
    {
      prompt: '[스타일: 모던] [색상: 빨강과 검정] [컨셉: 식당] [텍스트: 맛있는집]',
      seed: 100,
      randomizeSeed: false,
      width: 512,
      height: 512,
      steps: 4,
      filename: 'korean-logo.png'
    }
  ];

  for (const test of tests) {
    await generateLogo(
      test.prompt,
      test.seed,
      test.randomizeSeed,
      test.width,
      test.height,
      test.steps,
      test.filename
    );
  }
}

main();