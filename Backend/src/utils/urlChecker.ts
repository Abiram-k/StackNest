export const isImageUrl = (url: string): boolean => {
  return /\.(jpeg|jpg|gif|png|webp|bmp)$/i.test(url);
};
export const isVideoUrl = (url: string): boolean => {
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
};
