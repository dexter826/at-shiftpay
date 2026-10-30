import React, { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Banknote,
  CalendarDays,
  MapPin,
  Minus,
  Moon,
  Sun,
  ThumbsDown,
  ThumbsUp,
  Type,
} from 'lucide-react';
import { Employee, Shift, ShiftSession, Event, UserSettings, Location } from '@/types/index';
import { shiftService } from '@/lib/api/shiftService';
import { locationService } from '@/lib/api/locationService';
import { eventService } from '@/lib/api/eventService';
import { planEventSave, surchargePerPerson } from '@/features/calendar/eventPlan';
import EmployeeAssignmentList from '@/features/calendar/components/EmployeeAssignmentList';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { Field } from '@/components/ui/Field';
import { FormSection } from '@/components/ui/FormSection';
import { Input } from '@/components/ui/Input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import SearchInput from '@/components/ui/SearchInput';
import { Textarea } from '@/components/ui/Textarea';
import { TimePicker } from '@/components/ui/TimePicker';
import { useToast } from '@/components/ui/ToastProvider';
import { areValuesEqual } from '@/utils/compare';
import { formatCurrency, parseDateOnly } from '@/utils/format';
import { useAuthStore } from '@/stores/authStore';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

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

interface EventFormErrors {
  session?: string;
  employees?: string;
  surcharge?: string;
}

interface EventSnapshot {
  title: string;
  location: string;
  note: string;
  time: string;
  amount: number;
  surcharge: number;
  distributionType: 'equal' | 'selected';
  surchargeIds: string[];
  assignmentIds: string[];
  session: ShiftSession | null;
  review?: 'high' | 'low';
  reviewNote: string;
}

const REVIEW_OPTIONS: Array<{
  value: 'high' | 'low' | undefined;
  label: string;
  Icon: LucideIcon;
  selectedClass: string;
}> = [
  {
    value: 'high',
    label: 'Tốt',
    Icon: ThumbsUp,
    selectedClass: 'border-success/50 bg-success/10 text-success',
  },
  {
    value: undefined,
    label: 'Thường',
    Icon: Minus,
    selectedClass: 'border-ink-muted bg-surface-2 text-ink',
  },
  {
    value: 'low',
    label: 'Kém',
    Icon: ThumbsDown,
    selectedClass: 'border-danger/50 bg-danger/10 text-danger',
  },
];

const defaultTimeFor = (session: ShiftSession, settings: UserSettings) =>
  session === 'morning' ? settings.morningTime : settings.afternoonTime;

const formatEventDate = (dateStr: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parseDateOnly(dateStr));

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
  const userId = user?.uid || '';
  const { showToast } = useToast();

  const existingLocation = existingEvent
    ? locations.find((location) => location.id === existingEvent.locationId)
    : undefined;
  const editableShifts = existingShifts.filter((shift) => shift.status === 'unpaid');
  const settledShiftCount = existingShifts.length - editableShifts.length;
  const detectedSession = editableShifts[0]?.session ?? existingShifts[0]?.session ?? null;
  const initialSessionShifts = editableShifts.filter((shift) => shift.session === detectedSession);
  const editableEmployeeIds = new Set(initialSessionShifts.map((shift) => shift.employeeId));
  const settledEmployeeIds = new Set(
    existingShifts
      .filter((shift) => shift.status !== 'unpaid' && !editableEmployeeIds.has(shift.employeeId))
      .map((shift) => shift.employeeId)
  );
  const initialAmount = existingEvent?.amount || existingShifts[0]?.amount || settings.shiftRate;
  const initialReview = existingLocation?.review ?? undefined;

  const [title, setTitle] = useState(existingEvent?.title ?? '');
  const [locationName, setLocationName] = useState(existingLocation?.name ?? '');
  const [note, setNote] = useState(existingEvent?.note ?? '');
  const [time, setTime] = useState(
    existingEvent?.time || (detectedSession ? defaultTimeFor(detectedSession, settings) : '')
  );
  const [amount, setAmount] = useState(initialAmount);
  const [surcharge, setSurcharge] = useState(existingEvent?.surcharge ?? 0);
  const [distributionType, setDistributionType] = useState<'equal' | 'selected'>(
    existingEvent?.surchargeDistribution?.type ?? 'equal'
  );
  const [surchargeSelectedEmployees, setSurchargeSelectedEmployees] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      (existingEvent?.surchargeDistribution?.selectedEmployeeIds ?? []).map((id) => [id, true])
    )
  );
  const [selectedSession, setSelectedSession] = useState<ShiftSession | null>(detectedSession);
  const [assignments, setAssignments] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(initialSessionShifts.map((shift) => [shift.employeeId, true]))
  );
  const [initialSelectedIds] = useState(
    () => new Set(initialSessionShifts.map((shift) => shift.employeeId))
  );
  const [review, setReview] = useState<'high' | 'low' | undefined>(initialReview);
  const [reviewNote, setReviewNote] = useState(existingLocation?.reviewNote ?? '');
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeShiftCounts, setEmployeeShiftCounts] = useState<Record<string, number>>({});
  const [countsLoaded, setCountsLoaded] = useState(() => !userId);
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialSnapshot] = useState<EventSnapshot>(() => ({
    title: (existingEvent?.title ?? '').trim() || 'Tiệc',
    location: (existingLocation?.name ?? '').trim(),
    note: (existingEvent?.note ?? '').trim(),
    time: existingEvent?.time ?? '',
    amount: existingEvent?.amount || settings.shiftRate,
    surcharge: existingEvent?.surcharge ?? 0,
    distributionType: existingEvent?.surchargeDistribution?.type ?? 'equal',
    surchargeIds: [...(existingEvent?.surchargeDistribution?.selectedEmployeeIds ?? [])].sort(),
    assignmentIds: initialSessionShifts.map((shift) => shift.employeeId).sort(),
    session: detectedSession,
    review: initialReview,
    reviewNote: (existingLocation?.reviewNote ?? '').trim(),
  }));

  useEffect(() => {
    let cancelled = false;

    if (!userId) {
      return;
    }

    shiftService
      .getUnpaidShifts(userId)
      .then((shifts) => {
        if (cancelled) return;
        const counts: Record<string, number> = {};
        shifts.forEach((shift) => {
          counts[shift.employeeId] = (counts[shift.employeeId] || 0) + 1;
        });
        setEmployeeShiftCounts(counts);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Error loading employee shift counts:', error);
        setEmployeeShiftCounts({});
      })
      .finally(() => {
        if (!cancelled) setCountsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const assignedIds = useMemo(
    () =>
      Object.entries(assignments)
        .filter(([, isAssigned]) => isAssigned)
        .map(([employeeId]) => employeeId),
    [assignments]
  );
  const selectedSurchargeIds = useMemo(
    () =>
      Object.entries(surchargeSelectedEmployees)
        .filter(([, isSelected]) => isSelected)
        .map(([employeeId]) => employeeId),
    [surchargeSelectedEmployees]
  );

  const locationSuggestions = useMemo(() => {
    const term = locationName.trim().toLowerCase();
    if (term.length < 2) return [];
    return locations
      .filter(
        (location) =>
          location.name.toLowerCase().includes(term) && location.name.toLowerCase() !== term
      )
      .slice(0, 5);
  }, [locationName, locations]);

  const exactLocation = useMemo(() => {
    const term = locationName.trim().toLowerCase();
    if (!term) return undefined;
    return locations.find((location) => location.name.toLowerCase() === term);
  }, [locationName, locations]);

  const hasChanged =
    !existingEvent ||
    !areValuesEqual(
      {
        title: title.trim() || 'Tiệc',
        location: locationName.trim(),
        note: note.trim(),
        time,
        amount,
        surcharge,
        distributionType,
        surchargeIds: [...selectedSurchargeIds].sort(),
        assignmentIds: [...assignedIds].sort(),
        session: selectedSession,
        review,
        reviewNote: reviewNote.trim(),
      },
      initialSnapshot
    );

  const clearError = (key: keyof EventFormErrors) =>
    setErrors((previous) => ({ ...previous, [key]: undefined }));

  const selectSession = (session: ShiftSession) => {
    if (settledShiftCount > 0) return;

    if (selectedSession === session) {
      setSelectedSession(null);
      setAssignments({});
      setSearchTerm('');
      setTime('');
      return;
    }

    setSelectedSession(session);
    setTime(defaultTimeFor(session, settings));
    clearError('session');
  };

  const toggleAssignment = (employeeId: string) => {
    const wasAssigned = assignments[employeeId] || false;
    setAssignments((previous) => ({ ...previous, [employeeId]: !previous[employeeId] }));
    if (wasAssigned) {
      setSurchargeSelectedEmployees((previous) => {
        if (!previous[employeeId]) return previous;
        return { ...previous, [employeeId]: false };
      });
    }
    clearError('employees');
  };

  const toggleSurchargeEmployee = (employeeId: string) => {
    setSurchargeSelectedEmployees((previous) => ({
      ...previous,
      [employeeId]: !previous[employeeId],
    }));
    clearError('surcharge');
  };

  const perPerson = surchargePerPerson({
    surcharge,
    surchargeDistributionType: distributionType,
    assignments,
    surchargeSelectedEmployees,
  });
  const hasLocation = locationName.trim().length > 0;

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const nextErrors: EventFormErrors = {};
    if (!selectedSession) nextErrors.session = 'Chọn ca làm việc.';
    if (assignedIds.length === 0 && (!existingEvent || editableShifts.length > 0)) {
      nextErrors.employees = 'Chọn ít nhất 1 nhân viên.';
    }
    if (surcharge > 0 && distributionType === 'selected' && selectedSurchargeIds.length === 0) {
      nextErrors.surcharge = 'Chọn ít nhất 1 người nhận phụ phí.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!selectedSession) return;
    setErrors({});
    setIsSubmitting(true);

    try {
      let locationId = '';
      if (locationName.trim()) {
        locationId = await locationService.findOrCreateLocation(userId, locationName.trim(), {
          review,
          reviewNote: reviewNote.trim(),
        });
      }

      const finalTitle = title.trim() || 'Tiệc';
      const plan = planEventSave(
        {
          date,
          title: finalTitle,
          locationId,
          note: note.trim(),
          time,
          amount,
          surcharge,
          surchargeDistributionType: distributionType,
          surchargeSelectedEmployees,
          assignments,
          session: selectedSession,
          originalSession: detectedSession,
          userId,
        },
        employees,
        existingShifts
      );

      if (existingEvent) {
        await eventService.batchUpdateEvent(existingEvent.id, plan.eventData, {
          create: plan.create,
          update: plan.update,
          delete: plan.remove,
        });
        showToast('Đã cập nhật sự kiện.', 'success');
      } else {
        await eventService.createEventWithShifts(plan.eventData, plan.create);
        showToast('Đã thêm sự kiện.', 'success');
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      showToast('Không thể lưu sự kiện. Thử lại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={existingEvent ? 'Sửa sự kiện' : 'Thêm sự kiện'}
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      footer={
        <div className="space-y-2">
          {!hasChanged && (
            <p className="text-center text-label text-ink-muted">Chưa có thay đổi để lưu.</p>
          )}
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
              form="event-form"
              className="flex-1"
              loading={isSubmitting}
              disabled={!hasChanged}
            >
              {existingEvent ? 'Cập nhật' : 'Lưu'}
            </Button>
          </div>
        </div>
      }
    >
      <form
        id="event-form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
        className="space-y-5"
        noValidate
      >
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <CalendarDays size={15} aria-hidden="true" className="text-ink-muted" />
          <p className="font-mono text-mono-label text-ink-muted">{formatEventDate(date)}</p>
        </div>

        <FormSection title="Thông tin">
          <Field label="Tên sự kiện" hint="Để trống sẽ dùng tên 'Tiệc'.">
            <Input
              leadingIcon={<Type size={15} aria-hidden="true" />}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ví dụ: Tiệc cưới nhà anh Minh"
              autoFocus
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <span className="block text-body-sm font-medium text-ink">Thời gian bắt đầu</span>
              <TimePicker value={time} onChange={setTime} ariaLabel="Thời gian bắt đầu" />
            </div>
            <Field label="Địa điểm">
              <Input
                leadingIcon={<MapPin size={15} aria-hidden="true" />}
                value={locationName}
                onChange={(event) => {
                  const value = event.target.value;
                  const match = locations.find(
                    (location) => location.name.toLowerCase() === value.trim().toLowerCase()
                  );
                  setLocationName(value);
                  setReview(match?.review ?? undefined);
                  setReviewNote(match?.reviewNote ?? '');
                }}
                placeholder="Ví dụ: Nhà hàng Sen"
                autoComplete="off"
              />
            </Field>
          </div>

          {locationSuggestions.length > 0 && (
            <div aria-label="Địa điểm gợi ý" className="divide-y divide-line border border-line">
              {locationSuggestions.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => {
                    setLocationName(location.name);
                    setReview(location.review ?? undefined);
                    setReviewNote(location.reviewNote || '');
                  }}
                  className={cn(
                    'flex min-h-11 w-full items-center gap-2 px-3 text-left text-label text-ink-soft transition-colors duration-fast ease-standard hover:bg-surface-2',
                    focusRingOnSurfaceClasses
                  )}
                >
                  <MapPin size={13} aria-hidden="true" className="text-ink-muted" />
                  {location.name}
                </button>
              ))}
            </div>
          )}

          {exactLocation?.review && (
            <div
              className={cn(
                'flex items-start gap-2 border px-3 py-2 text-label',
                exactLocation.review === 'high'
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-danger/30 bg-danger/10 text-danger'
              )}
            >
              {exactLocation.review === 'high' ? (
                <ThumbsUp size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
              ) : (
                <ThumbsDown size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
              )}
              <div>
                <p className="font-semibold">
                  Địa điểm đã được đánh giá {exactLocation.review === 'high' ? 'tốt' : 'kém'}.
                </p>
                {exactLocation.reviewNote && (
                  <p className="mt-0.5 italic">“{exactLocation.reviewNote}”</p>
                )}
              </div>
            </div>
          )}

          <Field label="Ghi chú">
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="min-h-20"
            />
          </Field>
        </FormSection>

        <FormSection title="Đánh giá địa điểm">
          {!hasLocation && (
            <p className="text-label text-ink-muted">Nhập địa điểm để lưu đánh giá.</p>
          )}
          <div role="group" aria-label="Đánh giá địa điểm" className="grid grid-cols-3 gap-2">
            {REVIEW_OPTIONS.map(({ value, label, Icon, selectedClass }) => (
              <button
                key={label}
                type="button"
                aria-pressed={review === value}
                disabled={!hasLocation}
                onClick={() => setReview(value)}
                className={cn(
                  'flex min-h-11 items-center justify-center gap-1.5 rounded-sm border text-body-sm font-medium transition-colors duration-fast ease-standard disabled:cursor-not-allowed disabled:opacity-50',
                  review === value
                    ? selectedClass
                    : 'border-line text-ink-muted hover:border-line-strong',
                  focusRingOnSurfaceClasses
                )}
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          <Field label="Ghi chú đánh giá" hint="Lưu theo địa điểm, dùng lại cho các sự kiện sau.">
            <Textarea
              value={reviewNote}
              onChange={(event) => setReviewNote(event.target.value)}
              disabled={!hasLocation}
              className="min-h-20"
            />
          </Field>
        </FormSection>

        <FormSection title="Ca và lương">
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Ca làm việc">
            {(['morning', 'afternoon'] as const).map((session) => {
              const Icon = session === 'morning' ? Sun : Moon;
              const isSelected = selectedSession === session;
              return (
                <button
                  key={session}
                  type="button"
                  aria-pressed={isSelected}
                  disabled={settledShiftCount > 0}
                  onClick={() => selectSession(session)}
                  className={cn(
                    'flex min-h-11 items-center justify-center gap-1.5 rounded-sm border text-body-sm font-medium transition-colors duration-fast ease-standard disabled:cursor-not-allowed disabled:opacity-50',
                    isSelected
                      ? 'border-accent bg-accent-soft text-accent-ink'
                      : 'border-line text-ink-muted hover:border-line-strong',
                    focusRingOnSurfaceClasses
                  )}
                >
                  <Icon size={15} aria-hidden="true" />
                  {session === 'morning' ? 'Ca sáng' : 'Ca chiều'}
                </button>
              );
            })}
          </div>
          {errors.session && (
            <p role="alert" className="text-label text-danger">
              {errors.session}
            </p>
          )}
          {!errors.session && (
            <p className="text-label text-ink-muted">
              {settledShiftCount > 0
                ? 'Không thể đổi ca vì sự kiện đã có ca đã trả hoặc đã ứng.'
                : 'Giờ bắt đầu tự điền theo ca; có thể sửa ở mục Thông tin.'}
            </p>
          )}

          {selectedSession && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Lương mỗi người" hint="VND">
                  <Input
                    leadingIcon={<Banknote size={15} aria-hidden="true" />}
                    type="number"
                    min={0}
                    step={1000}
                    inputMode="numeric"
                    value={amount || ''}
                    onChange={(event) =>
                      setAmount(Math.max(0, Math.trunc(Number(event.target.value) || 0)))
                    }
                    placeholder="0"
                  />
                </Field>
                <Field label="Phụ phí" hint="VND">
                  <Input
                    leadingIcon={<Banknote size={15} aria-hidden="true" />}
                    type="number"
                    min={0}
                    step={1000}
                    inputMode="numeric"
                    value={surcharge || ''}
                    onChange={(event) =>
                      setSurcharge(Math.max(0, Math.trunc(Number(event.target.value) || 0)))
                    }
                    placeholder="0"
                  />
                </Field>
              </div>

              {surcharge > 0 && (
                <div className="space-y-2">
                  <p className="text-body-sm font-medium text-ink">Phân phối phụ phí</p>
                  <RadioGroup
                    value={distributionType}
                    onValueChange={(value) => {
                      setDistributionType(value as 'equal' | 'selected');
                      clearError('surcharge');
                    }}
                    className="grid gap-1 sm:grid-cols-2"
                  >
                    <label
                      htmlFor="surcharge-equal"
                      className="flex min-h-11 cursor-pointer items-center gap-2 text-body-sm text-ink-soft"
                    >
                      <RadioGroupItem value="equal" id="surcharge-equal" />
                      Chia đều
                    </label>
                    <label
                      htmlFor="surcharge-selected"
                      className="flex min-h-11 cursor-pointer items-center gap-2 text-body-sm text-ink-soft"
                    >
                      <RadioGroupItem value="selected" id="surcharge-selected" />
                      Chọn người nhận
                    </label>
                  </RadioGroup>

                  <p className="font-mono text-label text-ink-muted">
                    {distributionType === 'equal'
                      ? `Chia đều ${formatCurrency(perPerson)}/người`
                      : selectedSurchargeIds.length > 0
                        ? `${selectedSurchargeIds.length} người · ${formatCurrency(perPerson)}/người`
                        : 'Chưa chọn người nhận'}
                  </p>

                  {distributionType === 'selected' && (
                    <div className="max-h-48 divide-y divide-line overflow-y-auto border border-line">
                      {assignedIds.length === 0 ? (
                        <p className="px-3 py-2 text-label text-ink-muted">
                          Chọn nhân viên ở mục Phân công trước.
                        </p>
                      ) : (
                        assignedIds.map((employeeId) => {
                          const employee = employees.find((item) => item.id === employeeId);
                          if (!employee) return null;
                          return (
                            <div key={employeeId} className="px-3">
                              <Checkbox
                                id={`surcharge-${employeeId}`}
                                checked={surchargeSelectedEmployees[employeeId] || false}
                                onChange={() => toggleSurchargeEmployee(employeeId)}
                              >
                                <span className="block truncate text-body-sm text-ink">
                                  {employee.name}
                                </span>
                              </Checkbox>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {errors.surcharge && (
                    <p role="alert" className="text-label text-danger">
                      {errors.surcharge}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </FormSection>

        {selectedSession && (
          <FormSection title="Phân công">
            <div className="flex items-center justify-between gap-2">
              <p className="text-body-sm text-ink">Đang chọn {assignedIds.length} người</p>
            </div>
            {settledShiftCount > 0 && (
              <p className="text-label text-ink-muted">
                {settledShiftCount} ca đã trả hoặc đã ứng được giữ nguyên khi sửa sự kiện.
              </p>
            )}
            <SearchInput
              aria-label="Tìm nhân viên"
              placeholder="Tìm nhân viên"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onClear={() => setSearchTerm('')}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.preventDefault();
              }}
            />
            <EmployeeAssignmentList
              employees={employees}
              shiftCounts={employeeShiftCounts}
              assignments={assignments}
              initialSelectedIds={initialSelectedIds}
              lockedIds={settledEmployeeIds}
              searchTerm={searchTerm}
              countsLoaded={countsLoaded}
              onToggle={toggleAssignment}
            />
            {errors.employees && (
              <p role="alert" className="text-label text-danger">
                {errors.employees}
              </p>
            )}
          </FormSection>
        )}
      </form>
    </Modal>
  );
};
