
import { GoogleGenAI, Type } from "@google/genai";
import type { Formula, Quiz } from '../types';

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

/**
 * Generates a 10-question quiz based on past IIT-JEE papers.
 * @returns A promise that resolves to a Quiz object.
 */
export const getDailyQuizQuestions = async (): Promise<Quiz> => {
    const prompt = `
        You are an expert IIT-JEE coach for a highly dedicated and serious student named Ritika. She has found previous questions too easy and requires a significant increase in difficulty.

        **YOUR PRIMARY GOAL:**
        Create an EXTREMELY CHALLENGING 10-question quiz. The difficulty level must be equivalent to the **top percentile questions of the JEE Advanced papers from the last 10 years**.

        **ABSOLUTE RULES FOR QUESTION GENERATION:**
        1.  **Source Material:** Every question MUST be from **past JEE Advanced or JEE Mains papers (last 10 years)**. Prioritize JEE Advanced questions. Do NOT create "similar" or "inspired by" questions. Use the real ones.
        2.  **NO EASY QUESTIONS:** Under no circumstances should you include basic, formula-based, or board-exam level questions. Assume Ritika has mastered the fundamentals. The questions should test deep conceptual understanding, multi-concept application, and tricky problem-solving skills.
        3.  **Subject Distribution:** Ensure a mix of Physics, Chemistry, and Mathematics questions. For example, 3 Physics, 4 Chemistry, 3 Maths.
        4.  **High-Level Topics:**
            *   **Physics:** Focus on topics like Rotational Mechanics, Electromagnetism, Modern Physics, and Thermodynamics.
            *   **Chemistry:** Include complex Organic Chemistry reaction mechanisms, Physical Chemistry problems (like Chemical Kinetics, Electrochemistry), and Inorganic Chemistry concepts.
            *   **Mathematics:** Prioritize Calculus (Definite Integrals, Differential Equations), Coordinate Geometry, and Algebra (Complex Numbers, Permutations).

        **CRITICAL INSTRUCTIONS FOR EXPLANATIONS:**
        *   **Tone:** Write the explanation as if you are a very patient and kind teacher explaining a complex topic to a 10-year-old. Be extremely simple, use analogies, and avoid jargon where possible. The goal is SUPER simple language for a SUPER hard problem.
        *   **Structure:**
            *   Start with the absolute core concept in one sentence. (e.g., "Okay, this problem looks scary, but at its heart, it's all about how energy is conserved!")
            *   Provide a step-by-step breakdown. Label each step clearly (Step 1, Step 2, etc.).
            *   Explain the 'WHY' for each step. Why did we use this formula? Why this approach?
            *   End with an encouraging summary. ("See? You can solve these tough problems! The key was just to identify the main principle first.")

        **JSON FORMAT:**
        Follow the required JSON schema precisely. Do not add any extra text or markdown outside of the JSON structure.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "A creative title for today's quiz, e.g., 'JEE Advanced Sprint #5'" },
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    subject: { type: Type.STRING, description: "Physics, Chemistry, or Mathematics" },
                                    topic: { type: Type.STRING, description: "The specific topic, e.g., 'Rotational Motion'" },
                                    questionText: { type: Type.STRING, description: "The full text of the question." },
                                    options: {
                                        type: Type.OBJECT,
                                        properties: {
                                            A: { type: Type.STRING },
                                            B: { type: Type.STRING },
                                            C: { type: Type.STRING },
                                            D: { type: Type.STRING },
                                        },
                                        required: ["A", "B", "C", "D"]
                                    },
                                    correctOption: { type: Type.STRING, description: "The key of the correct option (A, B, C, or D)" },
                                    detailedExplanation: { type: Type.STRING, description: "A simple, step-by-step explanation of the solution, written for a student in a friendly and encouraging tone." }
                                },
                                required: ["subject", "topic", "questionText", "options", "correctOption", "detailedExplanation"]
                            }
                        }
                    },
                    required: ["title", "questions"]
                }
            }
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("Received an empty response from the AI service for the quiz.");
        }

        const quizData = JSON.parse(jsonText);
        // Basic validation
        if (!quizData.title || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
            throw new Error("AI returned invalid quiz data structure.");
        }
        
        return quizData as Quiz;

    } catch (error) {
        console.error("Gemini API Error in getDailyQuizQuestions:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Failed to generate daily quiz: ${message}`);
    }
};
