import React, { useState } from 'react';
import { Reservation, ReservationStatus } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Inbox, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Printer, 
  RotateCcw, 
  History, 
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { daysBetween, getTodayString } from '../utils/dateUtils';

interface MyReservationsProps {
  onOpenExtensionModal: (reservation: Reservation) => void;
  onOpenPrintModal: (reservation: Reservation) => void;
}

export const MyReservations: React.FC<MyReservationsProps> = ({
  onOpenExtensionModal,
  onOpenPrintModal
}) => {
  const { currentUser, reservations, cancelReservation } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const todayStr = getTodayString();

  // 取得目前使用者的借用紀錄 (若為管理者則可看全體或個人)
  const myReservations = reservations.filter(r => {
    if (currentUser.role === 'faculty') {
      return r.applicantId === currentUser.id;
    }
    return true; // 招設組/主任可在此總覽所有申請
  });

  const getStatusDisplay = (status: ReservationStatus) => {
    switch (status) {
      case 'pending_section':
        return { label: '待招設組業務審核', color: 'bg-amber-50 text-amber-800 border-amber-300', icon: <Clock className="w-3.5 h-3.5 text-amber-600" /> };
      case 'section_approved':
        return { label: '招設組初審通過 · 待主任核定', color: 'bg-indigo-50 text-indigo-800 border-indigo-300', icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> };
      case 'approved':
        return { label: '教務主任核定通過 · 待出借', color: 'bg-emerald-50 text-emerald-800 border-emerald-300', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> };
      case 'borrowed':
        return { label: '使用中 (已點交)', color: 'bg-sky-50 text-sky-800 border-sky-300', icon: <Sparkles className="w-3.5 h-3.5 text-sky-600" /> };
      case 'extension_pending':
        return { label: '特殊延長申請審核中', color: 'bg-purple-50 text-purple-800 border-purple-300', icon: <FileText className="w-3.5 h-3.5 text-purple-600" /> };
      case 'returned':
        return { label: '已歸還結案', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> };
      case 'rejected_section':
        return { label: '招設組退回', color: 'bg-rose-50 text-rose-800 border-rose-300', icon: <XCircle className="w-3.5 h-3.5 text-rose-600" /> };
      case 'rejected_director':
        return { label: '教務主任退回', color: 'bg-rose-50 text-rose-800 border-rose-300', icon: <XCircle className="w-3.5 h-3.5 text-rose-600" /> };
      case 'cancelled':
        return { label: '申請人已取消', color: 'bg-slate-100 text-slate-500 border-slate-300', icon: <XCircle className="w-3.5 h-3.5 text-slate-400" /> };
    }
  };

  const filteredList = myReservations.filter(res => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') {
      return res.status === 'borrowed' || res.status === 'extension_pending' || res.status === 'approved' || res.status === 'section_approved' || res.status === 'pending_section';
    }
    if (filterStatus === 'completed') {
      return res.status === 'returned';
    }
    if (filterStatus === 'extensions') {
      return res.status === 'extension_pending' || res.extension !== undefined;
    }
    return true;
  });

  return (
    <div className="space-y-6" id="my-reservations">
      
      {/* 頂部說明與頁籤 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-sky-600" />
            借用申請紀錄與進度追蹤
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentUser.role === 'faculty'
              ? `目前登入教職員：${currentUser.name} (${currentUser.department})，可於此隨時查看簽核進度、列印借用聯或申請特殊延長`
              : `管理員檢視模式：目前共 ${reservations.length} 筆全校借用登記紀錄`}
          </p>
        </div>

        {/* 狀態過濾按鈕 */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'all' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            全部 ({myReservations.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'active' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            進行中/審核中 ({myReservations.filter(r => r.status !== 'returned' && r.status !== 'cancelled' && !r.status.startsWith('rejected')).length})
          </button>
          <button
            onClick={() => setFilterStatus('extensions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'extensions' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            特殊延長申請 ({myReservations.filter(r => r.extension !== undefined).length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'completed' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            已歸還結案 ({myReservations.filter(r => r.status === 'returned').length})
          </button>
        </div>
      </div>

      {/* 申請紀錄列表 */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700">目前尚無借用紀錄</h3>
            <p className="text-xs text-slate-500 mt-1">
              請前往「設備與教室預約大廳」預約視聽教室、多功能教室、資源班教室或教學器材。
            </p>
          </div>
        ) : (
          filteredList.map(res => {
            const statusInfo = getStatusDisplay(res.status);
            const isExpanded = expandedLogId === res.id;
            const daysLeft = daysBetween(todayStr, res.expectedReturnDate);
            const canExtend = res.status === 'borrowed' || res.status === 'approved';
            const canCancel = res.status === 'pending_section' || res.status === 'section_approved';

            return (
              <div
                key={res.id}
                id={`reservation-item-${res.id}`}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* 第一行：單號、申請人、狀態 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-sky-700 px-2.5 py-1 rounded-lg border border-slate-200">
                      {res.trackingNumber}
                    </span>
                    <span className="text-xs text-slate-600">
                      申請人：<strong className="text-slate-800">{res.applicantName}</strong> ({res.applicantDepartment})
                    </span>
                    <span className="text-[11px] text-slate-400 hidden md:inline">
                      送單時間：{res.submittedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-2xs ${statusInfo.color}`}>
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* 第二行：借用標的與時間排程 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <div className="text-xs text-slate-500 mb-0.5">借用項目 / 教室：</div>
                    <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      {res.resourceName}
                    </div>
                    <div className="text-xs font-mono text-sky-700 font-semibold mt-0.5">{res.resourceCode}</div>
                    <div className="text-xs text-slate-500 mt-2">
                      用途：<span className="text-slate-800 font-medium">{res.purpose}</span>
                    </div>
                  </div>

                  {/* 借用起迄 */}
                  <div className="md:col-span-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="text-slate-600 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      排程與歸還期限 (3日內歸還)：
                    </div>
                    <div className="text-slate-700">
                      借用起始：<strong className="text-slate-900">{res.startDate} ({res.startTime})</strong>
                    </div>
                    <div className="text-slate-700">
                      預計歸還：<strong className="text-amber-700">{res.expectedReturnDate} ({res.expectedReturnTime})</strong>
                    </div>

                    {res.status === 'borrowed' && (
                      <div className="pt-1 text-[11px]">
                        {daysLeft > 0 ? (
                          <span className="text-emerald-700 font-semibold">距離歸還期限尚有 {daysLeft} 天</span>
                        ) : daysLeft === 0 ? (
                          <span className="text-amber-700 font-bold">⚠️ 今日為應歸還日！請於 {res.expectedReturnTime} 前至招設組辦理</span>
                        ) : (
                          <span className="text-rose-700 font-bold">🚨 已逾期 {Math.abs(daysLeft)} 天！請盡速歸還或申請延長</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 審核狀態卡片 */}
                  <div className="md:col-span-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="text-slate-700 font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                        二級簽核進度：
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">1. 招設組業務審查：</span>
                      <span className={res.sectionReviewer ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                        {res.sectionReviewer ? `已由 ${res.sectionReviewer} 初審` : '⏳ 待招設組審理'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">2. 教務主任核定：</span>
                      <span className={res.directorReviewer ? 'text-purple-700 font-semibold' : 'text-slate-400'}>
                        {res.directorReviewer ? `已由 ${res.directorReviewer} 核定` : '⏳ 待主任核定'}
                      </span>
                    </div>

                    {res.sectionNote && (
                      <div className="text-[10px] text-slate-600 bg-white p-1.5 rounded border border-slate-200 truncate" title={res.sectionNote}>
                        招設組意見：{res.sectionNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* 若有延長借用申請資訊 */}
                {res.extension && (
                  <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-950 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-purple-600" />
                        特殊原因延長借用申請 (原 {res.extension.originalReturnDate} ➔ 申請延長至 {res.extension.requestedReturnDate}，加 {res.extension.daysExtended} 天)
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        res.extension.directorStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        res.extension.directorStatus === 'rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {res.extension.directorStatus === 'approved' ? '✓ 延長已核定生效' :
                         res.extension.directorStatus === 'rejected' ? '✕ 延長申請遭退回' :
                         '⏳ 延長審核中'}
                      </span>
                    </div>
                    <div className="text-purple-900 text-xs">
                      <strong>申請特殊原因：</strong>{res.extension.reason}
                    </div>
                    {res.extension.sectionNote && (
                      <div className="text-[11px] text-purple-700">
                        招設組初審意見：{res.extension.sectionNote} ({res.extension.sectionReviewer})
                      </div>
                    )}
                  </div>
                )}

                {/* 底部動作列 */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setExpandedLogId(isExpanded ? null : res.id)}
                    className="text-xs text-sky-700 hover:text-sky-800 font-medium flex items-center gap-1"
                  >
                    <History className="w-3.5 h-3.5" />
                    {isExpanded ? '收合審核歷程' : `查看完整簽核歷程 (${res.approvalLogs.length})`}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div className="flex items-center gap-2">
                    {/* 取消按鈕 */}
                    {canCancel && (
                      <button
                        onClick={() => cancelReservation(res.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg text-xs font-semibold transition-colors"
                      >
                        取消預約
                      </button>
                    )}

                    {/* 特殊延長申請按鈕 */}
                    {canExtend && !res.extension && (
                      <button
                        onClick={() => onOpenExtensionModal(res)}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        申請特殊原因延長
                      </button>
                    )}

                    {/* 列印憑條 */}
                    <button
                      onClick={() => onOpenPrintModal(res)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-200"
                    >
                      <Printer className="w-3.5 h-3.5 text-sky-600" />
                      借用通知單列印
                    </button>
                  </div>
                </div>

                {/* 簽核歷程展開面板 */}
                {isExpanded && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                    <div className="font-bold text-slate-800">歷史審核與簽核紀錄時間軸</div>
                    <div className="relative pl-4 border-l-2 border-slate-200 space-y-3">
                      {res.approvalLogs.map((log) => (
                        <div key={log.id} className="relative">
                          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-600 ring-4 ring-white" />
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{log.actorName} ({log.actorRole})</span>
                            <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                          </div>
                          <div className="text-slate-700 text-xs mt-0.5">{log.action}</div>
                          {log.comment && (
                            <div className="text-slate-600 text-[11px] mt-1 bg-white p-2 rounded border border-slate-200">
                              備註批示：{log.comment}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
