import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { focusRingOnSurfaceClasses } from '@/lib/utils';

import { Location } from '@/types/index';

const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY || 'free_key_placeholder';

interface LocationSuggestion {
  display_name: string;
  lat?: string;
  lon?: string;
}

export interface LocationFormData {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  review?: 'high' | 'low';
  reviewNote: string;
}

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingLocation: Location | null;
  onSubmit: (data: LocationFormData) => Promise<void>;
}

const LocationFormModal: React.FC<LocationFormModalProps> = ({
  isOpen,
  onClose,
  editingLocation,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [review, setReview] = useState<'high' | 'low' | undefined>(undefined);
  const [reviewNote, setReviewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingLocation) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- form state initialized from props when the modal opens
        setName(editingLocation.name);
        setAddress(editingLocation.address || '');
        setLat(editingLocation.latitude?.toString() || '');
        setLng(editingLocation.longitude?.toString() || '');
        setReview(editingLocation.review ?? undefined);
        setReviewNote(editingLocation.reviewNote || '');
      } else {
        // Reset form
        setName('');
        setAddress('');
        setLat('');
        setLng('');
        setReview(undefined);
        setReviewNote('');
      }
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [isOpen, editingLocation]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (text: string) => {
    if (text.length < 3 || LOCATIONIQ_API_KEY === 'free_key_placeholder') {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(text)}&limit=5&accept-language=vi&countrycodes=vn`
      );
      const data: unknown = await res.json();
      setSuggestions(Array.isArray(data) ? (data as LocationSuggestion[]) : []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, []);

  const handleAddressChange = (val: string) => {
    setAddress(val);
    fetchSuggestions(val);
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    setAddress(suggestion.display_name);
    if (suggestion.lat && suggestion.lon) {
      setLat(suggestion.lat.toString());
      setLng(suggestion.lon.toString());
    }
    setShowSuggestions(false);
  };

  const isChanged = useMemo(() => {
    if (!editingLocation) return !!name.trim();
    return (
      name.trim() !== editingLocation.name ||
      address.trim() !== (editingLocation.address || '') ||
      lat.trim() !== (editingLocation.latitude?.toString() || '') ||
      lng.trim() !== (editingLocation.longitude?.toString() || '') ||
      review !== editingLocation.review ||
      reviewNote.trim() !== (editingLocation.reviewNote || '')
    );
  }, [name, address, lat, lng, review, reviewNote, editingLocation]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        address: address.trim() || '',
        latitude: lat ? parseFloat(lat) : null,
        longitude: lng ? parseFloat(lng) : null,
        review,
        reviewNote: reviewNote.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingLocation ? 'Sửa địa điểm' : 'Thêm địa điểm mới'}
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!isChanged || isSubmitting}
            className="flex-1"
          >
            {editingLocation ? 'Cập nhật' : 'Lưu lại'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="location-name"
            className={`block text-label font-medium mb-1.5 text-ink-muted`}
          >
            Tên địa điểm
          </label>
          <input
            id="location-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên địa điểm"
            className={`w-full px-4 py-2.5 rounded-sm border border-line text-body-sm bg-surface-2 text-ink placeholder:text-ink-muted focus:outline-none hover:border-ink-muted transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
          />
        </div>

        <div>
          <label
            htmlFor="location-address"
            className={`block text-label font-medium mb-1.5 text-ink-muted`}
          >
            Địa chỉ & Tọa độ
          </label>
          <div className="space-y-3">
            <div className="relative" ref={suggestionRef}>
              <input
                id="location-address"
                type="text"
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                onFocus={() => address.length >= 3 && setShowSuggestions(true)}
                placeholder="Nhập địa chỉ (Ví dụ: 2739 Phạm Thế Hiển)"
                className={`w-full px-4 py-2.5 rounded-sm border border-line text-body-sm bg-surface-2 text-ink placeholder:text-ink-muted focus:outline-none hover:border-ink-muted transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
              />
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute z-50 w-full mt-1 border border-line rounded-md overflow-hidden bg-surface`}
                  >
                    {suggestions.map((s, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => handleSelectSuggestion(s)}
                          className={`w-full text-left px-4 py-2.5 text-body-sm transition-colors duration-fast ease-standard border-b last:border-0 border-line hover:bg-surface-2 text-ink ${focusRingOnSurfaceClasses}`}
                        >
                          <div className="font-medium line-clamp-1">
                            {s.display_name.split(',')[0]}
                          </div>
                          <div className={`text-label text-ink-soft line-clamp-1`}>
                            {s.display_name}
                          </div>
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <label htmlFor="location-lat" className="sr-only">
                  Vĩ độ
                </label>
                <input
                  id="location-lat"
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="Vĩ độ (Latitude)"
                  className={`w-full px-3 py-2.5 rounded-sm border border-line text-body-sm overflow-hidden text-ellipsis bg-surface-2 text-ink placeholder:text-ink-muted focus:outline-none hover:border-ink-muted transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
                />
              </div>
              <div className="relative flex-1">
                <label htmlFor="location-lng" className="sr-only">
                  Kinh độ
                </label>
                <input
                  id="location-lng"
                  type="text"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="Kinh độ (Longitude)"
                  className={`w-full px-3 py-2.5 rounded-sm border border-line text-body-sm overflow-hidden text-ellipsis bg-surface-2 text-ink placeholder:text-ink-muted focus:outline-none hover:border-ink-muted transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
                />
              </div>
            </div>
            <p className="text-label text-ink-muted px-1">
              * Lấy tọa độ từ Google Maps để hiển thị bản đồ chính xác.
            </p>
          </div>
        </div>

        <div>
          <label className={`block text-label font-medium mb-2 text-ink-muted`}>
            Đánh giá chất lượng
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setReview('high')}
              aria-pressed={review === 'high'}
              className={`flex-1 p-2.5 min-h-10 rounded-sm border text-body-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses} ${
                review === 'high'
                  ? 'border-success/50 bg-success/5 text-success'
                  : `border-line text-ink-muted hover:border-ink-muted`
              }`}
            >
              <ThumbsUp size={16} />
              Tốt
            </button>
            <button
              type="button"
              onClick={() => setReview(undefined)}
              aria-pressed={review === undefined}
              className={`flex-1 p-2.5 min-h-10 rounded-sm border text-body-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses} ${
                review === undefined
                  ? 'border-ink-muted bg-surface-2 text-ink'
                  : `border-line text-ink-muted hover:border-ink-muted`
              }`}
            >
              <Minus size={16} />
              Thường
            </button>
            <button
              type="button"
              onClick={() => setReview('low')}
              aria-pressed={review === 'low'}
              className={`flex-1 p-2.5 min-h-10 rounded-sm border text-body-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses} ${
                review === 'low'
                  ? 'border-danger/50 bg-danger/5 text-danger'
                  : `border-line text-ink-muted hover:border-ink-muted`
              }`}
            >
              <ThumbsDown size={16} />
              Kém
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="location-review-note"
            className={`block text-label font-medium mb-1.5 text-ink-muted`}
          >
            Ghi chú đánh giá
          </label>
          <textarea
            id="location-review-note"
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            placeholder="Lưu ý về địa điểm này..."
            rows={3}
            className={`w-full px-4 py-2.5 rounded-sm border border-line text-body-sm resize-none bg-surface-2 text-ink placeholder:text-ink-muted focus:outline-none hover:border-ink-muted transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
          />
        </div>
      </div>
    </Modal>
  );
};

export default memo(LocationFormModal);
