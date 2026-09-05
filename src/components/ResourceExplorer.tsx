import React, { useState, useMemo } from 'react';
import { ResourceItem, ResourceCategory, ResourceStatus } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Layers, 
  Building2, 
  Laptop, 
  Radio, 
  Eye, 
  Sparkles,
  Info
} from 'lucide-react';
import { getTodayString, getEarliestReservationDate } from '../utils/dateUtils';

interface ResourceExplorerProps {
  onSelectResource: (resource: ResourceItem) => void;
  onBookResource: (resource: ResourceItem) => void;
}

export const ResourceExplorer: React.FC<ResourceExplorerProps> = ({
  onSelectResource,
  onBookResource
}) => {
  const { resources, reservations } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const todayStr = getTodayString();
  const earliestDateStr = getEarliestReservationDate(todayStr);

  const categories: { key: string; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: '全部項目', icon: <Layers className="w-3.5 h-3.5" /> },
    { key: 'audiovisual_room', label: '視聽教室', icon: <Building2 className="w-3.5 h-3.5 text-sky-400" /> },
    { key: 'multifunction_room', label: '多功能教室', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> },
    { key: 'resource_room', label: '資源班教室', icon: <Users className="w-3.5 h-3.5 text-amber-400" /> },
    { key: 'special_classroom', label: '其他專用教室', icon: <Building2 className="w-3.5 h-3.5 text-purple-400" /> },
    { key: 'it_equipment', label: '資訊教學設備', icon: <Laptop className="w-3.5 h-3.5 text-emerald-400" /> },
    { key: 'av_equipment', label: '影音廣播設備', icon: <Radio className="w-3.5 h-3.5 text-rose-400" /> }
  ];

  // 計算每個資源目前是否正處於活躍使用中
  const enrichedResources = useMemo(() => {
    return resources.map(res => {
      // 檢查今天是否有進行中的借用
      const activeBorrowing = reservations.find(r => 
        r.resourceId === res.id && 
        (r.status === 'borrowed' || r.status === 'extension_pending') &&
        todayStr >= r.startDate && todayStr <= r.expectedReturnDate
      );
      
      const isReservedSoon = reservations.some(r =>
        r.resourceId === res.id &&
        (r.status === 'approved' || r.status === 'section_approved') &&
        r.startDate >= todayStr
      );

      let computedStatus: ResourceStatus = res.status;
      if (activeBorrowing) {
        computedStatus = 'in_use';
      } else if (isReservedSoon && computedStatus === 'available') {
        computedStatus = 'reserved';
      }

      return {
        ...res,
        computedStatus,
        activeBorrowing
      };
    });
  }, [resources, reservations, todayStr]);

  // 過濾邏輯
  const filteredResources = useMemo(() => {
    return enrichedResources.filter(item => {
      // 分類過濾
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // 狀態過濾
      if (selectedStatus !== 'all' && item.computedStatus !== selectedStatus) {
        return false;
      }
      // 關鍵字搜尋
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = item.name.toLowerCase().includes(term);
        const matchCode = item.code.toLowerCase().includes(term);
        const matchLoc = item.location.toLowerCase().includes(term);
        const matchDesc = item.description.toLowerCase().includes(term);
        const matchSpecs = item.specs.some(s => s.toLowerCase().includes(term));
        return matchName || matchCode || matchLoc || matchDesc || matchSpecs;
      }
      return true;
    });
  }, [enrichedResources, selectedCategory, selectedStatus, searchTerm]);

  return (
    <div className="space-y-6" id="resource-explorer">
      
      {/* 搜尋與篩選列 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* 搜尋輸入框 */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋設備或教室名稱、編號 (如: ROOM-AV-01)、位置、規格配備..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white transition-colors"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-medium"
              >
                清除
              </button>
            )}
          </div>

          {/* 閒置狀態快捷篩選 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              狀態：
            </span>
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-slate-800 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              全部 ({enrichedResources.length})
            </button>
            <button
              onClick={() => setSelectedStatus('available')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedStatus === 'available'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              🟢 閒置可借 ({enrichedResources.filter(r => r.computedStatus === 'available').length})
            </button>
            <button
              onClick={() => setSelectedStatus('reserved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedStatus === 'reserved'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              🟡 已有預約排程 ({enrichedResources.filter(r => r.computedStatus === 'reserved').length})
            </button>
            <button
              onClick={() => setSelectedStatus('in_use')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedStatus === 'in_use'
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              🔵 目前使用中 ({enrichedResources.filter(r => r.computedStatus === 'in_use').length})
            </button>
          </div>
        </div>

        {/* 分類按鈕群 */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === cat.key
                  ? 'bg-sky-50 text-sky-700 border border-sky-300 font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-transparent'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 設備與教室卡片網格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700">查無符合條件之教學設備或教室</h3>
            <p className="text-xs text-slate-500 mt-1">請嘗試調整搜尋關鍵字或清除篩選條件</p>
          </div>
        ) : (
          filteredResources.map(resource => {
            const isAvailable = resource.computedStatus === 'available';
            const isReserved = resource.computedStatus === 'reserved';
            const isInUse = resource.computedStatus === 'in_use';

            return (
              <div
                key={resource.id}
                id={`resource-card-${resource.id}`}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* 圖片與頂部狀態徽章 */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onSelectResource(resource)}>
                  <img
                    src={resource.imageUrl}
                    alt={resource.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                  {/* 財產編號 */}
                  <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm text-sky-300 text-[11px] font-mono font-semibold px-2 py-0.5 rounded border border-slate-700 shadow">
                    {resource.code}
                  </span>

                  {/* 閒置/使用中狀態標籤 */}
                  <div className="absolute top-3 right-3">
                    {isAvailable && (
                      <span className="bg-emerald-600/95 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1 shadow">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        閒置可借用
                      </span>
                    )}
                    {isReserved && (
                      <span className="bg-amber-600/95 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1 shadow">
                        <Clock className="w-3 h-3" />
                        已有排程
                      </span>
                    )}
                    {isInUse && (
                      <span className="bg-sky-600/95 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1 shadow">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        使用中 (可約後續)
                      </span>
                    )}
                  </div>

                  {/* 教室/設備名稱 */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-base font-bold text-white tracking-tight drop-shadow truncate">
                      {resource.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-200 mt-0.5 drop-shadow">
                      <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                      <span className="truncate">{resource.location}</span>
                    </div>
                  </div>
                </div>

                {/* 卡片本體內容 */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {resource.description}
                  </p>

                  {/* 關鍵配備 Tags */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">主要配置與規格：</div>
                    <div className="flex flex-wrap gap-1">
                      {resource.specs.slice(0, 3).map((spec, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[200px]">
                          {spec}
                        </span>
                      ))}
                      {resource.specs.length > 3 && (
                        <span className="text-[10px] text-slate-500 px-1 py-0.5">
                          +{resource.specs.length - 3}項
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 借用提示與歸還說明 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>管理：<strong className="text-slate-800">{resource.custodian}</strong></span>
                    <span className="text-sky-700 font-semibold">借期上限 3 天</span>
                  </div>

                  {/* 按鈕組 */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onSelectResource(resource)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      詳細規格
                    </button>
                    <button
                      onClick={() => onBookResource(resource)}
                      className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      預約登記
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
