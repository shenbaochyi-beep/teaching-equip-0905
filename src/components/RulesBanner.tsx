import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CalendarClock, 
  RotateCcw, 
  FileText, 
  ChevronRight,
  Info,
  CheckCircle2,
  Users,
  Building,
  Laptop
} from 'lucide-react';
import { getTodayString, getEarliestReservationDate } from '../utils/dateUtils';

export const RulesBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const todayStr = getTodayString();
  const earliestDateStr = getEarliestReservationDate(todayStr);

  return (
    <div className="bg-gradient-to-br from-blue-900/90 via-indigo-900/80 to-slate-900 text-white rounded-2xl p-5 border border-blue-700/40 shadow-xl mb-6 relative overflow-hidden" id="rules-banner">
      {/* 裝飾背景 */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-semibold flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              教務處教學設備與專用教室借用辦法規範
            </span>
            <span className="text-xs text-blue-200">
              今日基準日：<strong className="text-white font-bold">{todayStr}</strong>
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            設備/教室借用規定重點提醒
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-3xl leading-relaxed">
            借用設備一律為學校教職員；請先查詢設備或教室閒置狀態，<strong>須於借用日3日前先行登記</strong>，借用後<strong>須於3日內歸還</strong>。如有特殊教學需求延長，請填具「特殊原因延長借用申請」，經教務處招設組審查、教務主任核定。
          </p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="self-start lg:self-center px-3.5 py-2 bg-blue-600/50 hover:bg-blue-600/80 border border-blue-400/40 text-blue-100 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
        >
          {expanded ? '收合借用規範說明' : '查看完整規範與簽核流程'}
          <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* 4大規則卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-blue-800/60">
        {/* 規則 1 */}
        <div className="bg-slate-900/60 border border-blue-800/40 rounded-xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-sky-300">借用身分限定</div>
            <div className="text-xs text-slate-200 mt-0.5 font-medium">全體專兼任教職員</div>
            <div className="text-[11px] text-slate-400 mt-1 leading-snug">
              限本校教學、課程觀課、科展培訓及公開研討活動使用。
            </div>
          </div>
        </div>

        {/* 規則 2 */}
        <div className="bg-slate-900/60 border border-amber-600/40 rounded-xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <CalendarClock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300">提前 3 日登記預約</div>
            <div className="text-xs text-slate-200 mt-0.5 font-medium">
              最早可借日：<span className="text-amber-300 font-bold">{earliestDateStr}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 leading-snug">
              系統嚴格防呆，借用前須預留 3 日供招設組調配檢測與簽核。
            </div>
          </div>
        </div>

        {/* 規則 3 */}
        <div className="bg-slate-900/60 border border-emerald-600/40 rounded-xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300">借用期限 3 日內歸還</div>
            <div className="text-xs text-slate-200 mt-0.5 font-medium">借期上限 3 天</div>
            <div className="text-[11px] text-slate-400 mt-1 leading-snug">
              借用後須於3日內點收歸還，確保各班級與教師資源流通。
            </div>
          </div>
        </div>

        {/* 規則 4 */}
        <div className="bg-slate-900/60 border border-purple-600/40 rounded-xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-300">特殊延長另案申請</div>
            <div className="text-xs text-slate-200 mt-0.5 font-medium">招設組初審 ➔ 主任核定</div>
            <div className="text-[11px] text-slate-400 mt-1 leading-snug">
              如因科展、大型專案需延長借期，可於借用中提出線上延長申請。
            </div>
          </div>
        </div>
      </div>

      {/* 展開詳述流程 */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-blue-800/60 text-xs bg-slate-950/40 -mx-5 -mb-5 p-5 rounded-b-2xl">
          <h3 className="font-bold text-sky-200 text-sm mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            教務處教學設備借用標準行政作業流程（SOP）
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700">
              <span className="text-[10px] text-sky-400 font-bold uppercase">步驟 1</span>
              <div className="font-semibold text-slate-200 mt-1">線上查詢與預約登記</div>
              <p className="text-[11px] text-slate-400 mt-1">教職員於借用日3日前查詢閒置狀態並填寫借用單。</p>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700">
              <span className="text-[10px] text-sky-400 font-bold uppercase">步驟 2</span>
              <div className="font-semibold text-slate-200 mt-1">招設組業務審查</div>
              <p className="text-[11px] text-slate-400 mt-1">設備組查核無時段衝突、設備妥善率並初審核章。</p>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700">
              <span className="text-[10px] text-purple-400 font-bold uppercase">步驟 3</span>
              <div className="font-semibold text-slate-200 mt-1">教務主任核定</div>
              <p className="text-[11px] text-slate-400 mt-1">由教務主任進行最終審批核准（含核定意見簽章）。</p>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700">
              <span className="text-[10px] text-emerald-400 font-bold uppercase">步驟 4</span>
              <div className="font-semibold text-slate-200 mt-1">實體點交借出</div>
              <p className="text-[11px] text-slate-400 mt-1">申請人憑借用核定通知至設備室領取物品/教室鑰匙。</p>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700">
              <span className="text-[10px] text-amber-400 font-bold uppercase">步驟 5</span>
              <div className="font-semibold text-slate-200 mt-1">3日內驗收歸還</div>
              <p className="text-[11px] text-slate-400 mt-1">使用完畢復原並於3日內歸還點收結案（或另案申請延長）。</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
