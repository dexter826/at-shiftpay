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
    if (!croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (croppedImage) {
        const file = new File([croppedImage], 'avatar.jpg', { type: 'image/jpeg' });
        onCropComplete(file);
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      title="Sửa hình ảnh"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Hủy
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
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
            className={`w-full h-1.5 bg-surface-2 rounded-xs appearance-none cursor-pointer accent-accent ${focusRingOnSurfaceClasses}`}
          />
        </div>

        <p className={`text-body-sm text-ink-muted text-center`}>
          Kéo hình ảnh để canh chỉnh vùng hiển thị
        </p>
      </div>
    </Modal>
  );
};
