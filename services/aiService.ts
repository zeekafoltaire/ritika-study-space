

import { GoogleGenAI, Type } from "@google/genai";
import type { Formula } from '../types';

// The API key is hardcoded as per the user's explicit and repeated request.
const apiKey = 'AIzaSyAD4elCt6gvyU-KtEv0lHJZ9dnnIDMYiWs';

if (!apiKey) {
    // This provides a clear error for developers if the API key is not configured.
    throw new Error("API_KEY is not set. Please configure it.");
}
const ai = new GoogleGenAI({ apiKey });


/**
 * Sends a text prompt to the Gemini API for general doubts.
 * @param prompt - The user's query.
 * @returns The AI's text response.
 */
export const askDoubt = async (prompt: string): Promise<string> => {    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are a helpful study assistant for a student named Ritika. Keep your answers concise, clear, and helpful for a student."
            }
        });
        
        const text = response.text;
        if (!text) throw new Error("Received an empty response from the AI service.");
        return text.trim();

    } catch (error) {
        console.error("Gemini API Error in askDoubt:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        if (message.includes("API key not valid")) {
             throw new Error("AI service connection failed: The API Key is not valid. Please check your environment configuration.");
        }
        throw new Error(`Failed to connect to AI service: ${message}`);
    }
};

/**
 * Generates a step-by-step solution for a given problem.
 * @param question The problem statement.
 * @returns A promise that resolves to the AI-generated solution as a string.
 */
export const getAiProblemSolution = async (question: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Provide a step-by-step solution for the following problem: ${question}`,
            config: {
                systemInstruction: "You are an expert tutor. Provide a clear, step-by-step solution. Explain the reasoning behind each step."
            }
        });
        
        const text = response.text;
        if (!text) throw new Error("Received an empty response from the AI service.");
        return text.trim().replace(/\$/g, ''); // Remove stray dollar signs

    } catch (error) {
        console.error("Gemini API Error in getAiProblemSolution:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Failed to get AI solution: ${message}`);
    }
};

/**
 * Balances a chemical equation using the Gemini API.
 * @param unbalancedEquation - The unbalanced chemical equation string (e.g., "H2 + O2 -> H2O").
 * @returns A promise that resolves to the balanced equation string.
 */
export const balanceChemicalEquation = async (unbalancedEquation: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Balance the following chemical equation: ${unbalancedEquation}. Only return the balanced equation itself, with no extra explanation.`,
            config: {
                systemInstruction: "You are a chemistry expert. Your only task is to balance chemical equations provided by the user."
            }
        });
        
        const text = response.text;
        if (!text) throw new Error("Received an empty response from the AI service.");
        return text.trim();

    } catch (error) {
        console.error("Gemini API Error in balanceChemicalEquation:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Failed to balance equation with AI: ${message}`);
    }
};

/**
 * Generates a list of formulas for a given topic using the Gemini API.
 * @param topic - The topic to generate formulas for (e.g., "Kinematics").
 * @returns A promise that resolves to an array of formula objects.
 */
export const getAiGeneratedFormulas = async (topic: string): Promise<Omit<Formula, 'id' | 'subject'>[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a list of important formulas for the topic: ${topic}.`,
            config: {
                systemInstruction: "You are a physics and math tutor. Provide a list of formulas with a brief description for each. The topic is provided by the user.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            topic: {
                                type: Type.STRING,
                                description: 'The specific sub-topic or concept the formula relates to.'
                            },
                            formula_text: {
                                type: Type.STRING,
                                description: "The formula written in a common mathematical format (e.g., 'v = u + at')."
                            },
                            description: {
                                type: Type.STRING,
                                description: 'A brief explanation of what the formula represents and what its variables mean.'
                            }
                        },
                        required: ["topic", "formula_text", "description"]
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("Received an empty response from the AI service.");
        }
        
        const generatedFormulas = JSON.parse(jsonText);
        return generatedFormulas as Omit<Formula, 'id' | 'subject'>[];

    } catch (error) {
        console.error("Gemini API Error in getAiGeneratedFormulas:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Failed to generate formulas with AI: ${message}`);
    }
};
