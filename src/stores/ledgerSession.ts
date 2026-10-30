import { Employee, Event, Location, Shift, UserSettings } from '@/types/index';
import { eventService } from '@/lib/api/eventService';
import { shiftService } from '@/lib/api/shiftService';
import { employeeService } from '@/lib/api/employeeService';
import { locationService } from '@/lib/api/locationService';
import { settingsService } from '@/lib/api/settingsService';

type BaseKey = 'employees' | 'locations' | 'settings';
type MonthFlag = 'targetEvents' | 'targetShifts';

interface LoadedFlags {
  employees: boolean;
  locations: boolean;
  settings: boolean;
  targetEvents: boolean;
  targetShifts: boolean;
}

interface MonthCache {
  events: Event[];
  shifts: Shift[];
}

interface MonthLoaded {
  events: boolean;
  shifts: boolean;
}

export interface LedgerHandlers {
  onBase: (patch: {
    employees?: Employee[];
    locations?: Location[];
    settings?: UserSettings;
  }) => void;
  onLedger: (ledger: { events: Event[]; shifts: Shift[]; totalDebt: number }) => void;
  onLoading: (loading: { isLoading?: boolean; isCalendarLoading?: boolean }) => void;
  onError: () => void;
}

export interface LedgerSession {
  start: (userId: string, anchor: Date, handlers: LedgerHandlers) => void;
  stop: () => void;
}

const EMPTY_FLAGS: LoadedFlags = {
  employees: false,
  locations: false,
  settings: false,
  targetEvents: false,
  targetShifts: false,
};

const isBaseLoaded = (flags: LoadedFlags): boolean =>
  !!(flags.employees && flags.locations && flags.settings);

const isMonthLoaded = (flags: LoadedFlags): boolean => !!(flags.targetEvents && flags.targetShifts);

export const createLedgerSession = (): LedgerSession => {
  const subscriptions = new Map<string, () => void>();
  const dataCache = new Map<string, MonthCache>();
  const monthLoaded = new Map<string, MonthLoaded>();

  let flags: LoadedFlags = { ...EMPTY_FLAGS };
  let unpaidShifts: Shift[] = [];
  let extraEvents: Event[] = [];
  let activeUserId = '';
  let handlers: LedgerHandlers | null = null;
  let updateTimer: ReturnType<typeof setTimeout> | null = null;
  let reportedError = false;

  const reportLoadError = () => {
    if (reportedError) return;
    reportedError = true;
    handlers?.onError();
  };

  const executeUpdate = () => {
    const allEvents = new Map<string, Event>();
    dataCache.forEach((cache) => cache.events.forEach((event) => allEvents.set(event.id, event)));
    extraEvents.forEach((event) => allEvents.set(event.id, event));

    const allShifts = new Map<string, Shift>();
    dataCache.forEach((cache) => cache.shifts.forEach((shift) => allShifts.set(shift.id, shift)));
    unpaidShifts.forEach((shift) => allShifts.set(shift.id, shift));

    const events = Array.from(allEvents.values());
    const shifts = Array.from(allShifts.values());
    const totalDebt = shifts
      .filter((shift) => shift.status === 'unpaid')
      .reduce((sum, shift) => sum + shift.amount, 0);

    handlers?.onLedger({ events, shifts, totalDebt });
  };

  const scheduleUpdate = () => {
    if (updateTimer) clearTimeout(updateTimer);
    updateTimer = setTimeout(executeUpdate, 50);
  };

  const markBase = (key: BaseKey) => {
    if (flags[key]) return;
    flags = { ...flags, [key]: true };
    handlers?.onLoading({ isLoading: !isBaseLoaded(flags) });
  };

  const markMonth = (key: MonthFlag) => {
    if (flags[key]) return;
    flags = { ...flags, [key]: true };
    handlers?.onLoading({ isCalendarLoading: !isMonthLoaded(flags) });
  };

  const resetInternals = () => {
    subscriptions.forEach((unsubscribe) => unsubscribe());
    subscriptions.clear();
    dataCache.clear();
    monthLoaded.clear();
    unpaidShifts = [];
    extraEvents = [];
    flags = { ...EMPTY_FLAGS };
    activeUserId = '';
    if (updateTimer) {
      clearTimeout(updateTimer);
      updateTimer = null;
    }
  };

  const start = (userId: string, anchor: Date, nextHandlers: LedgerHandlers) => {
    handlers = nextHandlers;

    if (!userId) {
      handlers.onLoading({ isLoading: false, isCalendarLoading: false });
      return;
    }

    if (activeUserId && activeUserId !== userId) resetInternals();
    activeUserId = userId;
    reportedError = false;

    const month = anchor.getMonth() + 1;
    const year = anchor.getFullYear();
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const targetKey = `${month}-${year}`;
    const hasCache = dataCache.has(targetKey);
    const targetFlags = monthLoaded.get(targetKey);

    flags = {
      ...flags,
      targetEvents: targetFlags?.events ?? false,
      targetShifts: targetFlags?.shifts ?? false,
    };

    handlers.onLoading({
      isLoading: !isBaseLoaded(flags),
      isCalendarLoading: !hasCache && !isMonthLoaded(flags),
    });

    const needed = [
      { m: month, y: year },
      { m: month === 1 ? 12 : month - 1, y: month === 1 ? year - 1 : year },
      { m: month === 12 ? 1 : month + 1, y: month === 12 ? year + 1 : year },
      { m: currentMonth, y: currentYear },
    ];
    const neededKeys = new Set(needed.map((entry) => `${entry.m}-${entry.y}`));

    subscriptions.forEach((unsubscribe, key) => {
      if (key === 'app-data') return;
      const [keyMonth, keyYear] = key.split('-').map(Number);
      const distance = Math.abs(keyYear * 12 + keyMonth - (year * 12 + month));
      if (distance > 2 && !neededKeys.has(key)) {
        unsubscribe();
        subscriptions.delete(key);
        if (distance > 5) dataCache.delete(key);
      }
    });

    needed.forEach(({ m, y }) => {
      const key = `${m}-${y}`;
      if (subscriptions.has(key)) return;

      const unsubEvents = eventService.subscribeEventsByMonth(
        userId,
        m,
        y,
        (data) => {
          if (activeUserId !== userId) return;
          const current = dataCache.get(key) || { events: [], shifts: [] };
          dataCache.set(key, { ...current, events: data });
          monthLoaded.set(key, {
            ...(monthLoaded.get(key) || { events: false, shifts: false }),
            events: true,
          });
          scheduleUpdate();
          if (key === targetKey) markMonth('targetEvents');
        },
        () => {
          reportLoadError();
          markMonth('targetEvents');
        }
      );

      const unsubShifts = shiftService.subscribeShiftsByMonth(
        userId,
        m,
        y,
        (data) => {
          if (activeUserId !== userId) return;
          const current = dataCache.get(key) || { events: [], shifts: [] };
          dataCache.set(key, { ...current, shifts: data });
          monthLoaded.set(key, {
            ...(monthLoaded.get(key) || { events: false, shifts: false }),
            shifts: true,
          });
          scheduleUpdate();
          if (key === targetKey) markMonth('targetShifts');
        },
        () => {
          reportLoadError();
          markMonth('targetShifts');
        }
      );

      subscriptions.set(key, () => {
        unsubEvents();
        unsubShifts();
      });
    });

    if (!subscriptions.has('app-data')) {
      const unsubEmployees = employeeService.subscribeEmployees(
        userId,
        (data) => {
          handlers?.onBase({ employees: data });
          markBase('employees');
        },
        () => {
          reportLoadError();
          markBase('employees');
        }
      );

      const unsubLocations = locationService.subscribeLocations(
        userId,
        (data) => {
          handlers?.onBase({ locations: data });
          markBase('locations');
        },
        () => {
          reportLoadError();
          markBase('locations');
        }
      );

      const unsubSettings = settingsService.subscribeSettings(
        userId,
        (data) => {
          if (data) handlers?.onBase({ settings: data });
          markBase('settings');
        },
        () => {
          reportLoadError();
          markBase('settings');
        }
      );

      const unsubUnpaidShifts = shiftService.subscribeUnpaidShifts(
        userId,
        async (data) => {
          if (activeUserId !== userId) return;
          unpaidShifts = data;

          const eventIds = Array.from(
            new Set(data.filter((shift) => shift.eventId).map((shift) => shift.eventId))
          );
          const knownEventIds = new Set(
            Array.from(dataCache.values()).flatMap((cache) => cache.events.map((event) => event.id))
          );
          const missing = eventIds.filter((id) => id && !knownEventIds.has(id));

          let fetchedEvents: Event[] = [];
          if (missing.length > 0) {
            try {
              fetchedEvents = await eventService.getEventsByIds(userId, missing);
            } catch (error) {
              console.error(error);
            }
          }

          if (activeUserId !== userId) return;

          if (fetchedEvents.length > 0) extraEvents = fetchedEvents;
          scheduleUpdate();
        },
        () => reportLoadError()
      );

      subscriptions.set('app-data', () => {
        unsubEmployees();
        unsubLocations();
        unsubSettings();
        unsubUnpaidShifts();
      });
    }

    scheduleUpdate();
  };

  const stop = () => {
    resetInternals();
    handlers = null;
  };

  return { start, stop };
};
