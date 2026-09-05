import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Bell, 
  UserCheck, 
  ShieldCheck, 
  GraduationCap, 
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  Inbox,
  FileCheck,
  ChevronDown,
  Users,
  Search,
  X
} from 'lucide-react';
import { getTodayString, getEarliestReservationDate } from '../utils/dateUtils';
import { UserRole } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { 
    currentUser, 
    allUsers, 
    setCurrentUser, 
    notifications, 
    markNotificationRead, 
    clearAllNotifications,
    stats,
    resetToDefaultData 
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [roleCategoryFilter, setRoleCategoryFilter] = useState<'all' | 'review' | 'directors' | 'sections' | 'programs' | 'teachers' | 'homeroom'>('all');

  const unreadNotifs = notifications.filter(n => !n.read && (n.userId === currentUser.id || currentUser.role !== 'faculty'));
  const todayStr = getTodayString();
  const earliestDateStr = getEarliestReservationDate(todayStr);

  // 分類判斷邏輯
  const isReviewer = (u: typeof currentUser) => u.role === 'academic_director' || u.role === 'section_officer';
  const isDirectorOrSec = (u: typeof currentUser) => ['user-sec-zheng', 'user-sa-hu', 'user-ga-wang', 'user-guid-wei', 'user-intern-xie'].includes(u.id);
  const isSectionOfficer = (u: typeof currentUser) => ['user-acad-liu', 'user-acad-hong', 'user-acad-jian', 'user-sa-cai', 'user-sa-yuan', 'user-sa-huang', 'user-sa-chen', 'user-sa-zhang', 'user-sa-coach-chen', 'user-sa-nurse-xu'].includes(u.id);
  const isProgramDirector = (u: typeof currentUser) => ['user-intern-liu-qy', 'user-intern-yang', 'user-intern-cai-xl', 'user-intern-liu-zc', 'user-intern-liu-hr'].includes(u.id);
  const isSpecialTeacher = (u: typeof currentUser) => ['user-teacher-lee', 'user-teacher-lei', 'user-teacher-cai-lang', 'user-guid-chen'].includes(u.id);
  const isHomeroomTeacher = (u: typeof currentUser) => u.id.startsWith('user-home-');

  // 搜尋過濾
  const filteredUsers = allUsers.filter(u => {
    // 分類篩選
    if (roleCategoryFilter === 'review' && !isReviewer(u)) return false;
    if (roleCategoryFilter === 'directors' && !isDirectorOrSec(u)) return false;
    if (roleCategoryFilter === 'sections' && !isSectionOfficer(u)) return false;
    if (roleCategoryFilter === 'programs' && !isProgramDirector(u)) return false;
    if (roleCategoryFilter === 'teachers' && !isSpecialTeacher(u)) return false;
    if (roleCategoryFilter === 'homeroom' && !isHomeroomTeacher(u)) return false;

    // 關鍵字搜尋
    if (roleSearchTerm.trim()) {
      const q = roleSearchTerm.trim().toLowerCase();
      const match = 
        u.name.toLowerCase().includes(q) ||
        u.title.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'faculty':
        return { label: '申請教職員', icon: <UserCheck className="w-3.5 h-3.5" />, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'section_officer':
        return { label: '教務處招設組 (承辦審核)', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'bg-sky-100 text-sky-800 border-sky-300' };
      case 'academic_director':
        return { label: '教務主任 (主管核定)', icon: <GraduationCap className="w-3.5 h-3.5" />, color: 'bg-purple-100 text-purple-800 border-purple-300' };
    }
  };

  const currentBadge = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg" id="app-header">
      {/* 頂部重要規則提示條 */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 px-4 py-1.5 text-xs text-blue-200 flex flex-wrap items-center justify-between border-b border-blue-900/50">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-medium bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            今日：{todayStr}
          </span>
          <span className="hidden sm:inline text-blue-300/80">
            📌 依規定：借用須於借用日 <strong className="text-white underline decoration-amber-400 underline-offset-2">3 日前</strong> 先行登記（最早預約日：{earliestDateStr}），借用後須於 <strong className="text-white underline decoration-amber-400 underline-offset-2">3 日內</strong> 歸還。
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefaultData}
            className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] hover:underline"
            title="重設所有借用展示資料為初始狀態"
          >
            <RotateCcw className="w-3 h-3" /> 重設範例資料
          </button>
        </div>
      </div>

      {/* 主要導覽列 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & 標題 */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('explore')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20 border border-sky-400/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  教務處教學設備與教室借用系統
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-sky-500/20 text-sky-300 rounded border border-sky-400/30">
                  教職員專區
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                含視聽教室、多功能教室、資源班教室及各項資訊影音設備借用管理
              </p>
            </div>
          </div>

          {/* 右側：身分切換與通知 */}
          <div className="flex items-center gap-3">
            {/* 通知按鈕 */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowRoleMenu(false);
                }}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="系統通知"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* 通知下拉選單 */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-3 text-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-800">
                      <Bell className="w-4 h-4 text-sky-600" />
                      系統訊息與簽核通知 ({unreadNotifs.length})
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-sky-600 hover:text-sky-700 font-medium"
                      >
                        全部標示為已讀
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 mt-1">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        目前尚無系統通知
                      </div>
                    ) : (
                      notifications.slice(0, 8).map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`py-2.5 px-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors ${
                            !notif.read ? 'bg-sky-50/60' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className={`font-semibold ${
                              notif.type === 'urgent' ? 'text-rose-600' :
                              notif.type === 'warning' ? 'text-amber-600' :
                              notif.type === 'success' ? 'text-emerald-600' : 'text-sky-700'
                            }`}>
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 角色切換器 (供審核測試與實際權限切換) */}
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/90 border border-slate-700 px-3 py-1.5 rounded-xl transition-all"
              >
                <div className={`w-7 h-7 rounded-lg ${currentUser.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-inner`}>
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                    {currentUser.name}
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${currentBadge.color}`}>
                      {currentBadge.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">{currentUser.department}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* 角色選單 (全體38位教職員與行政主管切換) */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-[420px] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-3 text-slate-800 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-1 py-1 text-xs font-bold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <span className="flex items-center gap-1.5 text-slate-900">
                      <Users className="w-4 h-4 text-sky-600" />
                      全校教職員與審核主管名冊 ({allUsers.length} 位)
                    </span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-normal">
                      點擊切換身分
                    </span>
                  </div>

                  {/* 搜尋列 */}
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={roleSearchTerm}
                      onChange={(e) => setRoleSearchTerm(e.target.value)}
                      placeholder="快速搜尋姓名、職稱、班級或處室..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                    {roleSearchTerm && (
                      <button
                        onClick={() => setRoleSearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* 分類快速篩選標籤 */}
                  <div className="flex flex-wrap gap-1 mb-2.5 pb-2 border-b border-slate-100 text-[11px]">
                    {[
                      { id: 'all', label: `全部 (${allUsers.length})` },
                      { id: 'review', label: '🏛️ 審核主管 (2)' },
                      { id: 'directors', label: '🏫 處室主管/秘書 (5)' },
                      { id: 'sections', label: '💼 行政組長/專業 (10)' },
                      { id: 'programs', label: '🔬 學程主任 (5)' },
                      { id: 'teachers', label: '📚 特色/專任 (4)' },
                      { id: 'homeroom', label: '🎓 班級導師 (12)' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setRoleCategoryFilter(tab.id as typeof roleCategoryFilter)}
                        className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                          roleCategoryFilter === tab.id
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* 人員列表清單 */}
                  <div className="max-h-80 overflow-y-auto pr-1 space-y-1">
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        查無符合條件的教職員
                      </div>
                    ) : (
                      filteredUsers.map(user => {
                        const isSelected = user.id === currentUser.id;
                        const badge = getRoleBadge(user.role);
                        return (
                          <button
                            key={user.id}
                            onClick={() => {
                              setCurrentUser(user);
                              setShowRoleMenu(false);
                              if (user.role === 'section_officer') setActiveTab('section_review');
                              else if (user.role === 'academic_director') setActiveTab('director_approval');
                              else setActiveTab('explore');
                            }}
                            className={`w-full text-left p-2 rounded-lg flex items-center gap-2.5 transition-colors ${
                              isSelected ? 'bg-sky-50 border border-sky-300 text-sky-900 shadow-xs' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg ${user.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                              {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold flex items-center justify-between">
                                <span className="text-slate-900 flex items-center gap-1.5">
                                  {user.name}
                                  <span className="text-[10px] text-slate-600 font-normal bg-slate-100 px-1.5 py-0.2 rounded">
                                    {user.title}
                                  </span>
                                </span>
                                {isSelected ? (
                                  <span className="text-[10px] text-sky-700 font-semibold bg-sky-100 px-1.5 py-0.2 rounded shrink-0">當前登入</span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 shrink-0">{user.phone}</span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                                {user.role !== 'faculty' && (
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${badge.color}`}>{badge.label}</span>
                                )}
                                <span className="truncate">{user.department}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 導覽頁籤 */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm font-medium border-t border-slate-800/80 pt-2">
          <button
            id="nav-explore"
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'explore'
                ? 'bg-sky-600 text-white font-semibold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            設備與教室預約大廳
          </button>

          <button
            id="nav-schedule"
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'schedule'
                ? 'bg-sky-600 text-white font-semibold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            檔期借用現況日曆
          </button>

          <button
            id="nav-my-reservations"
            onClick={() => setActiveTab('my_reservations')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'my_reservations'
                ? 'bg-sky-600 text-white font-semibold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Inbox className="w-4 h-4" />
            我的借用申請紀錄
          </button>

          {/* 教務處招設組專屬頁籤 */}
          <button
            id="nav-section-review"
            onClick={() => setActiveTab('section_review')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'section_review'
                ? 'bg-sky-600 text-white font-semibold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            教務處招設組審核台
            {stats.pendingSectionCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-slate-900 text-[10px] font-bold rounded-full">
                {stats.pendingSectionCount}
              </span>
            )}
          </button>

          {/* 教務主任核定專屬頁籤 */}
          <button
            id="nav-director-approval"
            onClick={() => setActiveTab('director_approval')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'director_approval'
                ? 'bg-purple-600 text-white font-semibold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4 text-purple-400" />
            教務主任核定中心
            {stats.pendingDirectorCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                {stats.pendingDirectorCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
