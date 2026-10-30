import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

const DashboardSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex flex-col gap-3 border-b border-line pb-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <Skeleton width={150} height={12} />
        <Skeleton width={200} height={30} />
      </div>
      <div className="flex gap-2">
        <Skeleton width={110} height={44} />
        <Skeleton width={110} height={44} />
        <Skeleton width={100} height={44} />
      </div>
    </div>
    <div className="grid grid-cols-2 border border-line md:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="space-y-2 border-l border-line p-3.5 first:border-l-0">
          <Skeleton width="50%" height={10} />
          <Skeleton width="40%" height={24} />
          <Skeleton width="60%" height={10} />
        </div>
      ))}
    </div>
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_292px]">
      <div className="border border-line bg-surface p-3.5">
        <Skeleton width="30%" height={18} />
        <Skeleton variant="rectangular" height={260} className="mt-3" />
      </div>
      <div className="border border-line bg-surface p-3.5">
        <Skeleton width="40%" height={18} />
        <div className="mt-3 space-y-3">
          <Skeleton variant="rectangular" height={70} />
          <Skeleton variant="rectangular" height={70} />
          <Skeleton variant="rectangular" height={70} />
        </div>
      </div>
    </div>
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <div className="border border-line bg-surface p-3.5">
        <Skeleton width="35%" height={18} />
        <div className="mt-3 space-y-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <Skeleton key={row} height={28} />
          ))}
        </div>
      </div>
      <div className="border border-line bg-surface p-3.5">
        <Skeleton width="45%" height={18} />
        <div className="mt-3 space-y-3">
          <Skeleton height={24} />
          <Skeleton height={24} />
          <Skeleton height={24} />
        </div>
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
