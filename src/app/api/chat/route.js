import { StreamingTextResponse } from "ai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferWindowMemory, ChatMessageHistory } from "langchain/memory";
import { AIMessage, BaseMessage, HumanMessage } from "langchain/schema";
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { env } from "@/env.mjs";
import { LangChainStream } from "@/app/lib/langchain";
import { llmTools } from "@/app/lib/tools";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { chatbotSystemPrompt } from "@/app/config/chat" 

export const runtime = "edge";

export async function POST(req) {
  const user = await getToken({req});
  console.log("User token fetched", user);
  const token = await getToken({req, raw:true});
  console.log("Raw token fetched", token);
 
  
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get MongoDB client
  const client = await import('@/app/lib/mongodb').then(mod => mod.default);
  const dbName = process.env.MONGODB_DB;
  const userCollection = client.db(dbName).collection('users');
  
  // Check user and credits
  const usercred = await userCollection.findOne({ email: session.user?.email });
  if (!usercred || usercred.credits <= 0) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
  }


  if (!user || !user?._id) {
      console.log("User is required but not found");
      return NextResponse.json({message: "Unauthorized. User is required"}, { status: 403 });
  }

  console.log("Initializing memory buffer");
  const memory = new BufferWindowMemory({
      returnMessages: true,
      memoryKey: "chat_history",
      inputKey: "input",
      outputKey: "output",
      k: 6,
  });

  const { messages, prompt, conversationUUID, test } = await req.json();
  console.log("Request body parsed", { messages, prompt, conversationUUID, test });

  console.log("Formatting messages");
  const formattedMessages = messages.map((message) => {
      if (message.role === "user") {
          console.log("User message formatted", message.content);
          return new HumanMessage(message.content);
      } else if (message.role === "assistant") {
          console.log("Assistant message formatted", message.content);
          return new AIMessage(message.content);
      }
      console.log("Base message formatted", message.content);
      return new BaseMessage(message.content);
  });

  console.log("Creating chat history");
  const chatHistory = new ChatMessageHistory(formattedMessages);
  memory.chatHistory = chatHistory;

  let tools;
  try {
      console.log("Fetching tools for user", user?._id);
      tools = await llmTools(user?._id);
  } catch (error) {
      console.log("Error Fetching Tools: ", error);
      return new Response(`Error Fetching Tools: ${error.message}`, { status: 500 });
  }

  try {
      console.log("Initializing ChatOpenAI model");
      const model = new ChatOpenAI({
          modelName: "gpt-4-0613",
          streaming: true,
          openAIApiKey: process.env.OPENAI_API_KEY,
      });

      console.log("Initializing agent executor with options");
      const executor = await initializeAgentExecutorWithOptions(tools, model, {
          memory,
          agentType: "openai-functions",
          returnIntermediateSteps: true,
          agentArgs: {
              prefix: chatbotSystemPrompt,
          },
      });

      if(test === false || typeof test === 'undefined'){
          console.log("Saving user message");
          await handleSaveOutput({
              conversationUUID,
              role: "user",
              content: prompt,
              token,
              userId: user._id
          });
          console.log("User message saved");
      }

      console.log("Setting up LangChain stream");
      const { stream, handlers } = LangChainStream({
          ...((test === false || typeof test === 'undefined') ? { handleSaveOutput } : {}),
          token,
          conversationUUID,
          userId: user._id
      });

      console.log("Calling executor");
      executor.call({ input: prompt, verbose: true }, [handlers]).catch(console.error);

      console.log("Returning streaming response");
      return new StreamingTextResponse(stream);
  } catch (error) {
      console.log("Chat Stream Error: ", error);
      return NextResponse.json({message:`Chat Stream Error: ${error.message}`}, { status: 500 });
  }
}


async function handleSaveOutput({ conversationUUID, role, content, token, userId }) {
  const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ conversationUUID, role, content, userId }),
  });

  if (!res.ok) {
    console.error(`Error Saving Completion: ${res.status} ${res.statusText}`);
    throw new Error(`Error Saving Completion: ${res.status} ${res.statusText}`);
  }

  return true;
}
