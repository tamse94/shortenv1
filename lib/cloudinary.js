import { v2 as cloudinary } from 'cloudinary';
import { getSetting } from './turso'; 

export async function configureCloudinary() {
  const cloud_name = await getSetting('cloud_name');
  const api_key = await getSetting('api_key');
  const api_secret = await getSetting('api_secret');

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });

  return cloudinary;
}
