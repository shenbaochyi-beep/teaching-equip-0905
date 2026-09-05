import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  UserCheck, 
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserHint?: UserProfile | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, targetUserHint }) => {
  const { currentUser, isAuthenticated, loginWithAccount } = useApp();

  const [accountInput, setAccountInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [matchedUsers, setMatchedUsers] = useState<UserProfile[] | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAccountInput('');
      setErrorMessage('');
      setMatchedUsers(null);
    }
  }, [isOpen, targetUserHint]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setMatchedUsers(null);

    if (!accountInput.trim()) {
      setErrorMessage('請輸入教職員登入帳號！');
      return;
    }

    const res = loginWithAccount(accountInput);
    if (!res.success) {
      if (res.matchedUsers && res.matchedUsers.length > 1) {
        setMatchedUsers(res.matchedUsers);
      } else {
        setErrorMessage(res.message);
      }
    } else {
      onClose();
    }
  };

  const handleSelectMultiUser = (userId: string) => {
    const res = loginWithAccount(accountInput, userId);
    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        {/* 頂部資安橫幅標頭 */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 relative">
          {isAuthenticated && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="關閉視窗"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-md">
                  校園資安控管
                </span>
                <span className="text-[11px] text-slate-400">
                  符合教育部資通安全規範
                </span>
              </div>
              <h2 id="login-modal-title" className="text-lg font-bold text-white mt-1">
                教職員身分驗證登入
              </h2>
            </div>
          </div>

          <p className="text-xs text-blue-200/80 mt-2.5 leading-relaxed">
            為維護學校教學設備與專科教室之借用資安權責，本系統全體教職員皆配發專屬公務帳號，<strong className="text-white underline decoration-amber-400 underline-offset-2">需帳號完全符合才能登入授權</strong>。
          </p>

          {isAuthenticated && currentUser && (
            <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-300">目前登入身分：</span>
              <span className="font-semibold text-sky-300 flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-0.5 rounded border border-slate-700">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                {currentUser.name}（{currentUser.title}）
              </span>
            </div>
          )}

          {targetUserHint && (
            <div className="mt-2 text-xs text-amber-200 bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span>欲登入身分：<strong>{targetUserHint.name}（{targetUserHint.title}）</strong>，請輸入專屬登入帳號驗證。</span>
            </div>
          )}
        </div>

        {/* 核心登入表單 */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                請輸入教職員登入帳號 <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={accountInput}
                  onChange={(e) => {
                    setAccountInput(e.target.value);
                    setErrorMessage('');
                    setMatchedUsers(null);
                  }}
                  placeholder="請輸入教職員登入帳號"
                  className={`w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${
                    errorMessage ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
                  }`}
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" />
                英文字母不分大小寫，需帳號完全符合名冊設定方可登入。
              </p>
            </div>

            {/* 錯誤提示訊息 */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold">資安比對不符</div>
                  <div className="mt-0.5 text-rose-600 leading-relaxed">{errorMessage}</div>
                </div>
              </div>
            )}

            {/* 若為多名專任教師共用之專案帳號 (如 slvs281: 李玉雯、雷藤、蔡秀珠) */}
            {matchedUsers && matchedUsers.length > 0 && (
              <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl space-y-2 animate-in fade-in">
                <div className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  帳號驗證符合專案教師群組，請確認您的姓名以完成登入：
                </div>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {matchedUsers.map(user => (
                    <button
                      type="button"
                      key={user.id}
                      onClick={() => handleSelectMultiUser(user.id)}
                      className="text-left p-2.5 bg-white border border-sky-200 hover:border-sky-400 hover:bg-sky-50/50 rounded-lg flex items-center justify-between transition-all group shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-md ${user.avatarBg} text-white flex items-center justify-center font-bold text-xs`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-sky-700">
                            {user.name}（{user.title}）
                          </div>
                          <div className="text-[10px] text-slate-500">{user.department} · 分機 {user.phone}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-sky-600 group-hover:underline flex items-center gap-1">
                        以此身分登入 <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 送出與操作按鈕 */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                id="btn-login-submit"
                className="flex-1 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                核身登入系統
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                >
                  取消
                </button>
              )}
            </div>
          </form>

          {/* 資安注意事項 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-sky-600" />
              校園資訊安全注意事項
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              為確保教學設備借用與行政審核權責之真實性，請輸入您個人專屬之教職員公務登入帳號。若忘記登入帳號，請洽教務處招設組（分機 230）或資訊單位查詢。
            </p>
          </div>
        </div>

        {/* 頁尾說明 */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center text-[11px] text-slate-500">
          國立學校 教務處教學設備組 · 校園資訊安全防護系統
        </div>
      </div>
    </div>
  );
};
