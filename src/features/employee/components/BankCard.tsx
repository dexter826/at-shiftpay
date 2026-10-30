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
}) => {
  return (
    <div className="w-full max-w-[320px] aspect-[1.586/1] border border-line rounded-md bg-surface p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-title font-semibold text-ink">{bankName}</h3>
      </div>

      <div>
        <p className="text-label font-medium text-ink-muted">Số tài khoản</p>
        <p className="text-body font-semibold text-ink tabular-nums">{accountNumber}</p>
      </div>

      <div className="min-w-0">
        <p className="text-label font-medium text-ink-muted">Chủ tài khoản</p>
        <p className="text-body-sm font-medium text-ink truncate">{accountName}</p>
      </div>
    </div>
  );
};

export default BankCard;
