
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://wcvpthzbairrmnktrhaj.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjdnB0aHpiYWlycm1ua3RyaGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxOTMyMzUsImV4cCI6MjA1Nzc2OTIzNX0.TXcajT4ahbssQ2EMbpyG87nQ6HtLqkXuMxDTAKcLSZw";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const getImageUrl = (bucketName: string, path: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
};
