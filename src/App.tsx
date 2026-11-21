import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SplashScreen } from './components/SplashScreen';
import { AndroidTopBar } from './components/AndroidTopBar';
import { AndroidSidebar } from './components/AndroidSidebar';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { LoginScreen } from './components/LoginScreen';
import { DashboardTab } from './components/DashboardTab';
import { BookingsTab } from './components/BookingsTab';
import { StatementTab } from './components/StatementTab';
import { CareerIncrementTab } from './components/CareerIncrementTab';
import { WaterTestTab } from './components/WaterTestTab';
import { SettingsTab } from './components/SettingsTab';
import { SalarySlipModal } from './components/SalarySlipModal';
import { DigitalIdModal } from './components/DigitalIdModal';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { ActiveTab, BookingItem, IncrementApiInfo, MonthData, StaffInfo } from './types';
import {
  loginStaff,
  getFallbackResponse,
  sanitizeMonthData,
  SAMPLE_MONTH_DATA,
  buildSampleBookings,
} from './services/api';
import {
  calculateCareerAndIncrement,
  clearStaffPhoto,
  getSavedStaffPhoto,
  resizeAndCropSquareImage,
  saveStaffPhoto,
} from './utils/careerHelpers';
import { WifiOff, CheckCircle2 } from 'lucide-react';

function JalMitraApp() {
  const { t, language } = useLanguage();
  const isOnline = useOnlineStatus();
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [staff, setStaff] = useState<StaffInfo>({
    name: 'Talib',
    id: 'BP001',
    phone: '7054198443',
    dob: '12/05/1998',
    role: 'जल मित्र (डिलीवरी पार्टनर)',
    location: 'भारत पेयजल हरदोई 🇮🇳',
    joinDate: '15 Oct 2026',
    joiningDate: '2026-10-15',
    joiningDateDisplay: '15 अक्टूबर 2026',
  });
  const [staffPhoto, setStaffPhoto] = useState<string | null>(null);

  const [monthList, setMonthList] = useState<string[]>(['October 2026', 'November 2026']);
  const [defaultMonth, setDefaultMonth] = useState<string>('November 2026');
  const [selectedMonth, setSelectedMonth] = useState<string>('November 2026');
  const [monthDataMap, setMonthDataMap] = useState<Record<string, MonthData>>(SAMPLE_MONTH_DATA);
  const [bookings, setBookings] = useState<BookingItem[]>(() => buildSampleBookings());
  const [incrementApi, setIncrementApi] = useState<IncrementApiInfo | undefined>(undefined);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSalarySlipOpen, setIsSalarySlipOpen] = useState(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const savedId = typeof window !== 'undefined' ? localStorage.getItem('bp_staff_id') || '' : '';
  const savedPin = typeof window !== 'undefined' ? localStorage.getItem('bp_staff_pin') || '' : '';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Sync local/API staff photo whenever staff ID or API photo changes
  useEffect(() => {
    const localPhoto = getSavedStaffPhoto(staff.id);
    setStaffPhoto(localPhoto || staff.photo || null);
  }, [staff.id, staff.photo]);

  // Auto-login on mount if Remember Me was selected
  useEffect(() => {
    const remember = localStorage.getItem('bp_remember_me');
    const sId = localStorage.getItem('bp_staff_id');
    const sPin = localStorage.getItem('bp_staff_pin');

    if (remember === 'true' && sId && sPin) {
      handleLogin(sId, sPin, true, true);
    }
  }, []);

  const handleLogin = async (
    idVal: string,
    pinVal: string,
    remember: boolean,
    isQuiet = false
  ): Promise<boolean> => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const res = await loginStaff(idVal, pinVal);
      setIsLoading(false);

      if (!res.success) {
        if (!isQuiet) {
          setLoginError(res.message || t.loginFailedMsg);
        }
        return false;
      }

      if (remember) {
        localStorage.setItem('bp_staff_id', idVal);
        localStorage.setItem('bp_staff_pin', pinVal);
        localStorage.setItem('bp_remember_me', 'true');
      } else {
        localStorage.removeItem('bp_staff_id');
        localStorage.removeItem('bp_staff_pin');
        localStorage.removeItem('bp_remember_me');
      }

      if (res.staff) {
        setStaff(res.staff);
        const savedLocal = getSavedStaffPhoto(res.staff.id);
        setStaffPhoto(savedLocal || res.staff.photo || null);
      }
      if (res.monthList && res.monthList.length > 0) {
        setMonthList(res.monthList);
      }
      if (res.defaultMonth) {
        setDefaultMonth(res.defaultMonth);
        setSelectedMonth(res.defaultMonth);
      }
      if (res.monthDataMap) {
        setMonthDataMap(res.monthDataMap);
      }
      setBookings(Array.isArray(res.bookings) ? res.bookings : []);
      setIncrementApi(res.increment);

      setIsLoggedIn(true);
      setActiveTab('dashboard');
      return true;
    } catch {
      setIsLoading(false);
      if (!isQuiet) {
        setLoginError(t.networkErrorMsg);
      }
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bp_staff_id');
    localStorage.removeItem('bp_staff_pin');
    localStorage.removeItem('bp_remember_me');
    setIsLoggedIn(false);
    setActiveTab('dashboard');
    setIsSalarySlipOpen(false);
    setIsIdCardOpen(false);
  };

  const handleDemoLogin = (enteredId?: string) => {
    const fallback = getFallbackResponse(enteredId || 'BP001');
    if (fallback.staff) {
      setStaff(fallback.staff);
      const savedLocal = getSavedStaffPhoto(fallback.staff.id);
      setStaffPhoto(savedLocal || fallback.staff.photo || null);
    }
    if (fallback.monthList) setMonthList(fallback.monthList);
    if (fallback.defaultMonth) {
      setDefaultMonth(fallback.defaultMonth);
      setSelectedMonth(fallback.defaultMonth);
    }
    if (fallback.monthDataMap) setMonthDataMap(fallback.monthDataMap);
    setBookings(Array.isArray(fallback.bookings) ? fallback.bookings : []);
    setIncrementApi(fallback.increment);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const handleTriggerPhotoPicker = () => {
    if (!photoInputRef.current) return;
    photoInputRef.current.value = '';
    photoInputRef.current.click();
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type || !file.type.startsWith('image/')) {
      showToast(
        language === 'hi'
          ? 'कृपया केवल फोटो (JPG/PNG) फाइल चुनें!'
          : 'Please select an image (JPG/PNG) file.'
      );
      return;
    }

    try {
      const compressed = await resizeAndCropSquareImage(file, 320);
      saveStaffPhoto(staff.id, compressed);
      setStaffPhoto(compressed);
      showToast(
        language === 'hi'
          ? 'प्रोफ़ाइल फोटो अपडेट हो गई!'
          : 'Profile photo updated across app!'
      );
    } catch {
      showToast(
        language === 'hi'
          ? 'फोटो सेव करने में समस्या आई। कृपया दूसरी फोटो चुनें।'
          : 'Could not save photo. Please try another image.'
      );
    }
  };

  const handleRemovePhoto = () => {
    clearStaffPhoto(staff.id);
    setStaffPhoto(null);
  };

  const handleChangeTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rawMonthData =
    monthDataMap[selectedMonth] ||
    SAMPLE_MONTH_DATA['November 2026'] ||
    Object.values(monthDataMap)[0];
  const currentMonthData: MonthData = sanitizeMonthData(rawMonthData, selectedMonth);

  const pendingBookingCount = useMemo(
    () => bookings.filter((b) => b.status !== 'Delivered').length,
    [bookings]
  );

  const incrementSummary = useMemo(
    () => calculateCareerAndIncrement(staff, monthList, monthDataMap, incrementApi),
    [staff, monthList, monthDataMap, incrementApi]
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-between items-center transition-colors">
      {/* Branded Animated Splash Screen */}
      <SplashScreen />

      {/* Shared Hidden Profile Photo Picker */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoFileChange}
      />

      {/* Offline Toast Banner */}
      {!isOnline && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-600 text-white text-xs font-bold shadow-lg">
          <WifiOff className="w-3.5 h-3.5" />
          <span>{t.offlineMode}</span>
        </div>
      )}

      {/* Non-blocking Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xl whitespace-nowrap">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Android Device Container Shell */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between shadow-2xl relative transition-colors sm:border-x sm:border-slate-200 dark:sm:border-slate-800">
        <div>
          {/* Top Bar */}
          <AndroidTopBar
            isLoggedIn={isLoggedIn}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            staffName={staff.name}
            staffId={staff.id}
            staffPhoto={staffPhoto}
          />

          {/* Slide-out Android Sidebar Drawer */}
          <AndroidSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isLoggedIn={isLoggedIn}
            staff={staff}
            staffPhoto={staffPhoto}
            pendingBookingCount={pendingBookingCount}
            activeTab={activeTab}
            onChangeTab={handleChangeTab}
            onLogout={handleLogout}
            onOpenIdCard={() => setIsIdCardOpen(true)}
            onOpenSalarySlip={() => setIsSalarySlipOpen(true)}
            onPickPhoto={handleTriggerPhotoPicker}
            onRequestLogin={() => {
              setIsLoggedIn(false);
              setTimeout(() => {
                document.getElementById('login-id-input')?.focus();
              }, 120);
            }}
          />

          {/* Main App Content Views */}
          <main className="w-full px-3.5 pt-3">
            {!isLoggedIn ? (
              <LoginScreen
                onLogin={(id, pin, remember) => handleLogin(id, pin, remember)}
                onDemoLogin={handleDemoLogin}
                isLoading={isLoading}
                errorMsg={loginError}
                savedId={savedId}
                savedPin={savedPin}
              />
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <DashboardTab
                    staff={staff}
                    staffPhoto={staffPhoto}
                    onPickPhoto={handleTriggerPhotoPicker}
                    monthData={currentMonthData}
                    monthList={monthList}
                    defaultMonth={defaultMonth}
                    selectedMonth={selectedMonth}
                    bookings={bookings}
                    incrementSummary={incrementSummary}
                    onMonthChange={(m) => setSelectedMonth(m)}
                    onOpenStatement={() => handleChangeTab('statement')}
                    onOpenSalarySlip={() => setIsSalarySlipOpen(true)}
                    onOpenBookings={() => handleChangeTab('bookings')}
                    onOpenIncrement={() => handleChangeTab('increment')}
                  />
                )}

                {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}

                {activeTab === 'statement' && (
                  <StatementTab
                    staff={staff}
                    monthData={currentMonthData}
                    onOpenSalarySlip={() => setIsSalarySlipOpen(true)}
                  />
                )}

                {activeTab === 'increment' && (
                  <CareerIncrementTab staff={staff} summary={incrementSummary} />
                )}

                {activeTab === 'water_test' && <WaterTestTab />}

                {activeTab === 'settings' && (
                  <SettingsTab
                    staff={staff}
                    onLogout={handleLogout}
                    onOpenIdCard={() => setIsIdCardOpen(true)}
                  />
                )}
              </>
            )}
          </main>
        </div>

        {/* Bottom Navigation Bar when logged in */}
        {isLoggedIn && (
          <AndroidBottomNav
            activeTab={activeTab}
            pendingBookingCount={pendingBookingCount}
            onChangeTab={handleChangeTab}
          />
        )}

        {/* Salary Slip Modal */}
        <SalarySlipModal
          isOpen={isSalarySlipOpen}
          onClose={() => setIsSalarySlipOpen(false)}
          staff={staff}
          monthData={currentMonthData}
        />

        {/* Digital ID Card Modal */}
        <DigitalIdModal
          isOpen={isIdCardOpen}
          onClose={() => setIsIdCardOpen(false)}
          staff={staff}
          staffPhoto={staffPhoto}
          onPickPhoto={handleTriggerPhotoPicker}
          onRemovePhoto={handleRemovePhoto}
          cycleMonth={currentMonthData.month}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <JalMitraApp />
      </ThemeProvider>
    </LanguageProvider>
  );
}
