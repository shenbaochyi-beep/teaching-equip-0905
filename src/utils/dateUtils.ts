/**
 * 學校設備借用規則日期處理工具
 * 規則1: 借用前須於借用日3日前先行登記 (Earliest startDate >= Today + 3 days)
 * 規則2: 借用後須於3日內歸還 (expectedReturnDate <= startDate + 3 days)
 * 規則3: 特殊原因延長借用需另案申請
 */

// 取得今日 YYYY-MM-DD
export function getTodayString(): string {
  const now = new Date();
  return formatDate(now);
}

// 格式化 Date 為 YYYY-MM-DD
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 格式化 Date 為 YYYY-MM-DD HH:mm
export function formatDateTime(date: Date): string {
  const dateStr = formatDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${mins}`;
}

// 增加天數
export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

// 計算兩日期相差天數 (b - a)
export function daysBetween(startDateStr: string, endDateStr: string): number {
  const d1 = new Date(startDateStr + 'T00:00:00');
  const d2 = new Date(endDateStr + 'T00:00:00');
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// 計算最早可預約借用日 (今日 + 3天)
export function getEarliestReservationDate(todayStr = getTodayString()): string {
  return addDays(todayStr, 3);
}

// 計算最長標準歸還日 (起始日 + 3天)
export function getMaxStandardReturnDate(startDateStr: string): string {
  return addDays(startDateStr, 3);
}

// 檢查起始日是否符合「3日前登記」規定
export function isValidAdvanceBookingDate(startDateStr: string, todayStr = getTodayString()): { valid: boolean; minAllowedDate: string; diffDays: number } {
  const minAllowedDate = getEarliestReservationDate(todayStr);
  const diffDays = daysBetween(todayStr, startDateStr);
  return {
    valid: diffDays >= 3,
    minAllowedDate,
    diffDays
  };
}

// 檢查歸還日是否符合「3日內歸還」規定
export function isValidLoanDuration(startDateStr: string, returnDateStr: string): { valid: boolean; maxAllowedDate: string; durationDays: number } {
  const durationDays = daysBetween(startDateStr, returnDateStr);
  const maxAllowedDate = getMaxStandardReturnDate(startDateStr);
  return {
    valid: durationDays >= 0 && durationDays <= 3,
    maxAllowedDate,
    durationDays
  };
}

// 產生單號
export function generateTrackingNumber(): string {
  const now = new Date();
  const dateSegment = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `EDU-${dateSegment}-${randomSuffix}`;
}

// 判斷是否重疊預約
export function isTimeRangeOverlap(
  startA: string, 
  endA: string, 
  startB: string, 
  endB: string
): boolean {
  const aStart = new Date(startA).getTime();
  const aEnd = new Date(endA).getTime();
  const bStart = new Date(startB).getTime();
  const bEnd = new Date(endB).getTime();
  return Math.max(aStart, bStart) <= Math.min(aEnd, bEnd);
}
