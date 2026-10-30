import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  writeBatch,
  Unsubscribe,
  query,
  where
} from 'firebase/firestore';
import { Event, Shift } from '@/types/index';
import { buildMonthRangeQuery, createRealtimeSubscription, executeBatchQuery, executeBatchWithRetry } from '@/lib/api/firebaseService';
import { EventSchema } from '@/utils/validation';

export const eventService = {
  subscribeEventsByMonth(userId: string, month: number, year: number, callback: (events: Event[]) => void): Unsubscribe {
    const q = buildMonthRangeQuery({
      collectionName: 'events',
      dateField: 'date',
      month,
      year,
      userId
    });
    return createRealtimeSubscription<Event>(q, callback, 'subscribeEventsByMonth', EventSchema);
  },

  async getEventsByMonth(userId: string, month: number, year: number): Promise<Event[]> {
    const q = buildMonthRangeQuery({
      collectionName: 'events',
      dateField: 'date',
      month: month - 1,
      year,
      userId
    });
    return executeBatchQuery<Event>(q, EventSchema);
  },

  async getEventsByIds(userId: string, ids: string[]): Promise<Event[]> {
    if (ids.length === 0) return [];
    // Firestore giới hạn query 'in' tối đa 30 item
    const chunks = [];
    for (let i = 0; i < ids.length; i += 30) {
      chunks.push(ids.slice(i, i + 30));
    }
 
    const results = await Promise.all(chunks.map(async (chunk) => {
      const q = query(
        collection(db, 'events'),
        where('userId', '==', userId),
        where('__name__', 'in', chunk)
      );
      return executeBatchQuery<Event>(q, EventSchema);
    }));
 
    return results.flat();
  },

  async createEventWithShifts(eventData: Omit<Event, 'id'>, shiftsData: Omit<Shift, 'id'>[]): Promise<void> {
    try {
      await executeBatchWithRetry(async () => {
        const batch = writeBatch(db);

        const eventRef = doc(collection(db, 'events'));
        batch.set(eventRef, { ...eventData, userId: (eventData as any).userId || shiftsData[0]?.userId || '' });
 
        shiftsData.forEach(shiftData => {
          const shiftRef = doc(collection(db, 'shifts'));
          batch.set(shiftRef, { ...shiftData, eventId: eventRef.id });
        });

        await batch.commit();
      });
    } catch (error) {
      console.error('createEventWithShifts error:', error);
      throw new Error(`Không thể tạo sự kiện và ca làm: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  },

  async batchUpdateEvent(
    eventId: string,
    eventData: Partial<Event>,
    shifts: {
      create: Omit<Shift, 'id'>[],
      update: { id: string, data: Partial<Shift> }[],
      delete: string[]
    }
  ): Promise<void> {
    try {
      await executeBatchWithRetry(async () => {
        const batch = writeBatch(db);

        const eventRef = doc(db, 'events', eventId);
        batch.update(eventRef, eventData);

        shifts.create.forEach(shiftData => {
          const shiftRef = doc(collection(db, 'shifts'));
          batch.set(shiftRef, { ...shiftData, eventId });
        });

        shifts.update.forEach(({ id, data }) => {
          const shiftRef = doc(db, 'shifts', id);
          batch.update(shiftRef, data);
        });

        shifts.delete.forEach(id => {
          batch.delete(doc(db, 'shifts', id));
        });

        await batch.commit();
      });
    } catch (error) {
      console.error('batchUpdateEvent error:', error);
      throw new Error(`Không thể cập nhật sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  },

  async deleteEventWithShifts(eventId: string, shiftIds: string[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      batch.delete(doc(db, 'events', eventId));

      shiftIds.forEach(id => {
        batch.delete(doc(db, 'shifts', id));
      });

      await batch.commit();
    } catch (error) {
      console.error('deleteEventWithShifts error:', error);
      throw new Error(`Không thể xóa sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  },
};
