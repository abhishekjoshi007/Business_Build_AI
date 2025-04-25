// scripts/test-hf.ts
import fetch from 'node-fetch';        // npm i node-fetch@^3
import fs from 'fs/promises';

const HF_KEY = "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"
;
console.log(HF_KEY)
const url = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell';

async function main() {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: 'A pastel sunset over mountains, minimalist',
      parameters: { width: 256, height: 256, num_inference_steps: 4 }
    })
  });

  if (!res.ok) {
    console.error('HF error:', await res.text());
    return;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile('sunset.png', buf);
  console.log('Image saved → sunset.png');
}

main().catch(console.error);
