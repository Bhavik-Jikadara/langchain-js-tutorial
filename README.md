# LangChain.js Tutorial: Building an Advanced Retrieval Chain with Conversation History

## Introduction

This tutorial is designed to make working with [LangChain.js](https://js.langchain.com/docs/introduction/) as easy and approachable as possible. It provides a hands-on introduction to LangChain, a powerful library for building language model applications. With step-by-step guidance, you will learn how to harness the power of AI and language models in JavaScript without requiring advanced knowledge.

The core concept demonstrated here is the enhancement of a simple retrieval system by adding conversation memory. This allows users to have fluid conversations with the AI, where it remembers prior interactions and delivers context-aware responses.

## Use Cases

The advanced retrieval chain with conversation memory can be used in multiple scenarios:

- **Customer Support**: Allow customers to have fluid and natural conversations with chatbots that remember past queries, providing faster and more accurate responses.
- **Personal Assistants**: Build personal AI assistants that recall your previous conversations to assist with follow-up tasks and reminders.
- **Educational Tools**: Create AI tutors that keep track of learners' progress and adapt their answers based on past interactions.
- **Research Assistance**: Use the system to recall previously retrieved information and provide detailed, context-driven follow-ups.

## File Structure

Here's a brief overview of the important files in the src directory:

- **src/llms.js**: Handles the initialization of language models used for processing queries.
- **src/prompt-templates.js**: Contains templates for creating structured prompts for the language model.
- **src/output-parsers.js**: Defines parsers to interpret the output of the language model and format responses.
- **src/retrieval-chain.js**: Implements a basic retrieval chain, querying the vector database.
- **src/conversation-retrieval-chain.js**: Enhances the basic retrieval chain by incorporating conversation history for more accurate responses.
- **src/agent.js**: Defines the agent responsible for managing the query pipeline and interaction with different modules.
- **src/memory.js**: Manages conversation memory, keeping track of user interactions and responses.

## Installation

To set up and run the project locally, follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- NPM (comes with Node.js)

### Steps

1. **Clone the Repository**:

    ```bash
    git clone <repository-url>
    cd <repository-folder>  
    ```

2. **Install Dependencies**
Run the following command to install all required node modules:

    ```bash
    npm install
    ```

3. **Set Up Environment Variables**
Create a .env file in the root directory and add the following (replace placeholders with actual values):

    ```bash
    OPENAI_API_KEY=""
    OPENAI_MODEL_NAME=gpt-3.5-turbo
    TAVILY_API_KEY=""
    ```

### How to Run

1. Run the Application:
After setting up your environment variables, start the app using the following command:

    ```bash
    node src/filename.js
    ```

2. Test the Application:
The system is now set up to handle conversation-based queries and memory-enhanced retrieval. You can run tests by interacting with the console or integrating the code with a frontend interface.

## Future Enhancements

- **Frontend Integration**: Connect the conversation retrieval chain to a web or mobile interface to provide a seamless user experience.
- **Database Enhancements**: Add support for other vector databases or integrate with knowledge graphs to expand retrieval capabilities.
- **Custom Prompts**: Fine-tune the prompt templates and models for specific domains (e.g., customer support, medical assistance).

## Conclusion

This project provides a foundational understanding of building advanced AI applications using LangChain.js. By incorporating conversation memory into a retrieval system, we enable fluid and contextual conversations, making language models even more powerful and useful in real-world applications.

For more detailed documentation and future updates, refer to the [LangChain.js documentation](https://js.langchain.com/docs/introduction/).
