import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Briefcase, Save, Loader2 } from 'lucide-react';
import { UserSettings } from '@/types/index';
import { settingsService } from '@/lib/api/settingsService';
import { useToast } from '@/components/ui/ToastProvider';
import Button from '@/components/ui/Button';
import { TimePicker } from '@/components/ui/TimePicker';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import { DURATION_BASE, EASE_STANDARD } from '@/lib/motion';

interface WorkConfigSectionProps {
  userUid: string;
  settings: UserSettings;
}

const WorkConfigSection: React.FC<WorkConfigSectionProps> = ({ userUid, settings }) => {
  const { showToast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [editSettings, setEditSettings] = useState<UserSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- draft form mirrors the settings prop
    setEditSettings(settings); // Sync with props when they change
  }, [settings]);

  const hasChanges = JSON.stringify(editSettings) !== JSON.stringify(settings);

  const handleChange = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setEditSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancelSettings = () => {
    setEditSettings(settings);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await settingsService.updateSettings(userUid, editSettings);
      showToast('Đã lưu cài đặt', 'success');
    } catch (err) {
      console.error(err);
      showToast('Có lỗi xảy ra', 'error');
    }
    setSaving(false);
  };

  return (
    <section>
      <div className={`flex items-center gap-2 mb-4 px-1 text-title font-semibold text-ink`}>
        <Briefcase size={16} />
        <span>Cấu hình công việc</span>
      </div>

      <div className={`bg-surface rounded-md border border-line`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Mức lương */}
          <div className={`p-4 border-b sm:border-r lg:border-b-0 border-line`}>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="settings-shift-rate"
                className={`text-label font-medium text-ink-muted`}
              >
                Mức lương / ca
              </label>
              <span
                className={`text-label font-medium text-ink-muted px-2 py-[3px] rounded-xs bg-surface-2`}
              >
                VNĐ
              </span>
            </div>
            <input
              id="settings-shift-rate"
              type="number"
              value={editSettings.shiftRate}
              onChange={(e) => handleChange('shiftRate', Number(e.target.value))}
              className={`w-full p-2.5 min-h-10 rounded-sm border border-line bg-surface-2 text-ink text-body-sm tabular-nums placeholder:text-ink-muted focus:outline-none hover:border-ink-muted ${focusRingOnSurfaceClasses}`}
            />
            <p className={`text-body-sm text-ink-muted mt-2`}>Áp dụng cho các ca làm việc mới</p>
          </div>

          {/* Giờ trực - Sáng */}
          <div className={`p-4 border-b lg:border-r lg:border-b-0 border-line`}>
            <div role="group" aria-labelledby="settings-morning-label">
              <span
                id="settings-morning-label"
                className={`block text-label font-medium text-ink-muted mb-2`}
              >
                Giờ bắt đầu ca sáng
              </span>
              <TimePicker
                value={editSettings.morningTime}
                onChange={(v) => handleChange('morningTime', v)}
              />
            </div>
          </div>

          {/* Giờ trực - Chiều */}
          <div className="p-4">
            <div role="group" aria-labelledby="settings-afternoon-label">
              <span
                id="settings-afternoon-label"
                className={`block text-label font-medium text-ink-muted mb-2`}
              >
                Giờ bắt đầu ca chiều
              </span>
              <TimePicker
                value={editSettings.afternoonTime}
                onChange={(v) => handleChange('afternoonTime', v)}
              />
            </div>
          </div>
        </div>

        {/* Nút thao tác khi có thay đổi */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: DURATION_BASE, ease: EASE_STANDARD }
              }
              className="overflow-hidden"
            >
              <div className={`p-4 border-t border-line flex items-center justify-end gap-3`}>
                <Button onClick={handleCancelSettings} disabled={saving} variant="outline">
                  Hủy
                </Button>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WorkConfigSection;
