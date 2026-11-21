import React from 'react';
import {
  LayoutDashboard,
  Truck,
  FileText,
  TrendingUp,
  Droplets,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AndroidBottomNavProps {
  activeTab: ActiveTab;
  pendingBookingCount: number;
  onChangeTab: (tab: ActiveTab) => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  pendingBookingCount,
  onChangeTab,
}) => {
  const { t } = useLanguage();

  const tabs: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeCount?: number;
  }[] = [
    {
      id: 'dashboard',
      label: t.tabDashboard,
      icon: LayoutDashboard,
    },
    {
      id: 'bookings',
      label: t.tabBookings,
      icon: Truck,
      badgeCount: pendingBookingCount,
    },
    {
      id: 'statement',
      label: t.tabStatement,
      icon: FileText,
    },
    {
      id: 'increment',
      label: t.tabIncrement,
      icon: TrendingUp,
    },
    {
      id: 'water_test',
      label: t.tabWaterTest,
      icon: Droplets,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 transition-colors pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className="flex flex-col items-center justify-center h-full min-h-[48px] py-1 select-none touch-press group relative"
              aria-label={tab.label}
            >
              <div
                className={`relative px-3 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'scale-105'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                      }
                    : undefined
                }
              >
                <Icon
                  className={`w-[19px] h-[19px] transition-transform duration-200 ${
                    isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span className="absolute -top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-extrabold inline-flex items-center justify-center shadow-xs tabular-nums">
                    {tab.badgeCount > 99 ? '99+' : tab.badgeCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[9.5px] tracking-tight mt-0.5 transition-colors duration-150 truncate max-w-full px-0.5 ${
                  isActive
                    ? 'font-bold text-slate-900 dark:text-white'
                    : 'font-medium text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
