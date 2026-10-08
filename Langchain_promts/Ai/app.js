import Groq from "groq-sdk";
import {tavily} from "@tavily/core";
import readline from "readline/promises"; //for input from user
import dotenv from "dotenv";


dotenv.config({ path: "../Ai/.env" });

const Tavily = new tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq=new Groq({apiKey:process.env.GROQ_API_KEY});

//const rl = readline.createInterface({input: process.stdin, output: process.stdout});

export async function generate(userMessage) {

   const messages = [
    {
        role: "system",
        content: `You are a helpful assistant... current date is ${new Date().toUTCString()}`
    }
];
  //const question = await rl.question("You: ");

//   if (question.toLowerCase() === "bye") {
//         break;
//     }

  messages.push({
    role: "user",
    content: userMessage
   });
    while (true) {

    const chatCompletion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        temperature: 0,
        messages: messages,
        tools: [
            {
                type: "function",
                function: {
                    name: "webSearch",
                    description: "Search the web for information",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "the search query to look up on the web"
                            }
                        },
                        required: ["query"]
                    }
                }
            }
        ],
        tool_choice: "auto",
    });

    messages.push(chatCompletion.choices[0].message);

    const message = chatCompletion.choices[0].message;

    if (message.tool_calls) {

        for (const tool_call of message.tool_calls) {

            if (tool_call.function.name === "webSearch") {

                const toolResult = await webSearch(
                    JSON.parse(tool_call.function.arguments)
                );

                messages.push({
                    role: "tool",
                    tool_call_id: tool_call.id,
                    content: toolResult
                });
            }
        }

    } else {

        return message.content;

    }
}

    //console.log(finalResponse.choices[0].message.content);
    //console.log(JSON.stringify(chatCompletion.choices[0].message, null, 2));

  //rl.close();
}
//generate();

async function webSearch({query}) {
    console.log("calling web search")
    const response = await Tavily.search(query);
    //console.log(response)

    const finalResponse = response.results.map((result) =>result.content).join("\n\n");
    
    return finalResponse;
}