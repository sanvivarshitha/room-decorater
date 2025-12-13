
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert AI Room Decoration Stylist with spatial awareness capabilities.
Your job is to analyze an uploaded room image and generate decoration templates based on a SPECIFIC EVENT and BUDGET provided by the user.

You should use general knowledge and realistic Indian market pricing (Amazon/Flipkart style).

Follow these instructions strictly:

1. Context
The user has provided a room image, a specific Event Type (e.g., Birthday, Memorial, Diwali), and a Budget constraint.
ALL suggestions MUST be appropriate for this specific event and fit within the approximate budget.

2. Language & Localization (CRITICAL)
- The user has selected a specific language. 
- You MUST output ALL descriptive text (names, descriptions, reasons, tips, instructions) in that target language.
- However, keep the JSON Property Keys (e.g., 'roomAnalysis', 'layout', 'themes') in ENGLISH. Only the values should be translated.
- If the language is an Indian language (Hindi, Tamil, etc.), prices should still be in INR.
- If the language is international, prices should still be in INR (as the app is configured for India), but you can mention the context.

3. Room Understanding
Describe the room layout, lighting, colors, size, open spaces, and furniture.
Identify areas suitable for decoration (walls, corners, ceilings, entrance, etc.).

4. AI Spatial Measurement (NEW)
Estimate the room's physical dimensions based on visual reference points in the image.
- Use standard objects as reference (e.g., Standard Door Height ~7ft, Sofa Length ~6-7ft, Queen Bed ~5ft wide).
- Estimate 'estimatedWidth', 'estimatedHeight', and 'wallSpaceAvailable'.
- Provide a 'notes' field explaining what object you used as a reference.
- Provide 2-3 'decorFitAdvice' tips based on these measurements.

5. AI Lighting Simulation Strategy (NEW)
Analyze existing light sources and shadows in the image. Provide 3-4 specific 'lightingSuggestions' to enhance depth and ambience.

6. AI Photo Zone Scout (NEW)
Identify 1-2 prime spots in the room that would serve as the best "Photo Zones".
For each zone, determine:
- 'location': Where exactly in the room.
- 'lighting': Why the lighting here is ideal.
- 'standingSpot': Where the subject should stand vs where the photographer should stand.
- 'reason': Why this composition works.

7. Safety Recommendations (CRITICAL)
Analyze the room for potential hazards and provide 3-5 specific safety tips.

8. AI Crowd Capacity Planner (NEW)
Analyze the room's floor area to estimate crowd capacity for a comfortable event.
- 'totalCapacity': Estimated range of total people.
- 'standingCapacity': Max people if standing/cocktail style.
- 'seatingCapacity': Max people if seated.
- 'movementAdvice': Specific advice on where to place decor to ensure flow.
- 'zoneAdvice': Advice to prevent overcrowding key areas.

9. Clutter Removal Recommendation (Conditional)
Analyze the room for visual clutter.
- Set 'hasClutter' to true ONLY if items visible would negatively impact the aesthetic.
- If true, provide 'recommendations'.

10. Generate 5-7 Decoration Themes
Create distinct themes specifically for the requested Event Type.

11. Event Color Palette Generator (NEW)
For EACH theme, generate a highly specific Color Palette.
- Provide 3-5 colors with specific descriptive names and valid HEX CODES.
- Describe the specific 'mood' created by this palette.
- Explain 'whySuitsRoom': Analyze the room's existing wall color/furniture and explain why this palette complements it.

12. Low Budget DIY Logic (IMPORTANT)
IF the user's budget is very low (below ₹1000 INR), you MUST provide a 'diyOptions' array for each theme.

13. Decoration Template for Each Theme
Include backdrop, balloon details, lighting, special elements, and specific placement instructions.

14. AI Table Setup Designer (NEW)
If a table is visible or needed, generate a 'tableSetupPlan'.

15. Installation & Stability Guide (NEW)
For EACH theme, provide 3-4 practical "Pro Tips" on how to install the decor securely.

16. Time Estimates (NEW)
For EACH theme, estimate the time required.

17. Decor Placement Blueprint (Text-style)
Create a simple, spatial ASCII-style text diagram of the room layout.

18. Decoration Durability Prediction (NEW)
For EACH theme, estimate the durability/lifespan of the main decor elements.

19. AI Sound Ambience Recommender (NEW)
For EACH theme, suggest 2-3 music playlists or genres.

20. Cleaning & Removal Plan (NEW)
For EACH theme, provide a practical post-event cleanup guide.

21. Decoration Item List
For each item, give a realistic product name, source, approximate price in INR, quantity, and reason.

22. Choose the Best Theme
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
  budget: string,
  language: string = 'English'
): Promise<AnalysisResult> => {
  const ai = getAIClient();

  const prompt = `
  Analyze this room image for a "${eventType}" event.
  The user has a budget target of: ${budget}.
  
  CRITICAL: The user's preferred language is: "${language}". 
  All descriptions, names, tips, and reasoning must be translated into ${language}.
  Keep the JSON Keys in English.
  
  Provide a comprehensive decoration plan in JSON format.
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
                safetyTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                clutterCheck: {
                  type: Type.OBJECT,
                  description: "Recommendations to remove clutter, only if clutter exists.",
                  properties: {
                    hasClutter: { type: Type.BOOLEAN },
                    recommendations: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  }
                },
                estimatedDimensions: {
                  type: Type.OBJECT,
                  properties: {
                    estimatedWidth: { type: Type.STRING },
                    estimatedHeight: { type: Type.STRING },
                    wallSpaceAvailable: { type: Type.STRING },
                    notes: { type: Type.STRING },
                  }
                },
                decorFitAdvice: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                lightingSuggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Tips for enhancing room lighting based on shadows (e.g., LED strips, backlighting)",
                },
                photoZones: {
                  type: Type.ARRAY,
                  description: "List of best photo spots in the room",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      location: { type: Type.STRING },
                      lighting: { type: Type.STRING },
                      standingSpot: { type: Type.STRING },
                      reason: { type: Type.STRING },
                    }
                  }
                },
                crowdCapacity: {
                  type: Type.OBJECT,
                  properties: {
                    totalCapacity: { type: Type.STRING },
                    standingCapacity: { type: Type.STRING },
                    seatingCapacity: { type: Type.STRING },
                    movementAdvice: { type: Type.STRING },
                    zoneAdvice: { type: Type.STRING },
                  }
                }
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
                  paletteDetails: {
                    type: Type.OBJECT,
                    properties: {
                      colors: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            hex: { type: Type.STRING },
                          }
                        }
                      },
                      mood: { type: Type.STRING },
                      whySuitsRoom: { type: Type.STRING },
                    }
                  },
                  visualDescription: { type: Type.STRING },
                  placementInstructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  blueprint: {
                     type: Type.STRING,
                     description: "ASCII-style text diagram of room layout with decor",
                  },
                  backdropDesign: { type: Type.STRING },
                  balloonArrangement: { type: Type.STRING },
                  lightingSetup: { type: Type.STRING },
                  tableStyling: { type: Type.STRING },
                  tableSetupPlan: {
                     type: Type.OBJECT,
                     description: "Detailed plan for table/cake setup",
                     properties: {
                        suitableTableFound: { type: Type.BOOLEAN },
                        placement: { type: Type.STRING },
                        cakePlacement: { type: Type.STRING },
                        centerpieceIdeas: { type: Type.STRING },
                        propsArrangement: { type: Type.STRING },
                        foodLayout: { type: Type.STRING },
                     }
                  },
                  specialElements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  diyOptions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of DIY instructions if budget is low",
                  },
                  stabilityTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Pro tips for secure installation (tape, tying, etc.)",
                  },
                  timeEstimates: {
                    type: Type.OBJECT,
                    properties: {
                      breakdown: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            task: { type: Type.STRING },
                            durationMinutes: { type: Type.NUMBER },
                          }
                        }
                      },
                      totalTimeMinutes: { type: Type.NUMBER },
                      difficultyLevel: { type: Type.STRING, enum: ['Easy', 'Moderate', 'Hard'] },
                    }
                  },
                  durabilityEstimates: {
                    type: Type.ARRAY,
                    description: "Estimates for how long decorations will last",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        item: { type: Type.STRING },
                        lifespan: { type: Type.STRING },
                        note: { type: Type.STRING },
                      }
                    }
                  },
                  musicPlaylists: {
                    type: Type.ARRAY,
                    description: "Music/Sound recommendations for the theme",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        genre: { type: Type.STRING },
                        mood: { type: Type.STRING },
                        reason: { type: Type.STRING },
                      }
                    }
                  },
                  cleaningPlan: {
                    type: Type.OBJECT,
                    description: "Post-party cleanup and removal instructions",
                    properties: {
                      tapeRemoval: { type: Type.STRING },
                      reusableItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                      disposalInstructions: { type: Type.STRING },
                      wallCare: { type: Type.STRING },
                    }
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
