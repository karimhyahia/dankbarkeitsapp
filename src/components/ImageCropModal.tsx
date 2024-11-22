import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { X, Check, Loader2 } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (croppedImage: Blob) => void;
  isSaving?: boolean;
}

export default function ImageCropModal({ imageUrl, onClose, onCropComplete, isSaving = false }: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const getCroppedImg = async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.95
      );
    });
  };

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) return;
    try {
      const croppedImage = await getCroppedImg(imgRef.current, completedCrop);
      await onCropComplete(croppedImage);
    } catch (err) {
      console.error('Error cropping image:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-[280px]"
      >
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-medium">Profilbild zuschneiden</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            disabled={isSaving}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
            className="rounded-xl overflow-hidden"
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Profilbild"
              className="max-h-[240px] w-full object-contain"
            />
          </ReactCrop>
        </div>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            disabled={isSaving}
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1.5 text-sm bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-black/90 dark:hover:bg-white/90 transition-colors flex items-center space-x-1 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Speichern...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Speichern</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}