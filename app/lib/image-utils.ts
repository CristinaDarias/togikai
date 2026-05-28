export function isGifUrl(src: string) {
  return /\.gif($|\?)/i.test(src);
}
