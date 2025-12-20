
import { GoogleGenAI } from "@google/genai";

// Helper to strip data url prefix
const cleanBase64 = (data: string) => {
    return data.replace(/^data:image\/[a-z]+;base64,/, '');
};

// Helper to resize image to prevent payload issues (Max 512px for safety)
const resizeImage = (base64Str: string, maxWidth = 512): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions - Keep it small for XHR stability
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
           height = (maxWidth / width) * height;
           width = maxWidth;
        } else {
           width = (maxWidth / height) * width;
           height = maxWidth;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
          // Fill white background to handle transparent PNGs converting to JPEG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG 0.7 to reduce size significantly
          resolve(canvas.toDataURL('image/jpeg', 0.7));
      } else {
          resolve(base64Str); // Fallback
      }
    };
    img.onerror = (e) => {
        console.warn("Image processing failed, using original", e);
        resolve(base64Str); 
    };
  });
};

export const generateCakeImage = async (
    prompt: string, 
    referenceImage?: string, // Previous generation or user upload
    isRefinement: boolean = false
): Promise<string | null> => {
  try {
    // Always instantiate fresh to pick up the latest API key from process.env
    // Corrected initialization to strictly use process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    // Cardcaptor Sakura / CLAMP Style Injection
    const stylePrompt = `
      Target Art Style: "Cardcaptor Sakura" (CCS) / CLAMP anime illustration style.
      Visual Traits: Detailed ink lines, soft cel-shading, watercolor texture overlays, magical sparkles (kira-kira), ornate composition.
      
      CRITICAL INSTRUCTION FOR REFERENCE IMAGE:
      If a reference image is provided, you must perform a STRICT STYLE TRANSFER.
      1. PRESERVE THE ORIGINAL CAKE'S COLOR PALETTE AND INGREDIENTS. 
         - If the input is a brown chocolate cake, the output MUST be a brown chocolate cake.
         - If the input is a matcha cake, the output MUST be green.
         - DO NOT turn a dark cake into a pink/white cake just because of the "Sakura" theme.
      2. PRESERVE THE ORIGINAL CAKE'S SHAPE AND STRUCTURE.
      3. Only change the *rendering style* (line art, shading) and add *external* decorative elements (wings, petals, ribbons) around the subject.
    `;

    const negativePrompt = "Do not include: photorealistic textures, 3D render style, text overlays, copyright watermarks, blurry details, distorted perspective. Do not change the flavor or color of the food itself.";
    
    let textPrompt = "";
    
    if (referenceImage && !isRefinement) {
        // Case: User uploaded a photo
        textPrompt = `Redraw this exact cake in Cardcaptor Sakura anime style. Strict Requirement: Keep the original cake's color (e.g. chocolate stays brown) and flavor. Do not change the cake's material. Add magical CLAMP-style decorations around it. User Note: ${prompt}. ${stylePrompt} ${negativePrompt}`;
    } else if (isRefinement) {
        // Case: Refining previous generation
        textPrompt = `Refine this anime cake illustration. Enhance the Cardcaptor Sakura style. User Request: "${prompt}". ${stylePrompt} ${negativePrompt}`;
    } else {
        // Case: Text to Image
        textPrompt = `Generate a Cardcaptor Sakura style anime cake. User Description: "${prompt}". Colors: Soft Pastels (Sakura Pink, Creamy White, Gold) unless specified otherwise. ${stylePrompt} ${negativePrompt}`;
    }

    const contents: any[] = [];
    
    // Add reference image if exists
    if (referenceImage) {
        // RESIZE IMAGE BEFORE SENDING - Critical for avoiding XHR errors
        const optimizedImage = await resizeImage(referenceImage, 512);
        contents.push({
            inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64(optimizedImage)
            }
        });
    }

    // Add text prompt
    contents.push({ text: textPrompt });

    // Use gemini-2.5-flash-image
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: { parts: contents },
      config: {
          imageConfig: {
              aspectRatio: "3:4" // Changed to portrait to fit Clow Card format better
          }
      }
    });

    // Extract image from response
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }

    console.warn("No image found in response", response);
    return null;

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    return null;
  }
};
