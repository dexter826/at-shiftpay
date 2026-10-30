import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Loader2, RotateCcw } from 'lucide-react';
import { deleteField } from 'firebase/firestore';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Field } from '@/components/ui/Field';
import { FormSection } from '@/components/ui/FormSection';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';
import { ImageCropperModal } from '@/components/ImageCropperModal';
import { imageService } from '@/lib/api/imageService';
import { employeeService } from '@/lib/api/employeeService';
import { vietQRService, type VietQRBank } from '@/lib/api/vietqrService';
import { Employee, BankAccount } from '@/types/index';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingEmployee: Employee | null;
  employees: Employee[];
  userId: string;
}

interface EmployeeFormErrors {
  name?: string;
  phone?: string;
  bank?: string;
}

const formatPhone = (value: string) => value.replace(/[^0-9]/g, '').slice(0, 11);

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  editingEmployee,
  employees,
  userId,
}) => {
  const { showToast } = useToast();

  const [name, setName] = useState(editingEmployee?.name ?? '');
  const [phone, setPhone] = useState(editingEmployee?.phone ?? '');
  const [imageUrl, setImageUrl] = useState(editingEmployee?.imageUrl ?? '');
  const [imageError, setImageError] = useState(false);

  const [bankList, setBankList] = useState<VietQRBank[]>([]);
  const [bankListLoading, setBankListLoading] = useState(true);
  const [bankId, setBankId] = useState(editingEmployee?.bankAccount?.bankId ?? '');
  const [bankName, setBankName] = useState(editingEmployee?.bankAccount?.bankName ?? '');
  const [accountNumber, setAccountNumber] = useState(
    editingEmployee?.bankAccount?.accountNumber ?? ''
  );
  const [accountName, setAccountName] = useState(editingEmployee?.bankAccount?.accountName ?? '');

  const [errors, setErrors] = useState<EmployeeFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    vietQRService
      .getBankList()
      .then((banks) => {
        if (active) setBankList(banks);
      })
      .finally(() => {
        if (active) setBankListLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const bankOptions = useMemo(() => {
    const options = [
      { value: '', label: 'Không dùng ngân hàng' },
      ...bankList.map((bank) => ({
        value: bank.bin,
        label: `${bank.shortName} - ${bank.name}`,
      })),
    ];

    if (bankId && !bankList.some((bank) => bank.bin === bankId)) {
      options.splice(1, 0, {
        value: bankId,
        label: bankName || editingEmployee?.bankAccount?.bankName || 'Ngân hàng đã lưu',
      });
    }

    return options;
  }, [bankList, bankId, bankName, editingEmployee]);

  const hasChanges = useMemo(() => {
    if (!editingEmployee) return name.trim().length > 0;

    return (
      name.trim() !== editingEmployee.name.trim() ||
      phone.trim() !== editingEmployee.phone.trim() ||
      imageUrl.trim() !== (editingEmployee.imageUrl ?? '').trim() ||
      bankId !== (editingEmployee.bankAccount?.bankId ?? '') ||
      bankName !== (editingEmployee.bankAccount?.bankName ?? '') ||
      accountNumber.trim() !== (editingEmployee.bankAccount?.accountNumber ?? '').trim() ||
      accountName.trim() !== (editingEmployee.bankAccount?.accountName ?? '').trim()
    );
  }, [editingEmployee, name, phone, imageUrl, bankId, bankName, accountNumber, accountName]);

  const clearBankError = () => {
    if (errors.bank) setErrors((previous) => ({ ...previous, bank: undefined }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn file ảnh.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropComplete = async (croppedFile: File) => {
    setIsUploading(true);
    try {
      const url = await imageService.uploadImage(croppedFile);
      setImageUrl(url);
      setImageError(false);
      showToast('Đã tải ảnh lên.', 'success');
    } catch (error) {
      console.error('Upload failed:', error);
      showToast('Không thể tải ảnh lên. Thử lại.', 'error');
    } finally {
      setIsUploading(false);
      setTempImage(null);
    }
  };

  const validate = () => {
    const nextErrors: EmployeeFormErrors = {};
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      nextErrors.name = 'Nhập họ tên.';
    }

    if (trimmedPhone) {
      if (!/^\d{9,11}$/.test(trimmedPhone)) {
        nextErrors.phone = 'Số điện thoại phải có 9–11 chữ số.';
      } else if (
        (!editingEmployee || trimmedPhone !== editingEmployee.phone.trim()) &&
        employees.some(
          (employee) =>
            employee.id !== editingEmployee?.id && employee.phone.trim() === trimmedPhone
        )
      ) {
        nextErrors.phone = 'Số điện thoại này đã có trong sổ.';
      }
    }

    const hasAnyBank = Boolean(bankId || accountNumber || accountName);
    const hasFullBank = Boolean(bankId && accountNumber && accountName);
    if (hasAnyBank && !hasFullBank) {
      nextErrors.bank = 'Điền đủ ngân hàng, số tài khoản và chủ tài khoản hoặc để trống.';
    } else if (hasFullBank) {
      const validation = vietQRService.validateBankAccount(accountNumber, accountName);
      if (!validation.valid) {
        nextErrors.bank = validation.error || 'Thông tin ngân hàng không hợp lệ.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting || isUploading || !validate()) return;

    const bankAccount: BankAccount | null =
      bankId && accountNumber && accountName
        ? {
            bankId,
            bankName,
            accountNumber: accountNumber.trim(),
            accountName: accountName.trim(),
          }
        : null;

    const employeeData: {
      name: string;
      phone: string;
      imageUrl?: string;
      bankAccount?: BankAccount;
    } = {
      name: name.trim(),
      phone: phone.trim(),
    };

    if (imageUrl.trim()) employeeData.imageUrl = imageUrl.trim();
    if (bankAccount) employeeData.bankAccount = bankAccount;
    else if (editingEmployee) {
      (employeeData as Record<string, unknown>).bankAccount = deleteField();
    }

    setIsSubmitting(true);
    try {
      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee.id, employeeData);
        showToast('Đã cập nhật nhân viên.', 'success');
      } else {
        await employeeService.addEmployee(employeeData, userId);
        showToast('Đã thêm nhân viên.', 'success');
      }
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      showToast('Không thể lưu nhân viên. Thử lại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBank = () => {
    setBankId('');
    setBankName('');
    setAccountNumber('');
    setAccountName('');
    clearBankError();
  };

  const hint = isUploading
    ? 'Đang tải ảnh…'
    : !hasChanges
      ? editingEmployee
        ? 'Chưa có thay đổi để lưu.'
        : 'Nhập họ tên để lưu.'
      : null;

  return (
    <>
      <Modal
        title={editingEmployee ? 'Sửa hồ sơ' : 'Thêm nhân viên'}
        isOpen={isOpen && !cropperOpen}
        onClose={onClose}
        footer={
          <div className="space-y-2">
            {hint && <p className="text-center text-label text-ink-muted">{hint}</p>}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting || isUploading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                form="employee-form"
                className="flex-1"
                loading={isSubmitting}
                disabled={!hasChanges || isUploading}
              >
                {editingEmployee ? 'Cập nhật' : 'Lưu'}
              </Button>
            </div>
          </div>
        }
      >
        <form
          id="employee-form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
          className="space-y-5"
          noValidate
        >
          <FormSection title="Thông tin">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => !isUploading && fileInputRef.current?.click()}
                aria-label="Đổi ảnh đại diện"
                className={cn(
                  'relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-line bg-surface-2 text-ink-muted transition-colors duration-fast ease-standard hover:border-line-strong',
                  focusRingOnSurfaceClasses
                )}
              >
                {imageUrl && !imageError ? (
                  <img
                    src={imageUrl}
                    alt="Ảnh đại diện"
                    onError={() => setImageError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera size={24} aria-hidden="true" />
                )}
                {isUploading && (
                  <span className="absolute inset-0 flex items-center justify-center bg-surface/90">
                    <Loader2 size={24} aria-hidden="true" className="animate-spin text-ink" />
                  </span>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-label text-ink-muted">Nhấn để đổi ảnh</p>
            </div>

            <Field label="Họ tên" required error={errors.name}>
              <Input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (errors.name) setErrors((previous) => ({ ...previous, name: undefined }));
                }}
                placeholder="Ví dụ: Nguyễn Minh Anh"
                autoComplete="name"
                autoFocus
              />
            </Field>

            <Field label="Số điện thoại" hint="Tùy chọn, 9–11 chữ số." error={errors.phone}>
              <Input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(event) => {
                  setPhone(formatPhone(event.target.value));
                  if (errors.phone) setErrors((previous) => ({ ...previous, phone: undefined }));
                }}
                placeholder="Ví dụ: 0901234567"
                autoComplete="tel"
              />
            </Field>
          </FormSection>

          <FormSection title="Ngân hàng (tùy chọn)">
            <div className="flex items-center justify-between gap-2">
              <p className="text-label text-ink-muted">Dùng để chuyển khoản lương.</p>
              {(bankId || bankName || accountNumber || accountName) && (
                <Button
                  variant="outline"
                  onClick={resetBank}
                  icon={<RotateCcw size={14} />}
                  className="shrink-0 px-2.5 text-label"
                >
                  Xóa thông tin ngân hàng
                </Button>
              )}
            </div>

            <Field label="Ngân hàng">
              <Dropdown
                options={bankOptions}
                value={bankId}
                onChange={(value) => {
                  if (!value) {
                    setBankId('');
                    setBankName('');
                  } else {
                    const selectedBank = bankList.find((bank) => bank.bin === value);
                    setBankId(value);
                    setBankName(
                      selectedBank?.shortName ||
                        (value === editingEmployee?.bankAccount?.bankId
                          ? editingEmployee?.bankAccount?.bankName || ''
                          : '')
                    );
                  }
                  clearBankError();
                }}
                ariaLabel="Ngân hàng"
                placeholder="Chọn ngân hàng"
                searchable
                searchPlaceholder="Tìm ngân hàng"
                disabled={bankListLoading}
                className="w-full"
                minWidth="w-full"
              />
            </Field>
            {bankListLoading && (
              <p className="text-label text-ink-muted">Đang tải danh sách ngân hàng…</p>
            )}

            <Field label="Số tài khoản">
              <Input
                value={accountNumber}
                onChange={(event) => {
                  setAccountNumber(event.target.value.replace(/[^0-9]/g, '').slice(0, 20));
                  clearBankError();
                }}
                inputMode="numeric"
                placeholder="Ví dụ: 0123456789"
                className="tabular-nums"
              />
            </Field>

            <Field label="Chủ tài khoản" hint="Viết hoa, không dấu.">
              <Input
                value={accountName}
                onChange={(event) => {
                  setAccountName(event.target.value.toUpperCase());
                  clearBankError();
                }}
                placeholder="Ví dụ: NGUYEN MINH ANH"
              />
            </Field>

            {errors.bank && (
              <p role="alert" className="text-label text-danger">
                {errors.bank}
              </p>
            )}
          </FormSection>
        </form>
      </Modal>

      {tempImage && (
        <ImageCropperModal
          isOpen={cropperOpen}
          onClose={() => {
            setCropperOpen(false);
            setTempImage(null);
          }}
          image={tempImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
};

export default React.memo(EmployeeFormModal);
