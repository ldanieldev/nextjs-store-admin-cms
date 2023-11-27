import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const getPublicIdFromUrl = (url: string) => {
  const regex = /\/upload\/v\d{8,12}\/(.+)$/;
  const matches = regex.exec(url);

  return matches ? matches[1].split('.')[0] : null;
};

export function deleteCloudImage(imgUrl: string) {
  const publicId = getPublicIdFromUrl(imgUrl);

  try {
    if (!publicId) throw new Error('Public Id is required.');

    cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('[CLOUDINARY_IMAGE_DELETE]', error);
  }
}
