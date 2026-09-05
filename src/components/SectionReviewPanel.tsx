import React, { useState } from 'react';
import { Reservation, ResourceItem } from '../types';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  Laptop, 
  Building2, 
  AlertTriangle, 
  FileText, 
  RotateCcw, 
  Sparkles,
  ArrowRight,
  Send,
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';
import { daysBetween, getTodayString } from '../utils/dateUtils';

export const SectionReviewPanel: React.FC = () => {
  const { 
    reservations, 
    reviewBySection, 
    checkoutReservation, 
    checkinReservation, 
    reviewExtensionBySection,
    resources,
    updateResourceStatus
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'extensions' | 'checkout' | 'returns' | 'inventory'>('pending');
  const [reviewNote, setReviewNote] = useState<{ [id: string]: string }>({});
  const [returnConditionNote, setReturnConditionNote] = useState<{ [id: string]: string }>({});
  const todayStr = getTodayString();

  // 1. 待初審借用單 (pending_section)
  const pendingReservations = reservations.filter(r => r.status === 'pending_section');

  // 2. 待初審延長申請 (extension_pending with sectionStatus pending)
  const pendingExtensions = reservations.filter(r => 
    r.extension && r.extension.sectionStatus === 'pending'
  );

  // 3. 待出借點交 (已由教務主任核定通過 approved)
  const readyForCheckout = reservations.filter(r => r.status === 'approved');

  // 4. 使用中待歸還點收 (borrowed or extension_pending)
  const activeBorrowed = reservations.filter(r => r.status === 'borrowed' || r.status === 'extension_pending');

  const handleNoteChange = (id: string, text: string) => {
    setReviewNote(prev => ({ ...prev, [id]: text }));
  };

  const handleReturnNoteChange = (id: string, text: string) => {
    setReturnConditionNote(prev => ({ ...prev, [id]: text }));
  };

  return (
    <div className="space-y-6" id="section-review-panel">
      
      {/* 標題與職責說明 */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-800/50 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40 text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                教務處 招設組（教學設備組）業務處理平台
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              設備與教室借用業務審查及點交管理
            </h2>
            <p className="text-xs text-sky-200/80 mt-1 max-w-2xl leading-relaxed">
              負責全校教學設備與專用教室之借用初審、衝突調度、特殊延長案審查、實體點交出借與歸還驗收作業。初審同意後即呈報教務主任進行主管核定。
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-sky-800/60 text-xs">
            <div className="text-right">
              <div className="text-slate-400">目前待初審案件</div>
              <div className="text-lg font-bold text-amber-400">
                {pendingReservations.length + pendingExtensions.length} 件
              </div>
            </div>
          </div>
        </div>

        {/* 次頁籤導覽列 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-6 border-t border-sky-900/60 pt-3">
          <button
            onClick={() => setActiveSubTab('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'pending'
                ? 'bg-sky-600 text-white shadow'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            1. 新借用申請初審 ({pendingReservations.length})
          </button>

          <button
            onClick={() => setActiveSubTab('extensions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'extensions'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-300" />
            2. 特殊延長借用初審 ({pendingExtensions.length})
          </button>

          <button
            onClick={() => setActiveSubTab('checkout')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'checkout'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            3. 核定通過待出借點交 ({readyForCheckout.length})
          </button>

          <button
            onClick={() => setActiveSubTab('returns')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'returns'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-300" />
            4. 使用中歸還驗收 ({activeBorrowed.length})
          </button>

          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'inventory'
                ? 'bg-slate-700 text-white shadow'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-slate-300" />
            5. 設備與教室狀態維護 ({resources.length})
          </button>
        </div>
      </div>

      {/* Subtab 1: 新借用申請初審 */}
      {activeSubTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              待招設組業務審查之預約申請單 ({pendingReservations.length})
            </h3>
            <span className="text-xs text-slate-500">
              審查要點：核對3日前登記規範、借用天數上限3日、設備妥善率及有無衝堂
            </span>
          </div>

          {pendingReservations.length === 0 ? (
            <div className="py-12 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-semibold">目前無任何待初審之借用申請。</p>
            </div>
          ) : (
            pendingReservations.map(res => {
              const note = reviewNote[res.id] || '';
              return (
                <div
                  key={res.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
                        {res.trackingNumber}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {res.resourceName} <span className="text-xs font-mono text-slate-500 font-normal">({res.resourceCode})</span>
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      送單時間：{res.submittedAt}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* 申請人資訊 */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800">申請教職員資料：</div>
                      <div className="text-slate-700">姓名：<strong className="text-slate-900">{res.applicantName}</strong> ({res.applicantTitle})</div>
                      <div className="text-slate-600">處室/科別：{res.applicantDepartment}</div>
                      <div className="text-slate-600">電話/分機：{res.applicantPhone}</div>
                      <div className="text-slate-600">信箱：{res.applicantEmail}</div>
                    </div>

                    {/* 借用排程資訊 */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800">借用起迄時間：</div>
                      <div className="text-slate-700">借用起始：<strong className="text-sky-700">{res.startDate} ({res.startTime})</strong></div>
                      <div className="text-slate-700">預計歸還：<strong className="text-emerald-700">{res.expectedReturnDate} ({res.expectedReturnTime})</strong></div>
                      <div className="pt-1 text-[11px] text-slate-500">
                        借用天數：{daysBetween(res.startDate, res.expectedReturnDate)} 天 (符合3日內歸還上限)
                      </div>
                    </div>

                    {/* 課程用途 */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800">用途與課程：</div>
                      <div className="text-slate-700">{res.purpose}</div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        對象：{res.targetClass || '校內教學'} (約 {res.estimatedAttendees || 30} 人)
                      </div>
                    </div>
                  </div>

                  {/* 初審意見與操作 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                        招設組初審意見與調配備註 (將同步呈報教務主任與通知申請人)：
                      </label>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => handleNoteChange(res.id, e.target.value)}
                        placeholder="例：經檢視設備妥善率良好、時段無衝突，同意出借並呈送主任核定。"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => reviewBySection(res.id, 'reject', note || '時段衝堂或設備維護中，無法出借')}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        退回申請
                      </button>
                      <button
                        onClick={() => reviewBySection(res.id, 'approve', note || '設備檢測完妥無衝突，初審同意呈請主任核定')}
                        className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        初審同意 ➔ 呈送教務主任核定
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Subtab 2: 特殊延長申請初審 */}
      {activeSubTab === 'extensions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              待初審之特殊原因延長借用案 ({pendingExtensions.length})
            </h3>
            <span className="text-xs text-slate-500">
              審核要點：評估延長天數合理性、調配下週後續借用需求
            </span>
          </div>

          {pendingExtensions.length === 0 ? (
            <div className="py-12 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
              <CheckCircle2 className="w-10 h-10 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">目前無待初審之特殊延長借用申請。</p>
            </div>
          ) : (
            pendingExtensions.map(res => {
              if (!res.extension) return null;
              const note = reviewNote[res.id] || '';
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
                    <span className="text-purple-700 font-semibold">
                      申請延長 +{res.extension.daysExtended} 天
                    </span>
                  </div>

                  {/* 延長詳情 */}
                  <div className="bg-purple-50/60 border border-purple-200 p-4 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-3">
                      <span>原定歸還日：<strong className="text-slate-700">{res.extension.originalReturnDate}</strong></span>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                      <span>申請延長至：<strong className="text-amber-700 text-sm font-mono">{res.extension.requestedReturnDate}</strong></span>
                    </div>
                    <div className="text-purple-950">
                      <strong>特殊原因說明：</strong>
                      <div className="mt-1 p-2.5 bg-white rounded-lg text-slate-700 leading-relaxed border border-purple-200">
                        {res.extension.reason}
                      </div>
                    </div>
                  </div>

                  {/* 初審意見 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => handleNoteChange(res.id, e.target.value)}
                      placeholder="招設組初審意見（例：經確認後續備用庫存充足，無其他老師預約，建議准予延長）"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600"
                    />

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => reviewExtensionBySection(res.id, 'reject', note || '後續時段已有全校重大活動預約，無法延長')}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        退回延長申請
                      </button>
                      <button
                        onClick={() => reviewExtensionBySection(res.id, 'approve', note || '招設組初審同意延長，轉呈主任核定')}
                        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        初審同意延長 ➔ 呈送教務主任核定
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Subtab 3: 主任核定通過待出借點交 */}
      {activeSubTab === 'checkout' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              教務主任已核定通過 · 待借出點交登記 ({readyForCheckout.length})
            </h3>
            <span className="text-xs text-slate-500">
              借用人到場時進行實體器材或鑰匙點交確認
            </span>
          </div>

          {readyForCheckout.length === 0 ? (
            <div className="py-12 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">目前無待出借之案件。</p>
            </div>
          ) : (
            readyForCheckout.map(res => (
              <div
                key={res.id}
                className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {res.trackingNumber}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{res.resourceName}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">✓ 主任已核定</span>
                  </div>
                  <div className="text-slate-700">
                    借用人：<strong className="text-slate-900">{res.applicantName}</strong> ({res.applicantDepartment} · {res.applicantPhone})
                  </div>
                  <div className="text-slate-500">
                    排程：{res.startDate} ({res.startTime}) 至 {res.expectedReturnDate} ({res.expectedReturnTime})
                  </div>
                  {res.directorNote && (
                    <div className="text-emerald-800 text-[11px] font-medium">
                      主任批示：{res.directorNote}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => checkoutReservation(res.id)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  確認點交出借 (標記為使用中)
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Subtab 4: 使用中歸還驗收 */}
      {activeSubTab === 'returns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-sky-600" />
              目前使用中待歸還點收清單 ({activeBorrowed.length})
            </h3>
            <span className="text-xs text-slate-500">
              借用人歸還設備時，點檢配件、測試功能並註記驗收狀況
            </span>
          </div>

          {activeBorrowed.length === 0 ? (
            <div className="py-12 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
              <CheckCircle2 className="w-10 h-10 text-sky-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">目前無使用中之借用案件。</p>
            </div>
          ) : (
            activeBorrowed.map(res => {
              const condition = returnConditionNote[res.id] || '';
              const daysLeft = daysBetween(todayStr, res.expectedReturnDate);

              return (
                <div
                  key={res.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sky-700 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {res.trackingNumber}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{res.resourceName}</span>
                      <span className="text-slate-500">借用人：{res.applicantName} ({res.applicantPhone})</span>
                    </div>

                    <div>
                      {daysLeft > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                          距歸還日還有 {daysLeft} 天 (期限: {res.expectedReturnDate})
                        </span>
                      ) : daysLeft === 0 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                          ⚠️ 今日應歸還 ({res.expectedReturnTime} 前)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-bold">
                          🚨 逾期 {Math.abs(daysLeft)} 天
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 驗收輸入與按鈕 */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <input
                      type="text"
                      value={condition}
                      onChange={(e) => handleReturnNoteChange(res.id, e.target.value)}
                      placeholder="歸還驗收備註（例：線材齊全、外觀完好、教室已復原並上鎖）"
                      className="w-full sm:flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white"
                    />
                    <button
                      onClick={() => checkinReservation(res.id, condition || '設備配件清點完整，功能正常，歸還結案。')}
                      className="w-full sm:w-auto px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      驗收完成並結案歸還
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Subtab 5: 設備庫存狀態維護 */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              全校專用教室與教學設備庫存現況管理 ({resources.length})
            </h3>
            <span className="text-xs text-slate-500">招設組可在此快速調整設備狀態（閒置 / 保養維護中）</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map(item => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 text-xs shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                  <div>
                    <div className="font-mono text-sky-700 text-[11px] font-semibold">{item.code}</div>
                    <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                    <div className="text-slate-500 text-[11px]">{item.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={item.status}
                    onChange={(e) => updateResourceStatus(item.id, e.target.value as any)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-600 font-medium"
                  >
                    <option value="available">🟢 閒置可借用</option>
                    <option value="maintenance">🟠 保養維護中 (暫停出借)</option>
                    <option value="in_use">🔵 目前使用中</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
