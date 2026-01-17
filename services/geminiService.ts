
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client using the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a catchy description for a property using Gemini 3 Flash.
 */
export const generatePropertyDescription = async (name: string, facilities: string[], city: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a catchy and professional description for a boarding house (kost) named "${name}" located in ${city}. Facilities include: ${facilities.join(', ')}. Keep it under 100 words in Indonesian.`,
      config: {
        temperature: 0.7,
      }
    });
    // Use the .text property to extract the generated response.
    return response.text || "Gagal membuat deskripsi otomatis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi AI.";
  }
};

/**
 * Searches for nearby places using Google Maps grounding.
 * Maps grounding is only supported in Gemini 2.5 series models.
 */
export const searchNearbyPlaces = async (lat: number, lng: number, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Cari ${category} terdekat dari lokasi koordinat ${lat}, ${lng}. Berikan rekomendasi singkat dalam bahasa Indonesia.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    // Extract grounding metadata to provide clickable map links.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const text = response.text || "Tidak ada informasi ditemukan.";

    return { text, chunks: groundingChunks };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "Maaf, gagal mencari lokasi sekitar.", chunks: [] };
  }
};
