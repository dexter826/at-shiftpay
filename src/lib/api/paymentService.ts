import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  runTransaction,
  query,
  where,
  orderBy,
  getDocs,
  Unsubscribe,
} from 'firebase/firestore';
import { PaymentTransaction } from '@/types/index';
import { createRealtimeSubscription } from '@/lib/api/firebaseService';
import { PaymentTransactionSchema } from '@/utils/validation';

const ALREADY_SETTLED_MESSAGE = 'Khoản ứng đã được quyết toán';
const SHIFT_NOT_UNPAID_MESSAGE = 'Ca làm đã được thanh toán hoặc ứng trước';
const SHIFT_NOT_ADVANCED_MESSAGE = 'Ca làm không còn ở trạng thái ứng lương';

export const paymentService = {
  subscribePayments(
    userId: string,
    callback: (payments: PaymentTransaction[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, 'payments'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    return createRealtimeSubscription<PaymentTransaction>(
      q,
      callback,
      'subscribePayments',
      PaymentTransactionSchema
    );
  },

  async createPaymentTransaction(
    paymentData: Omit<PaymentTransaction, 'id'>,
    shiftIds: string[]
  ): Promise<void> {
    try {
      const paymentRef = doc(collection(db, 'payments'));
      const shiftStatus = paymentData.type === 'advance' ? 'advanced' : 'paid';

      await runTransaction(db, async (transaction) => {
        for (const shiftId of shiftIds) {
          const snapshot = await transaction.get(doc(db, 'shifts', shiftId));
          if (!snapshot.exists()) {
            throw new Error(`Ca làm ${shiftId} không tồn tại`);
          }
          if (snapshot.data().status !== 'unpaid') {
            throw new Error(SHIFT_NOT_UNPAID_MESSAGE);
          }
        }

        transaction.set(paymentRef, paymentData);

        for (const shiftId of shiftIds) {
          transaction.update(doc(db, 'shifts', shiftId), {
            status: shiftStatus,
            paidAt: paymentData.date,
            paymentId: paymentRef.id,
          });
        }
      });
    } catch (error) {
      console.error('createPaymentTransaction error:', error);
      throw new Error(
        `Không thể tạo giao dịch thanh toán: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`
      );
    }
  },

  async createAdvancePayment(
    paymentData: Omit<PaymentTransaction, 'id' | 'type'>,
    shiftIds: string[]
  ): Promise<void> {
    await paymentService.createPaymentTransaction({ ...paymentData, type: 'advance' }, shiftIds);
  },

  async settleAdvancePayment(
    employeeId: string,
    employeeName: string,
    advancePaymentIds: string[],
    shiftIds: string[],
    totalAmount: number,
    userId: string
  ): Promise<void> {
    try {
      const now = Date.now();
      const settlementRef = doc(collection(db, 'payments'));

      await runTransaction(db, async (transaction) => {
        for (const paymentId of advancePaymentIds) {
          const snapshot = await transaction.get(doc(db, 'payments', paymentId));
          if (!snapshot.exists() || snapshot.data().settledAt) {
            throw new Error(ALREADY_SETTLED_MESSAGE);
          }
        }

        for (const shiftId of shiftIds) {
          const snapshot = await transaction.get(doc(db, 'shifts', shiftId));
          if (!snapshot.exists() || snapshot.data().status !== 'advanced') {
            throw new Error(SHIFT_NOT_ADVANCED_MESSAGE);
          }
        }

        transaction.set(settlementRef, {
          employeeId,
          employeeName,
          amount: totalAmount,
          date: now,
          shiftIds,
          type: 'settlement',
          note: 'Quyết toán tiền ứng',
          userId: userId,
        });

        for (const paymentId of advancePaymentIds) {
          transaction.update(doc(db, 'payments', paymentId), {
            settledAt: now,
            settledBy: settlementRef.id,
          });
        }

        for (const shiftId of shiftIds) {
          transaction.update(doc(db, 'shifts', shiftId), {
            status: 'paid',
            paidAt: now,
            paymentId: settlementRef.id,
          });
        }
      });
    } catch (error) {
      console.error('settleAdvancePayment error:', error);
      throw new Error(
        `Không thể quyết toán tiền ứng: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`
      );
    }
  },

  async getUnsettledAdvances(employeeId: string, userId: string): Promise<PaymentTransaction[]> {
    try {
      const q = query(
        collection(db, 'payments'),
        where('userId', '==', userId),
        where('employeeId', '==', employeeId),
        where('type', '==', 'advance'),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      const payments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PaymentTransaction[];

      return payments.filter((p) => !p.settledAt);
    } catch (error) {
      console.error('getUnsettledAdvances error:', error);
      return [];
    }
  },
};
