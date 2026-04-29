
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_ITEMS, MOCK_ALERTS, MOCK_LOCATIONS, MOCK_WAREHOUSES, MOCK_MOVEMENTS, MOCK_CATEGORIES } from './constants';

export const askInventoryAssistant = async (question: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const context = `You are NexusAI, an advanced Warehouse Intelligence System. MISSION: Provide concise reports based on current grid state.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: { systemInstruction: context, temperature: 0.2 }
    });
    return response.text || "No intelligence generated.";
  } catch (error) {
    return "Intelligence failure. Please retry.";
  }
};

export const enhanceStory = async (rawText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a corporate communications officer for a logistics company. 
      Analyze this user input: "${rawText}". 
      TASK: Rewrite into a professional industrial story headline and detailed narrative for a warehouse management grid.
      
      OUTPUT RULES:
      1. title: max 40 chars, very punchy.
      2. content: expanded professional narrative.
      3. suggested_tags: 3-4 relevant industrial tags.
      
      RETURN ONLY RAW JSON.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            suggested_tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "content", "suggested_tags"]
        }
      }
    });
    
    const text = response.text?.trim() || "{}";
    // Attempt to extract JSON if model wraps it in markdown blocks
    const jsonStr = text.startsWith('```') ? text.split('\n').slice(1, -1).join('\n') : text;
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Enhance Story Error:", err);
    return {
      title: "Log Entry Sync",
      content: rawText,
      suggested_tags: ["Logistics", "Grid"]
    };
  }
};

export const generateCreativeStoryStyle = async (rawText: string, itemName?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this content: "${rawText}" and linked item: "${itemName || 'none'}". Create an ultimate high-impact creative package for a warehouse story. 
      Return exactly a JSON object.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Punchy short headline" },
            content_text: { type: Type.STRING, description: "Refined description" },
            background_color: { type: Type.STRING, description: "HEX color" },
            text_color: { type: Type.STRING, description: "HEX color contrast to background" },
            font_family: { type: Type.STRING, description: "One of: Montserrat, Orbitron, Rajdhani, Syncopate, majormono, michroma, pressstart" },
            animation_effect: { type: Type.STRING, description: "One of: fade, slide, glow, zoom, glitch, hologram, neon, subtitle" }
          },
          required: ["title", "content_text", "background_color", "text_color", "font_family", "animation_effect"]
        }
      }
    });
    const text = response.text?.trim() || "{}";
    const jsonStr = text.startsWith('```') ? text.split('\n').slice(1, -1).join('\n') : text;
    return JSON.parse(jsonStr);
  } catch {
    return {};
  }
};

export const generateStoryArt = async (content: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `A futuristic high-tech industrial vertical 9:16 cinematic digital art representing: "${content.slice(0, 150)}". Professional lighting, clean lines.` }] },
      config: { imageConfig: { aspectRatio: "9:16", imageSize: "1K" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch { return null; }
};

export const suggestBinAllocation = async (itemType: string, warehouseCode: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest storage zone for ${itemType} in warehouse ${warehouseCode}.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedZoneCode: { type: Type.STRING },
            reason: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch { return {}; }
};

export const autoIdentifyItem = async (base64Image: string, includeCharacteristics: boolean = true) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: `Identify this warehouse item. Return JSON.` }
        ]
      },
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category_id: { type: Type.NUMBER },
            suggested_price: { type: Type.NUMBER },
            condition: { type: Type.STRING },
            description: { type: Type.STRING },
            suggested_sku: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch { return {}; }
};

export const analyzeMovementRisk = async (itemName: string, fromZone: string, toZone: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Risk of moving ${itemName} from ${fromZone} to ${toZone}.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING },
            reason: { type: Type.STRING },
            suggestion: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch { return {}; }
};

export const suggestSmartReply = async (messageText: string, context: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 3 replies to: "${messageText}" in context of "${context}".`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch { return ["Understood.", "Send details.", "Checking grid."]; }
};

export const generateReportInsight = async (reportType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Strategic insight for ${reportType}.`,
    });
    return response.text || "Insight unavailable.";
  } catch { return "Insight failure."; }
};

export const generateAiSku = async (title: string, category: string, characteristics: any[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a structured industrial SKU for an item with Title: "${title}", Category: "${category}", and Characteristics: ${JSON.stringify(characteristics)}. Return only the SKU string.`,
    });
    return response.text?.trim() || `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`;
  } catch {
    return `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`;
  }
};

export const suggestCategoryOptimization = async (categories: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following warehouse category tree for potential optimizations, overlaps, or fragmentation: ${JSON.stringify(categories)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            optimization_score: { type: Type.NUMBER }
          },
          required: ["suggestions", "optimization_score"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch {
    return { suggestions: ["Audit requested taxonomy nodes for redundancy", "Consolidate low-count leaf categories"], optimization_score: 82 };
  }
};

export const generateCategoryVisual = async (categoryName: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `A clean, high-fidelity industrial 3D icon representing: "${categoryName}". Studio lighting, professional blue/slate aesthetic, solid dark background.` }] },
      config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch { return null; }
};

export const summarizeChat = async (messages: any[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const chatLog = messages.map(m => `${m.sender_name}: ${m.text}`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a professional, concise summary of the following industrial communication thread:\n\n${chatLog}`,
    });
    return response.text || "Summary analysis incomplete.";
  } catch { return "Intelligence synchronization failed for summary generation."; }
};

export const analyzeStoryPerformance = async (storyId: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a quick performance analysis summary for network story log ID: ${storyId}.`,
    });
    return response.text || "Performance metrics sync pending.";
  } catch { return "Engagement data unavailable."; }
};

export const generateProductStory = async (itemName: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional industrial narrative text (story) for the following asset to be shared on the Nexus grid: ${itemName}. Keep it concise and technical.`,
    });
    return response.text || "Narrative synthesis failed.";
  } catch { return "Error generating product narrative."; }
};
