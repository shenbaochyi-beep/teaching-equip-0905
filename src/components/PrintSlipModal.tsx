import React from 'react';
import { Reservation } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Printer, 
  X, 
  Building2, 
  School,
  CheckCircle2, 
  ShieldCheck, 
  GraduationCap, 
  Clock, 
  MapPin, 
  Tag
} from 'lucide-react';

interface PrintSlipModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintSlipModal: React.FC<PrintSlipModalProps> = ({
  reservation,
  isOpen,
  onClose
}) => {
  const { customLogo } = useApp();

  if (!isOpen || !reservation) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto" id="print-slip-modal">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 border border-slate-300">
        
        {/* Top bar controls */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
            <Printer className="w-4 h-4" />
            教務處教學設備借用核定通知單 / 領用點交憑證
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              列印此單據 / 存為PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Slip Content */}
        <div className="p-8 space-y-6 print:p-0">
          
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 relative">
            <div className="flex items-center justify-center gap-2 mb-1">
              {customLogo ? (
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-300 p-0.5 inline-flex items-center justify-center bg-white">
                  <img 
                    src={customLogo} 
                    alt="校徽" 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white inline-flex items-center justify-center">
                  <School className="w-4 h-4" />
                </div>
              )}
              <div className="text-xs text-slate-700 tracking-wider font-bold uppercase">
                國立成功商業水產職業學校 · 教務處教學設備組 (招設組)
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
              教學設備與專用教室借用核定通知單 (領用憑聯)
            </h1>
            <div className="flex items-center justify-between text-xs text-slate-600 mt-3 font-mono">
              <span>單號：<strong>{reservation.trackingNumber}</strong></span>
              <span>申請時間：{reservation.submittedAt}</span>
            </div>

            {/* 核定狀態印章 (仿真視覺效果) */}
            {reservation.status === 'approved' || reservation.status === 'borrowed' || reservation.status === 'returned' || reservation.status === 'extension_pending' ? (
              <div className="absolute right-0 top-0 border-2 border-emerald-600 text-emerald-700 px-3 py-1 rounded-lg rotate-6 text-center font-serif font-black text-xs shadow-sm bg-emerald-50/80">
                <div>教務主任</div>
                <div className="text-[10px]">【核定通過】</div>
              </div>
            ) : null}
          </div>

          {/* 借用人與設備基本資料 */}
          <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-700 w-28 border-r border-slate-200">借用教職員</td>
                  <td className="p-2.5 text-slate-900">{reservation.applicantName} ({reservation.applicantTitle})</td>
                  <td className="p-2.5 font-bold text-slate-700 w-28 border-x border-slate-200">所屬單位/科別</td>
                  <td className="p-2.5 text-slate-900">{reservation.applicantDepartment}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 font-bold text-slate-700 border-r border-slate-200">聯絡電話/分機</td>
                  <td className="p-2.5 text-slate-900">{reservation.applicantPhone}</td>
                  <td className="p-2.5 font-bold text-slate-700 border-x border-slate-200">電子信箱</td>
                  <td className="p-2.5 text-slate-900 font-mono">{reservation.applicantEmail}</td>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-700 border-r border-slate-200">借用項目/教室</td>
                  <td className="p-2.5 font-bold text-slate-900" colSpan={3}>
                    {reservation.resourceName} <span className="font-mono text-slate-600 font-normal">({reservation.resourceCode})</span>
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 font-bold text-slate-700 border-r border-slate-200">借用起迄排程</td>
                  <td className="p-2.5 text-slate-900 font-bold" colSpan={3}>
                    自 <span className="text-blue-700">{reservation.startDate} {reservation.startTime}</span> 起 至 <span className="text-emerald-700">{reservation.expectedReturnDate} {reservation.expectedReturnTime}</span> 止 (依規定於3日內歸還)
                  </td>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-700 border-r border-slate-200">活動用途說明</td>
                  <td className="p-2.5 text-slate-900" colSpan={3}>{reservation.purpose}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-700 border-r border-slate-200">班級與預估人數</td>
                  <td className="p-2.5 text-slate-900" colSpan={3}>
                    {reservation.targetClass || '校內教學活動'} (預估人數：{reservation.estimatedAttendees || 30} 人)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 審核簽章欄位 (三層行政機制 + 領用點收) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
            {/* 第一層：教務處計畫人員初審做確認 (專科教室鑰匙保管者) */}
            <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50 relative">
              <div className="font-bold text-slate-700 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>1. 計畫人員初審確認</span>
                <span className="text-[10px] text-teal-700 font-semibold">第一層核章</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 min-h-[46px]">
                {reservation.projectStaffNote || '鑰匙保管查核無誤，設備時段閒置，初審確認無誤。'}
              </div>
              <div className="mt-2 pt-1.5 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px]">
                <span>初審人：</span>
                <span className="font-bold text-slate-900">{reservation.projectStaffReviewer || '教務處計畫人員'}</span>
              </div>
            </div>

            {/* 第二層：招設組業務複審 */}
            <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50 relative">
              <div className="font-bold text-slate-700 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>2. 招設組業務複審</span>
                <span className="text-[10px] text-sky-700 font-semibold">第二層複審</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 min-h-[46px]">
                {reservation.sectionNote || '已查核設備完好無衝突，第二層複審通過。'}
              </div>
              <div className="mt-2 pt-1.5 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px]">
                <span>承辦人：</span>
                <span className="font-bold text-slate-900">{reservation.sectionReviewer || '林彥伊 招設組長'}</span>
              </div>
            </div>

            {/* 第三層：教務主任主管核定 */}
            <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50 relative">
              <div className="font-bold text-slate-700 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>3. 教務主任核定</span>
                <span className="text-[10px] text-purple-700 font-semibold">第三層決行</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 min-h-[46px]">
                {reservation.directorNote || '核定准予借用，請注意保管安全與整潔。'}
              </div>
              <div className="mt-2 pt-1.5 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px]">
                <span>教務主任：</span>
                <span className="font-bold text-slate-900">{reservation.directorReviewer || '黃寀霓 主任'}</span>
              </div>
            </div>

            {/* 借用人簽名及歸還簽收 */}
            <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50">
              <div className="font-bold text-slate-700 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>4. 領用與歸還點收</span>
                <span className="text-[10px] text-emerald-700 font-semibold">實體點檢</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 space-y-0.5 min-h-[46px]">
                <div>借出：{reservation.checkoutAt ? `${reservation.checkoutAt}` : '待領取點交'}</div>
                <div>歸還：{reservation.actualReturnDate ? `${reservation.actualReturnDate}` : '待歸還驗收'}</div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px]">
                <span>借用人簽章：</span>
                <span className="font-bold text-slate-900">{reservation.applicantName}</span>
              </div>
            </div>
          </div>

          {/* 備註與注意事項 */}
          <div className="bg-slate-100 p-3 rounded-lg text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">設備/教室借用規定重點提醒：</div>
            <div>1. 借用設備與教室 一律為學校教職員；請先查詢設備或教室閒置狀態， 須於借用日 1 日前先行登記，借用後須於 3 日內歸還。</div>
            <div>2. 如有特殊教學需求延長，請填具「特殊原因延長借用申請」，經 教務處 計畫人員 確認 第一層 專科教室鑰匙保管者 、 招設組審查 第二層 、教務主任核定 第三層 。</div>
            <div>3. 物品領取時請會同承辦人員當面清點配件；使用完畢落實場地復原及設備歸還驗收。</div>
          </div>

        </div>

      </div>
    </div>
  );
};
