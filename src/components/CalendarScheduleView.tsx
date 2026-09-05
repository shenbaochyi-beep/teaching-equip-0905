import React, { useState } from 'react';
import { ResourceItem } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  Clock, 
  Layers, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { getTodayString, addDays, getEarliestReservationDate } from '../utils/dateUtils';

interface CalendarScheduleViewProps {
  onBookResource: (resource: ResourceItem) => void;
}

export const CalendarScheduleView: React.FC<CalendarScheduleViewProps> = ({
  onBookResource
}) => {
  const { resources, reservations } = useApp();
  const todayStr = getTodayString();
  const earliestDateStr = getEarliestReservationDate(todayStr);

  const [dateOffset, setDateOffset] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'rooms' | 'equipment'>('all');

  // 產生連續 7 天的日期陣列
  const days = Array.from({ length: 7 }, (_, i) => addDays(todayStr, dateOffset + i));

  const filteredResources = resources.filter(r => {
    if (selectedFilter === 'rooms') {
      return r.category === 'audiovisual_room' || r.category === 'multifunction_room' || r.category === 'resource_room' || r.category === 'special_classroom';
    }
    if (selectedFilter === 'equipment') {
      return r.category === 'it_equipment' || r.category === 'av_equipment' || r.category === 'experiment_gear';
    }
    return true;
  });

  return (
    <div className="space-y-6" id="schedule-calendar-view">
      
      {/* 頂部控制器 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-600" />
            全校專用教室與教學設備 — 檔期借用現況總覽
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            可預先查詢各教室與設備各日期之閒置與借用狀態；依校規，點選 <strong className="text-amber-600 font-bold">{earliestDateStr}</strong> 之後的日期即可進行 3 日前線上預約。
          </p>
        </div>

        {/* 快速切換與前後翻頁 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${selectedFilter === 'all' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              全部項目
            </button>
            <button
              onClick={() => setSelectedFilter('rooms')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${selectedFilter === 'rooms' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              專用教室
            </button>
            <button
              onClick={() => setSelectedFilter('equipment')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${selectedFilter === 'equipment' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              資訊影音設備
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setDateOffset(prev => Math.max(0, prev - 7))}
              disabled={dateOffset === 0}
              className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-slate-200"
              title="前一週"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDateOffset(0)}
              className="px-2 py-1 text-xs text-slate-700 hover:text-slate-900 font-semibold"
            >
              本週
            </button>
            <button
              onClick={() => setDateOffset(prev => prev + 7)}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200"
              title="後一週"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 圖例說明 */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <span className="font-semibold text-slate-800">圖例狀態說明：</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500" />
          <span>🟢 閒置可借用 (提前3日可點選預約)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500" />
          <span>🟡 借用審核中</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-500/20 border border-sky-500" />
          <span>🔵 已核定借用中</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300" />
          <span>⚪ 未達3日前預約規範日</span>
        </div>
      </div>

      {/* 日曆時段排程矩陣 */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="p-3.5 font-bold w-64 border-r border-slate-200">教室 / 設備項目</th>
                {days.map((dayStr, idx) => {
                  const isToday = dayStr === todayStr;
                  const isAdvanceEligible = dayStr >= earliestDateStr;
                  const dateObj = new Date(dayStr + 'T00:00:00');
                  const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][dateObj.getDay()];

                  return (
                    <th
                      key={dayStr}
                      className={`p-3 text-center border-r border-slate-200 min-w-[100px] ${
                        isToday ? 'bg-sky-50 text-sky-800' : ''
                      }`}
                    >
                      <div className="text-[11px] text-slate-500">週{dayOfWeek}</div>
                      <div className={`font-bold text-sm ${isToday ? 'text-sky-700 font-black' : 'text-slate-800'}`}>
                        {dayStr.slice(5)}
                      </div>
                      {isToday && (
                        <span className="inline-block mt-0.5 text-[9px] bg-sky-100 text-sky-700 px-1.5 py-0.2 rounded font-semibold border border-sky-200">
                          今日
                        </span>
                      )}
                      {dayStr === earliestDateStr && (
                        <span className="inline-block mt-0.5 text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold border border-amber-200">
                          最早可約
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredResources.map(resource => (
                <tr key={resource.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* 左側名稱與規格 */}
                  <td className="p-3.5 border-r border-slate-200 bg-slate-50/40">
                    <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                      <span className="truncate">{resource.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="font-mono text-sky-700 font-semibold">{resource.code}</span>
                      <span>·</span>
                      <span className="truncate">{resource.location}</span>
                    </div>
                  </td>

                  {/* 7天欄位 */}
                  {days.map(dayStr => {
                    // 查詢這一天該設備有沒有被借用
                    const activeRes = reservations.find(r => 
                      r.resourceId === resource.id &&
                      r.status !== 'rejected_section' &&
                      r.status !== 'rejected_director' &&
                      r.status !== 'cancelled' &&
                      r.status !== 'returned' &&
                      dayStr >= r.startDate && dayStr <= r.expectedReturnDate
                    );

                    const isAdvanceEligible = dayStr >= earliestDateStr;

                    return (
                      <td
                        key={dayStr}
                        className="p-2 text-center border-r border-slate-200 align-middle"
                      >
                        {activeRes ? (
                          <div className={`p-2 rounded-xl text-[10px] leading-tight text-left shadow-xs ${
                            activeRes.status === 'borrowed' || activeRes.status === 'approved'
                              ? 'bg-sky-50 border border-sky-200 text-sky-900'
                              : 'bg-amber-50 border border-amber-200 text-amber-900'
                          }`}>
                            <div className="font-bold truncate text-slate-900">{activeRes.applicantName}</div>
                            <div className="text-[9px] text-slate-600 truncate">{activeRes.purpose}</div>
                            <div className="text-[9px] mt-0.5 font-mono font-semibold text-sky-700">
                              {activeRes.status === 'borrowed' ? '使用中' : '已核定'}
                            </div>
                          </div>
                        ) : isAdvanceEligible ? (
                          <button
                            onClick={() => onBookResource(resource)}
                            className="w-full py-2.5 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-semibold transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-0.5 group shadow-xs"
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:animate-ping" />
                            <span>閒置可借</span>
                            <span className="text-[9px] text-emerald-600 font-normal">點擊預約</span>
                          </button>
                        ) : (
                          <div className="py-2.5 px-1 text-slate-400 text-[10px] text-center">
                            <span>-</span>
                            <div className="text-[8px] text-slate-400">未滿3天</div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
