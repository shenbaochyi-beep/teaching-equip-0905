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
  KeyRound,
  LogOut,
  Lock,
  LogIn,
  School
} from 'lucide-react';
import { getTodayString, getEarliestReservationDate } from '../utils/dateUtils';
import { UserRole, UserProfile } from '../types';
import { LoginModal } from './LoginModal';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    notifications, 
    markNotificationRead, 
    clearAllNotifications,
    stats,
    resetToDefaultData,
    isAuthenticated,
    isLoginModalOpen,
    setIsLoginModalOpen,
    logout,
    customLogo,
    showToast
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [targetUserForLogin, setTargetUserForLogin] = useState<UserProfile | null>(null);

  const unreadNotifs = notifications.filter(n => !n.read && (n.userId === currentUser.id || currentUser.role !== 'faculty'));
  const todayStr = getTodayString();
  const earliestDateStr = getEarliestReservationDate(todayStr);

  // 判斷是否為已登入之教務主任 (具備更換與管理校徽權限)
  const isAcademicDirector = currentUser.role === 'academic_director' && isAuthenticated;

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
            📌 依規定：借用須於借用日 <strong className="text-white underline decoration-amber-400 underline-offset-2">30 日前</strong> 先行登記（最早預約日：{earliestDateStr}），借用後須於 <strong className="text-white underline decoration-amber-400 underline-offset-2">3 日內</strong> 歸還。
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
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveTab('explore')}
              className="cursor-pointer transition-transform hover:scale-105"
              title="國立成功商業水產職業學校"
            >
              {customLogo ? (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white p-1 shadow-md shadow-sky-500/20 border border-sky-400/40 flex items-center justify-center overflow-hidden">
                  <img 
                    src={customLogo} 
                    alt="國立成功商水 校徽 LOGO" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-sky-500/20 border border-sky-400/30">
                  <School className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span 
                  onClick={() => setActiveTab('explore')}
                  className="font-bold text-base sm:text-lg tracking-tight text-white hover:text-sky-300 transition-colors cursor-pointer"
                >
                  國立成功商水 教學設備與教室借用系統
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-sky-500/20 text-sky-300 rounded border border-sky-400/30">
                  教職員專區
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                含視聽教室、多功能學習教室、合作學習教室、生活科技/創課教室及各項資訊影音設備借用管理
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
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifMenu(false)} 
                  />
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
                </>
              )}
            </div>

            {/* 角色切換與身分驗證器 */}
            <div className="relative">
              {!isAuthenticated ? (
                <button
                  id="btn-role-switcher"
                  onClick={() => {
                    setTargetUserForLogin(null);
                    setIsLoginModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-rose-900/90 hover:bg-rose-800 text-rose-100 border border-rose-500/50 px-3 py-1.5 rounded-xl transition-all shadow-md animate-pulse"
                >
                  <Lock className="w-4 h-4 text-rose-300" />
                  <span className="text-xs font-bold">資安鎖定：請輸入帳號登入</span>
                  <LogIn className="w-3.5 h-3.5" />
                </button>
              ) : (
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
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        已驗證
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${currentBadge.color}`}>
                        {currentBadge.label}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>{currentUser.department}</span>
                      <span>·</span>
                      <span>分機 {currentUser.phone}</span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}

              {/* 登入帳號選單 (僅留切換教職員帳號及安全登出之選項功能) */}
              {showRoleMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowRoleMenu(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-3 text-slate-800 animate-in fade-in zoom-in-95 duration-100">
                    {/* 當前登入資訊卡 */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg ${currentUser.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}>
                          {currentUser.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                            <span className="truncate">{currentUser.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${currentBadge.color}`}>
                              {currentBadge.label}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                            {currentUser.department} · 分機 {currentUser.phone}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>已通過校園資安身分驗證</span>
                      </div>

                      <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                        <button
                          id="btn-switch-account"
                          onClick={() => {
                            setShowRoleMenu(false);
                            setTargetUserForLogin(null);
                            setIsLoginModalOpen(true);
                          }}
                          className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          切換教職員帳號
                        </button>
                        <button
                          id="btn-logout"
                          onClick={() => {
                            setShowRoleMenu(false);
                            logout();
                          }}
                          className="w-full py-2 px-3 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 border border-slate-200 hover:border-rose-300 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                          title="安全登出當前帳號"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          安全登出
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 導覽頁籤 */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm font-medium border-t border-slate-800/80 pt-2">
          <button
            id="nav-explore"
            onClick={() => {
              if (!isAuthenticated) {
                setIsLoginModalOpen(true);
                return;
              }
              setActiveTab('explore');
            }}
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
            onClick={() => {
              if (!isAuthenticated) {
                setIsLoginModalOpen(true);
                return;
              }
              setActiveTab('schedule');
            }}
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
            onClick={() => {
              if (!isAuthenticated) {
                setIsLoginModalOpen(true);
                return;
              }
              setActiveTab('my_reservations');
            }}
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
            onClick={() => {
              if (!isAuthenticated) {
                setIsLoginModalOpen(true);
                return;
              }
              setActiveTab('section_review');
            }}
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
            onClick={() => {
              if (!isAuthenticated) {
                setIsLoginModalOpen(true);
                return;
              }
              setActiveTab('director_approval');
            }}
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

      {/* 資安登入驗證視窗 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setTargetUserForLogin(null);
        }}
        targetUserHint={targetUserForLogin}
      />
    </header>
  );
};
