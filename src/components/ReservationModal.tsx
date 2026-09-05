import React, { useState, useMemo } from 'react';
import { ResourceItem } from '../types';
import { useApp } from '../context/AppContext';
import { 
  getTodayString, 
  getEarliestReservationDate, 
  getMaxStandardReturnDate,
  daysBetween,
  isValidAdvanceBookingDate,
  isValidLoanDuration
} from '../utils/dateUtils';
import { 
  Calendar, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  FileText, 
  Users, 
  BookOpen, 
  MapPin, 
  AlertTriangle,
  Info
} from 'lucide-react';

interface ReservationModalProps {
  resource: ResourceItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  resource,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser, allUsers, createReservation, reservations } = useApp();
  
  const todayStr = getTodayString();
  const earliestDateStr = getEarliestReservationDate(todayStr);
  const defaultStartDate = earliestDateStr;
  const defaultReturnDate = getMaxStandardReturnDate(defaultStartDate);

  const [selectedApplicantId, setSelectedApplicantId] = useState<string>(currentUser.id);
  const selectedApplicant = useMemo(() => {
    return allUsers.find(u => u.id === selectedApplicantId) || currentUser;
  }, [allUsers, selectedApplicantId, currentUser]);

  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [expectedReturnDate, setExpectedReturnDate] = useState<string>(defaultReturnDate);
  const [expectedReturnTime, setExpectedReturnTime] = useState<string>('17:00');
  
  const [purpose, setPurpose] = useState<string>('');
  const [courseName, setCourseName] = useState<string>('');
  const [targetClass, setTargetClass] = useState<string>('');
  const [estimatedAttendees, setEstimatedAttendees] = useState<number>(resource.capacity ? Math.min(35, resource.capacity) : 30);
  const [agreeRules, setAgreeRules] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 當起始日改變時，自動將預計歸還日預設為起始日+3天以內
  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    const maxEnd = getMaxStandardReturnDate(newStart);
    // 若原歸還日不在合規範圍內，自動調整
    if (expectedReturnDate < newStart || expectedReturnDate > maxEnd) {
      setExpectedReturnDate(maxEnd);
    }
  };

  // 驗證計算
  const advanceCheck = useMemo(() => {
    return isValidAdvanceBookingDate(startDate, todayStr);
  }, [startDate, todayStr]);

  const durationCheck = useMemo(() => {
    return isValidLoanDuration(startDate, expectedReturnDate);
  }, [startDate, expectedReturnDate]);

  // 檢查時段衝堂
  const conflicts = useMemo(() => {
    return reservations.filter(r => {
      if (r.resourceId !== resource.id) return false;
      if (r.status === 'rejected_section' || r.status === 'rejected_director' || r.status === 'cancelled' || r.status === 'returned') return false;
      // 判斷日期交集
      const hasOverlap = (startDate <= r.expectedReturnDate && expectedReturnDate >= r.startDate);
      return hasOverlap;
    });
  }, [reservations, resource.id, startDate, expectedReturnDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!purpose.trim()) {
      setErrorMessage('請填寫借用用途與教學活動說明');
      return;
    }

    if (!advanceCheck.valid) {
      setErrorMessage(`借用須於借用日 3 日前先行登記。最早可借日期為 ${advanceCheck.minAllowedDate}。`);
      return;
    }

    if (!durationCheck.valid) {
      setErrorMessage(`一般借用期限最長為 3 日。該起始日最遲歸還期限為 ${durationCheck.maxAllowedDate}。`);
      return;
    }

    if (!agreeRules) {
      setErrorMessage('請勾選並同意教務處設備借用管理要點');
      return;
    }

    const result = createReservation({
      resourceId: resource.id,
      startDate,
      startTime,
      expectedReturnDate,
      expectedReturnTime,
      purpose,
      courseName,
      targetClass,
      estimatedAttendees: Number(estimatedAttendees),
      applicantId: selectedApplicantId
    });

    if (result.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMessage(result.error || '送出申請失敗');
    }
  };

  const loanDays = daysBetween(startDate, expectedReturnDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto" id="reservation-modal">
      <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                借用登記申請單
              </h3>
              <p className="text-xs text-slate-300">
                教務處招設組業務審查 ➔ 教務主任核定標準程序
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* 借用標的預覽卡片 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3.5">
            <img 
              src={resource.imageUrl} 
              alt={resource.name} 
              className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200 font-semibold">
                  {resource.code}
                </span>
                <span className="text-xs text-slate-500">{resource.location}</span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-slate-900 mt-1 truncate">
                {resource.name}
              </h4>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>保管單位：{resource.custodian}</span>
                {resource.capacity && <span>容納席位：{resource.capacity} 人</span>}
              </div>
            </div>
          </div>

          {/* 申請教職員身分確認與切換 */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="applicant-select" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-600" />
                申請教職員（本校全體教職員名錄）
              </label>
              <span className="text-[11px] text-slate-500">限本校編制內教職員借用</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <select
                  id="applicant-select"
                  value={selectedApplicantId}
                  onChange={(e) => setSelectedApplicantId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-600"
                >
                  <optgroup label="🏛️ 教務處審核人員">
                    {allUsers.filter(u => u.role !== 'faculty').map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.title})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🏫 處室主任與校長室秘書">
                    {allUsers.filter(u => ['user-sec-zheng', 'user-sa-hu', 'user-ga-wang', 'user-guid-wei', 'user-intern-xie'].includes(u.id)).map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.title})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="💼 行政組長與專業員">
                    {allUsers.filter(u => ['user-acad-liu', 'user-acad-hong', 'user-acad-jian', 'user-sa-cai', 'user-sa-yuan', 'user-sa-huang', 'user-sa-chen', 'user-sa-zhang', 'user-sa-coach-chen', 'user-sa-nurse-xu'].includes(u.id)).map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.title})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🔬 實習處五大學程主任">
                    {allUsers.filter(u => ['user-intern-liu-qy', 'user-intern-yang', 'user-intern-cai-xl', 'user-intern-liu-zc', 'user-intern-liu-hr'].includes(u.id)).map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.title})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📚 專任與特色教師">
                    {allUsers.filter(u => ['user-teacher-lee', 'user-teacher-lei', 'user-teacher-cai-lang', 'user-guid-chen'].includes(u.id)).map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.title})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🎓 各班級導師 (12班)">
                    {allUsers.filter(u => u.id.startsWith('user-home-')).map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.title})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] flex flex-col justify-center">
                <span className="text-slate-500">所屬單位</span>
                <span className="font-semibold text-slate-800 truncate">{selectedApplicant.department}</span>
              </div>
              <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] flex flex-col justify-center">
                <span className="text-slate-500">分機 / 公務信箱</span>
                <span className="font-semibold text-slate-800 truncate">{selectedApplicant.phone}</span>
              </div>
            </div>
          </div>

          {/* 核心時間設定 (依規定防呆) */}
          <div className="border border-sky-200 bg-sky-50/50 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                借用與歸還日期排程 (落實 3 日前預約與 3 日內歸還規範)
              </span>
              <span className="text-[11px] text-slate-600">
                借期總計：<strong className="text-sky-700 font-bold">{loanDays === 0 ? '當天歸還 (0天)' : `${loanDays} 天`}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 借用起始日 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. 借用起始日 <span className="text-rose-600">*</span>
                  <span className="text-[11px] font-normal text-amber-700 ml-1">
                    (須 ≥ {earliestDateStr})
                  </span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  <input
                    type="date"
                    min={earliestDateStr}
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="col-span-3 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-600"
                    required
                  />
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="col-span-2 bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                  >
                    <option value="08:00">08:00 (第1節)</option>
                    <option value="09:00">09:00 (第2節)</option>
                    <option value="10:00">10:00 (第3節)</option>
                    <option value="11:00">11:00 (第4節)</option>
                    <option value="13:30">13:30 (第5節)</option>
                    <option value="14:30">14:30 (第6節)</option>
                    <option value="15:30">15:30 (第7節)</option>
                    <option value="16:30">16:30 (課後/社團)</option>
                  </select>
                </div>
                {!advanceCheck.valid && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    未滿 3 日前預約規定（最早須為 {advanceCheck.minAllowedDate}）
                  </p>
                )}
              </div>

              {/* 預計歸還日 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. 預計歸還日 <span className="text-rose-600">*</span>
                  <span className="text-[11px] font-normal text-emerald-700 ml-1">
                    (最遲 ≤ {durationCheck.maxAllowedDate})
                  </span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  <input
                    type="date"
                    min={startDate}
                    max={durationCheck.maxAllowedDate}
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                    className="col-span-3 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-600"
                    required
                  />
                  <select
                    value={expectedReturnTime}
                    onChange={(e) => setExpectedReturnTime(e.target.value)}
                    className="col-span-2 bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                  >
                    <option value="12:00">12:00 (午前歸還)</option>
                    <option value="16:00">16:00 (放學前)</option>
                    <option value="17:00">17:00 (當天下班前)</option>
                    <option value="18:00">18:00 (晚自習前)</option>
                  </select>
                </div>
                {!durationCheck.valid && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    借期超過 3 日限制，若有特殊需求請先送件並於核定後提延長申請
                  </p>
                )}
              </div>
            </div>

            {/* 衝堂檢測提示 */}
            {conflicts.length > 0 && (
              <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">提醒：該時段已有其他預約紀錄：</span>
                  {conflicts.map(c => (
                    <div key={c.id} className="text-[11px] mt-0.5 text-amber-800">
                      • {c.startDate} ~ {c.expectedReturnDate} ({c.applicantName} - {c.purpose})
                    </div>
                  ))}
                  <div className="text-[10px] text-amber-700 mt-1">
                    招設組將會查核設備可調度庫存或安排替代教室。
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 教學與活動目的 */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                借用具體用途 / 課程活動說明 <span className="text-rose-600">*</span>
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="例如：高二自然科「光學折射實驗」公開觀課 / 全國科展代表隊專題製作演練..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white placeholder-slate-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">課程/活動名稱</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="如：探究與實作"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">使用對象班級</label>
                <input
                  type="text"
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  placeholder="如：高一全體 / 高三甲班"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">預估使用人數</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={estimatedAttendees}
                  onChange={(e) => setEstimatedAttendees(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 規範合規確認勾選 */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 text-xs">
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeRules}
                onChange={(e) => setAgreeRules(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-0"
              />
              <span className="text-slate-700 leading-relaxed">
                我已詳閱並切結遵守學校教學設備借用要點：<strong>本單須於借用日前 3 天提出</strong>，借出後<strong>如期於 3 日內歸還</strong>；使用期間負妥善保管責任，若有特殊原因需延長借期，同意另案循程序送招設組及教務主任核定。
              </span>
            </label>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              {errorMessage}
            </div>
          )}

          {/* Footer 動作按鈕 */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              取消返回
            </button>
            <button
              type="submit"
              disabled={!advanceCheck.valid || !durationCheck.valid || !agreeRules}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              確認送出借用申請單
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
