import React from 'react';
import { Menu, Sun, Moon, PhoneCall, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { BharatPeyjalLogo } from './BharatPeyjalLogo';

interface AndroidTopBarProps {
  isLoggedIn: boolean;
  onOpenSidebar: () => void;
  staffName?: string;
  staffId?: string;
  staffPhoto?: string | null;
}

export const AndroidTopBar: React.FC<AndroidTopBarProps> = ({
  isLoggedIn,
  onOpenSidebar,
  staffName,
  staffId,
  staffPhoto,
}) => {
  const { isDark, toggleDark } = useTheme();
  const { language } = useLanguage();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-2xl mx-auto px-2.5 sm:px-4 py-1.5 flex items-center justify-between gap-2">
        {/* Left Zone: Sidebar Drawer Toggle + Bharat Peyjal Brand */}
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 touch-press transition-colors shrink-0"
            title={language === 'hi' ? 'साइडबार मेनू खोलें' : 'Open Sidebar Menu'}
            aria-label={language === 'hi' ? 'साइडबार मेनू खोलें' : 'Open Sidebar Menu'}
          >
            <Menu className="w-5 h-5" />
          </button>

          <BharatPeyjalLogo variant="horizontal" size="sm" showSubtitle={false} />
        </div>

        {/* Right Zone: Dark/Light Toggle + Helpline + User Profile Drawer Trigger */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={toggleDark}
            className="min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 touch-press transition-colors"
            title={
              language === 'hi'
                ? isDark
                  ? 'लाइट मोड चालू करें'
                  : 'डार्क मोड चालू करें'
                : isDark
                ? 'Switch to Light Mode'
                : 'Switch to Dark Mode'
            }
            aria-label="Toggle Dark Mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <a
            href="tel:+917860393198"
            className="min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 touch-press transition-colors"
            title={language === 'hi' ? 'हेल्पलाइन पर कॉल करें' : 'Call Helpline'}
            aria-label="Call Helpline"
          >
            <PhoneCall className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={onOpenSidebar}
            className="min-h-[40px] pl-1.5 pr-2.5 rounded-full flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold touch-press transition-colors whitespace-nowrap max-w-[130px]"
            title={language === 'hi' ? 'प्रोफ़ाइल और सेटिंग्स' : 'Profile & Settings'}
            aria-label={language === 'hi' ? 'प्रोफ़ाइल और सेटिंग्स' : 'Profile & Settings'}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold shrink-0 overflow-hidden"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {isLoggedIn && staffPhoto ? (
                <img src={staffPhoto} alt={staffName || 'Profile'} className="w-full h-full object-cover" />
              ) : isLoggedIn && staffName ? (
                staffName.charAt(0).toUpperCase()
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
            </span>
            <span className="truncate">
              {isLoggedIn ? staffName || staffId || 'Profile' : language === 'hi' ? 'मेनू' : 'Menu'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
