import React, { useEffect, useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';
import { Modal } from '@/components/ui/Modal';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import SearchInput from '@/components/ui/SearchInput';
import { Skeleton } from '@/components/ui/Skeleton';
import Switch from '@/components/ui/Switch';
import { Tag } from '@/components/ui/Tag';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import ThemeSwitch from '@/components/ui/ThemeSwitch';
import { TimePicker } from '@/components/ui/TimePicker';
import { useThemeStore, type ThemePreference } from '@/stores/themeStore';
import { ToastProvider, useToast } from '@/components/ui/ToastProvider';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';

const Section: React.FC<{
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ title, description, className, children }) => (
  <section className={cn('rounded-sm border border-line bg-surface p-4', className)}>
    <header>
      <h2 className="text-title text-ink">{title}</h2>
      {description && <p className="mt-1 text-body-sm text-ink-muted">{description}</p>}
    </header>
    <div className="mt-4">{children}</div>
  </section>
);

const colorTokens = [
  ['canvas', 'Canvas'],
  ['surface', 'Surface'],
  ['surface-2', 'Surface 2'],
  ['line', 'Line'],
  ['ink', 'Ink'],
  ['ink-muted', 'Ink muted'],
  ['accent', 'Accent'],
  ['accent-ink', 'Accent ink'],
  ['accent-soft', 'Accent soft'],
  ['highlight', 'Highlight'],
  ['success', 'Success'],
  ['warning', 'Warning'],
  ['danger', 'Danger'],
  ['info', 'Info'],
  ['scrim', 'Scrim'],
];

const departmentOptions: DropdownOption[] = [
  { value: 'pha-che', label: 'Pha chế' },
  { value: 'phuc-vu', label: 'Phục vụ' },
  { value: 'thu-ngan', label: 'Thu ngân' },
  { value: 'bep', label: 'Bếp' },
  { value: 'quan-ly', label: 'Quản lý ca' },
];

const GalleryContent: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [simpleValue, setSimpleValue] = useState('pha-che');
  const [searchValue, setSearchValue] = useState('phuc-vu');
  const [time, setTime] = useState('18:00');
  const [search, setSearch] = useState('');
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('theme');
    if (requested === 'light' || requested === 'dark' || requested === 'system') {
      useThemeStore.getState().setTheme(requested);
    }
  }, []);

  const simulateLoading = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-mono text-mono-label text-ink-muted">ShiftPay · dev only</p>
            <h1 className="text-title text-ink">Gallery Bảng ca</h1>
          </div>
          <div className="flex items-center gap-2">
            <Tag variant="highlight">Bảng ca</Tag>
            <ThemeSwitch />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 p-4 md:grid-cols-2">
        <Section title="Màu" description="Semantic token; đổi theme bằng nút ở header.">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {colorTokens.map(([token, label]) => (
              <div key={token} className="overflow-hidden rounded-sm border border-line">
                <div className="h-9" style={{ background: `var(--color-${token})` }} />
                <div className="border-t border-line px-2 py-1.5">
                  <p className="text-label text-ink">{label}</p>
                  <p className="font-mono text-mono-label text-ink-muted">{token}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Kiểu chữ" description="IBM Plex Sans + IBM Plex Mono.">
          <div className="space-y-3">
            <p className="text-display">Chào buổi sáng, Minh</p>
            <p className="text-title">Bảng ca tuần 44</p>
            <p className="text-body">Quản lý ca làm và lương của Anh Thư trong một màn hình.</p>
            <p className="text-body-sm text-ink-muted">
              Ca sáng bắt đầu lúc 08:00, cần thêm 2 phục vụ trước 17:00.
            </p>
            <p className="text-label text-ink-muted">NHÃN · 12PX</p>
            <p className="text-mono-label font-mono text-ink-muted">08:00 — 12:00 · Q1</p>
            <p className="text-data font-mono">24.850.000đ</p>
          </div>
        </Section>

        <Section title="Nút" className="md:col-span-2" description="Biến thể, trạng thái, loading.">
          <div className="flex flex-wrap items-center gap-2">
            <Button icon={<Plus size={16} />}>Xếp ca</Button>
            <Button variant="secondary">Xuất bảng lương</Button>
            <Button variant="outline">Tải tuần</Button>
            <Button variant="danger">Hủy ca</Button>
            <Button variant="success">Đã chốt</Button>
            <Button variant="warning">Chờ xác nhận</Button>
            <Button disabled>Không khả dụng</Button>
            <Button loading={loading} onClick={simulateLoading}>
              Lưu thay đổi
            </Button>
          </div>
        </Section>

        <Section title="Form" description="Label, hint, error, hit area 44px.">
          <div className="grid gap-4">
            <Field label="Email" hint="Dùng email công ty.">
              <Input type="email" placeholder="minh@anhthu.vn" />
            </Field>
            <Field label="Mã địa điểm" error="Mã chỉ gồm chữ và số.">
              <Input defaultValue="Q1-!" />
            </Field>
            <Field label="Ghi chú ca">
              <Textarea placeholder="Ghi chú cho quản lý ca..." />
            </Field>
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onClear={() => setSearch('')}
              placeholder="Tìm nhân viên..."
            />
            <div className="flex flex-wrap items-center gap-5">
              <Checkbox checked={checked} onChange={setChecked} label="Gửi nhắc trước 16:00" />
              <Switch checked={switchOn} onCheckedChange={setSwitchOn} label="Tự động chốt ca" />
            </div>
            <div>
              <p className="mb-2 text-body-sm font-medium text-ink">Giao diện</p>
              <RadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as ThemePreference)}
                aria-label="Giao diện"
              >
                {[
                  ['system', 'Hệ thống'],
                  ['light', 'Sáng'],
                  ['dark', 'Tối'],
                ].map(([value, label]) => (
                  <label
                    key={value}
                    className="flex min-h-11 cursor-pointer items-center gap-2 text-body-sm text-ink"
                  >
                    <RadioGroupItem value={value} id={`theme-${value}`} />
                    <span>{label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>
        </Section>

        <Section title="Chọn" description="Dropdown thường, tìm kiếm, giờ/phút.">
          <div className="grid gap-4">
            <div>
              <p className="mb-1.5 text-body-sm font-medium text-ink">Bộ phận</p>
              <Dropdown
                options={departmentOptions}
                value={simpleValue}
                onChange={setSimpleValue}
                ariaLabel="Bộ phận"
              />
            </div>
            <div>
              <p className="mb-1.5 text-body-sm font-medium text-ink">Tìm bộ phận</p>
              <Dropdown
                options={departmentOptions}
                value={searchValue}
                onChange={setSearchValue}
                searchable
                ariaLabel="Tìm bộ phận"
                searchPlaceholder="Gõ để lọc..."
              />
            </div>
            <div>
              <p className="mb-1.5 text-body-sm font-medium text-ink">Giờ bắt đầu</p>
              <TimePicker value={time} onChange={setTime} />
            </div>
            <Dropdown
              options={departmentOptions}
              value=""
              onChange={() => undefined}
              placeholder="Đang khóa"
              disabled
              ariaLabel="Bộ phận bị khóa"
            />
          </div>
        </Section>

        <Section title="Overlay" description="Modal, tooltip, toast.">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Mở modal
            </Button>
            <Tooltip content="Mở cài đặt ca">
              <button
                type="button"
                aria-label="Cài đặt ca"
                className="flex h-11 w-11 items-center justify-center rounded-sm border border-line text-ink-muted hover:text-ink"
              >
                <Settings size={18} aria-hidden="true" />
              </button>
            </Tooltip>
            <Button variant="success" onClick={() => showToast('Đã lưu ca sáng.', 'success')}>
              Toast thành công
            </Button>
            <Button variant="warning" onClick={() => showToast('2 ca cần xác nhận.', 'warning')}>
              Toast cảnh báo
            </Button>
            <Button variant="danger" onClick={() => showToast('Không thể lưu ca.', 'error')}>
              Toast lỗi
            </Button>
          </div>
        </Section>

        <Section title="Tabs" description="Radix Tabs với bàn phím.">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="shifts">Ca làm</TabsTrigger>
              <TabsTrigger value="pay">Lương</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="text-body-sm text-ink-muted">
              Tuần 44 có 48 ca, 6 ca cần xếp.
            </TabsContent>
            <TabsContent value="shifts" className="text-body-sm text-ink-muted">
              Ca sáng bắt đầu 08:00 tại Quận 1.
            </TabsContent>
            <TabsContent value="pay" className="text-body-sm text-ink-muted">
              Lương dự kiến tuần này: 24.850.000đ.
            </TabsContent>
          </Tabs>
        </Section>

        <Section title="Dữ liệu" description="Tag, skeleton, loader.">
          <div className="flex flex-wrap gap-2">
            <Tag>Nháp</Tag>
            <Tag variant="success">Đã chốt</Tag>
            <Tag variant="warning">Chờ chốt</Tag>
            <Tag variant="danger">Hủy</Tag>
            <Tag variant="info">Đã ứng</Tag>
            <Tag variant="highlight">Cần xếp</Tag>
          </div>
          <div className="mt-4 grid gap-2">
            <Skeleton height={18} />
            <Skeleton height={18} width="70%" />
            <Skeleton variant="rectangular" height={72} />
          </div>
          <div className="mt-4 rounded-sm border border-dashed border-line">
            <Loader fullScreen={false} />
          </div>
        </Section>
      </main>

      <Modal
        title="Xác nhận xếp ca"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                setModalOpen(false);
                showToast('Đã xếp ca sáng.', 'success');
              }}
            >
              Xếp ca
            </Button>
          </div>
        }
      >
        <p className="text-body-sm text-ink-muted">
          Ca sáng 08:00–12:00 tại Quận 1 sẽ được giao cho Nguyễn An.
        </p>
      </Modal>
    </div>
  );
};

const Gallery: React.FC = () => (
  <ToastProvider>
    <GalleryContent />
  </ToastProvider>
);

export default Gallery;
