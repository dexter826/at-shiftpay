import React from 'react';

interface BankCardProps {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

const BankCard: React.FC<BankCardProps> = ({
  bankName = 'Ngân hàng',
  accountNumber = '—',
  accountName = 'Chưa có tên chủ tài khoản',
}) => {
  return (
    <div className="w-full max-w-[320px] aspect-[1.586/1] border border-line rounded-md bg-surface p-5 flex flex-col justify-between">
      <div>
        <p className="text-label text-ink-muted">Hệ thống thanh toán</p>
        <h3 className="text-title font-semibold tracking-tight text-ink">{bankName}</h3>
      </div>

      <div>
        <p className="text-label text-ink-muted">Số tài khoản</p>
        <p className="text-body font-semibold text-ink tabular-nums">{accountNumber}</p>
      </div>

      <div className="min-w-0">
        <p className="text-label text-ink-muted">Chủ tài khoản</p>
        <p className="text-body-sm font-semibold text-ink truncate">{accountName}</p>
      </div>
    </div>
  );
};

export default BankCard;
