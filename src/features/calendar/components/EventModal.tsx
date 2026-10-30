import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import { Employee, Shift, ShiftSession, Event, UserSettings, Location } from '@/types/index';
import { shiftService } from '@/lib/api/shiftService';
import { locationService } from '@/lib/api/locationService';
import { eventService } from '@/lib/api/eventService';
import { planEventSave, surchargePerPerson } from '@/features/calendar/eventPlan';
import EmployeeAssignmentList from '@/features/calendar/components/EmployeeAssignmentList';
import {
  Sun,
  Moon,
  Check,
  AlertCircle,
  Banknote,
  ThumbsUp,
  ThumbsDown,
  Minus,
  MapPin,
  Type,
  FileText,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { TimePicker } from '@/components/ui/TimePicker';
import { useToast } from '@/components/ui/ToastProvider';
import SearchInput from '@/components/ui/SearchInput';
import { areValuesEqual } from '@/utils/compare';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';

interface EventModalProps {
  date: string;
  existingEvent: Event | null;
  existingShifts: Shift[];
  employees: Employee[];
  locations: Location[];
  settings: UserSettings;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  date,
  existingEvent,
  existingShifts,
  employees,
  locations,
  settings,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const userId = user?.uid || '';
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [time, setTime] = useState('');
  const [amount, setAmount] = useState<number>(settings.shiftRate);
  const [surcharge, setSurcharge] = useState<number>(0);
  const [surchargeDistributionType, setSurchargeDistributionType] = useState<'equal' | 'selected'>(
    'equal'
  );
  const [surchargeSelectedEmployees, setSurchargeSelectedEmployees] = useState<
    Record<string, boolean>
  >({});
  const [selectedSession, setSelectedSession] = useState<ShiftSession | null>(null);
  const [assignments, setAssignments] = useState<Record<string, boolean>>({});
  const [review, setReview] = useState<'high' | 'low' | undefined>(undefined);
  const [reviewNote, setReviewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeShiftCounts, setEmployeeShiftCounts] = useState<Record<string, number>>({});
  const [initialState, setInitialState] = useState<Record<string, unknown> | null>(null);
  const [initialSelectedIds, setInitialSelectedIds] = useState<Set<string>>(new Set());

  const initialStateRef = useRef<string | null>(null);

  const loadEmployeeShiftCounts = useCallback(async () => {
    try {
      const shifts = await shiftService.getUnpaidShifts(userId);
      const counts: Record<string, number> = {};

      shifts.forEach((shift) => {
        counts[shift.employeeId] = (counts[shift.employeeId] || 0) + 1;
      });

      setEmployeeShiftCounts(counts);
    } catch (error) {
      console.error('Error loading employee shift counts:', error);
      setEmployeeShiftCounts({});
    }
  }, [userId]);

  useEffect(() => {
    const initKey = `${existingEvent?.id ?? 'new'}:${date}:${locations.length > 0 ? 'loc' : 'noloc'}`;
    if (!isOpen) {
      initialStateRef.current = null;
      return;
    }
    if (initialStateRef.current === initKey) return;
    initialStateRef.current = initKey;

    if (isOpen) {
      if (existingEvent) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- form is initialized from the edited event when the modal opens
        setTitle(existingEvent.title);

        // Tìm địa điểm từ ID
        const loc = locations.find((l) => l.id === existingEvent.locationId);
        setLocation(loc ? loc.name : '');

        setNote(existingEvent.note || '');
        setTime(existingEvent.time || '');

        // Lấy đánh giá địa điểm
        if (loc) {
          setReview(loc.review ?? undefined);
          setReviewNote(loc.reviewNote || '');
        } else {
          setReview(undefined);
          setReviewNote('');
        }

        const newAssignments: Record<string, boolean> = {};
        let detectedSession: ShiftSession | null = null;

        // Ưu tiên: Sự kiện > Ca cũ > Mặc định
        let detectedAmount = existingEvent.amount;
        if (!detectedAmount && existingShifts.length > 0) {
          const firstShift = existingShifts[0];
          if (firstShift.amount) detectedAmount = firstShift.amount;
        }
        if (!detectedAmount) {
          detectedAmount = settings.shiftRate;
        }

        existingShifts.forEach((s) => {
          newAssignments[s.employeeId] = true;
          if (!detectedSession) detectedSession = s.session;
        });

        setAssignments(newAssignments);
        setInitialSelectedIds(new Set(existingShifts.map((s) => s.employeeId)));
        setSelectedSession(detectedSession);
        setAmount(detectedAmount);
        setSurcharge(existingEvent.surcharge || 0);

        // Khôi phục phân phối phụ phí
        if (existingEvent.surchargeDistribution) {
          setSurchargeDistributionType(existingEvent.surchargeDistribution.type);
          if (
            existingEvent.surchargeDistribution.type === 'selected' &&
            existingEvent.surchargeDistribution.selectedEmployeeIds
          ) {
            const selectedSurchargeEmps: Record<string, boolean> = {};
            existingEvent.surchargeDistribution.selectedEmployeeIds.forEach((id) => {
              selectedSurchargeEmps[id] = true;
            });
            setSurchargeSelectedEmployees(selectedSurchargeEmps);
          }
        } else {
          setSurchargeDistributionType('equal');
          setSurchargeSelectedEmployees({});
        }

        // Đặt giờ theo ca
        if (!existingEvent.time && detectedSession) {
          setTime(detectedSession === 'morning' ? settings.morningTime : settings.afternoonTime);
        }
      } else {
        setTitle('');
        setLocation('');
        setNote('');
        setTime('');
        setAmount(settings.shiftRate);
        setSurcharge(0);
        setSurchargeDistributionType('equal');
        setSurchargeSelectedEmployees({});
        setSelectedSession(null);
        setAssignments({});
        setInitialSelectedIds(new Set());
        setReview(undefined);
        setReviewNote('');
      }

      loadEmployeeShiftCounts();

      // Lấy đánh giá từ địa điểm
      if (existingEvent) {
        const loc = locations.find((l) => l.id === existingEvent.locationId);
        if (loc) {
          setReview(loc.review ?? undefined);
          setReviewNote(loc.reviewNote || '');
        }
      }

      // Lưu trạng thái gốc
      if (existingEvent) {
        const loc = locations.find((l) => l.id === existingEvent.locationId);
        setInitialState({
          title: existingEvent.title,
          locationId: existingEvent.locationId || '',
          note: existingEvent.note || '',
          time: existingEvent.time || '',
          amount: existingEvent.amount || settings.shiftRate,
          surcharge: existingEvent.surcharge || 0,
          surchargeDistribution: existingEvent.surchargeDistribution,
          assignments: Object.fromEntries(existingShifts.map((s) => [s.employeeId, true])),
          session: existingShifts[0]?.session || null,
          review: loc?.review,
          reviewNote: loc?.reviewNote || '',
        });
      } else {
        setInitialState(null);
      }
    }
  }, [isOpen, existingEvent, existingShifts, settings, locations, date, loadEmployeeShiftCounts]);

  const selectSession = (session: ShiftSession) => {
    if (selectedSession === session) {
      setSelectedSession(null);
      setAssignments({});
      setTime('');
    } else {
      setSelectedSession(session);
      setAssignments({});
      setSearchTerm('');
      // Đặt giờ mặc định
      setTime(session === 'morning' ? settings.morningTime : settings.afternoonTime);
    }
  };

  const toggleAssignment = (empId: string) => {
    setAssignments((prev) => ({
      ...prev,
      [empId]: !prev[empId],
    }));
  };

  const getSelectedCount = () => Object.values(assignments).filter(Boolean).length;

  const getSurchargePerPerson = () =>
    surchargePerPerson({
      surcharge,
      surchargeDistributionType,
      assignments,
      surchargeSelectedEmployees,
    });

  const toggleSurchargeEmployee = (empId: string) => {
    setSurchargeSelectedEmployees((prev) => ({
      ...prev,
      [empId]: !prev[empId],
    }));
  };

  const formatDateTitle = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dayOfWeek = dayNames[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${dayOfWeek}, ${day}/${month}`;
  };

  const validateTitle = () => {
    // Không bắt buộc tên
    setTitleError('');
    return true;
  };

  const hasChanged = useMemo(() => {
    if (!existingEvent || !initialState) return true; // Cho phép lưu nếu tạo mới

    const currentSurchargeDistribution =
      surcharge > 0
        ? {
            type: surchargeDistributionType,
            selectedEmployeeIds:
              surchargeDistributionType === 'selected'
                ? Object.entries(surchargeSelectedEmployees)
                    .filter(([_, selected]) => selected)
                    .map(([id]) => id)
                : undefined,
          }
        : undefined;

    const currentState = {
      title: title.trim() || 'Tiệc',
      locationId: locations.find((l) => l.name === location.trim())?.id || '',
      note: note.trim(),
      time,
      amount,
      surcharge,
      surchargeDistribution: currentSurchargeDistribution,
      assignments: Object.fromEntries(Object.entries(assignments).filter(([_, v]) => v)),
      session: selectedSession,
      review,
      reviewNote: reviewNote.trim(),
    };

    return !areValuesEqual(currentState, initialState);
  }, [
    title,
    location,
    note,
    time,
    amount,
    surcharge,
    surchargeDistributionType,
    surchargeSelectedEmployees,
    assignments,
    selectedSession,
    review,
    reviewNote,
    initialState,
    existingEvent,
    locations,
  ]);

  const handleSubmit = async () => {
    // Tên mặc định là "Tiệc"
    const finalTitle = title.trim() || 'Tiệc';
    if (!selectedSession) {
      showToast('Chọn một ca làm việc', 'error');
      return;
    }
    if (getSelectedCount() === 0) {
      showToast('Chọn ít nhất 1 nhân viên', 'error');
      return;
    }

    // Kiểm tra người nhận phụ phí
    if (surcharge > 0 && surchargeDistributionType === 'selected') {
      const selectedSurchargeCount = Object.values(surchargeSelectedEmployees).filter(
        Boolean
      ).length;
      if (selectedSurchargeCount === 0) {
        showToast('Chọn ít nhất 1 người nhận phụ phí', 'error');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Xử lý Địa điểm & Đánh giá
      let locationId = '';
      if (location.trim()) {
        locationId = await locationService.findOrCreateLocation(userId, location.trim(), {
          review,
          reviewNote: reviewNote.trim(),
        });
      }

      // Chuẩn bị dữ liệu
      const isEditing = !!existingEvent;

      const plan = planEventSave(
        {
          date,
          title: finalTitle,
          locationId,
          note,
          time,
          amount,
          surcharge,
          surchargeDistributionType,
          surchargeSelectedEmployees,
          assignments,
          session: selectedSession,
          userId,
        },
        employees,
        existingShifts
      );

      if (isEditing && existingEvent) {
        // Cập nhật thông minh
        await eventService.batchUpdateEvent(existingEvent.id, plan.eventData, {
          create: plan.create,
          update: plan.update,
          delete: plan.remove,
        });
      } else {
        // Tạo mới (Atomic)
        await eventService.createEventWithShifts(plan.eventData, plan.create);
      }

      showToast(isEditing ? 'Đã cập nhật sự kiện' : 'Đã tạo sự kiện mới', 'success');
      onSuccess();
    } catch (err) {
      showToast('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        existingEvent
          ? `Sửa sự kiện ${formatDateTitle(date)}`
          : `Tạo sự kiện ${formatDateTitle(date)}`
      }
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            loading={isSubmitting}
            disabled={!hasChanged}
          >
            {existingEvent ? 'Cập nhật' : 'Lưu'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Tên & Thời gian */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 text-ink-muted`}>
              Tên sự kiện
            </label>
            <div className="relative">
              <Type
                className={`absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted`}
                size={18}
              />
              <input
                type="text"
                placeholder="Nhập tên sự kiện"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) validateTitle();
                }}
                onBlur={() => validateTitle()}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-sm text-body-sm focus:outline-none ${focusRingOnSurfaceClasses} ${
                  titleError
                    ? 'border-danger focus:border-danger'
                    : `border-line bg-surface-2 text-ink placeholder:text-ink-muted focus:border-accent`
                }`}
              />
            </div>
            {titleError && <p className="text-danger text-xs mt-1">{titleError}</p>}
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-1.5 text-ink-muted`}>
              Thời gian bắt đầu
            </label>
            <TimePicker value={time} onChange={setTime} />
          </div>
        </div>

        {/* Địa điểm */}
        <div className="space-y-2">
          <label className={`block text-xs font-semibold mb-1.5 text-ink-muted`}>Địa điểm</label>
          <div className="relative">
            <MapPin
              className={`absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted`}
              size={18}
            />
            <input
              type="text"
              placeholder="Nhập địa điểm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-sm text-body-sm focus:outline-none ${focusRingOnSurfaceClasses} border-line bg-surface-2 text-ink placeholder:text-ink-muted focus:border-accent`}
            />
          </div>

          {/* Cảnh báo địa điểm */}
          {location.length >= 2 &&
            (() => {
              const suggestions = locations.filter(
                (l) =>
                  l.name.toLowerCase().includes(location.toLowerCase()) &&
                  l.name.toLowerCase() !== location.toLowerCase()
              );

              const exactMatch = locations.find(
                (l) => l.name.toLowerCase() === location.toLowerCase()
              );

              return (
                <div className="space-y-2">
                  {/* Autocomplete Suggestions */}
                  {suggestions.length > 0 && (
                    <div
                      className={`mt-1 border border-line rounded-md overflow-hidden bg-surface max-h-32 overflow-y-auto`}
                    >
                      {suggestions.slice(0, 5).map((loc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setLocation(loc.name);
                            setReview(loc.review ?? undefined);
                            setReviewNote(loc.reviewNote || '');
                          }}
                          className={`w-full px-3 py-2 text-left text-xs hover:bg-line transition-colors border-b last:border-0 border-line text-ink-soft`}
                        >
                          📍 {loc.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Warning/Success History */}
                  {exactMatch && (exactMatch.review || exactMatch.reviewNote) && (
                    <div
                      className={`p-3 rounded-md border flex items-start gap-3 ${
                        exactMatch.review === 'low'
                          ? 'bg-danger/10 border-danger/20 text-danger'
                          : exactMatch.review === 'high'
                            ? 'bg-success/10 border-success/20 text-success'
                            : `bg-surface-2 border-line text-ink-soft`
                      }`}
                    >
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <p>
                          Địa điểm này từng được đánh giá{' '}
                          <strong>
                            {exactMatch.review === 'low'
                              ? 'Kém'
                              : exactMatch.review === 'high'
                                ? 'Tốt'
                                : 'Thường'}
                          </strong>
                          .
                        </p>
                        {exactMatch.reviewNote && (
                          <p className="mt-1 italic opacity-80">"{exactMatch.reviewNote}"</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
        </div>

        <div>
          <label className={`block text-xs font-semibold mb-1.5 text-ink-muted`}>Ghi chú</label>
          <div className="relative">
            <FileText className={`absolute left-3 top-3 text-ink-muted`} size={18} />
            <textarea
              placeholder="Nhập ghi chú"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-sm text-body-sm focus:outline-none ${focusRingOnSurfaceClasses} h-20 resize-none border-line bg-surface-2 text-ink placeholder:text-ink-muted focus:border-accent`}
            />
          </div>
        </div>

        {/* Đánh giá sự kiện */}
        <div>
          <label className={`block text-xs font-semibold mb-1.5 text-ink-muted`}>
            Đánh giá sự kiện
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setReview('high')}
              className={`p-2.5 rounded-sm border text-body-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                review === 'high'
                  ? 'border-success/50 bg-success/10 text-success'
                  : `border-line text-ink-muted hover:border-accent/50`
              }`}
            >
              <ThumbsUp size={16} />
              Tốt
            </button>
            <button
              type="button"
              onClick={() => setReview(undefined)}
              className={`p-2.5 rounded-sm border text-body-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                review === undefined
                  ? 'border-accent/50 bg-accent/10 text-accent-ink'
                  : `border-line text-ink-muted hover:border-accent/50`
              }`}
            >
              <Minus size={16} />
              Thường
            </button>
            <button
              type="button"
              onClick={() => setReview('low')}
              className={`p-2.5 rounded-sm border text-body-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                review === 'low'
                  ? 'border-danger/50 bg-danger/10 text-danger'
                  : `border-line text-ink-muted hover:border-danger/50`
              }`}
            >
              <ThumbsDown size={16} />
              Kém
            </button>
          </div>
        </div>

        {/* Lý do đánh giá */}
        <div className="space-y-1.5 pt-1">
          <label className={`block text-xs font-semibold text-ink-muted`}>
            Lý do đánh giá ({review === 'high' ? 'Tốt' : review === 'low' ? 'Kém' : 'Thường'})
          </label>
          <div className="relative">
            <FileText className={`absolute left-3 top-3 text-ink-muted`} size={18} />
            <textarea
              placeholder="Nhập lý do hoặc nhận xét cụ thể..."
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-sm text-body-sm focus:outline-none ${focusRingOnSurfaceClasses} h-20 resize-none border-line bg-surface-2 text-ink placeholder:text-ink-muted ${
                review === 'high'
                  ? 'focus:border-success/50'
                  : review === 'low'
                    ? 'focus:border-danger/50'
                    : 'focus:border-accent'
              }`}
            />
          </div>
        </div>

        {/* Chọn ca */}
        <div>
          <label className={`block text-xs font-semibold mb-1.5 text-ink-muted`}>Ca làm việc</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => selectSession('morning')}
              className={`p-2.5 rounded-sm border text-body-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                selectedSession === 'morning'
                  ? 'border-warning/50 bg-warning/10 text-warning'
                  : `border-line text-ink-muted hover:border-accent/50`
              }`}
            >
              <Sun size={16} />
              Tiệc Sáng
            </button>
            <button
              type="button"
              onClick={() => selectSession('afternoon')}
              className={`p-2.5 rounded-sm border text-body-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                selectedSession === 'afternoon'
                  ? 'border-accent/50 bg-accent/10 text-accent-ink'
                  : `border-line text-ink-muted hover:border-accent/50`
              }`}
            >
              <Moon size={16} />
              Tiệc Chiều
            </button>
          </div>
        </div>

        {/* Lương & Phụ phí */}
        {selectedSession && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 text-ink-muted`}>
                Lương/người
              </label>
              <div className="relative">
                <Banknote
                  size={18}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted`}
                />
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-sm text-body-sm focus:outline-none ${focusRingOnSurfaceClasses} border-line bg-surface-2 text-ink placeholder:text-ink-muted focus:border-accent`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1.5 text-ink-muted`}>Phụ phí</label>
              <div className="relative">
                <Banknote
                  size={18}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted`}
                />
                <input
                  type="number"
                  value={surcharge || ''}
                  onChange={(e) => setSurcharge(e.target.value === '' ? 0 : Number(e.target.value))}
                  placeholder="0"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-sm text-body-sm focus:outline-none ${focusRingOnSurfaceClasses} border-line bg-surface-2 text-ink placeholder:text-ink-muted focus:border-accent`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Phân phối phụ phí */}
        {selectedSession && surcharge > 0 && (
          <div>
            <label
              className={`block text-xs mb-1.5 ${
                theme === 'dark' ? 'text-ink-muted' : 'text-ink-muted'
              }`}
            >
              Phân phối phụ phí
            </label>

            {/* Radio buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="surchargeDistribution"
                  value="equal"
                  checked={surchargeDistributionType === 'equal'}
                  onChange={() => setSurchargeDistributionType('equal')}
                  className="accent-accent"
                />
                <span className={`text-sm text-ink-soft`}>Chia đều cho tất cả</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="surchargeDistribution"
                  value="selected"
                  checked={surchargeDistributionType === 'selected'}
                  onChange={() => {
                    setSurchargeDistributionType('selected');
                  }}
                  className="accent-accent"
                />
                <span className={`text-sm text-ink-soft`}>Chọn người nhận</span>
              </label>
            </div>

            {/* Danh sách người nhận */}
            {surchargeDistributionType === 'selected' && (
              <div
                className={`border rounded-md divide-y max-h-32 overflow-y-auto border-line divide-line`}
              >
                {Object.entries(assignments)
                  .filter(([_, isAssigned]) => isAssigned)
                  .map(([empId]) => {
                    const emp = employees.find((e) => e.id === empId);
                    if (!emp) return null;

                    const isSelected = surchargeSelectedEmployees[empId] || false;

                    return (
                      <div
                        key={empId}
                        onClick={() => toggleSurchargeEmployee(empId)}
                        className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors hover:bg-accent/5 ${
                          isSelected ? 'bg-accent/10' : ''
                        }`}
                      >
                        <span
                          className={`text-sm text-ink-soft ${isSelected ? 'font-medium' : ''}`}
                        >
                          {emp.name}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-xs border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-accent border-accent' : 'border-line'
                          }`}
                        >
                          {isSelected && <Check size={12} className="text-on-accent" />}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Hiển thị tính toán */}
            {surchargeDistributionType === 'selected' && (
              <p className={`text-xs mt-2 text-ink-muted`}>
                {Object.values(surchargeSelectedEmployees).filter(Boolean).length} người được chọn -{' '}
                {getSurchargePerPerson().toLocaleString('vi-VN')} VND/người
              </p>
            )}
          </div>
        )}

        {/* Danh sách nhân viên */}
        {selectedSession && (
          <div>
            <label className={`block text-xs mb-1.5 text-ink-muted`}>
              Chọn người làm ({getSelectedCount()})
            </label>

            {/* Search Bar */}
            <SearchInput
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              containerClassName="mb-3"
            />

            {/* Filtered Employees List */}
            <EmployeeAssignmentList
              employees={employees}
              shiftCounts={employeeShiftCounts}
              assignments={assignments}
              initialSelectedIds={initialSelectedIds}
              searchTerm={searchTerm}
              onToggle={toggleAssignment}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
