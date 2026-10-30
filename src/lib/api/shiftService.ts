import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, Unsubscribe } from 'firebase/firestore';
import { Shift } from '@/types/index';
import {
  buildMonthRangeQuery,
  createRealtimeSubscription,
  executeBatchQuery,
} from '@/lib/api/firebaseService';
import { ShiftSchema } from '@/utils/validation';

export const shiftService = {
  subscribeShiftsByMonth(
    userId: string,
    month: number,
    year: number,
    callback: (shifts: Shift[]) => void,
    onError?: (error: unknown) => void
  ): Unsubscribe {
    const q = buildMonthRangeQuery({
      collectionName: 'shifts',
      dateField: 'date',
      month,
      year,
      userId,
    });
    return createRealtimeSubscription<Shift>(
      q,
      callback,
      'subscribeShiftsByMonth',
      ShiftSchema,
      onError
    );
  },

  async getShiftsByMonth(userId: string, month: number, year: number): Promise<Shift[]> {
    const q = buildMonthRangeQuery({
      collectionName: 'shifts',
      dateField: 'date',
      month: month - 1,
      year,
      userId,
    });
    return executeBatchQuery<Shift>(q, ShiftSchema);
  },

  subscribeUnpaidShifts(
    userId: string,
    callback: (shifts: Shift[]) => void,
    onError?: (error: unknown) => void
  ): Unsubscribe {
    const q = query(
      collection(db, 'shifts'),
      where('userId', '==', userId),
      where('status', 'in', ['unpaid', 'advanced']),
      orderBy('date', 'asc')
    );
    return createRealtimeSubscription<Shift>(
      q,
      callback,
      'subscribeUnpaidShifts',
      ShiftSchema,
      onError
    );
  },

  async getUnpaidShifts(userId: string): Promise<Shift[]> {
    const q = query(
      collection(db, 'shifts'),
      where('userId', '==', userId),
      where('status', '==', 'unpaid'),
      orderBy('date', 'asc')
    );
    return executeBatchQuery<Shift>(q, ShiftSchema);
  },
};
