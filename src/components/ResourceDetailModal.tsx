import React, { useState, useMemo, useEffect } from 'react';
import { ResourceItem } from '../types';
import { useApp } from '../context/AppContext';
import { LOCKED_ROOM_IMAGES, LOCKED_CLASSROOM_IDS } from '../data/mockData';
import { 
  Building, 
  MapPin, 
  Users, 
  CheckCircle2, 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar, 
  Clock, 
  Layers,
  Sparkles,
  Camera,
  AlertCircle,
  CalendarCheck2,
  Lock
} from 'lucide-react';
import { 
  getTodayString, 
  getEarliestReservationDate, 
  getMaxStandardReturnDate, 
  isValidAdvanceBookingDate 
} from '../utils/dateUtils';

interface ResourceDetailModalProps {
  resource: ResourceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (resource: ResourceItem) => void;
  onOpenImageModal?: (resource: ResourceItem) => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  isOpen,
  onClose,
  onBook,
  onOpenImageModal
}) => {
  const { reservations, currentUser, isAuthenticated } = useApp();
  const hasPhotoPermission = (currentUser.role === 'academic_director' || currentUser.role === 'section_officer') && isAuthenticated;

  const todayStr = getTodayString();
  const defaultCheckDate = getEarliestReservationDate(todayStr);
  const [checkDate, setCheckDate] = useState<string>(defaultCheckDate);

  // 當開啟視窗或切換資源時，重設查詢日期為最早合規預約日
  useEffect(() => {
    if (isOpen && resource) {
      setCheckDate(defaultCheckDate);
    }
  }, [isOpen, resource?.id, defaultCheckDate]);

  // 取得此資源未來的有效預約 (排除已歸還、已撤案、已否決)
  const upcomingReservations = useMemo(() => {
    if (!resource) return [];
    return reservations
      .filter(r => 
        r.resourceId === resource.id && 
        (r.status === 'approved' || r.status === 'borrowed' || r.status === 'section_approved' || r.status === 'pending_section')
      )
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [reservations, resource]);

  // 即時檢查使用者選擇的檢查日期是否有衝突已預約
  const conflictingReservations = useMemo(() => {
    if (!resource || !checkDate) return [];
    return upcomingReservations.filter(r => {
      // 判斷 checkDate 是否落在該筆預約的區間內 (startDate ~ expectedReturnDate)
      return checkDate >= r.startDate && checkDate <= r.expectedReturnDate;
    });
  }, [upcomingReservations, resource, checkDate]);

  const hasConflict = conflictingReservations.length > 0;

  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto" id="resource-detail-modal">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header with Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900 group">
          <img 
            src={resource.imageUrl} 
            alt={resource.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (resource.isPhotoLocked || resource.id in LOCKED_ROOM_IMAGES || target.src.startsWith('data:image/')) {
                return;
              }
              if (!target.src.includes('unsplash')) {
                target.src = 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {resource.isPhotoLocked && (
              <span 
                className="bg-amber-950/85 text-amber-300 border border-amber-500/50 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 backdrop-blur shadow"
                title={resource.photoLockedBy ? `實景照片已由 ${resource.photoLockedBy} 上傳並核定鎖定` : '實景照片已核定鎖定'}
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>照片已鎖定</span>
                {resource.photoLockedBy && (
                  <span className="hidden sm:inline text-amber-200/80 text-[11px]">（{resource.photoLockedBy}）</span>
                )}
              </span>
            )}
            {onOpenImageModal && hasPhotoPermission && (
              <button
                type="button"
                onClick={() => onOpenImageModal(resource)}
                className={`${
                  currentUser.role === 'academic_director'
                    ? 'bg-purple-900/80 hover:bg-purple-700 text-purple-100 border-purple-500/60 hover:border-purple-400'
                    : 'bg-sky-900/80 hover:bg-sky-700 text-sky-100 border-sky-500/60 hover:border-sky-400'
                } px-3 py-1.5 rounded-full backdrop-blur transition-all border text-xs font-semibold flex items-center gap-1.5 shadow`}
                title={currentUser.role === 'academic_director' ? '教務主任主管權限：上傳或更換實景相片' : '招設組長管理權限：上傳或更換實景相片'}
              >
                <Camera className={`w-3.5 h-3.5 ${currentUser.role === 'academic_director' ? 'text-purple-300' : 'text-sky-300'}`} />
                <span>修訂相片</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white p-2 rounded-full backdrop-blur transition-colors border border-slate-700 hover:border-slate-500"
              aria-label="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/40">
                  {resource.code}
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  {resource.location}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {resource.name}
              </h2>
            </div>
            
            <div className="hidden sm:block">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                resource.status === 'available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                resource.status === 'in_use' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {resource.status === 'available' ? '🟢 閒置可借用' :
                 resource.status === 'in_use' ? '🔵 目前使用中' : '🟡 預約調度中'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* 即時檔期預約衝突檢查區塊 */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4.5 space-y-3.5 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    即時檔期衝突檢查
                    <span className="text-[11px] font-normal text-sky-400">（選擇預計借用日期即時核對）</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    請選取您預計借用之日期，系統將自動比對目前所有已登記或已核准之借用排程
                  </p>
                </div>
              </div>

              {/* 日期選擇輸入框 */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <label htmlFor="detail-check-date" className="text-xs font-semibold text-slate-300 whitespace-nowrap">
                  查詢日期：
                </label>
                <input
                  id="detail-check-date"
                  type="date"
                  value={checkDate}
                  min={todayStr}
                  onChange={(e) => setCheckDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                />
              </div>
            </div>

            {/* 衝突判斷與即時狀態回饋 */}
            {hasConflict ? (
              <div 
                id="conflict-warning-banner"
                className="bg-rose-950/60 border-2 border-rose-600/80 rounded-xl p-3.5 flex items-start gap-3 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="p-1.5 bg-rose-600/20 text-rose-400 rounded-lg shrink-0 mt-0.5 border border-rose-500/40">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-rose-600 text-white font-bold rounded text-[11px]">
                      時段衝突
                    </span>
                    <strong className="text-rose-200 font-bold text-xs sm:text-sm">
                      您選擇的日期（{checkDate}）已被他人預約，無法重複登記！
                    </strong>
                  </div>
                  <div className="text-xs text-rose-300/90 leading-relaxed">
                    該日已有借用排程正在使用或已通過核准：
                    <ul className="mt-1 space-y-1 list-disc list-inside text-[11px] text-rose-200 font-medium">
                      {conflictingReservations.map(conf => (
                        <li key={conf.id}>
                          <strong>{conf.startDate} ~ {conf.expectedReturnDate}</strong>：
                          {conf.applicantName} 老師（{conf.applicantDepartment}）· 用途：{conf.purpose}
                          <span className="ml-1.5 text-rose-400 font-mono">[{conf.status === 'borrowed' ? '使用中' : '已核准排程'}]</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-[11px] text-rose-400 pt-1 flex items-center gap-1 font-semibold">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    因時段衝突，下方「立即登記借用」按鈕已自動鎖定，請更換其他日期。
                  </div>
                </div>
              </div>
            ) : (
              <div 
                id="conflict-safe-banner"
                className="bg-emerald-950/40 border border-emerald-700/60 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-200"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>{checkDate}</strong> 目前無人預約，檔期完全空閒，可正常辦理借用登記。
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 bg-emerald-900/60 text-emerald-300 rounded font-medium border border-emerald-700/50">
                  可預約
                </span>
              </div>
            )}
          </div>

          {/* 基本描述與管理單位 */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">場地/設備簡介</h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* 規格配置清單 */}
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              硬體配備與功能清單
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {resource.specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 使用注意事項 */}
          <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl p-4 text-xs text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300 mb-0.5">使用與保養注意事項</div>
              <div className="leading-relaxed text-amber-200/90">{resource.cautionNotes}</div>
              <div className="mt-1 text-[11px] text-amber-400/80">
                ※ 借用後須於 3 日內完成點收歸還手續。逾期未還或特殊需求者請事先辦理延長申請。
              </div>
            </div>
          </div>

          {/* 已登記檔期預覽 */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-400" />
              已登記/預約使用排程 ({upcomingReservations.length})
            </h4>
            {upcomingReservations.length === 0 ? (
              <div className="bg-slate-800/40 p-4 rounded-xl text-center text-xs text-slate-400">
                目前近期尚無其他預約登記，歡迎教職員提前登記借用。
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingReservations.map(res => (
                  <div 
                    key={res.id} 
                    onClick={() => setCheckDate(res.startDate)}
                    title="點擊此時段可將查詢日期帶入此預約之起始日測試衝突檢查"
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      checkDate >= res.startDate && checkDate <= res.expectedReturnDate
                        ? 'bg-rose-950/40 border-rose-600/70 shadow-sm'
                        : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-200 flex items-center gap-2">
                        <span>{res.startDate} ({res.startTime}) 至 {res.expectedReturnDate} ({res.expectedReturnTime})</span>
                        {checkDate >= res.startDate && checkDate <= res.expectedReturnDate && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-600/80 text-white font-bold">
                            當前查詢衝突
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        申請人：{res.applicantName} ({res.applicantDepartment}) · {res.purpose}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-sky-950 text-sky-300 border border-sky-800 shrink-0">
                      {res.status === 'borrowed' ? '使用中' : '已核准排程'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 self-start sm:self-auto">
            保管處室：<strong className="text-slate-200">{resource.custodian}</strong>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
            >
              關閉
            </button>

            {/* 衝突時鎖定按鈕，並標記紅色禁用樣式與提示 */}
            <button
              id="detail-book-now-button"
              type="button"
              disabled={hasConflict}
              onClick={() => {
                if (hasConflict) return;
                onClose();
                onBook(resource);
              }}
              title={hasConflict ? '所選日期已有預約衝突，按鈕已鎖定' : '立即登記借用'}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                hasConflict
                  ? 'bg-rose-950/80 text-rose-300/60 border border-rose-800/60 cursor-not-allowed shadow-none'
                  : 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer active:scale-95'
              }`}
            >
              {hasConflict ? (
                <>
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>時段已被預約 (已鎖定)</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>立即登記借用 (提前30日預約)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

