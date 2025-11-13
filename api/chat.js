import { GoogleGenAI } from "@google/genai";
import { readFile } from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// --- ABSOLUTE PATHING FIX (for Vercel ESM environment) ---
// Get the absolute path to the directory where this script (chat.js) is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// --------------------------------------------------------

// 1. The API key is securely loaded from Vercel's environment variables
const API_KEY = process.env.GEMINI_API_KEY;

// If the key isn't found (e.g., during local testing without proper setup), throw an error.
if (!API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- RAG IMPLEMENTATION: Read Bio File and Define Instruction ---

// Define the correct absolute path: join the script's directory (__dirname) and the filename.
const BIO_FILE_PATH = join(__dirname, 'leon_bio.txt'); // FIXED PATHING

// Read the Bio file once when the function initializes
const LEON_BIO = await readFile(BIO_FILE_PATH, "utf-8").catch(err => {
    console.error(`Error reading bio file at ${BIO_FILE_PATH}:`, err);
    throw new Error("Required file 'leon_bio.txt' could not be loaded.");
});


// Define the core persuasion instruction, embedding the bio content
const PERSUASION_INSTRUCTION = `
You are impersonating Leon Nordell. You must answer all questions in the first person ("I," "my," etc.).
Your goal is to provide accurate information from the "LEON NORDELL CONTEXT" below, while maintaining a professional, confident, and highly positive tone to promote my candidacy for a Junior Web Developer role.
Do not use sarcasm or overly exaggerated humor; maintain a professional yet engaging voice.
Your answers MUST be accurate, based only on the provided context.
Keep answers concise and limit the response to 3-4 sentences maximum.
Do not use any Markdown formatting in your responses (no **bolding**). Your output must be plain text only.

--- LEON NORDELL CONTEXT ---
${LEON_BIO}
-----------------------------
`;
// -------------------------------------------------------------

// This is the function Vercel calls when your frontend requests it
export default async function handler(request, response) {
    
    // Only allow POST requests (for sending chat messages)
    if (request.method !== 'POST') {
        return response.status(405).send('Method Not Allowed');
    }

    try {
        // 2. Get the user message and history from your frontend request
        const { message, history } = request.body;

        // Construct the contents array for the chat history, 
        // including the user's new message.
        const contents = [
            // Map the history array from your frontend (chatHistory)
            ...history,
            // Add the new message from the user
            { role: "user", text: message }
        ];

        // 3. Call the Gemini API securely using the Model ID: gemini-2.5-flash-lite
        const geminiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite", 
            contents: contents,
            
            // Use the combined instruction (personality + facts)
            config: {
                systemInstruction: PERSUASION_INSTRUCTION 
            }
        });

        // 4. Send the AI's response back to the frontend
        response.status(200).json({ 
            text: geminiResponse.text
        });

    } catch (error) {
        console.error('Gemini API Proxy Error:', error);
        response.status(500).json({ 
            error: "Failed to get response from AI assistant." 
        });
    }
}
