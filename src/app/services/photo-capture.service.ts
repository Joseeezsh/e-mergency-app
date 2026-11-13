import { Injectable } from '@angular/core';
import { Camera, CameraErrorCode, EncodingType, MediaTypeSelection } from '@capacitor/camera';
import type { MediaResult } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

/**
 * Captures or selects an emergency scene photo and compresses it to a compact JPEG data URL.
 */
@Injectable({ providedIn: 'root' })
export class PhotoCaptureService {
  async takePhoto(): Promise<string | null> {
    try {
      if (Capacitor.isNativePlatform()) {
        const perm = await Camera.checkPermissions();
        if (perm.camera !== 'granted') {
          const requested = await Camera.requestPermissions({ permissions: ['camera'] });
          if (requested.camera === 'denied') {
            throw new Error('Camera permission denied. Enable Camera access in Android settings.');
          }
        }
      }

      const result = await Camera.takePhoto({
        quality: 70,
        targetWidth: 960,
        targetHeight: 960,
        correctOrientation: true,
        encodingType: EncodingType.JPEG,
        saveToGallery: false,
        webUseInput: true,
      });

      return await this.mediaResultToDataUrl(result);
    } catch (err) {
      if (this.isCancelledError(err)) {
        return null;
      }
      throw err instanceof Error ? err : new Error('Unable to capture photo.', { cause: err });
    }
  }

  async chooseFromGallery(): Promise<string | null> {
    try {
      const response = await Camera.chooseFromGallery({
        mediaType: MediaTypeSelection.Photo,
        allowMultipleSelection: false,
        quality: 70,
        targetWidth: 960,
        targetHeight: 960,
        correctOrientation: true,
        webUseInput: true,
      });

      const first = response.results[0];
      if (!first) {
        return null;
      }
      return await this.mediaResultToDataUrl(first);
    } catch (err) {
      if (this.isCancelledError(err)) {
        return null;
      }
      throw err instanceof Error ? err : new Error('Unable to select photo.', { cause: err });
    }
  }

  private async mediaResultToDataUrl(result: MediaResult): Promise<string | null> {
    if (result.webPath) {
      const response = await fetch(result.webPath);
      const blob = await response.blob();
      return await this.compressBlobToJpegDataUrl(blob);
    }
    if (result.thumbnail) {
      return result.thumbnail.startsWith('data:')
        ? result.thumbnail
        : `data:image/jpeg;base64,${result.thumbnail}`;
    }
    return null;
  }

  private async compressBlobToJpegDataUrl(blob: Blob): Promise<string> {
    const objectUrl = URL.createObjectURL(blob);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('Failed to decode selected image.'));
        el.src = objectUrl;
      });

      const maxDimension = 800;
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height, 1));
      const targetWidth = Math.max(1, Math.round(img.width * scale));
      const targetHeight = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Unable to process image canvas.');
      }
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      return canvas.toDataURL('image/jpeg', 0.72);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  private isCancelledError(err: unknown): boolean {
    const code =
      typeof err === 'object' && err !== null && 'code' in err ? String(err.code) : '';
    const message = err instanceof Error ? err.message : String(err ?? '');
    return (
      code === CameraErrorCode.TakePhotoCancelled ||
      code === CameraErrorCode.ChooseMediaCancelled ||
      /cancel/i.test(message)
    );
  }
}

