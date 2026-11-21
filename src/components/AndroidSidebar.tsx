import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  User,
  LogIn,
  LogOut,
  Sun,
  Moon,
  Laptop,
  Palette,
  Languages,
  Check,
  LayoutDashboard,
  Truck,
  FileText,
  TrendingUp,
  Droplets,
  Settings,
  Smartphone,
  Phone,
  Mail,
  ExternalLink,
  MapPin,
  ShieldCheck,
  IdCard,
  Receipt,
  Camera,
  Instagram,
} from 'lucide-react';
import { ActiveTab, DynamicPalette, StaffInfo, ThemeMode } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { BharatPeyjalLogo } from './BharatPeyjalLogo';

interface AndroidSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  staff: StaffInfo;
  staffPhoto: string | null;
  pendingBookingCount: number;
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onLogout: () => void;
  onRequestLogin: () => void;
  onOpenIdCard: () => void;
  onOpenSalarySlip: () => void;
  onPickPhoto: () => void;
}

export const AndroidSidebar: React.FC<AndroidSidebarProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  staff,
  staffPhoto,
  pendingBookingCount,
  activeTab,
  onChangeTab,
  onLogout,
  onRequestLogin,
  onOpenIdCard,
  onOpenSalarySlip,
  onPickPhoto,
}) => {
  const { mode, setMode, palette, setPalette, paletteMeta } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConfirmLogout(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const themeModes: {
    id: ThemeMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'light', label: language === 'hi' ? 'लाइट' : 'Light', icon: Sun },
    { id: 'dark', label: language === 'hi' ? 'डार्क' : 'Dark', icon: Moon },
    { id: 'system', label: language === 'hi' ? 'ऑटो' : 'Auto', icon: Laptop },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    onChangeTab(tabId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label={language === 'hi' ? 'साइडबार मेनू' : 'Sidebar Navigation'}
        >
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/55 backdrop-blur-xs"
          />

          {/* Slide-out Drawer Panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[86%] max-w-[330px] h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl border-r border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* 1. Drawer Profile Header */}
            <div
              className="p-4 pt-5 text-white relative shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <BharatPeyjalLogo variant="icon" size="md" className="shadow-md border-white/30" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white/85 truncate">{t.appName}</p>
                    <p className="text-[11px] text-white/70 truncate">{t.jalMitra}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="min-w-[44px] min-h-[44px] -mr-2 -mt-2 rounded-full flex items-center justify-center text-white/90 hover:bg-white/15 transition-colors touch-press"
                  aria-label={t.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Identity Box with Photo Picker */}
              {isLoggedIn ? (
                <div className="p-3 rounded-2xl bg-slate-950/25 backdrop-blur-xs border border-white/15 space-y-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={onPickPhoto}
                      title={t.changePhotoBtn}
                      className="relative w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 font-extrabold text-base text-white border border-white/30 touch-press overflow-visible"
                    >
                      <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
                        {staffPhoto ? (
                          <img
                            src={staffPhoto}
                            alt={staff.name}
                            className="w-full h-full object-cover"
                          />
                        ) : staff.name ? (
                          staff.name.charAt(0).toUpperCase()
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-900 border-2 border-[#0284c7] flex items-center justify-center shadow"
                        aria-hidden="true"
                      >
                        <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                    </button>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-extrabold text-white truncate leading-tight">
                        {staff.name || t.jalMitra}
                      </h3>
                      <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        <span className="text-[10.5px] bg-white/20 px-2 py-0.5 rounded font-mono font-bold">
                          ID: {staff.id || 'BP001'}
                        </span>
                        <button
                          type="button"
                          onClick={onPickPhoto}
                          className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 transition"
                        >
                          <Camera className="w-2.5 h-2.5" />
                          <span>{t.changePhotoBtn}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {(staff.location || staff.role) && (
                    <div className="flex items-center gap-1.5 text-[11px] text-white/80 pt-1.5 border-t border-white/10 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {staff.location
                          ? language === 'en' && staff.location === 'भारत पेयजल हरदोई 🇮🇳'
                            ? t.defaultLocation
                            : staff.location
                          : language === 'en' && staff.role === 'जल मित्र (डिलीवरी पार्टनर)'
                          ? t.roleValue
                          : staff.role}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-950/25 backdrop-blur-xs border border-white/15 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {language === 'hi' ? 'लॉगिन नहीं किया गया' : 'Not Signed In'}
                    </p>
                    <p className="text-[11px] text-white/75 truncate">
                      {language === 'hi'
                        ? 'अपना वेतन व डेटा देखने हेतु लॉगिन करें'
                        : 'Login to view salary & reports'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onRequestLogin();
                    }}
                    className="px-3 py-2 min-h-[40px] rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm touch-press whitespace-nowrap"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'लॉगिन' : 'Login'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Scrollable Drawer Body */}
            <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 no-scrollbar">
              {/* Navigation Menu (when logged in) */}
              {isLoggedIn && (
                <section className="space-y-1.5">
                  <p className="px-2 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    {language === 'hi' ? 'मुख्य मेनू (Navigation)' : 'Navigation'}
                  </p>
                  <div className="space-y-1">
                    {/* Dashboard */}
                    <button
                      type="button"
                      onClick={() => handleNavClick('dashboard')}
                      className={`w-full min-h-[42px] px-3 py-2 rounded-2xl flex items-center gap-3 text-xs font-bold transition-colors touch-press whitespace-nowrap ${
                        activeTab === 'dashboard'
                          ? ''
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                      }`}
                      style={
                        activeTab === 'dashboard'
                          ? { backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }
                          : undefined
                      }
                    >
                      <LayoutDashboard className="w-4 h-4 shrink-0" />
                      <span className="truncate">
                        {language === 'hi' ? 'डैशबोर्ड (होम)' : 'Dashboard (Home)'}
                      </span>
                    </button>

                    {/* Wedding / Function Bookings */}
                    <button
                      type="button"
                      onClick={() => handleNavClick('bookings')}
                      className={`w-full min-h-[42px] px-3 py-2 rounded-2xl flex items-center gap-3 text-xs font-bold transition-colors touch-press whitespace-nowrap ${
                        activeTab === 'bookings'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                          : 'text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100/70 dark:hover:bg-amber-950/50'
                      }`}
                    >
                      <Truck className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span className="truncate">{t.sidebarBookingsLabel}</span>
                      {pendingBookingCount > 0 && (
                        <span className="ml-auto text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-extrabold tabular-nums">
                          {pendingBookingCount}
                        </span>
                      )}
                    </button>

                    {/* Digital ID Card */}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenIdCard();
                      }}
                      className="w-full min-h-[42px] px-3 py-2 rounded-2xl flex items-center gap-3 text-xs font-bold text-sky-900 dark:text-sky-200 bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-800/50 hover:bg-sky-100/70 dark:hover:bg-sky-950/50 transition-colors touch-press whitespace-nowrap"
                    >
                      <IdCard className="w-4 h-4 shrink-0 text-sky-600 dark:text-sky-400" />
                      <span className="truncate">{t.idCardBtn}</span>
                      <span className="ml-auto text-[9.5px] bg-emerald-100 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">
                        Verified
                      </span>
                    </button>

                    {/* Official Salary Slip (Payslip) Shortcut */}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSalarySlip();
                      }}
                      className="w-full min-h-[42px] px-3 py-2 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/50 transition-colors touch-press whitespace-nowrap"
                    >
                      <Receipt className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="truncate">{t.sidebarPayslipLabel}</span>
                      <span className="ml-auto text-[9.5px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                        {t.sidebarPayslipNew}
                      </span>
                    </button>

                    {/* Detailed Statement */}
                    <button
                      type="button"
                      onClick={() => handleNavClick('statement')}
                      className={`w-full min-h-[42px] px-3 py-2 rounded-2xl flex items-center gap-3 text-xs font-bold transition-colors touch-press whitespace-nowrap ${
                        activeTab === 'statement'
                          ? ''
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                      }`}
                      style={
                        activeTab === 'statement'
                          ? { backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }
                          : undefined
                      }
                    >
                      <FileText className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="truncate">{t.viewDetailedStatement}</span>
                    </button>

                    {/* Career Report & Increment */}
                    <button
                      type="button"
                      onClick={() => handleNavClick('increment')}
                      className={`w-full min-h-[42px] px-3 py-2 rounded-2xl flex items-center gap-3 text-xs font-bold transition-colors touch-press whitespace-nowrap ${
                        activeTab === 'increment'
                          ? ''
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                      }`}
                      style={
                        activeTab === 'increment'
                          ? { backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }
                          : undefined
                      }
                    >
                      <TrendingUp className="w-4 h-4 shrink-0 text-amber-500" />
                      <span className="truncate">{t.sidebarIncrementLabel}</span>
                    </button>

                    {/* Water Test */}
                    <button
                      type="button"
                      onClick={() => handleNavClick('water_test')}
                      className={`w-full min-h-[42px] px-3 py-2 rounded-2xl flex items-center gap-3 text-xs font-bold transition-colors touch-press whitespace-nowrap ${
                        activeTab === 'water_test'
                          ? ''
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                      }`}
                      style={
                        activeTab === 'water_test'
                          ? { backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }
                          : undefined
                      }
                    >
                      <Droplets className="w-4 h-4 shrink-0 text-sky-500" />
                      <span className="truncate">{t.tabWaterTest}</span>
                    </button>

                    {/* Settings */}
                    <button
                      type="button"
                      onClick={() => handleNavClick('settings')}
                      className={`w-full min-h-[42px] px-3 py-2 rounded-2xl flex items-center gap-3 text-xs font-bold transition-colors touch-press whitespace-nowrap ${
                        activeTab === 'settings'
                          ? ''
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                      }`}
                      style={
                        activeTab === 'settings'
                          ? { backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }
                          : undefined
                      }
                    >
                      <Settings className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                      <span className="truncate">{t.tabSettings}</span>
                    </button>
                  </div>
                </section>
              )}

              {/* Appearance (Light / Dark / System) */}
              <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 px-1">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t.appearanceTitle}
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
                  {themeModes.map((tm) => {
                    const Icon = tm.icon;
                    const isSelected = mode === tm.id;
                    return (
                      <button
                        key={tm.id}
                        type="button"
                        onClick={() => setMode(tm.id)}
                        className={`min-h-[40px] px-2 py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all touch-press whitespace-nowrap ${
                          isSelected
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{tm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Dynamic Theme Colors */}
              <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 px-1">
                  <Palette className="w-4 h-4 text-sky-500 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t.dynamicThemingTitle}
                  </h4>
                </div>
                <div className="space-y-1.5">
                  {(Object.keys(paletteMeta) as DynamicPalette[]).map((key) => {
                    const item = paletteMeta[key];
                    const isSelected = palette === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPalette(key)}
                        className={`w-full min-h-[42px] px-3 py-2 rounded-2xl border text-left flex items-center justify-between gap-2 transition-colors touch-press ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 font-bold text-slate-900 dark:text-white'
                            : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-white"
                            style={{ backgroundColor: item.color }}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                          <span className="text-xs truncate">
                            {language === 'hi' ? item.hindiName : item.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Language Switcher */}
              <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 px-1">
                  <Languages className="w-4 h-4 text-indigo-500 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t.languageTitle}
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setLanguage('hi')}
                    className={`min-h-[40px] rounded-xl text-xs font-bold transition-all touch-press ${
                      language === 'hi'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    हिंदी (Hindi)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`min-h-[40px] rounded-xl text-xs font-bold transition-all touch-press ${
                      language === 'en'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    English
                  </button>
                </div>
              </section>

              {/* App Install & Support */}
              <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 px-1">
                  <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t.appStatusTitle}
                  </h4>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {isInstalled ? t.appInstalled : t.browserMode}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                      {language === 'hi' ? 'जल मित्र पोर्टल' : 'Jal Mitra Portal'}
                    </span>
                  </div>
                  {!isInstalled && isInstallable && (
                    <button
                      type="button"
                      onClick={install}
                      className="px-3 py-2 min-h-[38px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 touch-press whitespace-nowrap"
                    >
                      {t.installAppBtn}
                    </button>
                  )}
                  {isInstalled && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" /> {t.active}
                    </span>
                  )}
                </div>

                {/* Support Contact + Instagram Follow */}
                <div className="space-y-1.5 pt-1">
                  <a
                    href="tel:+917860393198"
                    className="min-h-[44px] px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium truncate">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>7860393198</span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      {t.call} →
                    </span>
                  </a>

                  <a
                    href="https://www.instagram.com/bharatpeyjal_ro?gwpx=MXNwMHN2c21tejc5Yg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="min-h-[44px] px-3 py-2 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 dark:from-pink-950/30 dark:via-rose-950/30 dark:to-amber-950/20 border border-pink-200/80 dark:border-pink-800/50 flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-100 font-bold touch-press transition"
                  >
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Instagram className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">{t.instagramFollowLabel}</span>
                    <span className="ml-auto text-[10px] bg-pink-600 text-white px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                      {t.instagramFollowBadge}
                    </span>
                  </a>

                  <a
                    href="mailto:hi@bharatpeyjal.in.net"
                    className="min-h-[44px] px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium truncate">
                      <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">hi@bharatpeyjal.in.net</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </a>
                </div>

                <div className="pt-1 px-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <a
                    href="https://bharatpeyjal.in.net/privacy.html"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Privacy
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href="https://bharatpeyjal.in.net/terms.html"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Terms
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href="https://bharatpeyjal.in.net/tds.html"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    TDS Report
                  </a>
                </div>
              </section>
            </div>

            {/* 3. Drawer Sticky Footer: Login / Logout */}
            <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/95 shrink-0">
              {isLoggedIn ? (
                confirmLogout ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-center text-slate-800 dark:text-slate-200">
                      {t.logoutConfirmTitle}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmLogout(false)}
                        className="flex-1 min-h-[42px] py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs touch-press"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmLogout(false);
                          onClose();
                          onLogout();
                        }}
                        className="flex-1 min-h-[42px] py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs touch-press"
                      >
                        {t.confirmLogout}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmLogout(true)}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors touch-press"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>{t.logoutBtn}</span>
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestLogin();
                  }}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all touch-press"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <LogIn className="w-4 h-4 shrink-0" />
                  <span>{language === 'hi' ? 'स्टाफ लॉगिन करें (Login)' : 'Staff Login'}</span>
                </button>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
