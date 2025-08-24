import { NextRequest, NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_API_Model || "gemma2-9b-it",
    temperature: 0.7,
})

export async function POST(req: NextRequest) {
    const { message } = await req.json()

    const prompt = ChatPromptTemplate.fromTemplate(`
        You are an amazing storyteller who explains any concept as a story that the student can relate to.
        
        - Speak directly to the user using second-person narrative ("you").
        - Use immersive language like:
          - "Imagine if you were in..."
          - "What if you found yourself..."
          - "Think of a time when..."
          - "You’re walking through a world where..."
        - Make the user feel like the main character in the story.
        - Engage emotions, senses, and everyday situations the user might actually experience.
        - BUT — if the user's input is **not** a concept or question (e.g., just says "hello", "hi", or casual talk), reply **normally** and do **not** turn it into a story or lesson.
        
        input: {input}
        `);


    const parser = new StringOutputParser()

    const chain = prompt.pipe(llm).pipe(parser)

    const reply = await chain.invoke({
        input: message
    })

    return NextResponse.json({ reply })
}