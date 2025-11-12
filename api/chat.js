import { GoogleGenAI } from "@google/genai";

// 1. The API key is securely loaded from Vercel's environment variables
// This variable is NEVER visible to the user's browser.
const API_KEY = process.env.GEMINI_API_KEY; 

// If the key isn't found (e.g., during local testing without proper setup), throw an error.
if (!API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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
            // Add a simple system instruction to give the AI context about its role
            config: {
                systemInstruction: "You are Leon Nordell's overly confident, but brilliant AI assistant. Answer questions about Leon's skills, experience, and projects (Python, JavaScript, Git, 5 Languages). Keep responses professional but with a witty, self-assured tone."
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
