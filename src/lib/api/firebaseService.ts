import { collection, query, where, orderBy, onSnapshot, getDocs, Unsubscribe, Query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { safeValidate } from '@/utils/validation';
import { z } from 'zod';

interface DateRangeQuery {
  collectionName: string;
  dateField: string;
  month: number;
  year: number;
  userId: string;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}

export function buildMonthRangeQuery({
  collectionName,
  dateField,
  month,
  year,
  userId,
  orderByField,
  orderDirection = 'desc',
}: DateRangeQuery): Query {
  // month 1-12; month 0 = cả năm; month 0 + year 0 = toàn bộ thời gian
  if (month === 0 && year === 0) {
    return query(
      collection(db, collectionName),
      where('userId', '==', userId),
      orderBy(orderByField || dateField, orderDirection)
    );
  }

  const monthPart = String(month).padStart(2, '0');
  const startDate = month === 0 ? `${year}-01-01` : `${year}-${monthPart}-01`;
  const endDate =
    month === 0
      ? `${year}-12-31`
      : `${year}-${monthPart}-${String(new Date(year, month, 0).getDate()).padStart(2, '0')}`;

  return query(
    collection(db, collectionName),
    where('userId', '==', userId),
    where(dateField, '>=', startDate),
    where(dateField, '<=', endDate),
    orderBy(orderByField || dateField, orderDirection)
  );
}

export function createRealtimeSubscription<T>(
  q: Query,
  callback: (data: T[]) => void,
  errorContext: string,
  schema?: z.ZodSchema<T>,
  onError?: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    q,
    (snapshot) => {
      const rawData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (schema) {
        const validData = rawData
          .map((item) => safeValidate(schema, item))
          .filter((item): item is T => item !== null);
        callback(validData);
      } else {
        callback(rawData as T[]);
      }
    },
    (error) => {
      console.error(`Error in ${errorContext}:`, error);
      onError?.(error);
    }
  );
}

export async function executeBatchQuery<T>(q: Query, schema?: z.ZodSchema<T>): Promise<T[]> {
  const snapshot = await getDocs(q);
  const rawData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (schema) {
    return rawData
      .map((item) => safeValidate(schema, item))
      .filter((item): item is T => item !== null);
  }

  return rawData as T[];
}

const RETRYABLE_FIRESTORE_CODES = new Set([
  'aborted',
  'cancelled',
  'deadline-exceeded',
  'internal',
  'resource-exhausted',
  'unavailable',
  'unknown',
]);

function isRetryableError(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  return typeof code === 'string' && RETRYABLE_FIRESTORE_CODES.has(code);
}

export async function executeBatchWithRetry(
  batchOperation: () => Promise<void>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await batchOperation();
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`Batch operation failed (attempt ${attempt + 1}/${maxRetries}):`, error);

      if (!isRetryableError(error)) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }

  throw new Error(`Batch operation failed sau ${maxRetries} lần thử: ${lastError?.message}`, {
    cause: lastError,
  });
}
