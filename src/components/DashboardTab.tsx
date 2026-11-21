import React from 'react';
import {
  Calendar,
  Users,
  AlertTriangle,
  ShieldAlert,
  Award,
  Wallet,
  Gift,
  Scissors,
  HandCoins,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  Clock,
  Truck,
  Camera,
  User,
} from 'lucide-react';
import { BookingItem, MonthData, StaffInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  CareerIncrementSummary,
  getLeaveBreakdown,
  getTodayIsoLocal,
} from '../utils/careerHelpers';

interface DashboardTabProps {
  staff: StaffInfo;
  staffPhoto: string | null;
  onPickPhoto: () => void;
  monthData: MonthData;
  monthList: string[];
  defaultMonth: string;
  selectedMonth: string;
  bookings: BookingItem[];
  incrementSummary: CareerIncrementSummary;
  onMonthChange: (month: string) => void;
  onOpenStatement: () => void;
  onOpenSalarySlip: () => void;
  onOpenBookings: () => void;
  onOpenIncrement: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  staff,
  staffPhoto,
  onPickPhoto,
  monthData,
  monthList,
  defaultMonth,
  selectedMonth,
  bookings,
  incrementSummary,
  onMonthChange,
  onOpenStatement,
  onOpenSalarySlip,
  onOpenBookings,
  onOpenIncrement,
}) => {
  const { t, language } = useLanguage();
  const isHi = language === 'hi';
  const d = monthData;
  const totalCust = (d.regList?.length || 0) + (d.altList?.length || 0);
  const paid = d.paidAmount !== undefined && d.paidAmount !== null ? Number(d.paidAmount) : 0;
  const pending = Math.max(0, Number(d.inHand || 0) - paid);
  const leave = getLeaveBreakdown(d, language);

  const todayIso = getTodayIsoLocal();
  const pendingBookings = bookings.filter((b) => b.status !== 'Delivered');
  const pendingBookingCount = pendingBookings.length;
  const todayBookingCount = pendingBookings.filter((b) => b.deliveryDateIso === todayIso).length;

  const displayLocation =
    !staff.location || (language === 'en' && staff.location === 'भारत पेयजल हरदोई 🇮🇳')
      ? t.defaultLocation
      : staff.location;

  return (
    <div className="space-y-3.5 pb-20 animate-in fade-in duration-200">
      {/* 1. Profile & Month Selector Card with Interactive Profile Photo */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPickPhoto}
            title={t.changePhotoBtn}
            aria-label={t.changePhotoBtn}
            className="relative w-13 h-13 rounded-2xl bg-sky-50 dark:bg-slate-800 text-[#003366] dark:text-sky-300 flex items-center justify-center shrink-0 border border-sky-200 dark:border-slate-700 shadow-2xs touch-press overflow-visible"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
              {staffPhoto ? (
                <img
                  src={staffPhoto}
                  alt={staff.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-900 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-xs"
              aria-hidden="true"
            >
              <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex justify-between items-center mb-0.5 gap-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {t.hello}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60 shrink-0">
                <Sparkles className="w-3 h-3 text-amber-500" /> {t.jalMitra}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
              {staff.name}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                {t.idPrefix} {staff.id}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {displayLocation}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Month Selector Strip */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 flex items-center justify-center shadow-2xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-tight">
                  {t.salaryMonth}
                </span>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {t.monthlySummary}
                </span>
              </div>
            </div>

            <div className="shrink-0 max-w-[175px]">
              <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="w-full text-xs font-bold py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
              >
                {monthList.map((m) => (
                  <option key={m} value={m}>
                    {m} {m === defaultMonth ? t.currentSuffix : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 1B. Live Wedding / Function Bookings Alert Banner */}
      {pendingBookingCount > 0 && (
        <button
          type="button"
          onClick={onOpenBookings}
          className="w-full text-left bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-300 dark:border-amber-800/70 rounded-2xl p-3 shadow-xs flex items-center justify-between gap-2.5 touch-press transition"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-4.5 h-4.5" />
            </span>
            <div className="min-w-0">
              <span className="block text-[10px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                {t.bookingsAlertTitle}
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                {todayBookingCount > 0
                  ? isHi
                    ? `🔥 आज ${todayBookingCount} बुकिंग की डिलीवरी है! (कुल पेंडिंग: ${pendingBookingCount})`
                    : `🔥 ${todayBookingCount} delivery due today! (${pendingBookingCount} pending)`
                  : isHi
                  ? `आपकी ${pendingBookingCount} आगामी शादी / फंक्शन बुकिंग पेंडिंग हैं`
                  : `You have ${pendingBookingCount} upcoming wedding/function booking(s)`}
              </p>
            </div>
          </div>
          <span className="shrink-0 bg-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-0.5">
            {t.bookingsViewBtn} <ChevronRight className="w-3 h-3" />
          </span>
        </button>
      )}

      {/* 2. Net In-Hand Banner */}
      <div
        className="rounded-3xl p-5 text-white shadow-lg relative overflow-hidden transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)',
        }}
      >
        <div className="relative z-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/20 backdrop-blur-xs text-sky-100 mb-1">
            {t.netPayableTitle}
          </span>

          <div className="text-3xl sm:text-4xl font-black text-amber-300 my-1 tabular-nums tracking-tight">
            ₹{d.inHand.toLocaleString('en-IN')}
          </div>

          <p className="text-[11px] text-sky-100/80 mb-3">{t.netPayableSubtitle}</p>

          {/* Paid vs Due Two-Pill Box */}
          <div className="grid grid-cols-2 gap-2 mt-2 text-left">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="block text-[10px] font-medium text-emerald-200">{t.paidAmount}</span>
              <strong className="text-sm sm:text-base font-extrabold text-white tabular-nums">
                ₹{paid.toLocaleString('en-IN')}
              </strong>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="block text-[10px] font-medium text-amber-200">{t.dueAmount}</span>
              <strong className="text-sm sm:text-base font-extrabold text-amber-300 tabular-nums">
                ₹{pending.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          <div className="mt-3 flex justify-center">
            {pending === 0 && d.inHand > 0 ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t.fullyPaidStatus}
              </span>
            ) : pending > 0 ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/30 text-amber-100 border border-amber-300/30">
                <Clock className="w-3.5 h-3.5" /> {t.dueStatusPrefix}
                {pending.toLocaleString('en-IN')} {t.dueStatusSuffix}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-slate-200">
                {t.accountNormal}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Four Summary Stat Badges */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
          <div className="min-w-0 pr-1">
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium">
              {t.statBaseSalary}
            </span>
            <strong className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
              ₹{d.baseSalary.toLocaleString('en-IN')}
            </strong>
          </div>
          <Wallet className="w-4 h-4 text-slate-400 shrink-0" />
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
          <div className="min-w-0 pr-1">
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium">
              {t.statTotalIncentive}
            </span>
            <strong className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              +₹{d.totalIncentive.toLocaleString('en-IN')}
            </strong>
          </div>
          <Gift className="w-4 h-4 text-emerald-500 shrink-0" />
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
          <div className="min-w-0 pr-1">
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium">
              {t.statTotalCut}
            </span>
            <strong className="text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums">
              -₹{d.totalPenalties.toLocaleString('en-IN')}
            </strong>
          </div>
          <Scissors className="w-4 h-4 text-rose-500 shrink-0" />
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
          <div className="min-w-0 pr-1">
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium">
              {t.statAdvanceExpenses}
            </span>
            <strong className="text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              -₹{d.advanceTaken.toLocaleString('en-IN')}
            </strong>
          </div>
          <HandCoins className="w-4 h-4 text-amber-500 shrink-0" />
        </div>
      </div>

      {/* 4. Performance Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shrink-0"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {t.performanceReport}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {d.month}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
            {t.monthlyBadge}
          </span>
        </div>

        {/* 4 KPI Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* KPI 1: New Customers */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 flex flex-col justify-between min-h-[92px]">
            <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400">
              <span className="text-[11px] font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {t.newCustomers}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="my-1">
              <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                {totalCust} {t.customersUnit}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              {d.regList?.length || 0} {t.regularShort} + {d.altList?.length || 0}{' '}
              {t.alternativeShort}
            </p>
          </div>

          {/* KPI 2: Missed Deliveries */}
          <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/40 flex flex-col justify-between min-h-[92px]">
            <div className="flex justify-between items-center text-rose-700 dark:text-rose-400">
              <span className="text-[11px] font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {t.missedDeliveries}
              </span>
              <span className="text-[10px] font-bold">⚠️</span>
            </div>
            <div className="my-1">
              <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                {d.missedCount || 0} {t.complaintsUnit}
              </span>
            </div>
            <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 leading-tight">
              ₹{(d.missedDeliveries || 0).toLocaleString('en-IN')} {t.cutDeducted}
            </p>
          </div>

          {/* KPI 3: Penalty / Damage */}
          <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 flex flex-col justify-between min-h-[92px]">
            <div className="flex justify-between items-center text-amber-700 dark:text-amber-400">
              <span className="text-[11px] font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> {t.penaltyDamage}
              </span>
              <span className="text-[10px]">⚖️</span>
            </div>
            <div className="my-1">
              <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                ₹{(d.damagePenalty || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              {t.negligenceCut}
            </p>
          </div>

          {/* KPI 4: Attendance Record (with Half-Day Support) */}
          <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-900/40 flex flex-col justify-between min-h-[92px]">
            <div className="flex justify-between items-center text-sky-700 dark:text-sky-400">
              <span className="text-[11px] font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> {t.attendanceRecord}
              </span>
              <span className="text-[10px]">📅</span>
            </div>
            <div className="my-1">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight block">
                {leave.hasNoLeave ? t.fullAttendance : leave.summaryText}
              </span>
            </div>
            <p
              className={`text-[10px] font-bold leading-tight ${
                leave.hasNoLeave || d.attendanceBonus > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {leave.hasNoLeave
                ? t.attendanceBonusEligible
                : d.attendanceBonus > 0
                ? isHi
                  ? `+₹${d.attendanceBonus} इनाम मिला`
                  : `+₹${d.attendanceBonus} Bonus Earned`
                : t.attendanceBonusNotEligible}
            </p>
          </div>
        </div>

        {/* Advisory Strip */}
        <div className="mt-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2">
          <span className="shrink-0 text-sm">📢</span>
          <p className="leading-tight">{t.monthlyNotice}</p>
        </div>
      </div>

      {/* 5. Mini Live Increment Progress Preview Card (Opens Full Career/Increment Tab) */}
      <button
        type="button"
        onClick={onOpenIncrement}
        className="w-full text-left bg-white dark:bg-slate-900 rounded-3xl p-3.5 border border-emerald-200/90 dark:border-emerald-900/50 shadow-sm touch-press transition"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-white">
              {t.dashIncCardTitle}
            </span>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full inline-flex items-center gap-0.5">
            <span>
              {incrementSummary.isEligible
                ? t.dashIncEligibleShort
                : `${incrementSummary.custPercent}%`}
            </span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
          <div
            className="inc-progress-fill h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            style={{ width: `${incrementSummary.custPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10.5px] text-slate-600 dark:text-slate-300 font-semibold">
          <span>
            {incrementSummary.customers} / {incrementSummary.targetCustomers}{' '}
            {isHi ? 'नए ग्राहक' : 'New Customers'}
          </span>
          <span>
            {isHi ? 'सेवाकाल:' : 'Tenure:'} {incrementSummary.displayMonths} /{' '}
            {incrementSummary.targetMonths} {isHi ? 'माह' : 'Mo'}
          </span>
        </div>
      </button>

      {/* 6. Quick Shortcut CTA Row */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onOpenStatement}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors touch-press flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {t.viewDetailedStatement}
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {t.nineItemsDescription}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>

        <button
          type="button"
          onClick={onOpenSalarySlip}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors touch-press flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {t.viewSalarySlip}
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {t.shareAndPrintSlip}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      </div>
    </div>
  );
};
