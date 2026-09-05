import React, { useState } from 'react';
import { Reservation } from '../types';
import { useApp } from '../context/AppContext';
import { addDays, daysBetween, formatDate } from '../utils/dateUtils';
import { 
  FileText, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';

interface ExtensionModalProps {
  reservation: Reservation;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ExtensionModal: React.FC<ExtensionModalProps> = ({
  reservation,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { submitExtensionRequest, currentUser } = useApp();

  const minExtensionDate = addDays(reservation.expectedReturnDate, 1);
  const defaultExtensionDate = addDays(reservation.expectedReturnDate, 3);

  const [requestedReturnDate, setRequestedReturnDate] = useState<string>(defaultExtensionDate);
  const [reason, setReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const extraDays = daysBetween(reservation.expectedReturnDate, requestedReturnDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!reason.trim()) {
      setErrorMsg('請詳實填寫延長借用之具體特殊原因說明');
      return;
    }

    if (extraDays <= 0) {
      setErrorMsg(`延長歸還日期必須晚於原定歸還日（${reservation.expectedReturnDate}）`);
      return;
    }

    const res = submitExtensionRequest(reservation.id, requestedReturnDate, reason);
    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || '送出延長借用申請失敗');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto" id="extension-modal">
      <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                特殊原因延長借用申請書
              </h3>
              <p className="text-xs text-slate-300">
                依規定一般借用上限3日，延長須另案專簽由招設組與主任核定
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 原借用資訊 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">{reservation.trackingNumber}</span>
              <span className="text-slate-500">申請人：{reservation.applicantName} ({reservation.applicantDepartment})</span>
            </div>
            <div className="text-sm font-bold text-slate-900">{reservation.resourceName}</div>
            <div className="flex items-center gap-2 text-slate-600 pt-1 border-t border-slate-200">
              <span>原借用起迄：</span>
              <strong className="text-slate-800">{reservation.startDate}</strong>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span>原定歸還日：</span>
              <strong className="text-amber-800">{reservation.expectedReturnDate} ({reservation.expectedReturnTime})</strong>
            </div>
          </div>

          {/* 申請延長日期設定 */}
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl space-y-3">
            <label className="block text-xs font-bold text-purple-900">
              1. 申請延長至歸還日 <span className="text-rose-600">*</span>
            </label>
            
            <div className="flex items-center gap-3">
              <input
                type="date"
                min={minExtensionDate}
                value={requestedReturnDate}
                onChange={(e) => setRequestedReturnDate(e.target.value)}
                className="bg-white border border-purple-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-purple-600 flex-1"
                required
              />
              <div className="px-3 py-2 bg-purple-100 border border-purple-300 rounded-lg text-xs text-purple-900 shrink-0 font-medium">
                延長天數：<span className="font-bold text-purple-950">{extraDays > 0 ? `+${extraDays} 天` : '0 天'}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              ※ 請評估教學專案實際需要天數，避免影響後續其他班級教師之借用權益。
            </p>
          </div>

          {/* 特殊原因詳細說明 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>2. 特殊原因詳細說明 (請詳實敘明教學專案或競賽活動需求) <span className="text-rose-600">*</span></span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="例：因指導學生參加全國中小學科學展覽會進行密集實驗數據收集；或因校慶成果發表會大型彩排需求..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
              required
            />
          </div>

          {/* 簽核流程說明 */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-sky-600" />
              延長申請簽核流程說明：
            </div>
            <div>
              1. 申請送出後，將先由<strong>教務處招設組承辦人</strong>查核後續預約有無衝堂並進行初審。
            </div>
            <div>
              2. 招設組初審通過後，呈由<strong>教務主任</strong>進行最終核定。核定通過後歸還期限自動展延。
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={extraDays <= 0}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              確認送出特殊延長借用申請
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
