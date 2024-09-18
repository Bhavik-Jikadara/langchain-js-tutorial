import { ChatOpenAI } from "@langchain/openai";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";

import { MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

import * as dotenv from "dotenv";

// Import environment variables
dotenv.config();

// Instantiate Model
const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
});

// Use PuppeteerWebBaseLoader to scrape content from webpage and create documents
const loader = new PuppeteerWebBaseLoader(
    "https://js.langchain.com/docs/expression_language/"
);
const docs = await loader.load();

// Text Splitter
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
});
const splitDocs = await splitter.splitDocuments(docs);


// Instantiate Embeddings function
const embeddings = new OpenAIEmbeddings();

// Create Vector Store
const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
);

// Create a retriever from vector store
const retriever = vectorstore.asRetriever({ k: 1 });

// Create a HistoryAwareRetriever which will be responsible for
// generating a search query based on both the user input and
// the chat history
const retrieverPrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
    [
        "user",
        "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
]);

// This chain will return a list of documents from the vector store
const retrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: retrieverPrompt,
});

// Fake chat history
const chatHistory = [
    new HumanMessage("What does LCEL stand for?"),
    new AIMessage("LangChain Expression Language"),
];

// // Test: return only the documents
// const response = await retrievalChain.invoke({
//     chat_history: chatHistory,
//     input: "What is it?",
// });

// console.log(response);

// ###########################################
// #### Final ####
// ###########################################

// Define the prompt for the final chain
const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        "Answer the user's questions based on the following context: {context}.",
    ],
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
]);

// Since we need to pass the docs from the retriever, we will use
// the createStuffDocumentsChain
const chain = await createStuffDocumentsChain({
    llm: model,
    prompt: prompt,
});

// Create the conversation chain, which will combine the retrieverChain
// and combineStuffChain in order to get an answer
const conversationChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever: retrieverChain,
});

// Test
const response = await conversationChain.invoke({
    chat_history: chatHistory,
    input: "How to install langchain-core in langchain Python?",
});

console.log(response);