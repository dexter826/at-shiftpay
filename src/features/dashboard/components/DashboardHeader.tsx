import React, { memo } from 'react';
import { Download } from 'lucide-react';
import type { User } from 'firebase/auth';
import Button from '@/components/ui/Button';

interface DashboardHeaderProps {
  user: User | null;
  onOpenExport: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onOpenExport }) => {
  return (
    <div className={`hidden md:block py-4 px-6 border-b border-line`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={user?.photoURL || '/avatar.png'}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-accent"
            onError={(e) => {
              e.currentTarget.src = '/avatar.png';
            }}
          />
          <div>
            <p className={`text-sm text-ink-soft`}>Xin chào,</p>
            <h2 className={`text-lg font-semibold text-ink`}>
              {user?.displayName || user?.email?.split('@')[0] || 'Người dùng'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={onOpenExport}
            variant="primary"
            className="flex items-center gap-2"
            icon={<Download size={18} />}
          >
            <span>Xuất báo cáo</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardHeader);
