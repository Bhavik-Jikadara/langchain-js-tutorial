import readline from "readline";
import * as dotenv from "dotenv";

import { ChatOpenAI } from "@langchain/openai";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";

import { HumanMessage, AIMessage } from "@langchain/core/messages";

import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";

// Tool imports
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { createRetrieverTool } from "langchain/tools/retriever";

// Custom Data Source, Vector Stores
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";


// Import environment variables
dotenv.config();

// ---------------------- Create Retriever ----------------------------
// Use PuppeteerWebBaseLoader to scrape content from webpage and create documents
const loader = new PuppeteerWebBaseLoader(
    "https://js.langchain.com/docs/expression_language/"
);
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
});

const splitDocs = await splitter.splitDocuments(docs);

const embeddings = new OpenAIEmbeddings();

const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
);

const retriever = vectorStore.asRetriever({
    k: 2,
});

// ------------------------ Instantiate the model ------------------------
const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.2,
});

// --------------------------- Prompt Template --------------------------
const prompt = ChatPromptTemplate.fromMessages([
    ("system", "You are a helpful assistant."),
    new MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
    new MessagesPlaceholder("agent_scratchpad"),
]);

// ------------------------ Tools ------------------------------------
const searchTool = new TavilySearchResults();
const retrieverTool = createRetrieverTool(retriever, {
    name: "lcel_search",
    description:
        "Use this tool when searching for information about Lanchain Expression Language (LCEL)",
});

const tools = [searchTool, retrieverTool];

const agent = await createOpenAIFunctionsAgent({
    llm: model,
    prompt,
    tools,
});

//  ------------------------ Create the executor ------------------------------------
const agentExecutor = new AgentExecutor({
    agent,
    tools,
});

// ------------------------ User Input ------------------------------------

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const chat_history = [];

function askQuestion() {
    rl.question("User: ", async (input) => {
        if (input.toLowerCase() === "exit") {
            rl.close();
            return;
        }

        const response = await agentExecutor.invoke({
            input: input,
            chat_history: chat_history,
        });

        console.log("Agent: ", response.output);

        chat_history.push(new HumanMessage(input));
        chat_history.push(new AIMessage(response.output));

        askQuestion();
    });
}

askQuestion();
