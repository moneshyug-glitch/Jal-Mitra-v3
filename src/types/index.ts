export type ThemeMode = 'light' | 'dark' | 'system';

export type DynamicPalette = 'ocean' | 'emerald' | 'saffron' | 'indigo' | 'ruby';

export interface CustomerTanki {
  id?: string;
  date: string;
  customer: string;
  amount: number;
  type?: 'regular' | 'alternative';
  address?: string;
}

export interface HalfDayEntry {
  date: string;
}

export interface MonthData {
  month: string;
  baseSalary: number;
  regList: CustomerTanki[];
  regIncentiveTotal: number;
  altList: CustomerTanki[];
  altIncentiveTotal: number;
  bookingPercentBonus: number;
  attendanceBonus: number;
  leaveDays: number;
  halfDays?: number;
  fullLeaveDays?: number;
  halfDayList?: HalfDayEntry[];
  leaveCut: number;
  missedCount: number;
  missedDeliveries: number;
  damagePenalty: number;
  advanceTaken: number;
  totalIncentive: number;
  totalPenalties: number;
  inHand: number;
  paidAmount?: number | null;
}

export interface BookingItem {
  bookingId: string;
  eventType: string;
  deliveryDate: string;
  deliveryDateIso: string;
  deliveryTime?: string;
  jarQty: number;
  customerName: string;
  mobile?: string;
  location?: string;
  totalAmount: number;
  advanceAmount: number;
  dueAmount?: number;
  notes?: string;
  status: 'Pending' | 'Delivered' | string;
  assignedType?: 'ALL' | string;
}

export interface IncrementApiInfo {
  completedMonths?: number;
  totalCustomers?: number;
  incrementCount?: number;
}

export interface StaffInfo {
  name: string;
  id: string;
  phone?: string;
  photo?: string;
  dob?: string;
  role?: string;
  location?: string;
  joinDate?: string;
  joiningDate?: string;
  joiningDateDisplay?: string;
  completedMonths?: number;
  totalCustomers?: number;
  incrementCount?: number;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  staff?: StaffInfo;
  monthList?: string[];
  defaultMonth?: string;
  monthDataMap?: Record<string, MonthData>;
  bookings?: BookingItem[];
  increment?: IncrementApiInfo;
}

export type ActiveTab =
  | 'dashboard'
  | 'bookings'
  | 'statement'
  | 'increment'
  | 'water_test'
  | 'settings';
