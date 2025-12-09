import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SocialPostInput, GeneratedPostContent, AspectRatio, ImageSize } from "../types";

const SYSTEM_INSTRUCTION = `
Você é um Criador Profissional de Conteúdo para Redes Sociais, especialista em Instagram e TikTok.
Sua tarefa é gerar um post completo com legenda, título, hashtags e uma ideia de imagem a partir de um tema fornecido pelo usuário.

O conteúdo deve ser objetivo, natural, com foco em engajamento.
A saída deve SEMPRE seguir o JSON de resposta definido pelo schema.

REGRAS IMPORTANTES:
Sempre responda em JSON válido, SEM texto antes ou depois.
Nunca quebre o formato do schema.
Nunca explique a resposta.
Nunca repita a entrada do usuário.
Nunca use markdown.
As hashtags devem ser específicas e relevantes para o nicho.
A legenda deve ter um gancho inicial, desenvolvimento e um CTA leve.
O campo visual_prompt deve descrever uma imagem clara, específica e útil para modelos de geração visual.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    caption: { type: Type.STRING },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    visual_prompt: { type: Type.STRING },
    variations: {
      type: Type.OBJECT,
      properties: {
        short_version: { type: Type.STRING },
        funny_version: { type: Type.STRING },
      },
      required: ["short_version", "funny_version"],
    },
  },
  required: ["title", "caption", "hashtags", "visual_prompt", "variations"],
};

export const generatePostContent = async (input: SocialPostInput): Promise<GeneratedPostContent> => {
  // Inicializa o cliente dentro da função para garantir o uso da chave mais recente
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const userInputJSON = JSON.stringify(input);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userInputJSON,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Nenhum texto retornado pelo Gemini");
    return JSON.parse(text) as GeneratedPostContent;
  } catch (error) {
    console.error("Erro ao gerar conteúdo do post:", error);
    throw error;
  }
};

async function callImageModel(ai: GoogleGenAI, model: string, prompt: string, config: any): Promise<string> {
  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [{ text: prompt }],
    },
    config: config,
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Nenhum dado de imagem encontrado na resposta");
}

export const generatePostImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  size: ImageSize
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Seleciona o modelo baseado na resolução solicitada
  const isHighRes = size === ImageSize.SIZE_2K || size === ImageSize.SIZE_4K;
  
  // Tenta primeiro com o modelo solicitado ou apropriado
  let model = isHighRes ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  let config: any = {
    imageConfig: {
      aspectRatio: aspectRatio,
    },
  };

  if (isHighRes) {
    config.imageConfig.imageSize = size;
  }

  try {
    return await callImageModel(ai, model, prompt, config);
  } catch (error: any) {
    console.warn(`Erro na tentativa inicial com modelo ${model}:`, error);

    // Se falhar com erro de permissão (403) ou outro erro e estávamos tentando o modelo Pro,
    // faz fallback para o modelo Flash (padrão)
    if (isHighRes && (error.message?.includes('403') || error.status === 403 || error.status === 'PERMISSION_DENIED')) {
      console.log("Tentando fallback para gemini-2.5-flash-image...");
      model = 'gemini-2.5-flash-image';
      config = {
        imageConfig: {
          aspectRatio: aspectRatio,
          // Remove imageSize pois flash-image não suporta ou ignora, e queremos evitar erros
        },
      };
      
      try {
        return await callImageModel(ai, model, prompt, config);
      } catch (fallbackError: any) {
        console.error("Erro no fallback:", fallbackError);
         if (fallbackError.message) {
            throw new Error(`Erro ao gerar imagem (Fallback): ${fallbackError.message}`);
        }
        throw fallbackError;
      }
    }

    if (error.message) {
      throw new Error(`Erro da API: ${error.message}`);
    }
    throw error;
  }
};