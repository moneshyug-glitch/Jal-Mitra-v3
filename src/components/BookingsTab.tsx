import React, { useMemo, useState } from 'react';
import {
  CalendarCheck,
  Phone,
  MapPin,
  ChevronDown,
  StickyNote,
  Sparkles,
  Navigation,
} from 'lucide-react';
import { BookingItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatTime12Hr, getTodayIsoLocal } from '../utils/careerHelpers';

interface BookingsTabProps {
  bookings: BookingItem[];
}

const DeliveryTruckSvg: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 40"
    className="w-8 h-5 shrink-0 drop-shadow-xs"
    aria-hidden="true"
  >
    <rect x="2" y="6" width="36" height="22" rx="4" fill="#0284c7" stroke="#003366" strokeWidth="2" />
    <path
      d="M20 11 C20 11 15 17 15 20.5 A5 5 0 0 0 25 20.5 C25 17 20 11 20 11 Z"
      fill="#e0f2fe"
    />
    <path
      d="M38 13 H50 L58 21 V28 H38 Z"
      fill="#f97316"
      stroke="#003366"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M41 16 H49 L54 21 H41 Z" fill="#e0f2fe" />
    <rect x="3" y="27" width="56" height="3.5" rx="1.5" fill="#003366" />
    <circle cx="15" cy="32" r="5.5" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
    <circle cx="15" cy="32" r="2" fill="#cbd5e1" />
    <circle cx="48" cy="32" r="5.5" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
    <circle cx="48" cy="32" r="2" fill="#cbd5e1" />
  </svg>
);

export const BookingsTab: React.FC<BookingsTabProps> = ({ bookings }) => {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<'Pending' | 'Delivered'>('Pending');
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const todayIso = useMemo(() => getTodayIsoLocal(), []);

  const pendingList = useMemo(
    () => bookings.filter((b) => b.status !== 'Delivered'),
    [bookings]
  );
  const deliveredList = useMemo(
    () => bookings.filter((b) => b.status === 'Delivered'),
    [bookings]
  );

  const listToShow = filter === 'Delivered' ? deliveredList : pendingList;

  const isExpanded = (key: string, defaultOpen: boolean) => {
    if (expandedKeys[key] !== undefined) return expandedKeys[key];
    return defaultOpen;
  };

  const toggleExpand = (key: string, current: boolean) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: !current }));
  };

  return (
    <div className="space-y-3.5 pb-20 animate-in fade-in duration-200">
      {/* Header & Filter Card */}
      <div
        className="rounded-3xl p-4 text-white shadow-md"
        style={{
          background: 'linear-gradient(135deg, #002855 0%, var(--primary) 55%, #0284c7 100%)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-extrabold text-sm leading-tight truncate">{t.bookingsTitle}</h3>
            <p className="text-[11px] text-sky-100/90 leading-tight mt-0.5 truncate">
              {t.bookingsSubtitle}
            </p>
          </div>
        </div>

        {/* Pending vs Completed Filter Bar */}
        <div className="grid grid-cols-2 gap-2 mt-3.5">
          <button
            type="button"
            onClick={() => setFilter('Pending')}
            className={`min-h-[40px] py-2 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 touch-press ${
              filter === 'Pending'
                ? 'bg-white text-[#003366] shadow-sm'
                : 'bg-white/15 text-white border border-white/20 hover:bg-white/20'
            }`}
          >
            <span className="truncate">{t.bookingsPendingTab}</span>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full tabular-nums ${
                filter === 'Pending'
                  ? 'bg-amber-400 text-slate-900'
                  : 'bg-white/25 text-white'
              }`}
            >
              {pendingList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('Delivered')}
            className={`min-h-[40px] py-2 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 touch-press ${
              filter === 'Delivered'
                ? 'bg-white text-[#003366] shadow-sm'
                : 'bg-white/15 text-white border border-white/20 hover:bg-white/20'
            }`}
          >
            <span className="truncate">{t.bookingsDeliveredTab}</span>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full tabular-nums ${
                filter === 'Delivered'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/25 text-white'
              }`}
            >
              {deliveredList.length}
            </span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {listToShow.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
            {t.bookingsEmptyTitle}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filter === 'Delivered' ? t.bookingsEmptyDelivered : t.bookingsEmptyPending}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {listToShow.map((b, idx) => {
            const key = `${filter}-${b.bookingId || idx}-${idx}`;
            const isDelivered = b.status === 'Delivered';
            const isToday = !isDelivered && b.deliveryDateIso === todayIso;
            const isPastDue = !isDelivered && Boolean(b.deliveryDateIso) && b.deliveryDateIso < todayIso;

            let headerBgClass = 'bg-[#003366] text-white';
            let cardBorderClass = 'border-slate-200 dark:border-slate-800';
            let statusBadge = (
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                {t.bookingsUpcomingBadge}
              </span>
            );

            if (isDelivered) {
              headerBgClass = 'bg-emerald-700 text-white';
              cardBorderClass = 'border-emerald-300 dark:border-emerald-800';
              statusBadge = (
                <span className="bg-white text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap">
                  {t.bookingsDoneBadge}
                </span>
              );
            } else if (isToday) {
              headerBgClass = 'bg-gradient-to-r from-rose-600 to-orange-600 text-white';
              cardBorderClass = 'border-rose-400 ring-2 ring-rose-200 dark:ring-rose-900/50';
              statusBadge = (
                <span className="bg-white text-rose-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                  {t.bookingsTodayBadge}
                </span>
              );
            } else if (isPastDue) {
              headerBgClass = 'bg-amber-700 text-white';
              cardBorderClass = 'border-amber-300 dark:border-amber-800';
              statusBadge = (
                <span className="bg-amber-200 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap">
                  {t.bookingsPendingBadge}
                </span>
              );
            }

            const cleanPhone = String(b.mobile || '').replace(/[^\d+]/g, '');
            const hasPhone = cleanPhone.length >= 10;

            const rawLoc = String(b.location || '').trim();
            const hasLocation = rawLoc.length > 0;
            const isMapUrl = /^https?:\/\//i.test(rawLoc);
            const mapHref = hasLocation
              ? isMapUrl
                ? rawLoc
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rawLoc)}`
              : undefined;

            const totalAmt = Number(b.totalAmount || 0);
            const advAmt = Number(b.advanceAmount || 0);
            const dueAmt = Number(
              b.dueAmount !== undefined ? b.dueAmount : Math.max(0, totalAmt - advAmt)
            );
            const formattedTime = formatTime12Hr(b.deliveryTime);
            const expanded = isExpanded(key, isToday);

            return (
              <article
                key={key}
                className={`bg-white dark:bg-slate-900 rounded-3xl border ${cardBorderClass} shadow-sm overflow-hidden transition-colors`}
              >
                {/* Card Header Strip */}
                <div className={`${headerBgClass} px-3.5 py-2.5 flex items-center justify-between gap-2`}>
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="bg-black/25 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md tabular-nums">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-extrabold truncate">
                      🎉 {b.eventType || (language === 'hi' ? 'फंक्शन' : 'Function')}
                    </span>
                    {b.assignedType === 'ALL' ? (
                      <span className="bg-white/20 text-sky-100 text-[9.5px] font-bold px-2 py-0.5 rounded-full">
                        {t.bookingsAllDuty}
                      </span>
                    ) : (
                      <span className="bg-amber-300 text-slate-900 text-[9.5px] font-extrabold px-2 py-0.5 rounded-full">
                        {t.bookingsYourDuty}
                      </span>
                    )}
                  </div>
                  <div className="shrink-0">{statusBadge}</div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 space-y-2.5">
                  {/* Delivery Truck + Date/Time + Jar Count */}
                  <div className="bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/50 rounded-2xl px-3 py-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <DeliveryTruckSvg />
                      <div className="min-w-0 leading-tight">
                        <span className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400">
                          {t.bookingsDateTimeLabel}
                        </span>
                        <strong className="block text-xs font-extrabold text-[#003366] dark:text-sky-300 truncate mt-0.5">
                          {b.deliveryDate || (language === 'hi' ? 'तारीख तय नहीं' : 'Date TBD')}
                          {formattedTime ? ` • ${formattedTime}` : ''}
                        </strong>
                      </div>
                    </div>
                    <span className="shrink-0 bg-white dark:bg-slate-800 border border-sky-300 dark:border-sky-700 text-sky-800 dark:text-sky-200 text-xs font-extrabold px-2.5 py-1 rounded-xl shadow-2xs tabular-nums">
                      💧 {Number(b.jarQty || 0)} {t.bookingsJarUnit}
                    </span>
                  </div>

                  {/* Customer Name & Due Amount */}
                  <div className="flex items-center justify-between gap-2 px-0.5">
                    <div className="min-w-0">
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        {t.bookingsCustomerLabel}
                      </span>
                      <strong className="block text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {b.customerName || (language === 'hi' ? 'ग्राहक' : 'Customer')}
                      </strong>
                    </div>
                    <div
                      className={`text-right shrink-0 border rounded-2xl px-2.5 py-1 ${
                        dueAmt > 0
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50'
                      }`}
                    >
                      <span
                        className={`block text-[9.5px] font-bold ${
                          dueAmt > 0
                            ? 'text-rose-700 dark:text-rose-300'
                            : 'text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {t.bookingsDueCollectLabel}
                      </span>
                      <strong
                        className={`text-sm font-extrabold tabular-nums ${
                          dueAmt > 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        ₹{dueAmt.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {/* Location Strip */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 rounded-2xl px-3 py-2 flex items-start gap-2 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1 text-slate-700 dark:text-slate-200 font-semibold break-words">
                      {hasLocation
                        ? isMapUrl
                          ? t.bookingsMapLinkAttached
                          : rawLoc
                        : t.bookingsNoLocation}
                    </div>
                  </div>

                  {/* Collapsible Details Drawer */}
                  {expanded && (
                    <div className="space-y-2 pt-0.5 animate-in fade-in duration-150">
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-2">
                          <span className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400">
                            {t.bookingsTotalBill}
                          </span>
                          <strong className="text-xs font-extrabold text-slate-800 dark:text-white tabular-nums">
                            ₹{totalAmt.toLocaleString('en-IN')}
                          </strong>
                        </div>
                        <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-2">
                          <span className="block text-[9.5px] font-bold text-emerald-700 dark:text-emerald-300">
                            {t.bookingsAdvancePaid}
                          </span>
                          <strong className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            ₹{advAmt.toLocaleString('en-IN')}
                          </strong>
                        </div>
                        <div
                          className={`border rounded-xl p-2 ${
                            dueAmt > 0
                              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                              : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
                          }`}
                        >
                          <span
                            className={`block text-[9.5px] font-bold ${
                              dueAmt > 0
                                ? 'text-rose-700 dark:text-rose-300'
                                : 'text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {t.bookingsRemainingDue}
                          </span>
                          <strong
                            className={`text-xs font-extrabold tabular-nums ${
                              dueAmt > 0
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            ₹{dueAmt.toLocaleString('en-IN')}
                          </strong>
                        </div>
                      </div>

                      {b.notes && (
                        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-2.5 flex items-start gap-2 text-[11px]">
                          <StickyNote className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                          <div className="text-amber-950 dark:text-amber-200 font-medium break-words">
                            <strong>{t.bookingsNotePrefix}</strong> {b.notes}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono px-1">
                        <span>
                          {language === 'hi' ? 'बुकिंग ID:' : 'Booking ID:'} #{b.bookingId || '---'}
                        </span>
                        <span>
                          {language === 'hi' ? 'मोबाइल:' : 'Mobile:'}{' '}
                          {hasPhone ? b.mobile : language === 'hi' ? 'उपलब्ध नहीं' : 'N/A'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 3 Action Buttons: Call / Open Map / Details Toggle */}
                  <div className="grid grid-cols-3 gap-2 pt-0.5">
                    {hasPhone ? (
                      <a
                        href={`tel:${cleanPhone}`}
                        className="min-h-[40px] py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs font-bold text-[11px] flex items-center justify-center gap-1 transition touch-press"
                      >
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{t.bookingsCallBtn}</span>
                      </a>
                    ) : (
                      <span className="min-h-[40px] py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-[11px] flex items-center justify-center gap-1">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{t.bookingsNoNumber}</span>
                      </span>
                    )}

                    {hasLocation && mapHref ? (
                      <a
                        href={mapHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[40px] py-2 px-2 rounded-xl text-white shadow-2xs font-bold text-[11px] flex items-center justify-center gap-1 transition touch-press"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        <Navigation className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{t.bookingsOpenMapBtn}</span>
                      </a>
                    ) : (
                      <span className="min-h-[40px] py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-[11px] flex items-center justify-center gap-1">
                        <Navigation className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{t.bookingsOpenMapBtn}</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleExpand(key, expanded)}
                      className="min-h-[40px] py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-[11px] flex items-center justify-center gap-1 transition touch-press"
                    >
                      <span>{t.bookingsDetailsBtn}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          expanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
