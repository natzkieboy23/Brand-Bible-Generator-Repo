import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { BrandIdentity } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

// Initialize the Google Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the JSON schema for the brand identity to ensure structured output from the model
const brandIdentitySchema = {
    type: Type.OBJECT,
    properties: {
        companyName: { type: Type.STRING },
        slogan: { type: Type.STRING },
        logoPrompt: {
            type: Type.STRING,
            description: "A detailed DALL-E 3, Midjourney, or Imagen prompt for a primary company logo. Should be a vector-style, modern, minimalist logo. Describe the visual elements, colors, and overall style."
        },
        colorPalette: {
            type: Type.ARRAY,
            description: "An array of 4-6 colors.",
            items: {
                type: Type.OBJECT,
                properties: {
                    hex: { type: Type.STRING, description: "The hex code for the color, e.g., '#RRGGBB'." },
                    name: { type: Type.STRING, description: "A creative name for the color." },
                    usage: { type: Type.STRING, description: "How this color should be used (e.g., 'Primary CTA', 'Background', 'Accent')." }
                },
                required: ["hex", "name", "usage"]
            }
        },
        fontPairings: {
            type: Type.OBJECT,
            properties: {
                header: { type: Type.STRING, description: "The name of a Google Font for headers." },
                body: { type: Type.STRING, description: "The name of a Google Font for body text that pairs well with the header font." },
                notes: { type: Type.STRING, description: "A brief explanation of why these fonts were chosen and how they reflect the brand." }
            },
            required: ["header", "body", "notes"]
        },
    },
    required: ["companyName", "slogan", "logoPrompt", "colorPalette", "fontPairings"]
};


export async function generateBrandIdentity(companyName: string, companyDescription: string): Promise<BrandIdentity> {
    const prompt = `
        You are an expert branding consultant. Create a complete brand identity for a company.
        Company Name: ${companyName}
        Company Description: ${companyDescription}

        Based on this, generate a comprehensive brand identity. I need a company slogan, a detailed prompt for a primary logo, a color palette, and font pairings.
        - The slogan should be catchy and memorable.
        - The logo prompt should be detailed enough for an image generation AI like Imagen. Focus on a modern, minimalist, vector style.
        - The color palette should consist of 4-6 colors, each with a hex code, a creative name, and its intended usage.
        - The font pairings should suggest a header and a body font from Google Fonts, with a brief note on why they work for the brand.

        Return the entire identity as a single JSON object.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // Using a powerful model for complex JSON generation
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: brandIdentitySchema,
        },
    });
    
    const jsonText = response.text.trim();
    try {
        const parsed = JSON.parse(jsonText);
        // Basic validation to ensure the response is usable
        if (!parsed.companyName || !parsed.colorPalette) {
            throw new Error("Invalid JSON structure received from API.");
        }
        return parsed as BrandIdentity;
    } catch (e) {
        console.error("Failed to parse brand identity JSON:", jsonText, e);
        throw new Error("Failed to generate a valid brand identity. The model's response was not valid JSON.");
    }
}

export async function generateLogo(prompt: string): Promise<string> {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001', // High-quality image generation model
        prompt: `${prompt}, white background, high resolution, vector art`,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    } else {
        throw new Error("Logo generation failed, no images were returned.");
    }
}

export function createChatSession(): Chat {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash', // A fast model suitable for chat applications
        config: {
            systemInstruction: 'You are a friendly and helpful branding assistant. You are chatting with a user who is creating a brand identity for their company. Answer their questions about branding, design, and marketing concisely.',
        },
    });
    return chat;
}
