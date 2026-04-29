
import { GoogleGenAI } from "@google/genai";
import { MOCK_ITEMS, MOCK_WAREHOUSES, MOCK_ALERTS, MOCK_LOCATIONS } from '../constants';

export const askInventoryAssistant = async (question: string): Promise<string> => {
  // Initialize right before call to ensure up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Create a context string based on the current "state" of the warehouse
    const context = `
      You are an expert AI Assistant for a Warehouse Management System called NexusAI.
      
      Here is the current snapshot of the database:
      
      LOCATIONS:
      ${JSON.stringify(MOCK_LOCATIONS.map(l => ({ name: l.name, city: l.city, type: l.type, code: l.location_code, active: l.is_active })))}
      
      ITEMS (Sample):
      ${JSON.stringify(MOCK_ITEMS.map(i => ({ title: i.title, qty: i.available_quantity, price: i.price, location: i.location_id, status: i.status })))}
      
      WAREHOUSES:
      ${JSON.stringify(MOCK_WAREHOUSES.map(w => ({ name: w.name, capacity: w.capacity_volume, zones: w.zones?.length })))}
      
      ACTIVE ALERTS:
      ${JSON.stringify(MOCK_ALERTS)}

      Rules:
      1. Answer questions concisely.
      2. If asked to find items, look at the JSON provided.
      3. If asked about potential issues, analyze the alerts or low stock levels.
      4. Use formatting (markdown) to make tables or lists if helpful.
      5. Assume the user is a Warehouse Manager.
    `;

    // Always use gemini-3-flash-preview for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: context,
        temperature: 0.2, // Low temperature for factual data
      }
    });

    return response.text || "I couldn't process that request.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the neural core. Please try again later.";
  }
};

export const analyzeItemImage = async (base64Image: string): Promise<{ title: string; category: string; estimated_price: string; condition_assessment: string }> => {
  // Initialize right before call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: `Analyze this image for a warehouse inventory system. 
                   Identify the item. 
                   Return a JSON object with: 
                   - title (short descriptive name)
                   - category (guess the category)
                   - estimated_price (a number representing USD)
                   - condition_assessment (new, used_good, used_fair, or damaged)` 
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);

  } catch (error) {
    console.error("Vision Analysis Error:", error);
    throw error;
  }
};
