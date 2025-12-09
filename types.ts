export interface SocialPostInput {
  tema: string;
  nicho: string;
  publico: string;
  objetivo: string;
  tom: string;
}

export interface PostVariations {
  short_version: string;
  funny_version: string;
}

export interface GeneratedPostContent {
  title: string;
  title_variations: string[];
  caption: string;
  hashtags: string[];
  visual_prompt: string;
  variations: PostVariations;
  // Configurações de imagem salvas junto com o post
  imageOptions?: {
    aspectRatio: AspectRatio;
    size: ImageSize;
  };
}

export interface SavedPost {
  id: string;
  user_id: string;
  topic: string;
  content: GeneratedPostContent;
  created_at: string;
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT_3_4 = '3:4',
  PORTRAIT_9_16 = '9:16',
  LANDSCAPE_4_3 = '4:3',
  LANDSCAPE_16_9 = '16:9',
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K',
}