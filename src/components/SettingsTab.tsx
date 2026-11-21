import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Laptop,
  Palette,
  Smartphone,
  Phone,
  Mail,
  ExternalLink,
  LogOut,
  Check,
  Languages,
  IdCard,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { DynamicPalette, StaffInfo, ThemeMode } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { BharatPeyjalLogo } from './BharatPeyjalLogo';

const LanguageSettingsCard: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors space-y-3">
      <div className="flex items-center gap-2">
        <Languages className="w-4 h-4 text-indigo-500" />
        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
          {t.languageTitle}
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setLanguage('hi')}
          className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all touch-press ${
            language === 'hi'
              ? 'border-2 border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 shadow-2xs'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
          }`}
        >
          हिंदी (Hindi)
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all touch-press ${
            language === 'en'
              ? 'border-2 border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 shadow-2xs'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
          }`}
        >
          English
        </button>
      </div>
    </div>
  );
};

interface SettingsTabProps {
  staff: StaffInfo;
  onLogout: () => void;
  onOpenIdCard: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ staff, onLogout, onOpenIdCard }) => {
  const { mode, setMode, palette, setPalette, paletteMeta } = useTheme();
  const { language, t } = useLanguage();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const themeModes: { id: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'light', label: t.lightMode, icon: Sun },
    { id: 'dark', label: t.darkMode, icon: Moon },
    { id: 'system', label: t.systemAuto, icon: Laptop },
  ];

  const displayLocation =
    !staff.location || (language === 'en' && staff.location === 'भारत पेयजल हरदोई 🇮🇳')
      ? t.defaultLocation
      : staff.location;

  const displayRole =
    !staff.role || (language === 'en' && staff.role === 'जल मित्र (डिलीवरी पार्टनर)')
      ? t.roleValue
      : staff.role;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. Profile Card with Official Bharat Peyjal Logo */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-3 mb-3">
          <BharatPeyjalLogo variant="icon" size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
              {staff.name}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              {t.idPrefix} <strong>{staff.id}</strong> • {displayRole}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {t.areaLabel} {displayLocation}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenIdCard}
          className="w-full min-h-[44px] px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-press"
        >
          <span className="flex items-center gap-2 truncate">
            <IdCard className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="truncate">{t.idCardBtn}</span>
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
      </div>

      {/* 2. Dynamic Theming (Material You Color Accent) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-sky-500" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            {t.dynamicThemingTitle}
          </h4>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          {t.dynamicThemingDesc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(Object.keys(paletteMeta) as DynamicPalette[]).map((key) => {
            const item = paletteMeta[key];
            const isSelected = palette === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setPalette(key)}
                className={`p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all touch-press ${
                  isSelected
                    ? 'border-2 border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-5 h-5 rounded-full shrink-0 shadow-xs flex items-center justify-center text-white text-[10px]"
                    style={{ backgroundColor: item.color }}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate text-slate-900 dark:text-white">
                      {language === 'hi' ? item.hindiName : item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {language === 'hi' ? item.name : item.hindiName}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Appearance (Light / Dark Mode) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors space-y-3">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            {t.appearanceTitle}
          </h4>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {themeModes.map((tm) => {
            const Icon = tm.icon;
            const isSelected = mode === tm.id;

            return (
              <button
                key={tm.id}
                type="button"
                onClick={() => setMode(tm.id)}
                className={`py-2.5 px-2 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-all touch-press ${
                  isSelected
                    ? 'border-2 border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 font-bold shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px]">{tm.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3b. Language Selector */}
      <LanguageSettingsCard />

      {/* 4. Android App & PWA Status */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors space-y-2.5">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            {t.appStatusTitle}
          </h4>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
              {isInstalled ? t.appInstalled : t.browserMode}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
              {t.appVersionText}
            </span>
          </div>

          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs touch-press"
            >
              {t.installAppBtn}
            </button>
          )}

          {isInstalled && (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] shrink-0">
              {t.active}
            </span>
          )}
        </div>
      </div>

      {/* 5. Organization Helpline & Support */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors space-y-2">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
          {t.supportTitle}
        </h4>

        <div className="space-y-1.5 text-xs">
          <a
            href="tel:+917860393198"
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-100"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>{t.helplineShort} <strong>7860393198</strong></span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600">{t.call} →</span>
          </a>

          <a
            href="mailto:hi@bharatpeyjal.in.net"
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-100"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-600" />
              <span>{t.support}: <strong>hi@bharatpeyjal.in.net</strong></span>
            </div>
            <span className="text-[10px] font-bold text-sky-600">{t.sendEmail}</span>
          </a>

          <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-slate-500">
            <a
              href="https://bharatpeyjal.in.net/privacy.html"
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-0.5"
            >
              Privacy Policy <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span>•</span>
            <a
              href="https://bharatpeyjal.in.net/terms.html"
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-0.5"
            >
              Terms & Conditions <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span>•</span>
            <a
              href="https://bharatpeyjal.in.net/tds.html"
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-0.5"
            >
              TDS Report <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 6. Logout Button */}
      <div className="pt-2">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-3 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-bold text-xs flex items-center justify-center gap-2 touch-press hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logoutBtn}</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <LogOut className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              {t.logoutConfirmTitle}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {t.logoutConfirmDesc}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                {t.confirmLogout}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
