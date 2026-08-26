import { useState, useEffect } from 'react';
import heic2any from 'heic2any';

// In-memory cache for converted HEIC blob URLs to avoid re-converting the same image
const heicBlobCache = new Map<string, string>();

/**
 * Checks if a URL or filename indicates a HEIC/HEIF image
 */
export function isHeicUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  return /\.(heic|heif)(\?.*)?$/i.test(url) || url.includes('/heic') || url.includes('/heif');
}

/**
 * Converts a HEIC URL to a browser-renderable JPEG Blob URL
 */
export async function convertHeicUrlToRenderable(url: string): Promise<string> {
  if (!url) return url;
  
  if (heicBlobCache.has(url)) {
    return heicBlobCache.get(url)!;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) return url;
    
    const blob = await response.blob();
    const converted = await heic2any({
      blob,
      toType: 'image/jpeg',
      quality: 0.94
    });

    const finalBlob = Array.isArray(converted) ? converted[0] : converted;
    const objectUrl = URL.createObjectURL(finalBlob);
    heicBlobCache.set(url, objectUrl);
    return objectUrl;
  } catch (err) {
    console.warn('[HEIC ON-THE-FLY CONVERSION FAILED]', err, 'for URL:', url);
    return url;
  }
}

/**
 * React hook to get a guaranteed browser-renderable image URL
 * (handles HEIC on-the-fly conversion seamlessly for any legacy/direct HEIC files)
 */
export function useRenderableImage(src: string | undefined | null): { displayUrl: string; isLoading: boolean } {
  const [displayUrl, setDisplayUrl] = useState<string>(src || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setDisplayUrl('');
      return;
    }

    if (heicBlobCache.has(src)) {
      setDisplayUrl(heicBlobCache.get(src)!);
      return;
    }

    if (isHeicUrl(src)) {
      setIsLoading(true);
      convertHeicUrlToRenderable(src).then((converted) => {
        setDisplayUrl(converted);
        setIsLoading(false);
      }).catch(() => {
        setDisplayUrl(src);
        setIsLoading(false);
      });
    } else {
      setDisplayUrl(src);
    }
  }, [src]);

  return { displayUrl, isLoading };
}
