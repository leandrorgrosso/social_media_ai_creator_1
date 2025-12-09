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

// Validação de segurança da chave
if (!process.env.API_KEY) {
  console.error("ERRO CRÍTICO: API_KEY não encontrada. Verifique suas variáveis de ambiente na Vercel.");
}

// Inicializa o cliente
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Função utilitária para tentar novamente em caso de erro 429 (Rate Limit)
 * Lê o tempo de espera da mensagem de erro se disponível.
 */
async function withRetry<T>(operation: () => Promise<T>, retries = 3, defaultDelay = 2000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    const isRateLimit = 
      error.status === 429 || 
      error.code === 429 ||
      (error.message && error.message.includes("429")) ||
      (error.message && error.message.includes("RESOURCE_EXHAUSTED"));

    if (isRateLimit && retries > 0) {
      let waitTime = defaultDelay;

      // Tenta extrair o tempo exato sugerido pela API (ex: "Please retry in 18.63s")
      // Procura por padrões como "retry in 18.6s" ou "retry after 18s"
      const match = error.message?.match(/retry in (\d+(\.\d+)?)s/i);
      if (match) {
        // Se encontrou, usa o tempo da API + 1 segundo de segurança
        waitTime = Math.ceil(parseFloat(match[1]) * 1000) + 1000;
        console.warn(`⚠️ API pediu espera de ${match[1]}s. Aguardando ${waitTime/1000}s para tentar novamente...`);
      } else {
        console.warn(`⚠️ Cota excedida (429). Aguardando ${waitTime/1000}s... (${retries} tentativas restantes)`);
      }
      
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      
      // Na próxima tentativa, se não houver instrução específica, duplicamos o delay padrão (backoff exponencial)
      return withRetry(operation, retries - 1, defaultDelay * 2);
    }
    
    throw error;
  }
}

export const generatePostContent = async (
  input: SocialPostInput
): Promise<GeneratedPostContent> => {
  const userInputJSON = JSON.stringify(input);

  return withRetry(async () => {
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
  });
};

async function callImageModel(
  ai: GoogleGenAI,
  model: string,
  prompt: string,
  config: any
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [{ text: prompt }],
    },
    config,
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
  const isHighRes = size === ImageSize.SIZE_2K || size === ImageSize.SIZE_4K;

  let model = isHighRes ? "gemini-3-pro-image-preview" : "gemini-2.5-flash-image";

  let config: any = {
    imageConfig: {
      aspectRatio,
    },
  };

  if (isHighRes) {
    config.imageConfig.imageSize = size;
  }

  // Envolvemos toda a lógica de chamada e fallback no withRetry
  return withRetry(async () => {
    try {
      return await callImageModel(ai, model, prompt, config);
    } catch (error: any) {
      
      // Verificação específica para fallback de modelo PRO para FLASH
      const isPermissionError = error.message?.includes("403") || error.status === 403 || error.status === "PERMISSION_DENIED";
      // Também fazemos fallback se for erro 429 no modelo Pro, pois o Flash pode ter cota diferente
      const isRateLimitError = error.message?.includes("429") || error.status === 429;
      
      if (isHighRes && (isPermissionError || isRateLimitError)) {
        console.log(`Tentando fallback para gemini-2.5-flash-image devido a erro (${error.status || 'desc'}) no modelo Pro...`);
        model = "gemini-2.5-flash-image";
        config = {
          imageConfig: {
            aspectRatio,
          },
        };

        try {
          return await callImageModel(ai, model, prompt, config);
        } catch (fallbackError: any) {
          console.error("Erro no fallback:", fallbackError);
          // Se o fallback falhar, lançamos o erro original para o withRetry tentar tudo de novo se necessário
          throw error; 
        }
      }

      throw error;
    }
  }, 3, 2000); // 3 tentativas, começando com 2s (mas será ajustado se a API pedir mais tempo)
};