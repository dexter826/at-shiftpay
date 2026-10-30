import { create } from 'zustand';
import { Employee, Event, Shift, UserSettings, DEFAULT_SETTINGS, Location } from '@/types/index';
import { createLedgerSession } from '@/stores/ledgerSession';

interface AppDataState {
  // Data
  employees: Employee[];
  locations: Location[];
  events: Event[];
  shifts: Shift[];
  settings: UserSettings;

  // UI state
  isLoading: boolean;
  isCalendarLoading: boolean;
  dataError: string | null;
  viewDate: Date;

  // Computed
  totalDebt: number;

  // Actions
  setDataError: (message: string | null) => void;
  setViewDate: (date: Date) => void;
  initSubscriptions: (userId: string) => void;
  cleanupSubscriptions: () => void;
  refreshData: (userId: string) => void;
}

const LEDGER_ERROR_MESSAGE = 'Không thể tải dữ liệu. Kiểm tra kết nối và thử lại.';
const session = createLedgerSession();

export const useAppDataStore = create<AppDataState>((set, get) => ({
  // Initial data
  employees: [],
  locations: [],
  events: [],
  shifts: [],
  settings: DEFAULT_SETTINGS,

  // UI state
  isLoading: true,
  isCalendarLoading: true,
  dataError: null,
  viewDate: new Date(),

  // Computed
  totalDebt: 0,

  // Actions
  setDataError: (dataError) => set({ dataError }),
  setViewDate: (viewDate) => set({ viewDate }),

  initSubscriptions: (userId) => {
    session.start(userId, get().viewDate, {
      onBase: (patch) => set(patch),
      onLedger: (ledger) => set(ledger),
      onLoading: (loading) => set(loading),
      onError: () => set({ dataError: LEDGER_ERROR_MESSAGE }),
    });
  },

  cleanupSubscriptions: () => {
    session.stop();
    set({
      employees: [],
      locations: [],
      events: [],
      shifts: [],
      settings: DEFAULT_SETTINGS,
      totalDebt: 0,
      dataError: null,
      isLoading: false,
      isCalendarLoading: false,
    });
  },

  refreshData: (userId) => {
    get().cleanupSubscriptions();
    set({ isLoading: true, isCalendarLoading: true });
    get().initSubscriptions(userId);
  },
}));
