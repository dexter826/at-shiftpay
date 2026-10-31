import React from 'react';

interface BankCardProps {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

const BankCard: React.FC<BankCardProps> = ({
  bankName = 'Ngân hàng',
  accountNumber = '**** **** **** ****',
  accountName = 'CHỦ TÀI KHOẢN',
}) => (
  <div className="w-full border border-line bg-surface p-4">
    <div>
      <p className="font-mono text-mono-label text-ink-muted">Ngân hàng</p>
      <p className="mt-0.5 text-body font-semibold text-ink">{bankName}</p>
    </div>
    <div className="mt-3">
      <p className="font-mono text-mono-label text-ink-muted">Số tài khoản</p>
      <p className="mt-0.5 font-mono text-body font-semibold tracking-wide text-ink tabular-nums break-all">
        {accountNumber}
      </p>
    </div>
    <div className="mt-3 min-w-0">
      <p className="font-mono text-mono-label text-ink-muted">Chủ tài khoản</p>
      <p className="mt-0.5 truncate text-body-sm font-medium text-ink">{accountName}</p>
    </div>
  </div>
);

export default BankCard;
