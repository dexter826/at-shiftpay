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
  limit,
} from 'firebase/firestore';
import { UserSettings, DEFAULT_SETTINGS } from '@/types/index';
import { UserSettingsSchema } from '@/utils/validation';

const USER_DATA_COLLECTIONS = ['employees', 'locations', 'events', 'shifts', 'payments'] as const;
const DELETE_CHUNK_SIZE = 400;

async function deleteUserCollection(collectionName: string, userId: string): Promise<void> {
  for (;;) {
    const snapshot = await getDocs(
      query(collection(db, collectionName), where('userId', '==', userId), limit(DELETE_CHUNK_SIZE))
    );
    if (snapshot.empty) return;

    const batch = writeBatch(db);
    snapshot.forEach((document) => batch.delete(document.ref));
    await batch.commit();
  }
}

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
      await deleteDoc(doc(db, 'settings', userId));

      for (const collectionName of USER_DATA_COLLECTIONS) {
        await deleteUserCollection(collectionName, userId);
      }
    } catch (error) {
      console.error('deleteUserAccountData error:', error);
      throw new Error(
        `Không thể xóa dữ liệu người dùng: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`
      );
    }
  },
};
