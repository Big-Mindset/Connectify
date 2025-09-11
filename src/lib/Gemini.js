let {OpenAI} = require("openai") 
let {config} = require("dotenv")
let util = require("util")

config()
let res = async ()=>{

    const client = new OpenAI({
        baseURL: "https://router.huggingface.co/v1",
        apiKey: process.env.Api_Token,
    });

    const chatCompletion = await client.chat.completions.create({
        model: "openai/gpt-oss-120b:fireworks-ai",
        messages: [
            {
                role: "user",
                content: "What is the capital of France?",
            },
        ],
    });
    console.log(chatCompletion.choices[0].message);
    console.log(util.inspect(chatCompletion,{depth : null}));
    
    
}
res()