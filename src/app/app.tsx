import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import { Employee, Event, Shift, Location, UserSettings } from '@/types/index';
import Loader from '@/components/ui/Loader';
import { Navbar } from '@/components/layouts/Navbar';
import { OfflineIndicator } from '@/components/layouts/OfflineIndicator';
import { Login } from '@/app/routes/login';
import { Splashscreen } from '@/components/Splashscreen';
import { PullToRefresh } from '@/components/PullToRefresh';
import { ExportModal } from '@/features/payroll/components/ExportModal';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { ToastProvider, useToast } from '@/components/ui/ToastProvider';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import { useAuthStore } from '@/stores/authStore';
import { useAppDataStore } from '@/stores/appDataStore';
import { eventService } from '@/lib/api/eventService';
import { shiftService } from '@/lib/api/shiftService';
import { exportDetailedReport } from '@/lib/api/exportService';

const DashboardView = lazy(() => import('@/app/routes/dashboard'));
const CalendarView = lazy(() => import('@/app/routes/calendar'));
const EmployeeView = lazy(() => import('@/app/routes/employees'));
const LocationView = lazy(() => import('@/app/routes/locations'));
const PayrollView = lazy(() => import('@/app/routes/payroll'));
const SettingsView = lazy(() => import('@/app/routes/settings'));
const Gallery = import.meta.env.DEV ? lazy(() => import('@/dev/Gallery')) : null;

const TAB_NAMES = {
  dashboard: 'Tổng quan',
  calendar: 'Lịch tiệc',
  employees: 'Nhân sự',
  payroll: 'Thanh toán',
  locations: 'Địa điểm',
  settings: 'Cài đặt',
} as const;

type Tab = keyof typeof TAB_NAMES;

const currentTabFromPath = (pathname: string): Tab => {
  const path = pathname.replace(/^\//, '');
  return path in TAB_NAMES ? (path as Tab) : 'dashboard';
};

const RouteFallback = () => (
  <div className="flex justify-center py-16">
    <Loader fullScreen={false} />
  </div>
);

function AppShell() {
  const { user, loading: authLoading, init: initAuth, logout } = useAuthStore();
  const {
    employees,
    locations,
    events,
    shifts,
    settings,
    isLoading,
    isCalendarLoading,
    viewDate,
    setViewDate,
    totalDebt,
    initSubscriptions,
    cleanupSubscriptions,
    refreshData,
  } = useAppDataStore();

  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = currentTabFromPath(location.pathname);

  // Cập nhật tiêu đề trang theo route và cuộn lên đầu trang
  useEffect(() => {
    if (user && user.emailVerified) {
      document.title = `${TAB_NAMES[currentTab]} - ShiftPay`;
      window.scrollTo(0, 0);
    }
  }, [currentTab, user]);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Lắng nghe auth
  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  // Tải data user
  useEffect(() => {
    if (user) {
      initSubscriptions(user.uid);
    } else {
      cleanupSubscriptions();
    }
    return () => cleanupSubscriptions();
  }, [user, initSubscriptions, cleanupSubscriptions]);

  // Sync khi đổi ngày
  const lastViewDateRef = useRef<Date | null>(null);
  useEffect(() => {
    if (!user) return;
    const previous = lastViewDateRef.current;
    lastViewDateRef.current = viewDate;
    if (!previous || previous === viewDate) return;
    initSubscriptions(user.uid);
  }, [viewDate, user, initSubscriptions]);

  const handleOpenExport = () => {
    setIsExportModalOpen(true);
  };

  const handleExportReport = async (month: number, year: number, onlyDebt: boolean) => {
    if (!user) return;

    try {
      setIsExporting(true);
      const [fetchedEvents, fetchedShifts] = await Promise.all([
        eventService.getEventsByMonth(user.uid, month, year),
        shiftService.getShiftsByMonth(user.uid, month, year),
      ]);
      await exportDetailedReport(
        month,
        year,
        fetchedEvents,
        fetchedShifts,
        employees,
        locations,
        settings,
        onlyDebt
      );
      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      useAppDataStore.getState().setDataError('Xuất báo cáo thất bại. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  const requestLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <ToastProvider>
      <DataErrorWatcher />
      <OfflineIndicator />
      {authLoading ? (
        <div className="flex items-center justify-center h-screen bg-canvas">
          <Loader />
        </div>
      ) : !user || !user.emailVerified ? (
        <Login onLogin={() => {}} />
      ) : (
        <AppContent
          onLogout={requestLogout}
          user={user}
          employees={employees}
          locations={locations}
          events={events}
          shifts={shifts}
          settings={settings}
          isLoading={isLoading}
          isCalendarLoading={isCalendarLoading}
          viewDate={viewDate}
          setViewDate={setViewDate}
          totalDebt={totalDebt}
          refreshData={refreshData}
          onOpenExport={handleOpenExport}
          isExportModalOpen={isExportModalOpen}
          setIsExportModalOpen={setIsExportModalOpen}
          isExporting={isExporting}
          onExportReport={handleExportReport}
          showLogoutConfirm={showLogoutConfirm}
          onCloseLogoutConfirm={() => setShowLogoutConfirm(false)}
          onConfirmLogout={confirmLogout}
        />
      )}
    </ToastProvider>
  );
}

function AppContent({
  onLogout,
  user,
  employees,
  locations,
  events,
  shifts,
  settings,
  isLoading,
  isCalendarLoading,
  viewDate,
  setViewDate,
  totalDebt,
  refreshData,
  onOpenExport,
  isExportModalOpen,
  setIsExportModalOpen,
  isExporting,
  onExportReport,
  showLogoutConfirm,
  onCloseLogoutConfirm,
  onConfirmLogout,
}: {
  onLogout: () => void;
  user: User | null;
  employees: Employee[];
  locations: Location[];
  events: Event[];
  shifts: Shift[];
  settings: UserSettings;
  isLoading: boolean;
  isCalendarLoading: boolean;
  viewDate: Date;
  setViewDate: (date: Date) => void;
  totalDebt: number;
  refreshData: (userId: string) => void;
  onOpenExport: () => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isExporting: boolean;
  onExportReport: (month: number, year: number, onlyDebt: boolean) => void;
  showLogoutConfirm: boolean;
  onCloseLogoutConfirm: () => void;
  onConfirmLogout: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = currentTabFromPath(location.pathname);

  return (
    <div className="min-h-dynamic bg-canvas">
      <Navbar
        currentTab={currentTab}
        setTab={(tab) => navigate(`/${tab}`)}
        onLogout={onLogout}
        user={user}
      />
      <main className="pb-[calc(64px+env(safe-area-inset-bottom))] md:pl-[var(--rail-width)] md:pb-0">
        <PullToRefresh
          onRefresh={() => {
            if (user) refreshData(user.uid);
          }}
        >
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <DashboardView
                    employees={employees}
                    events={events}
                    shifts={shifts}
                    locations={locations}
                    loading={isLoading}
                    onOpenExport={onOpenExport}
                  />
                }
              />
              <Route
                path="/calendar"
                element={
                  <CalendarView
                    events={events}
                    shifts={shifts}
                    employees={employees}
                    locations={locations}
                    totalDebt={totalDebt}
                    settings={settings}
                    currentDate={viewDate}
                    onDateChange={setViewDate}
                    onNavigateToReviews={() => navigate('/locations')}
                    loading={isLoading || isCalendarLoading}
                  />
                }
              />
              <Route
                path="/employees"
                element={
                  <EmployeeView
                    employees={employees}
                    shifts={shifts}
                    events={events}
                    loading={isLoading}
                  />
                }
              />
              <Route
                path="/locations"
                element={
                  <LocationView
                    locations={locations}
                    events={events}
                    loading={isLoading}
                    onBack={() => navigate('/calendar')}
                  />
                }
              />
              <Route
                path="/payroll"
                element={
                  <PayrollView
                    shifts={shifts}
                    employees={employees}
                    events={events}
                    locations={locations}
                    loading={isLoading}
                  />
                }
              />
              <Route
                path="/settings"
                element={<SettingsView user={user} settings={settings} onLogout={onLogout} />}
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </PullToRefresh>
      </main>

      <ScrollToTopButton activeTab={currentTab} />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        isExporting={isExporting}
        onExport={onExportReport}
      />

      <Modal
        title="Xác nhận đăng xuất"
        isOpen={showLogoutConfirm}
        onClose={onCloseLogoutConfirm}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onCloseLogoutConfirm} className="flex-1">
              Hủy
            </Button>
            <Button variant="danger" onClick={onConfirmLogout} className="flex-1">
              Đăng xuất
            </Button>
          </div>
        }
      >
        <p className="text-sm text-ink-soft">Bạn có chắc muốn đăng xuất khỏi ứng dụng?</p>
      </Modal>
    </div>
  );
}

function DataErrorWatcher() {
  const dataError = useAppDataStore((state) => state.dataError);
  const setDataError = useAppDataStore((state) => state.setDataError);
  const { showToast } = useToast();

  useEffect(() => {
    if (!dataError) return;
    showToast(dataError, 'error');
    setDataError(null);
  }, [dataError, setDataError, showToast]);

  return null;
}

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('splashscreen_shown');
  });

  if (Gallery && window.location.pathname === '/gallery') {
    return (
      <Suspense fallback={<Loader fullScreen={false} />}>
        <Gallery />
      </Suspense>
    );
  }

  if (showSplash) {
    return <Splashscreen onComplete={() => setShowSplash(false)} />;
  }

  return <AppShell />;
}

export default App;
