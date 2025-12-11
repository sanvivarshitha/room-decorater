import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert AI Room Decoration Stylist.
Your job is to analyze an uploaded room image and generate decoration templates based on a SPECIFIC EVENT and BUDGET provided by the user.

You should use general knowledge and realistic Indian market pricing (Amazon/Flipkart style).

Follow these instructions strictly:

1. Context
The user has provided a room image, a specific Event Type (e.g., Birthday, Memorial, Diwali), and a Budget constraint.
ALL suggestions MUST be appropriate for this specific event and fit within the approximate budget.

2. Room Understanding
Describe the room layout, lighting, colors, size, open spaces, and furniture.
Identify areas suitable for decoration (walls, corners, ceilings, entrance, etc.).

3. Generate 5-7 Decoration Themes
Create distinct themes specifically for the requested Event Type.
Examples:
- If "Birthday": Elegant Birthday, Cartoon Theme, Pastel Party.
- If "Memorial/Death Anniversary": Serene White Floral, Candlelight Remembrance, Subtle & Respectful.
- If "Cultural": Specific to the culture (e.g., Traditional Marigold for Diwali).

4. Decoration Template for Each Theme
Include backdrop, balloon details (if appropriate for event), lighting, table styling, special elements, and specific placement instructions.

5. Decoration Item List
For each item, give a realistic product name, source (Amazon/Flipkart/Local), approximate price in INR, quantity, and reason.
ENSURE the total cost is close to the user's specified budget.

6. Total Budget
Calculate total cost and classify as Budget-Friendly, Moderate, or Premium.

7. Choose the Best Theme
Analyze the room again and recommend the theme that fits BEST.

Output MUST be a valid JSON object matching the provided schema.
`;

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set REACT_APP_GEMINI_API_KEY.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeRoomImage = async (
  base64Image: string,
  eventType: string,
  budget: string
): Promise<AnalysisResult> => {
  const ai = getAIClient();

  const prompt = `
  Analyze this room image for a "${eventType}" event.
  The user has a budget target of: ${budget}.
  
  Provide a comprehensive decoration plan in JSON format.
  Ensure themes are culturally appropriate for "${eventType}" and respect the budget "${budget}".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roomAnalysis: {
              type: Type.OBJECT,
              properties: {
                layout: { type: Type.STRING },
                lighting: { type: Type.STRING },
                colors: { type: Type.STRING },
                openSpaces: { type: Type.STRING },
                furniture: { type: Type.STRING },
                suitableAreas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
            },
            themes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  mood: { type: Type.STRING },
                  colorPalette: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  visualDescription: { type: Type.STRING },
                  placementInstructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  backdropDesign: { type: Type.STRING },
                  balloonArrangement: { type: Type.STRING },
                  lightingSetup: { type: Type.STRING },
                  tableStyling: { type: Type.STRING },
                  specialElements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        source: { type: Type.STRING },
                        approxPriceINR: { type: Type.NUMBER },
                        quantity: { type: Type.STRING },
                        reason: { type: Type.STRING },
                      },
                    },
                  },
                  totalCost: { type: Type.NUMBER },
                  budgetCategory: {
                    type: Type.STRING,
                    enum: ["Budget-Friendly", "Moderate", "Premium"],
                  },
                },
              },
            },
            recommendedThemeId: { type: Type.STRING },
            recommendationReason: { type: Type.STRING },
          },
        },
      },
    });

    if (!response.text) {
      throw new Error("No data returned from Gemini.");
    }

    return JSON.parse(response.text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

const generateSingleImage = async (
  ai: GoogleGenAI,
  originalBase64Image: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: originalBase64Image,
              mimeType: 'image/jpeg',
            },
          },
          { text: prompt },
        ],
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data found in response");
  } catch (err) {
    console.error("Single image generation failed", err);
    return ""; // Return empty string on failure to allow Promise.all to continue if needed, or throw
  }
};

export const generateDecoratedRoomVariations = async (
  originalBase64Image: string,
  themeName: string,
  visualDescription: string,
  eventType: string
): Promise<string[]> => {
  const ai = getAIClient();
  
  const basePrompt = `
    This is an image of a room. 
    Modify this image to show it decorated for a "${eventType}" with the theme "${themeName}".
    
    Design Context:
    ${visualDescription}
    
    Key Constraints:
    1. Keep the room layout, walls, and furniture EXACTLY as they are.
    2. Add decorations realistically into the space.
    3. High-quality interior design visualization.
  `;

  // Create 4 distinct variations for the user to choose from
  const variations = [
    { name: "Balanced", prompt: `${basePrompt}\n\nStyle: Creates a perfectly balanced, symmetrical composition with evenly distributed decorations.` },
    { name: "Atmospheric", prompt: `${basePrompt}\n\nStyle: Focus heavily on mood lighting, warmth, and ambiance. Make it look cozy and magical.` },
    { name: "Grand", prompt: `${basePrompt}\n\nStyle: Make it look lavish and full. Emphasize volume in balloons/flowers and richness in decor.` },
    { name: "Minimalist", prompt: `${basePrompt}\n\nStyle: Keep it elegant, clean, and modern. Use decorations sparingly but effectively for a chic look.` },
  ];

  try {
    // Generate all variations in parallel
    const promises = variations.map(v => generateSingleImage(ai, originalBase64Image, v.prompt));
    const results = await Promise.all(promises);
    
    // Filter out any failed generations (empty strings)
    return results.filter(url => url.length > 0);
  } catch (error) {
    console.error("Variations Generation Error:", error);
    throw error;
  }
};