import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
dotenv.config();

// Initialise ChatOpenAI Object
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL_NAME = process.env.OPENAI_MODEL_NAME;

const model = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    modelName: OPENAI_MODEL_NAME
});

// response
const invoke_response = await model.invoke("What is Langchain?")
const batch_response = await model.batch(["What is Langchain?", "Key features of Langchain?"])
const stream_response = await model.stream("What is Langchain?")
const stream_log_response = await model.streamLog("What is Langchain?")

console.log(invoke_response['content']);

// Streamling data
for await (const chunks of stream_response){
    console.log(chunks.content);
}
