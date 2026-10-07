import React, { useState } from 'react';
import { Reservation } from '../types';
import { useApp } from '../context/AppContext';
import { 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  Building2, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  ArrowRight,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCheck,
  Search,
  Layers,
  Lock
} from 'lucide-react';
import { daysBetween, getTodayString } from '../utils/dateUtils';

export const ProjectStaffReviewPanel: React.FC = () => {
  const { 
    reservations, 
    reviewByProjectStaff, 
    reviewExtensionByProjectStaff,
    currentUser,
    resources
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'extensions' | 'key_overview'>('pending');
  const [reviewNote, setReviewNote] = useState<{ [id: string]: string }>({});
  const [extensionNote, setExtensionNote] = useState<{ [id: string]: string }>({});
  const todayStr = getTodayString();

  // 1. 第一層待初審確認借用單 (pending_project_staff)
  const pendingReservations = reservations.filter(r => r.status === 'pending_project_staff');

  // 2. 待第一層初審之特殊延長借用申請 (extension_pending with projectStaffStatus pending)
  const pendingExtensions = reservations.filter(r => 
    r.extension && (!r.extension.projectStaffStatus || r.extension.projectStaffStatus === 'pending')
  );

  // 3. 所有專科教室借用與鑰匙借出狀態監控
  const classroomReservations = reservations.filter(r => 
    ['res-av-room', 'res-coop-room', 'res-multi-room', 'res-living-tech-room'].includes(r.resourceId) &&
    ['pending_project_staff', 'pending_section', 'section_approved', 'approved', 'borrowed', 'extension_pending'].includes(r.status)
  );

  const handleNoteChange = (id: string, text: string) => {
    setReviewNote(prev => ({ ...prev, [id]: text }));
  };

  const handleExtensionNoteChange = (id: string, text: string) => {
    setExtensionNote(prev => ({ ...prev, [id]: text }));
  };

  const handleBatchApproveAll = () => {
    pendingReservations.forEach(r => {
      reviewByProjectStaff(
        r.id, 
        'approve', 
        '專科教室鑰匙保管查核無誤，設備時段閒置，第一層初審確認通過，送第二層招設組複審。'
      );
    });
  };

  return (
    <div className="space-y-6" id="project-staff-review-panel">
      
      {/* 標題與職責說明 Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-cyan-950 border border-teal-800/60 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 text-xs font-semibold flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                第一層初審確認 · 專科教室鑰匙保管者
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-teal-200 border border-teal-700/60 text-[11px] font-mono">
                公務帳號：slvs280
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              教務處計畫人員 第一層初審確認台
            </h2>
            <p className="text-xs sm:text-sm text-teal-200/90 mt-1.5 max-w-2xl leading-relaxed">
              依借用三層行政機制，當教職員申請借用時，<strong className="text-amber-300">先由教務處計畫人員（第一層 專科教室鑰匙保管者）初審做確認</strong>。確認設備與專科教室鑰匙閒置狀態無誤後，方進入第二層招設組複審。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-teal-800/60 text-right">
              <div className="text-xs text-slate-400">待初審確認案件</div>
              <div className="text-xl font-black text-amber-400">{pendingReservations.length} 件</div>
            </div>

            {pendingReservations.length > 0 && (
              <button
                onClick={handleBatchApproveAll}
                className="px-4 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 shrink-0"
              >
                <CheckCheck className="w-4 h-4" />
                一鍵全數初審確認
              </button>
            )}
          </div>
        </div>

        {/* 三層行政簽核進度導覽條 */}
        <div className="mt-5 pt-4 border-t border-teal-900/60">
          <div className="text-[11px] text-teal-300 font-semibold mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            借用行政流程三層機制目前所屬層級：
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-teal-500/20 border-2 border-teal-400 p-2.5 rounded-xl text-teal-100 flex items-center gap-2 shadow-inner">
              <div className="w-6 h-6 rounded-lg bg-teal-500 text-slate-900 font-bold flex items-center justify-center text-xs shrink-0">
                1
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white flex items-center gap-1">
                  第一層 初審做確認（本平台）
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[11px] text-teal-200">教務處計畫人員（slvs280）· 專科教室鑰匙保管者</div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-700 p-2.5 rounded-xl text-slate-300 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-xs shrink-0">
                2
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-200">第二層 招設組審查（複審）</div>
                <div className="text-[11px] text-slate-400">教務處招設組（slvs230）· 設備調度與時段審查</div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-700 p-2.5 rounded-xl text-slate-300 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-xs shrink-0">
                3
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-200">第三層 教務主任核定</div>
                <div className="text-[11px] text-slate-400">教務主任（slvs200）· 主管決行准予借用結案</div>
              </div>
            </div>
          </div>
        </div>

        {/* 次頁籤導覽列 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-5 border-t border-teal-900/60 pt-3">
          <button
            onClick={() => setActiveSubTab('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'pending'
                ? 'bg-teal-600 text-white shadow'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            1. 待第一層初審確認借用案 ({pendingReservations.length})
          </button>

          <button
            onClick={() => setActiveSubTab('extensions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'extensions'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            2. 特殊延長借用初審查核 ({pendingExtensions.length})
          </button>

          <button
            onClick={() => setActiveSubTab('key_overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'key_overview'
                ? 'bg-cyan-600 text-white shadow'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            3. 專科教室鑰匙保管暨借用現況 ({classroomReservations.length})
          </button>
        </div>
      </div>

      {/* 頁籤 1: 待第一層初審確認案件 */}
      {activeSubTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-teal-600" />
              待教務處計畫人員初審做確認之申請案 ({pendingReservations.length})
            </h3>
            <span className="text-xs text-slate-500">確認通過後方能呈送第二層招設組複審</span>
          </div>

          {pendingReservations.length === 0 ? (
            <div className="py-12 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
              <CheckCircle2 className="w-10 h-10 text-teal-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">目前尚無待初審確認案件</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                所有教職員之借用申請已全數完成第一層初審確認，或尚無新進案件提報。新申請案將第一時間推播至本台。
              </p>
            </div>
          ) : (
            pendingReservations.map(res => {
              const note = reviewNote[res.id] || '';
              const loanDays = daysBetween(res.startDate, res.expectedReturnDate);
              const targetRes = resources.find(r => r.id === res.resourceId);

              return (
                <div
                  key={res.id}
                  className="bg-white border border-teal-200 hover:border-teal-300 rounded-2xl p-5 shadow-sm space-y-4 transition-all"
                >
                  {/* 單號與申請人 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-bold bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg border border-teal-200">
                        {res.trackingNumber}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{res.resourceName}</span>
                      <span className="text-slate-500">
                        申請人：<strong className="text-slate-800">{res.applicantName}</strong> ({res.applicantDepartment})
                      </span>
                      <span className="text-slate-400">分機：{res.applicantPhone}</span>
                    </div>
                    <span className="text-amber-800 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 w-fit">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      待第一層初審確認 (計畫人員)
                    </span>
                  </div>

                  {/* 借用要項卡片 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-500 block mb-1 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        借用排程與天數：
                      </span>
                      <div className="font-semibold text-slate-900">
                        {res.startDate} ({res.startTime}) 至 {res.expectedReturnDate} ({res.expectedReturnTime})
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        預計使用借期 {loanDays} 天 (符合 3 日內歸還規範)
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-500 block mb-1 font-semibold flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        教學用途與班級：
                      </span>
                      <div className="text-slate-800 font-medium">{res.purpose}</div>
                      <div className="text-[11px] text-slate-500">
                        班級：{res.targetClass || '校內教學'} (預估人數：{res.estimatedAttendees || 30} 人)
                      </div>
                    </div>

                    <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-200 space-y-1">
                      <span className="text-teal-900 block mb-1 font-semibold flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                        專科教室鑰匙保管與設備查核：
                      </span>
                      <div className="text-slate-700 text-[11px]">
                        場地位置：<strong className="text-slate-900">{targetRes?.location || '行政大樓專科教室'}</strong>
                      </div>
                      <div className="text-teal-800 text-[11px] font-medium">
                        鑰匙保管查核：經確認鑰匙保管備存正常，時段無專案衝突
                      </div>
                    </div>
                  </div>

                  {/* 初審審查操作區 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-teal-950 mb-1 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-teal-700" />
                        第一層初審確認查核備註意見（送第二層招設組參考）：
                      </label>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => handleNoteChange(res.id, e.target.value)}
                        placeholder="例：專科教室鑰匙保管查核無誤，設備時段閒置，第一層初審確認通過，送第二層招設組複審。"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        onClick={() => reviewByProjectStaff(
                          res.id, 
                          'reject', 
                          note || '專科教室時段已有校級計畫專案使用，或鑰匙時段衝突'
                        )}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        初審退回
                      </button>
                      <button
                        onClick={() => reviewByProjectStaff(
                          res.id, 
                          'approve', 
                          note || '專科教室鑰匙保管查核無誤，設備時段閒置，同意初審確認通過，送第二層招設組複審。'
                        )}
                        className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        第一層初審確認通過 (送第二層招設組複審)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 頁籤 2: 特殊延長借用查核 */}
      {activeSubTab === 'extensions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              特殊原因延長借用案查核 ({pendingExtensions.length})
            </h3>
            <span className="text-xs text-slate-500">查核專科教室鑰匙與場地延伸時段</span>
          </div>

          {pendingExtensions.length === 0 ? (
            <div className="py-12 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
              <CheckCircle2 className="w-10 h-10 text-purple-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">目前尚無待初審之延長借用申請</h4>
              <p className="text-xs text-slate-500 mt-1">若有教職員提出特殊教學延長，將自動於此呈現。</p>
            </div>
          ) : (
            pendingExtensions.map(res => {
              if (!res.extension) return null;
              const note = extensionNote[res.id] || '';

              return (
                <div
                  key={res.id}
                  className="bg-white border border-purple-200 hover:border-purple-300 rounded-2xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-200">
                        {res.trackingNumber}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{res.resourceName}</span>
                      <span className="text-slate-500">申請人：<strong>{res.applicantName}</strong></span>
                    </div>
                    <span className="text-purple-800 font-semibold bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      特殊原因延長借用查核
                    </span>
                  </div>

                  <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-200 text-xs space-y-1.5">
                    <div>
                      <strong>申請延長歸還日：</strong>自原歸還日 {res.extension.originalReturnDate} ➔ 申請延長至 <strong className="text-purple-900">{res.extension.requestedReturnDate}</strong> (延長 {res.extension.daysExtended} 天)
                    </div>
                    <div>
                      <strong>特殊具體原因：</strong>{res.extension.reason}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        第一層鑰匙保管查核備註：
                      </label>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => handleExtensionNoteChange(res.id, e.target.value)}
                        placeholder="例：查核延長期間鑰匙保管無衝突，初審同意延長送招設組複審。"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        onClick={() => reviewExtensionByProjectStaff(res.id, 'reject', note || '延長時段專科教室另有排程')}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold"
                      >
                        退回延長申請
                      </button>
                      <button
                        onClick={() => reviewExtensionByProjectStaff(res.id, 'approve', note || '第一層初審確認同意延長，送第二層招設組複審')}
                        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
                      >
                        第一層同意延長 (送招設組複審)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 頁籤 3: 專科教室鑰匙保管暨借用現況 */}
      {activeSubTab === 'key_overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-600" />
              專科教室鑰匙保管與場地動態監控 ({classroomReservations.length})
            </h3>
            <span className="text-xs text-slate-500">協助各專用教室鑰匙領用管制與安全</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'res-av-room', name: '視聽教室', loc: '行政大樓 3F', keyStatus: '專案辦公室保管中' },
              { id: 'res-coop-room', name: '合作學習教室', loc: '行政大樓 2F', keyStatus: '專案辦公室保管中' },
              { id: 'res-multi-room', name: '多功能學習教室', loc: '行政大樓 2F', keyStatus: '專案辦公室保管中' },
              { id: 'res-living-tech-room', name: '生活科技/創課教室', loc: '行政大樓 2F', keyStatus: '專案辦公室保管中' },
            ].map(room => {
              const activeBookings = reservations.filter(r => r.resourceId === room.id && ['approved', 'borrowed'].includes(r.status));
              const isCheckedOut = activeBookings.some(r => r.status === 'borrowed');

              return (
                <div key={room.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{room.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isCheckedOut ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isCheckedOut ? '鑰匙借出中' : '鑰匙在庫保管'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">位置：{room.loc}</div>
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    目前核准借用：{activeBookings.length > 0 ? `${activeBookings[0].applicantName} (${activeBookings[0].startDate})` : '尚無借用'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
