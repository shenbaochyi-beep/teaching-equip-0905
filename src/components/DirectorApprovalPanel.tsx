import React, { useState } from 'react';
import { Reservation } from '../types';
import { useApp } from '../context/AppContext';
import { 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  GraduationCap, 
  Sparkles, 
  AlertCircle, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  MessageSquare,
  Award
} from 'lucide-react';
import { daysBetween } from '../utils/dateUtils';

export const DirectorApprovalPanel: React.FC = () => {
  const { 
    reservations, 
    reviewByDirector, 
    reviewExtensionByDirector,
    currentUser
  } = useApp();

  const [directorNotes, setDirectorNotes] = useState<{ [id: string]: string }>({});

  // 1. 待主任核定之一般借用案 (招設組初審通過者)
  const pendingDirectorReservations = reservations.filter(r => r.status === 'section_approved');

  // 2. 待主任核定之特殊延長借用案 (招設組初審通過延長者)
  const pendingDirectorExtensions = reservations.filter(r => 
    r.extension && r.extension.sectionStatus === 'approved' && r.extension.directorStatus === 'pending'
  );

  const handleNoteChange = (id: string, text: string) => {
    setDirectorNotes(prev => ({ ...prev, [id]: text }));
  };

  const handleBatchApproveAll = () => {
    pendingDirectorReservations.forEach(r => {
      reviewByDirector(r.id, 'approve', '教務處核定同意借用。');
    });
    pendingDirectorExtensions.forEach(r => {
      reviewExtensionByDirector(r.id, 'approve', '核定同意延長借用。');
    });
  };

  const totalPending = pendingDirectorReservations.length + pendingDirectorExtensions.length;

  return (
    <div className="space-y-6" id="director-approval-panel">
      
      {/* 主任簽核頂部導覽 Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/60 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 text-xs font-semibold flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                教務處 主管決行核定中心
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              教學設備與專用教室借用及特殊延長核定
            </h2>
            <p className="text-xs text-purple-200/80 mt-1 max-w-2xl leading-relaxed">
              全校教學場地與設備借用之最終核定關卡。請審視招設組業務審查意見，確認符合校務教學推展需求後予以批示核定。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/60 text-right">
              <div className="text-xs text-slate-400">待核定總件數</div>
              <div className="text-xl font-black text-amber-400">{totalPending} 件</div>
            </div>

            {totalPending > 0 && (
              <button
                onClick={handleBatchApproveAll}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 shrink-0"
              >
                <Award className="w-4 h-4" />
                一鍵全數核定決行
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 區塊 1: 待主任核定之一般借用案件 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-purple-600" />
            1. 待核定之設備與教室借用申請 ({pendingDirectorReservations.length})
          </h3>
          <span className="text-xs text-slate-500">招設組已初審合格呈送</span>
        </div>

        {pendingDirectorReservations.length === 0 ? (
          <div className="py-10 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">目前無待核定之一般借用申請。</p>
          </div>
        ) : (
          pendingDirectorReservations.map(res => {
            const note = directorNotes[res.id] || '';
            const loanDays = daysBetween(res.startDate, res.expectedReturnDate);

            return (
              <div
                key={res.id}
                className="bg-white border border-purple-200 hover:border-purple-300 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-200">
                      {res.trackingNumber}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{res.resourceName}</span>
                    <span className="text-slate-500">申請人：<strong className="text-slate-800">{res.applicantName}</strong> ({res.applicantDepartment})</span>
                  </div>
                  <span className="text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ✓ 招設組已初審核章
                  </span>
                </div>

                {/* 借用要項 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block mb-1">借用時段與天數：</span>
                    <div className="font-semibold text-slate-900">{res.startDate} ({res.startTime}) 至 {res.expectedReturnDate} ({res.expectedReturnTime})</div>
                    <div className="text-[11px] text-sky-700 font-semibold mt-1">借期共 {loanDays} 天 (符合3日內規定)</div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block mb-1">教學用途與對象：</span>
                    <div className="text-slate-800 font-medium">{res.purpose}</div>
                    <div className="text-[11px] text-slate-500 mt-1">班級：{res.targetClass || '校內教學'} (約 {res.estimatedAttendees || 30} 人)</div>
                  </div>

                  <div className="bg-sky-50 p-3 rounded-xl border border-sky-200">
                    <span className="text-sky-900 font-semibold block mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                      招設組初審意見：
                    </span>
                    <div className="text-slate-800 text-xs">{res.sectionNote || '設備功能正常，庫存充足，時段無衝突，建請准予借用。'}</div>
                    <div className="text-[10px] text-slate-500 mt-1">初審承辦人：{res.sectionReviewer}</div>
                  </div>
                </div>

                {/* 主任批示與簽核操作 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-purple-900 mb-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                      教務主任核定批示意見：
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => handleNoteChange(res.id, e.target.value)}
                      placeholder="例：核定准予借用，請於使用期間妥善保管設備並維護場地安全整潔。"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                      onClick={() => reviewByDirector(res.id, 'reject', note || '配合全校重大校務活動調度，本次未予核准')}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      退回不予核定
                    </button>
                    <button
                      onClick={() => reviewByDirector(res.id, 'approve', note || '核定准予借用。')}
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      教務主任核定通過 (決行)
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 區塊 2: 待主任核定之特殊延長借用案 */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            2. 待主任核定之特殊原因延長借用案 ({pendingDirectorExtensions.length})
          </h3>
          <span className="text-xs text-slate-500">專案或科展特殊借期簽核</span>
        </div>

        {pendingDirectorExtensions.length === 0 ? (
          <div className="py-10 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
            <CheckCircle2 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">目前無待核定之特殊延長借用申請。</p>
          </div>
        ) : (
          pendingDirectorExtensions.map(res => {
            if (!res.extension) return null;
            const note = directorNotes[res.id] || '';

            return (
              <div
                key={res.id}
                className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                      {res.trackingNumber}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{res.resourceName}</span>
                    <span className="text-slate-500">申請人：{res.applicantName} ({res.applicantDepartment})</span>
                  </div>
                  <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    申請延長 +{res.extension.daysExtended} 天 (至 {res.extension.requestedReturnDate})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* 特殊原因 */}
                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 space-y-1">
                    <span className="text-purple-900 font-semibold block">申請延長特殊原因：</span>
                    <div className="text-slate-800 leading-relaxed">{res.extension.reason}</div>
                  </div>

                  {/* 招設組初審意見 */}
                  <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 space-y-1">
                    <span className="text-sky-900 font-semibold block">招設組調配初審意見：</span>
                    <div className="text-slate-800">{res.extension.sectionNote || '已調度備用設備，不影響後續教學，建請主任同意。'}</div>
                    <div className="text-[10px] text-slate-500 mt-1">初審人員：{res.extension.sectionReviewer}</div>
                  </div>
                </div>

                {/* 核定輸入與操作 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => handleNoteChange(res.id, e.target.value)}
                    placeholder="主任核定批示（例：同意特殊延長借用，全力支援學生科展競賽）"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600"
                  />

                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => reviewExtensionByDirector(res.id, 'reject', note || '因後續已有預約排程，未克同意延長，請如期歸還')}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      退回延長申請
                    </button>
                    <button
                      onClick={() => reviewExtensionByDirector(res.id, 'approve', note || '核定同意延長借用。')}
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      教務主任核定同意延長 (展延生效)
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
