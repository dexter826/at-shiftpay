import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Minus, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { FormSection } from '@/components/ui/FormSection';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Location } from '@/types/index';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY || '';
const CAN_AUTOCOMPLETE =
  LOCATIONIQ_API_KEY.length > 0 && LOCATIONIQ_API_KEY !== 'free_key_placeholder';

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

interface LocationFormErrors {
  name?: string;
  coords?: string;
  lat?: string;
  lng?: string;
}

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingLocation: Location | null;
  locations: Location[];
  onSubmit: (data: LocationFormData) => Promise<void>;
}

const REVIEW_OPTIONS = [
  {
    value: 'high' as const,
    label: 'Tốt',
    Icon: ThumbsUp,
    active: 'border-success/50 bg-success/10 text-success',
  },
  {
    value: undefined,
    label: 'Thường',
    Icon: Minus,
    active: 'border-ink-muted bg-surface-2 text-ink',
  },
  {
    value: 'low' as const,
    label: 'Kém',
    Icon: ThumbsDown,
    active: 'border-danger/50 bg-danger/10 text-danger',
  },
];

const LocationFormModal: React.FC<LocationFormModalProps> = ({
  isOpen,
  onClose,
  editingLocation,
  locations,
  onSubmit,
}) => {
  const [name, setName] = useState(editingLocation?.name ?? '');
  const [address, setAddress] = useState(editingLocation?.address ?? '');
  const [lat, setLat] = useState(editingLocation?.latitude?.toString() ?? '');
  const [lng, setLng] = useState(editingLocation?.longitude?.toString() ?? '');
  const [review, setReview] = useState<'high' | 'low' | undefined>(
    editingLocation?.review ?? undefined
  );
  const [reviewNote, setReviewNote] = useState(editingLocation?.reviewNote ?? '');
  const [errors, setErrors] = useState<LocationFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const suggestionRef = useRef<HTMLDivElement | null>(null);

  const closeSuggestions = () => {
    setShowSuggestions(false);
    setIsSearching(false);
    abortRef.current?.abort();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        closeSuggestions();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(
    () => () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    },
    []
  );

  const fetchSuggestions = (value: string) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    const term = value.trim();
    if (!CAN_AUTOCOMPLETE || term.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = window.setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(
          `https://api.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(term)}&limit=5&accept-language=vi&countrycodes=vn`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error(`LocationIQ ${response.status}`);

        const data: unknown = await response.json();
        if (controller.signal.aborted) return;

        setSuggestions(Array.isArray(data) ? (data as LocationSuggestion[]) : []);
        setShowSuggestions(true);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error fetching address suggestions:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } finally {
        if (abortRef.current === controller) setIsSearching(false);
      }
    }, 300);
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setShowSuggestions(false);
    fetchSuggestions(value);
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    setAddress(suggestion.display_name);
    if (suggestion.lat && suggestion.lon) {
      setLat(suggestion.lat);
      setLng(suggestion.lon);
      setErrors((previous) => ({ ...previous, coords: undefined, lat: undefined, lng: undefined }));
    }
    setSuggestions([]);
    setShowSuggestions(false);
    abortRef.current?.abort();
    setIsSearching(false);
  };

  const hasChanges = useMemo(() => {
    if (!editingLocation) return name.trim().length > 0;

    return (
      name.trim() !== editingLocation.name.trim() ||
      address.trim() !== (editingLocation.address || '').trim() ||
      lat.trim() !== (editingLocation.latitude?.toString() ?? '') ||
      lng.trim() !== (editingLocation.longitude?.toString() ?? '') ||
      (review ?? null) !== (editingLocation.review ?? null) ||
      reviewNote.trim() !== (editingLocation.reviewNote || '').trim()
    );
  }, [name, address, lat, lng, review, reviewNote, editingLocation]);

  const validate = () => {
    const nextErrors: LocationFormErrors = {};
    const trimmedName = name.trim();

    if (!trimmedName) {
      nextErrors.name = 'Nhập tên địa điểm.';
    } else {
      const nameChanged =
        !editingLocation || trimmedName.toLowerCase() !== editingLocation.name.trim().toLowerCase();
      if (
        nameChanged &&
        locations.some(
          (location) =>
            location.id !== editingLocation?.id &&
            location.name.trim().toLowerCase() === trimmedName.toLowerCase()
        )
      ) {
        nextErrors.name = 'Địa điểm này đã có trong sổ.';
      }
    }

    const latText = lat.trim();
    const lngText = lng.trim();
    if (Boolean(latText) !== Boolean(lngText)) {
      nextErrors.coords = 'Nhập cả vĩ độ và kinh độ hoặc để trống cả hai.';
    } else if (latText && lngText) {
      const latitude = Number(latText);
      const longitude = Number(lngText);
      if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
        nextErrors.lat = 'Vĩ độ phải từ -90 đến 90.';
      }
      if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
        nextErrors.lng = 'Kinh độ phải từ -180 đến 180.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        address: address.trim(),
        latitude: lat.trim() ? Number(lat) : null,
        longitude: lng.trim() ? Number(lng) : null,
        review,
        reviewNote: reviewNote.trim(),
      });
    } catch {
      // Route đã hiện toast lỗi; giữ form để thử lại.
    } finally {
      setIsSubmitting(false);
    }
  };

  const hint = !hasChanges
    ? editingLocation
      ? 'Chưa có thay đổi để lưu.'
      : 'Nhập tên địa điểm để lưu.'
    : null;

  return (
    <Modal
      title={editingLocation ? 'Sửa địa điểm' : 'Thêm địa điểm'}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="space-y-2">
          {hint && <p className="text-center text-label text-ink-muted">{hint}</p>}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              form="location-form"
              className="flex-1"
              loading={isSubmitting}
              disabled={!hasChanges}
            >
              {editingLocation ? 'Cập nhật' : 'Lưu'}
            </Button>
          </div>
        </div>
      }
    >
      <form
        id="location-form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
        className="space-y-5"
        noValidate
      >
        <FormSection title="Thông tin">
          <Field label="Tên địa điểm" required error={errors.name}>
            <Input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (errors.name) setErrors((previous) => ({ ...previous, name: undefined }));
              }}
              placeholder="Ví dụ: Nhà hàng Sen"
              autoFocus
            />
          </Field>

          <div ref={suggestionRef} className="space-y-1.5">
            <Field
              label="Địa chỉ"
              hint={
                CAN_AUTOCOMPLETE
                  ? 'Tùy chọn. Có thể nhập tay hoặc chọn gợi ý.'
                  : 'Tùy chọn. Nhập địa chỉ nếu có.'
              }
            >
              <Input
                leadingIcon={<MapPin size={15} aria-hidden="true" />}
                value={address}
                onChange={(event) => handleAddressChange(event.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') closeSuggestions();
                }}
                placeholder="Ví dụ: 2739 Phạm Thế Hiển, Quận 8"
                autoComplete="off"
              />
            </Field>

            {isSearching && (
              <p role="status" className="text-label text-ink-muted">
                Đang tìm địa chỉ…
              </p>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <div
                role="group"
                aria-label="Gợi ý địa chỉ"
                className="max-h-48 divide-y divide-line overflow-y-auto border border-line"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.display_name}-${index}`}
                    type="button"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className={cn(
                      'flex min-h-11 w-full items-start gap-2 px-3 py-2 text-left transition-colors duration-fast ease-standard hover:bg-surface-2',
                      focusRingOnSurfaceClasses
                    )}
                  >
                    <MapPin
                      size={14}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-ink-muted"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-body-sm text-ink">
                        {suggestion.display_name.split(',')[0]}
                      </span>
                      <span className="block truncate text-label text-ink-muted">
                        {suggestion.display_name}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </FormSection>

        <FormSection title="Tọa độ (tùy chọn)">
          <p className="text-label text-ink-muted">
            Dùng để hiển thị bản đồ chính xác cho địa điểm.
          </p>
          {errors.coords && (
            <p role="alert" className="text-label text-danger">
              {errors.coords}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Vĩ độ" error={errors.lat}>
              <Input
                value={lat}
                onChange={(event) => {
                  setLat(event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    coords: undefined,
                    lat: undefined,
                  }));
                }}
                inputMode="decimal"
                placeholder="10.7400"
              />
            </Field>
            <Field label="Kinh độ" error={errors.lng}>
              <Input
                value={lng}
                onChange={(event) => {
                  setLng(event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    coords: undefined,
                    lng: undefined,
                  }));
                }}
                inputMode="decimal"
                placeholder="106.7000"
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Đánh giá">
          <div role="group" aria-label="Đánh giá địa điểm" className="grid grid-cols-3 gap-2">
            {REVIEW_OPTIONS.map(({ value, label, Icon, active }) => (
              <button
                key={label}
                type="button"
                aria-pressed={review === value}
                onClick={() => setReview(value)}
                className={cn(
                  'flex min-h-11 items-center justify-center gap-1.5 rounded-sm border text-body-sm font-medium transition-colors duration-fast ease-standard',
                  review === value ? active : 'border-line text-ink-muted hover:border-line-strong',
                  focusRingOnSurfaceClasses
                )}
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          <Field label="Ghi chú đánh giá" hint="Dùng lại khi xếp sự kiện tại địa điểm này.">
            <Textarea
              value={reviewNote}
              onChange={(event) => setReviewNote(event.target.value)}
              className="min-h-20"
            />
          </Field>
        </FormSection>
      </form>
    </Modal>
  );
};

export default LocationFormModal;
