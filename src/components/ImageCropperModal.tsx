import React, { useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { getCroppedImg } from '@/utils/cropImage';
import { focusRingOnSurfaceClasses } from '@/lib/utils';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  onCropComplete: (file: File) => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  image,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropAreaComplete = (_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  };

  const handleConfirm = async () => {
    if (!croppedAreaPixels || isProcessing) return;

    setError('');
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (!croppedImage) throw new Error('Không thể cắt ảnh');
      const file = new File([croppedImage], 'avatar.jpg', { type: 'image/jpeg' });
      onCropComplete(file);
      onClose();
    } catch (caught) {
      console.error(caught);
      setError('Không thể cắt ảnh. Thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      title="Sửa hình ảnh"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={isProcessing}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1"
            loading={isProcessing}
            disabled={!croppedAreaPixels}
          >
            Xong
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className={`relative w-full h-64 bg-surface-2 rounded-md overflow-hidden`}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropAreaComplete}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-label font-medium">
            <span className="text-ink-muted">Phóng to</span>
            <span className="text-ink-muted tabular-nums">{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-label="Phóng to"
            onChange={(e) => setZoom(Number(e.target.value))}
            className={`h-11 w-full appearance-none cursor-pointer rounded-sm bg-transparent [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-xs [&::-webkit-slider-runnable-track]:bg-ink-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:-mt-2 [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-ink [&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-xs [&::-moz-range-track]:bg-ink-muted [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-sm [&::-moz-range-thumb]:bg-ink ${focusRingOnSurfaceClasses}`}
          />
        </div>

        {error && (
          <p role="alert" className="text-label text-danger">
            {error}
          </p>
        )}

        <p className={`text-body-sm text-ink-muted text-center`}>
          Kéo hình ảnh để canh chỉnh vùng hiển thị
        </p>
      </div>
    </Modal>
  );
};
