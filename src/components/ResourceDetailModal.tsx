import React from 'react';
import { ResourceItem } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Building, 
  MapPin, 
  Users, 
  CheckCircle2, 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar, 
  Clock, 
  Layers,
  Sparkles
} from 'lucide-react';

interface ResourceDetailModalProps {
  resource: ResourceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (resource: ResourceItem) => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  isOpen,
  onClose,
  onBook
}) => {
  const { reservations } = useApp();

  if (!isOpen || !resource) return null;

  // 取得此資源未來的預約
  const upcomingReservations = reservations
    .filter(r => r.resourceId === resource.id && (r.status === 'approved' || r.status === 'borrowed' || r.status === 'section_approved' || r.status === 'pending_section'))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto" id="resource-detail-modal">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header with Hero Image */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-950">
          <img 
            src={resource.imageUrl} 
            alt={resource.name}
            className="w-full h-full object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white p-2 rounded-full backdrop-blur transition-colors"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/40">
                  {resource.code}
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  {resource.location}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {resource.name}
              </h2>
            </div>
            
            <div className="hidden sm:block">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                resource.status === 'available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                resource.status === 'in_use' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {resource.status === 'available' ? '🟢 閒置可借用' :
                 resource.status === 'in_use' ? '🔵 目前使用中' : '🟡 預約調度中'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* 基本描述與管理單位 */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">場地/設備簡介</h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* 規格配置清單 */}
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              硬體配備與功能清單
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {resource.specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 使用注意事項 */}
          <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl p-4 text-xs text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300 mb-0.5">使用與保養注意事項</div>
              <div className="leading-relaxed text-amber-200/90">{resource.cautionNotes}</div>
              <div className="mt-1 text-[11px] text-amber-400/80">
                ※ 借用後須於 3 日內完成點收歸還手續。逾期未還或特殊需求者請事先辦理延長申請。
              </div>
            </div>
          </div>

          {/* 已登記檔期預覽 */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-400" />
              已登記/預約使用排程 ({upcomingReservations.length})
            </h4>
            {upcomingReservations.length === 0 ? (
              <div className="bg-slate-800/40 p-4 rounded-xl text-center text-xs text-slate-400">
                目前近期尚無其他預約登記，歡迎教職員提前 3 日登記借用。
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingReservations.map(res => (
                  <div key={res.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">
                        {res.startDate} ({res.startTime}) 至 {res.expectedReturnDate} ({res.expectedReturnTime})
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        申請人：{res.applicantName} ({res.applicantDepartment}) · {res.purpose}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-sky-950 text-sky-300 border border-sky-800">
                      {res.status === 'borrowed' ? '使用中' : '已核准排程'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            保管處室：<strong className="text-slate-200">{resource.custodian}</strong>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
            >
              關閉
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(resource);
              }}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              立即登記借用 (提前3日預約)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
