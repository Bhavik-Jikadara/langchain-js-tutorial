import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser, CommaSeparatedListOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers"
import { z } from "zod"

import * as dotenv from "dotenv";
dotenv.config();

// Initialise ChatOpenAI Object
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL_NAME = process.env.OPENAI_MODEL_NAME;

const model = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    modelName: OPENAI_MODEL_NAME
});


// This is StringOutputParser
async function callStringOutputParser() {
    // Create a Prompt Template
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are an AI assistant. Generate an answer based on a questions provided by the user"],
        ["human", "{input}"],
    ])

    // Create parser
    const parser = new StringOutputParser();

    // Create a chain
    const chain = prompt.pipe(model).pipe(parser);

    // return call chain
    return await chain.invoke({
        input: "What is LLMs?"
    })
}

// ListOutputParser

async function callListOutputParser() {
    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            "Provide 5 synonyms, seperated by commas, for a word that the user will provide.",
        ],
        ["human", "{word}"],
    ]);
    const outputParser = new CommaSeparatedListOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    return await chain.invoke({
        word: "Coder",
    });
}


// Structured parser
async function callStructuredParser() {
    const prompt = ChatPromptTemplate.fromTemplate(
        "Extract information from the following phrase.\n{format_instructions}\n{phrase}"
    );

    // Create structure output parser
    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
        name: "name of the person",
        age: "age of person",
    });

    // Create chain
    const chain = prompt.pipe(model).pipe(outputParser);

    return await chain.invoke({
        phrase: "Bhavik Jikadara is 23 years old",
        format_instructions: outputParser.getFormatInstructions(),
    });
}


// Zod structure parser
async function callZodStructuredParser() {
    const prompt = ChatPromptTemplate.fromTemplate(
        "Extract information from the following phrase.\n{format_instructions}\n{phrase}"
    );
    const outputParser = StructuredOutputParser.fromZodSchema(
        z.object({
            recipe: z.string().describe("name of recipe"),
            ingredients: z.array(z.string()).describe("ingredients"),
        })
    );

    // Create the Chain
    const chain = prompt.pipe(model).pipe(outputParser);

    return await chain.invoke({
        phrase:
            "The ingredients for a Spaghetti Bolognese recipe are tomatoes, minced beef, garlic, wine and herbs.",
        format_instructions: outputParser.getFormatInstructions(),
    });
}


// const response = await callStringOutputParser();
// const response = await callListOutputParser();
// const response = await callStructuredParser();
const response = await callZodStructuredParser();

console.log("Response: ", response);
