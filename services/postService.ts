import { supabase } from '../lib/supabase';
import { GeneratedPostContent, SavedPost } from '../types';

export const postService = {
  // CREATE
  async savePost(topic: string, content: GeneratedPostContent): Promise<SavedPost> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('saved_posts')
      .insert({
        user_id: user.id,
        topic: topic,
        content: content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // READ
  async getPosts(): Promise<SavedPost[]> {
    const { data, error } = await supabase
      .from('saved_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // UPDATE (Neste contexto, vamos permitir atualizar o conteúdo de um post existente)
  async updatePost(id: string, content: GeneratedPostContent): Promise<SavedPost> {
     const { data, error } = await supabase
      .from('saved_posts')
      .update({ content: content })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // DELETE
  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('saved_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};