import { db } from '@/lib/firebase';
import {
  doc,
  setDoc,
  onSnapshot,
  Unsubscribe,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  deleteDoc,
} from 'firebase/firestore';
import { UserSettings, DEFAULT_SETTINGS } from '@/types/index';
import { UserSettingsSchema } from '@/utils/validation';

export const settingsService = {
  subscribeSettings(
    userId: string,
    callback: (settings: UserSettings) => void,
    onError?: (error: unknown) => void
  ): Unsubscribe {
    const docRef = doc(db, 'settings', userId);
    return onSnapshot(
      docRef,
      (snapshot) => {
        const merged = {
          ...DEFAULT_SETTINGS,
          ...(snapshot.exists() ? snapshot.data() : {}),
          userId,
        };
        const parsed = UserSettingsSchema.safeParse(merged);
        callback(parsed.success ? parsed.data : { ...DEFAULT_SETTINGS, userId });
      },
      (error) => {
        console.error('subscribeSettings error:', error);
        onError?.(error);
      }
    );
  },

  async updateSettings(userId: string, data: Partial<UserSettings>): Promise<void> {
    try {
      const docRef = doc(db, 'settings', userId);
      await setDoc(docRef, { ...data, userId }, { merge: true });
    } catch (error) {
      console.error('updateSettings error:', error);
      throw new Error(
        `Không thể cập nhật cài đặt: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`
      );
    }
  },

  async deleteUserAccountData(userId: string): Promise<void> {
    try {
      const batch = writeBatch(db);

      batch.delete(doc(db, 'settings', userId));

      const collections = ['employees', 'locations', 'events', 'shifts', 'payments'];

      for (const collName of collections) {
        const q = query(collection(db, collName), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }

      await batch.commit();
    } catch (error) {
      console.error('deleteUserAccountData error:', error);
      throw new Error(
        `Không thể xóa dữ liệu người dùng: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`
      );
    }
  },
};
