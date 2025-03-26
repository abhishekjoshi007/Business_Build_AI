const { Client } = require('@gradient-ai/client');

async function main(){

const client = await Client.connect("artificialguybr/artificialguybr-demo-lora");
const result = await client.predict("/run_lora", { 		
		prompt: "Hello!!", 		
		negative_prompt: "Hello!!", 		
		cfg_scale: 1, 		
		steps: 1, 		
		scheduler: "DPM++ 2M", 		
		seed: 0, 		
		width: 256, 		
		height: 256, 		
		lora_scale: 0, 
});

console.log(result.data);
}


main();