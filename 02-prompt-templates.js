import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts"
import * as dotenv from "dotenv";
dotenv.config();

// Initialise ChatOpenAI Object
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL_NAME = process.env.OPENAI_MODEL_NAME;

const model = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    modelName: OPENAI_MODEL_NAME
});

// Create a Prompt Template
const prompt = ChatPromptTemplate.fromTemplate(
    "You are an AI assistant. That give answer based on the following questions: {input}"
)

// const prompts = ChatPromptTemplate.fromMessages([
//     ["system", "You are an AI assistant. Generate an answer based on a questions provided by the user"],
//     ["human", "{input}"],
// ])


// print prompt-template
console.log(await prompt.format({input: "What is LLMs?"}));


// Create a chain
const chain = prompt.pipe(model);

// call chain
const response = await chain.invoke({
    input: "What is LLMs?"
})

console.log("Response: ", response.content);
