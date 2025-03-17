
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Add UUID dependency
// <lov-add-dependency>uuid@latest</lov-add-dependency>

export const uploadImage = async (
  file: File,
  bucket: string,
  folder: string = ''
): Promise<string> => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder ? `${folder}/` : ''}${uuidv4()}.${fileExt}`;

    // Upload the file
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get the public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteImage = async (
  url: string,
  bucket: string
): Promise<void> => {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    const bucketIndex = pathSegments.findIndex(segment => segment === bucket);
    
    if (bucketIndex === -1) throw new Error('Invalid image URL');
    
    const filePath = pathSegments.slice(bucketIndex + 1).join('/');
    
    // Delete the file
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
