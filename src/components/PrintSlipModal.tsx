import React from 'react';
import { Reservation } from '../types';
import { 
  Printer, 
  X, 
  Building2, 
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
            <div className="text-xs text-slate-500 tracking-widest font-semibold uppercase">
              國立高級中學 · 教務處教學設備組 (招設組)
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

          {/* 審核簽章欄位 */}
          <div className="grid grid-cols-3 gap-4 text-xs pt-2">
            {/* 招設組業務審查 */}
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 relative">
              <div className="font-bold text-slate-700 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>1. 教務處招設組審查</span>
                <span className="text-[10px] text-sky-700 font-semibold">初審核章</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 min-h-[50px]">
                {reservation.sectionNote || '已查核設備完好無衝突，同意出借。'}
              </div>
              <div className="mt-2 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px]">
                <span>承辦人：</span>
                <span className="font-bold text-slate-900">{reservation.sectionReviewer || '林彥伊 招設組長'}</span>
              </div>
            </div>

            {/* 教務主任核定 */}
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 relative">
              <div className="font-bold text-slate-700 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>2. 教務主任核定</span>
                <span className="text-[10px] text-purple-700 font-semibold">主管決行</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 min-h-[50px]">
                {reservation.directorNote || '核定准予借用，請注意用電安全及環境整潔。'}
              </div>
              <div className="mt-2 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px]">
                <span>教務主任：</span>
                <span className="font-bold text-slate-900">{reservation.directorReviewer || '黃寀霓 主任'}</span>
              </div>
            </div>

            {/* 借用人簽名及歸還簽收 */}
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50">
              <div className="font-bold text-slate-700 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>3. 領用/歸還點收</span>
                <span className="text-[10px] text-emerald-700 font-semibold">實體點檢</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 space-y-1">
                <div>借出點交：{reservation.checkoutAt ? `${reservation.checkoutAt} (已點交)` : '待領取點交'}</div>
                <div>歸還點收：{reservation.actualReturnDate ? `${reservation.actualReturnDate} (已結案)` : '待歸還驗收'}</div>
              </div>
              <div className="mt-2 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px]">
                <span>借用人簽章：</span>
                <span className="font-bold text-slate-900">{reservation.applicantName}</span>
              </div>
            </div>
          </div>

          {/* 備註與注意事項 */}
          <div className="bg-slate-100 p-3 rounded-lg text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">教學設備與教室借用規範須知：</div>
            <div>1. 借用設備與教室一律為本校教職員工，借用前須於借用日 3 日前先行登記。</div>
            <div>2. 借用後須於 3 日內點收歸還。如有特殊教學或競賽專案需延長，須填具特殊延長借用申請書，經招設組審查及教務主任核定。</div>
            <div>3. 物品領取時請會同招設組同仁當面清點配件；歸還時若有遺失或人為損壞應負修復賠償責任。</div>
          </div>

        </div>

      </div>
    </div>
  );
};
