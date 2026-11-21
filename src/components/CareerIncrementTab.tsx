import React, { useEffect, useState } from 'react';
import {
  Award,
  Clock,
  IndianRupee,
  Users,
  Trophy,
  TrendingUp,
  UserPlus,
  CalendarCheck,
  Rocket,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { StaffInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CareerIncrementSummary, formatTenureDuration } from '../utils/careerHelpers';

interface CareerIncrementTabProps {
  staff: StaffInfo;
  summary: CareerIncrementSummary;
}

export const CareerIncrementTab: React.FC<CareerIncrementTabProps> = ({ staff, summary }) => {
  const { t, language } = useLanguage();
  const isHi = language === 'hi';

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const timer = window.setTimeout(() => setAnimated(true), 70);
    return () => window.clearTimeout(timer);
  }, [summary.custPercent, summary.monthPercent]);

  const tenure = formatTenureDuration(staff.joiningDate, summary.months, language);
  const joinDisplay = staff.joiningDateDisplay || staff.joinDate || '----';

  // Smart recommendation box logic matching app.js
  let adviceIcon = <Rocket className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
  let adviceBoxClass =
    'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200';
  let adviceText = '';

  if (summary.isEligible) {
    adviceIcon = <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
    adviceBoxClass =
      'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200 font-bold';
    adviceText = isHi
      ? 'बधाई हो! आपने दोनों शर्तें पूरी कर ली हैं — आप वार्षिक वेतन वृद्धि (Increment) के लिए पात्र हैं!'
      : 'Congratulations! You have met both criteria — you are eligible for your annual salary increment!';
  } else if (summary.isCustDone && !summary.isMonthDone) {
    adviceIcon = <Clock className="w-4 h-4 text-sky-700 dark:text-sky-400 shrink-0" />;
    adviceBoxClass =
      'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900/50 text-slate-700 dark:text-sky-200 font-semibold';
    adviceText = isHi
      ? `शानदार! आपका ग्राहक लक्ष्य पूरा हो चुका है। बस ${summary.monthRemaining} माह का सेवाकाल पूरा होते ही आप इंक्रीमेंट के पात्र होंगे।`
      : `Awesome! Customer target is complete. Complete ${summary.monthRemaining} more month(s) of tenure to unlock your increment.`;
  } else if (!summary.isCustDone && summary.isMonthDone) {
    adviceIcon = <Target className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
    adviceText = isHi
      ? `आपका 1 वर्ष सेवाकाल पूर्ण है! सैलरी इंक्रीमेंट के लिए बस ${summary.custRemaining} नए ग्राहक और जोड़ें।`
      : `Your 1-year tenure is complete! Add just ${summary.custRemaining} more new customers to qualify for your increment.`;
  } else {
    const perMonthNeed =
      summary.monthRemaining > 0
        ? Math.max(1, Math.ceil(summary.custRemaining / summary.monthRemaining))
        : summary.custRemaining;
    adviceText = isHi
      ? `हर माह औसतन ${perMonthNeed} नए ग्राहक जोड़कर आप आसानी से वार्षिक वेतन वृद्धि का लक्ष्य पूरा कर सकते हैं!`
      : `By adding an average of ${perMonthNeed} new customers per month, you can easily reach your annual increment goal!`;
  }

  return (
    <div className="space-y-3.5 pb-20 animate-in fade-in duration-200">
      {/* 1. 4-BOX CAREER SUMMARY CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div
          className="text-white px-4 py-3.5 flex items-center justify-between gap-2"
          style={{
            background: 'linear-gradient(135deg, #002855 0%, var(--primary) 55%, #0284c7 100%)',
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
              <Award className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-extrabold text-xs sm:text-sm leading-tight truncate">
                {t.careerHeaderTitle}
              </h3>
              <span className="text-[10px] text-sky-100/90 block mt-0.5 truncate">
                {t.idCardJoiningLabel}: {joinDisplay}
              </span>
            </div>
          </div>
          <span className="bg-white/15 border border-white/25 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
            {t.careerTotalRecordBadge}
          </span>
        </div>

        <div className="p-3.5 grid grid-cols-2 gap-2.5">
          {/* Box 1: Tenure */}
          <div className="bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/40 rounded-2xl p-3">
            <span className="text-[10.5px] font-bold text-[#003366] dark:text-sky-300 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 shrink-0" /> {t.careerTenureLabel}
            </span>
            <strong className="block text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
              {tenure.main}
            </strong>
            <span className="block text-[9.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {tenure.sub}
            </span>
          </div>

          {/* Box 2: Total Incentive Earned */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 rounded-2xl p-3">
            <span className="text-[10.5px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 mb-1">
              <IndianRupee className="w-3.5 h-3.5 shrink-0" /> {t.careerIncentiveLabel}
            </span>
            <strong className="block text-sm font-extrabold text-emerald-600 dark:text-emerald-400 leading-tight tabular-nums">
              ₹{summary.allIncentive.toLocaleString('en-IN')}
            </strong>
            <span className="block text-[9.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {t.careerIncentiveSub}
            </span>
          </div>

          {/* Box 3: Total Customers Added */}
          <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 rounded-2xl p-3">
            <span className="text-[10.5px] font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1 mb-1">
              <Users className="w-3.5 h-3.5 shrink-0" /> {t.careerCustomersLabel}
            </span>
            <strong className="block text-sm font-extrabold text-slate-900 dark:text-white leading-tight tabular-nums">
              {summary.allCust} {t.customersUnit}
            </strong>
            <span className="block text-[9.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {summary.allReg} {t.regularShort} + {summary.allAlt} {t.alternativeShort}
            </span>
          </div>

          {/* Box 4: Increments Earned */}
          <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-900/50 rounded-2xl p-3">
            <span className="text-[10.5px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1 mb-1">
              <Trophy className="w-3.5 h-3.5 shrink-0" /> {t.careerIncrementCountLabel}
            </span>
            <strong className="block text-sm font-extrabold text-amber-700 dark:text-amber-400 leading-tight tabular-nums">
              {summary.incrementCount} {t.careerTimesUnit}
            </strong>
            <span className="block text-[9.5px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              {summary.incrementCount > 0 ? t.careerIncrementEarnedSub : t.careerIncrementProgressSub}
            </span>
          </div>
        </div>
      </div>

      {/* 2. LIVE INCREMENT PROGRESS TRACKER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div
          className="text-white px-4 py-3.5 flex items-center justify-between gap-2"
          style={{
            background: 'linear-gradient(135deg, #002855 0%, var(--primary) 55%, #0284c7 100%)',
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs sm:text-sm leading-tight truncate">
                {t.incTrackerTitle}
              </h4>
              <span className="text-[10px] text-sky-100/90 block">{t.incTrackerSub}</span>
            </div>
          </div>
          <span
            className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap shadow-xs shrink-0 ${
              summary.isEligible
                ? 'bg-emerald-400 text-slate-900'
                : 'bg-amber-400 text-slate-900'
            }`}
          >
            {summary.isEligible
              ? t.incEligibleBadge
              : `${t.incInProgressLabel} (${summary.overallPercent}%)`}
          </span>
        </div>

        <div className="p-3.5 space-y-3">
          {/* Target 1: New Customers */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 rounded-2xl p-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-0.5">
                  <UserPlus className="w-3 h-3 shrink-0" /> {t.incTarget1Tag}
                </span>
                <p className="text-xs font-extrabold text-slate-800 dark:text-white leading-snug">
                  {isHi
                    ? `आपकी वेतन वृद्धि प्रगति: ${summary.customers} / ${summary.targetCustomers} नए ग्राहक पूरे (${summary.custPercent}%)`
                    : `Increment progress: ${summary.customers} / ${summary.targetCustomers} new customers (${summary.custPercent}%)`}
                </p>
              </div>
              <span className="shrink-0 bg-emerald-600 text-white text-[10.5px] font-extrabold px-2 py-0.5 rounded-full tabular-nums">
                {summary.custPercent}%
              </span>
            </div>

            <div className="w-full h-3 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900 rounded-full overflow-hidden p-0.5">
              <div
                className="inc-progress-fill h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                style={{ width: `${animated ? summary.custPercent : 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-1.5 text-[10px]">
              <span className="text-emerald-800 dark:text-emerald-300 font-semibold">
                {summary.isCustDone
                  ? isHi
                    ? '🎉 बधाई हो! न्यूनतम 36 नए ग्राहकों का लक्ष्य पूरा हुआ'
                    : '🎉 Congrats! 36 new customer target achieved'
                  : isHi
                  ? `लक्ष्य पूरा करने के लिए ${summary.custRemaining} नए ग्राहक और जोड़ें`
                  : `Add ${summary.custRemaining} more new customers to complete target`}
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-bold shrink-0 ml-2">
                {t.incTargetCustLabel}
              </span>
            </div>
          </div>

          {/* Target 2: Tenure */}
          <div className="bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/50 rounded-2xl p-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#003366] dark:text-sky-400 flex items-center gap-1 mb-0.5">
                  <CalendarCheck className="w-3 h-3 shrink-0" /> {t.incTarget2Tag}
                </span>
                <p className="text-xs font-extrabold text-slate-800 dark:text-white leading-snug">
                  {summary.months > summary.targetMonths
                    ? isHi
                      ? `सेवाकाल: ${summary.targetMonths} / ${summary.targetMonths} माह पूरे (कुल ${summary.months} माह)`
                      : `Tenure: ${summary.targetMonths} / ${summary.targetMonths} months (${summary.months} total)`
                    : isHi
                    ? `सेवाकाल: ${summary.displayMonths} / ${summary.targetMonths} माह पूरे`
                    : `Tenure: ${summary.displayMonths} / ${summary.targetMonths} months completed`}
                </p>
              </div>
              <span
                className="shrink-0 text-white text-[10.5px] font-extrabold px-2 py-0.5 rounded-full tabular-nums"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {summary.monthPercent}%
              </span>
            </div>

            <div className="w-full h-3 bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-900 rounded-full overflow-hidden p-0.5">
              <div
                className="inc-progress-fill h-full bg-gradient-to-r from-[#003366] to-[#0284c7] rounded-full"
                style={{ width: `${animated ? summary.monthPercent : 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-1.5 text-[10px]">
              <span className="text-slate-600 dark:text-slate-300 font-semibold">
                {summary.isMonthDone
                  ? isHi
                    ? '✓ 1 वर्ष (12 माह) का सेवाकाल पूर्ण हुआ'
                    : '✓ 1 Year (12 Months) tenure completed'
                  : isHi
                  ? `वार्षिक समीक्षा में ${summary.monthRemaining} माह शेष`
                  : `${summary.monthRemaining} month(s) remaining for annual review`}
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-bold shrink-0 ml-2">
                {t.incTargetMonthLabel}
              </span>
            </div>
          </div>

          {/* Smart Motivational Advice Box */}
          <div className={`border rounded-2xl p-2.5 flex items-center gap-2.5 ${adviceBoxClass}`}>
            {adviceIcon}
            <p className="text-[11px] leading-snug">{adviceText}</p>
          </div>
        </div>
      </div>

      {/* 3. INCREMENT POLICY RULES WITH LIVE STATUS BADGES */}
      <div className="bg-gradient-to-br from-white via-white to-emerald-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 rounded-3xl p-4 shadow-sm border border-emerald-200/80 dark:border-emerald-900/40 transition-colors">
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
                {t.incrementPolicyTitle}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-tight">
                {t.incrementPolicySubtitle}
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 shrink-0">
            {t.incrementBadge}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
          {t.incrementPolicyIntro}
        </p>

        {/* Condition 1 & 2 with Live Badges */}
        <div className="space-y-2 mb-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              1
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between items-center gap-1 mb-0.5">
                <strong className="text-xs text-slate-900 dark:text-white">{t.cond1Title}</strong>
                <span
                  className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    summary.isMonthDone
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {summary.isMonthDone
                    ? t.incDoneBadge
                    : `${summary.displayMonths} / ${summary.targetMonths} ${isHi ? 'माह' : 'Mo'}`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {t.cond1Desc}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              2
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between items-center gap-1 mb-0.5">
                <strong className="text-xs text-slate-900 dark:text-white">{t.cond2Title}</strong>
                <span
                  className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    summary.isCustDone
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-sky-100 dark:bg-sky-900/60 text-[#003366] dark:text-sky-300'
                  }`}
                >
                  {summary.isCustDone
                    ? t.incDoneBadge
                    : `${summary.customers} / ${summary.targetCustomers} ${t.customersUnit}`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {t.cond2Desc}
              </p>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="leading-tight">{t.incrementNote}</p>
        </div>
      </div>
    </div>
  );
};
