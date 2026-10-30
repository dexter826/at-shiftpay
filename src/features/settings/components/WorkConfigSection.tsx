import React, { useEffect, useState } from 'react';
import { Banknote } from 'lucide-react';
import { UserSettings } from '@/types/index';
import { settingsService } from '@/lib/api/settingsService';
import { useToast } from '@/components/ui/ToastProvider';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { TimePicker } from '@/components/ui/TimePicker';
import { formatCurrency } from '@/utils/format';

interface WorkConfigSectionProps {
  userUid: string;
  settings: UserSettings;
}

const WorkConfigSection: React.FC<WorkConfigSectionProps> = ({ userUid, settings }) => {
  const { showToast } = useToast();
  const [editSettings, setEditSettings] = useState<UserSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- draft form mirrors the settings prop
    setEditSettings(settings);
  }, [settings]);

  const hasChanges =
    editSettings.shiftRate !== settings.shiftRate ||
    editSettings.morningTime !== settings.morningTime ||
    editSettings.afternoonTime !== settings.afternoonTime;

  const handleChange = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setEditSettings((previous) => ({ ...previous, [key]: value }));
  };

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);
    try {
      await settingsService.updateSettings(userUid, {
        shiftRate: Math.max(0, Math.trunc(editSettings.shiftRate)),
        morningTime: editSettings.morningTime,
        afternoonTime: editSettings.afternoonTime,
      });
      showToast('Đã lưu cài đặt.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Không thể lưu cài đặt. Thử lại.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-line bg-surface">
      <div className="grid gap-4 p-4 sm:grid-cols-3">
        <Field label="Lương mỗi ca" hint={`VND · ${formatCurrency(editSettings.shiftRate)}`}>
          <Input
            leadingIcon={<Banknote size={15} aria-hidden="true" />}
            type="number"
            min={0}
            step={1000}
            inputMode="numeric"
            value={editSettings.shiftRate || ''}
            onChange={(event) => {
              const value = Number(event.target.value);
              handleChange(
                'shiftRate',
                Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0
              );
            }}
            placeholder="Ví dụ: 250000"
          />
        </Field>

        <div className="space-y-1.5">
          <span className="block text-body-sm font-medium text-ink">Giờ bắt đầu ca sáng</span>
          <TimePicker
            value={editSettings.morningTime}
            onChange={(value) => handleChange('morningTime', value)}
            ariaLabel="Giờ bắt đầu ca sáng"
          />
        </div>

        <div className="space-y-1.5">
          <span className="block text-body-sm font-medium text-ink">Giờ bắt đầu ca chiều</span>
          <TimePicker
            value={editSettings.afternoonTime}
            onChange={(value) => handleChange('afternoonTime', value)}
            ariaLabel="Giờ bắt đầu ca chiều"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-line p-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-label text-ink-muted">
          {hasChanges ? 'Thay đổi chưa được lưu.' : 'Chưa có thay đổi để lưu.'}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setEditSettings(settings)}
            disabled={!hasChanges || saving}
          >
            Hủy
          </Button>
          <Button onClick={handleSave} loading={saving} disabled={!hasChanges}>
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkConfigSection;
