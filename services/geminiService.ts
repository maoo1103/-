import { GoogleGenAI } from "@google/genai";

const cleanBase64 = (data: string) => {
    return data.replace(/^data:image\/[a-z]+;base64,/, '');
};

const resizeImage = (base64Str: string, maxWidth = 512): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
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
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
      } else {
          resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

export const generateCakeImage = async (
    prompt: string, 
    referenceImage?: string,
    isRefinement: boolean = false
): Promise<string | null> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (process.env.API_KEY as string) || "";
    
    if (!apiKey) {
      console.error("API Key is missing");
      return null;
    }

    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const stylePrompt = `Target Art Style: "Cardcaptor Sakura" (CCS) / CLAMP anime illustration style. Visual Traits: Detailed ink lines, soft cel-shading, watercolor textures, magical sparkles.`;
    const negativePrompt = "Do not include: photorealistic textures, 3D render style, text overlays.";
    
    let textPrompt = isRefinement ? `Refine this cake: ${prompt}` : `Generate a Cardcaptor Sakura style cake: ${prompt}`;
    textPrompt += ` ${stylePrompt} ${negativePrompt}`;

    const parts: any[] = [];
    if (referenceImage) {
        const optimizedImage = await resizeImage(referenceImage, 512);
        parts.push({
            inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64(optimizedImage)
            }
        });
    }

    parts.push({ text: textPrompt });

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });

    const response = await result.response;
    const outputParts = response.candidates?.[0]?.content?.parts;
    
    if (outputParts) {
        for (const part of outputParts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }

    return null;

  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
