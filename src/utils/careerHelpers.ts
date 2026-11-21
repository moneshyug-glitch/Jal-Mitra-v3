import { IncrementApiInfo, MonthData, StaffInfo } from '../types';
import { Language } from '../context/LanguageContext';

export function getTodayIsoLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatTime12Hr(rawTime?: string): string {
  const t = String(rawTime || '').trim();
  if (!t) return '';
  if (/\b(am|pm)\b/i.test(t)) return t;
  const match = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return t;
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  if (isNaN(hour) || hour < 0 || hour > 23) return t;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${String(hour).padStart(2, '0')}:${minute} ${ampm}`;
}

export function formatIndianPhone(rawPhone?: string): string {
  const raw = String(rawPhone || '').trim();
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (/^[6-9]\d{9}$/.test(digits)) {
    return `+91 ${digits}`;
  }
  if (/^91[6-9]\d{9}$/.test(digits)) {
    return `+91 ${digits.slice(2)}`;
  }
  return raw;
}

export interface LeaveBreakdown {
  totalLeave: number;
  halfDaysCount: number;
  fullLeavesCount: number;
  hasNoLeave: boolean;
  summaryText: string;
  halfDayDatesText: string;
  perDayRate: number;
}

export function getLeaveBreakdown(d: MonthData, language: Language): LeaveBreakdown {
  const totalLeave = Number(d.leaveDays || 0);
  const halfDaysCount =
    d.halfDays !== undefined
      ? Number(d.halfDays)
      : totalLeave % 1 !== 0
      ? 1
      : 0;
  const fullLeavesCount =
    d.fullLeaveDays !== undefined
      ? Number(d.fullLeaveDays)
      : Math.max(0, Math.floor(totalLeave - halfDaysCount * 0.5));

  const hasNoLeave = totalLeave === 0 && halfDaysCount === 0;

  let summaryText = '';
  if (language === 'hi') {
    if (fullLeavesCount > 0 && halfDaysCount > 0) {
      summaryText = `${fullLeavesCount} छुट्टी + ${halfDaysCount} हाफ डे`;
    } else if (halfDaysCount > 0) {
      summaryText = `${halfDaysCount} हाफ डे`;
    } else {
      summaryText = `${totalLeave} दिन छुट्टी`;
    }
  } else {
    if (fullLeavesCount > 0 && halfDaysCount > 0) {
      summaryText = `${fullLeavesCount} Leave + ${halfDaysCount} Half Day`;
    } else if (halfDaysCount > 0) {
      summaryText = `${halfDaysCount} Half Day`;
    } else {
      summaryText = `${totalLeave} Days Leave`;
    }
  }

  const halfDayDatesText =
    Array.isArray(d.halfDayList) && d.halfDayList.length > 0
      ? ` (${d.halfDayList.map((h) => h.date).filter(Boolean).join(', ')})`
      : '';

  const perDayRate =
    d.baseSalary > 0
      ? Math.round(d.baseSalary / 30)
      : totalLeave > 0 && d.leaveCut > 0
      ? Math.round(d.leaveCut / totalLeave)
      : 0;

  return {
    totalLeave,
    halfDaysCount,
    fullLeavesCount,
    hasNoLeave,
    summaryText,
    halfDayDatesText,
    perDayRate,
  };
}

export function parseDateLocalSafe(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const isoMatch = String(dateStr).trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export function calcMonthsFromJoinDate(dateStr?: string): number | null {
  const jd = parseDateLocalSafe(dateStr);
  if (!jd) return null;
  const now = new Date();
  if (jd > now) return 0;
  let months = (now.getFullYear() - jd.getFullYear()) * 12 + (now.getMonth() - jd.getMonth());
  if (now.getDate() < jd.getDate()) months -= 1;
  return Math.max(0, months);
}

export function formatTenureDuration(
  dateStr: string | undefined,
  fallbackMonths: number,
  language: Language
): { main: string; sub: string } {
  const jd = parseDateLocalSafe(dateStr);
  if (!jd) {
    return language === 'hi'
      ? { main: `${fallbackMonths} माह`, sub: 'भारत पेयजल के साथ' }
      : { main: `${fallbackMonths} Months`, sub: 'With Bharat Payjal' };
  }

  const now = new Date();
  if (jd > now) {
    return language === 'hi'
      ? { main: '0 दिन', sub: 'जॉइनिंग आगामी' }
      : { main: '0 Days', sub: 'Joining Upcoming' };
  }

  let years = now.getFullYear() - jd.getFullYear();
  let months = now.getMonth() - jd.getMonth();
  let days = now.getDate() - jd.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  let mainText = '';
  if (language === 'hi') {
    if (years > 0 && months > 0) {
      mainText = `${years} वर्ष ${months} माह`;
    } else if (years > 0) {
      mainText = `${years} वर्ष${days > 0 ? ` ${days} दिन` : ''}`;
    } else if (months > 0 && days > 0) {
      mainText = `${months} माह ${days} दिन`;
    } else if (months > 0) {
      mainText = `${months} माह`;
    } else {
      mainText = `${days} दिन`;
    }
  } else {
    if (years > 0 && months > 0) {
      mainText = `${years} Yr ${months} Mo`;
    } else if (years > 0) {
      mainText = `${years} Yr${days > 0 ? ` ${days}d` : ''}`;
    } else if (months > 0 && days > 0) {
      mainText = `${months} Mo ${days}d`;
    } else if (months > 0) {
      mainText = `${months} Months`;
    } else {
      mainText = `${days} Days`;
    }
  }

  const totalFullMonths = years * 12 + months;
  const subText =
    totalFullMonths > 0
      ? language === 'hi'
        ? `कुल ${totalFullMonths} माह पूरे`
        : `${totalFullMonths} Total Months Completed`
      : language === 'hi'
      ? 'भारत पेयजल के साथ'
      : 'With Bharat Payjal';

  return { main: mainText, sub: subText };
}

export interface CareerIncrementSummary {
  customers: number;
  months: number;
  targetCustomers: number;
  targetMonths: number;
  custPercent: number;
  custRemaining: number;
  isCustDone: boolean;
  displayMonths: number;
  monthPercent: number;
  monthRemaining: number;
  isMonthDone: boolean;
  overallPercent: number;
  isEligible: boolean;
  allIncentive: number;
  allReg: number;
  allAlt: number;
  allCust: number;
  incrementCount: number;
}

export function calculateCareerAndIncrement(
  staff: StaffInfo,
  monthList: string[],
  monthDataMap: Record<string, MonthData>,
  incrementApi?: IncrementApiInfo
): CareerIncrementSummary {
  const targetCustomers = 36;
  const targetMonths = 12;

  let allIncentive = 0;
  let allReg = 0;
  let allAlt = 0;

  monthList.forEach((mKey) => {
    const mData = monthDataMap[mKey];
    if (mData) {
      allIncentive += Number(mData.totalIncentive || 0);
      allReg += Array.isArray(mData.regList) ? mData.regList.length : 0;
      allAlt += Array.isArray(mData.altList) ? mData.altList.length : 0;
    }
  });
  const allCust = allReg + allAlt;

  let monthsCount = monthList.length;
  if (incrementApi?.completedMonths !== undefined) {
    monthsCount = Number(incrementApi.completedMonths) || 0;
  } else if (staff.completedMonths !== undefined) {
    monthsCount = Number(staff.completedMonths) || 0;
  } else {
    const joinedMonths = calcMonthsFromJoinDate(staff.joiningDate);
    if (joinedMonths !== null) {
      monthsCount = joinedMonths;
    }
  }

  let totalNewCustomers = 0;
  if (incrementApi?.totalCustomers !== undefined) {
    totalNewCustomers = Number(incrementApi.totalCustomers) || 0;
  } else if (staff.totalCustomers !== undefined) {
    totalNewCustomers = Number(staff.totalCustomers) || 0;
  } else {
    const cycleMonths = monthList.slice(-12);
    cycleMonths.forEach((mKey) => {
      const mData = monthDataMap[mKey];
      if (mData) {
        const regLen = Array.isArray(mData.regList) ? mData.regList.length : 0;
        const altLen = Array.isArray(mData.altList) ? mData.altList.length : 0;
        totalNewCustomers += regLen + altLen;
      }
    });
  }

  const customers = Math.max(0, totalNewCustomers);
  const months = Math.max(0, monthsCount);

  const custPercent = Math.min(100, Math.round((customers / targetCustomers) * 100));
  const custRemaining = Math.max(0, targetCustomers - customers);
  const isCustDone = customers >= targetCustomers;

  const displayMonths = Math.min(targetMonths, months);
  const monthPercent = Math.min(100, Math.round((displayMonths / targetMonths) * 100));
  const monthRemaining = Math.max(0, targetMonths - displayMonths);
  const isMonthDone = months >= targetMonths;

  const overallPercent = Math.round((custPercent + monthPercent) / 2);
  const isEligible = isCustDone && isMonthDone;

  let incrementCount = Math.min(Math.floor(months / 12), Math.floor(allCust / 36));
  if (incrementApi?.incrementCount !== undefined) {
    incrementCount = Number(incrementApi.incrementCount) || 0;
  } else if (staff.incrementCount !== undefined) {
    incrementCount = Number(staff.incrementCount) || 0;
  }

  return {
    customers,
    months,
    targetCustomers,
    targetMonths,
    custPercent,
    custRemaining,
    isCustDone,
    displayMonths,
    monthPercent,
    monthRemaining,
    isMonthDone,
    overallPercent,
    isEligible,
    allIncentive,
    allReg,
    allAlt,
    allCust,
    incrementCount,
  };
}

// Unified local profile photo helpers synced across Dashboard, Sidebar, TopBar, and Digital ID Card
export function getStaffPhotoKey(staffId: string): string {
  const clean = String(staffId || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  return clean && clean !== 'BP---' ? `bp_profile_photo_${clean}` : '';
}

export function getSavedStaffPhoto(staffId: string): string {
  const key = getStaffPhotoKey(staffId);
  if (!key) return '';
  try {
    const primary = localStorage.getItem(key);
    if (primary) return primary;
    const legacyKey = `bp_id_photo_${key.replace('bp_profile_photo_', '')}`;
    const legacy = localStorage.getItem(legacyKey);
    if (legacy) {
      localStorage.setItem(key, legacy);
      return legacy;
    }
    return '';
  } catch {
    return '';
  }
}

export function saveStaffPhoto(staffId: string, dataUrl: string): void {
  const key = getStaffPhotoKey(staffId);
  if (!key) return;
  try {
    localStorage.setItem(key, dataUrl);
  } catch {
    // Ignore storage quota errors
  }
}

export function clearStaffPhoto(staffId: string): void {
  const key = getStaffPhotoKey(staffId);
  if (!key) return;
  try {
    localStorage.removeItem(key);
    const legacyKey = `bp_id_photo_${key.replace('bp_profile_photo_', '')}`;
    localStorage.removeItem(legacyKey);
  } catch {
    // Ignore errors
  }
}

export function resizeAndCropSquareImage(file: File, size = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    const objUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const minSide = Math.min(w, h);
        const sx = Math.floor((w - minSide) / 2);
        const sy = Math.floor((h - minSide) / 2);

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objUrl);
          reject(new Error('Canvas unavailable'));
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.84);
        URL.revokeObjectURL(objUrl);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(objUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      reject(new Error('Unable to load image file'));
    };

    img.src = objUrl;
  });
}
