import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Upload, 
  Link, 
  RotateCcw, 
  Check, 
  School, 
  GraduationCap, 
  Cog, 
  Image as ImageIcon,
  Sparkles,
  Info,
  Lock,
  ShieldAlert,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

// 精選校徽預設 Data URIs (使用已驗證 Base64 編碼，無字元編碼異常風險)
const PRESET_LOGOS = [
  {
    id: 'slvs-emblem',
    name: '沙鹿高工 經典工藝校徽',
    desc: '以工業齒輪、紡紗筒管與工藝意象為主之標準校徽',
    icon: <Cog className="w-8 h-8 text-sky-400 animate-spin" />,
    svg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDI4NGM3Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMWUzYThhIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImdvbGQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmYmJmMjQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNkOTc3MDYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSI1NiIgZmlsbD0idXJsKCNnKSIgc3Ryb2tlPSIjMzhiZGY4IiBzdHJva2Utd2lkdGg9IjMiLz48cGF0aCBkPSJNNjAgMTQgTDY0IDIyIEw3MiAyMiBMNzAgMzAgTDc4IDMzIEw3MyA0MCBMODAgNDYgTDczIDUwIEw3OCA1NyBMNzAgNTkgTDcyIDY3IEw2NCA2NyBMNjAgNzUgTDU2IDY3IEw0OCA2NyBMNTAgNTkgTDQyIDU3IEw0NyA1MCBMNDAgNDYgTDQ3IDQwIEw0MiAzMyBMNTAgMzAgTDQ4IDIyIEw1NiAyMiBaIiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjZ29sZCkiIHN0cm9rZS13aWR0aD0iMi41Ii8+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iMzIiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzAzNjlhMSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjAiIHk9IjU1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0iIzBjNGE2ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5rKZ5belPC90ZXh0Pjx0ZXh0IHg9IjYwIiB5PSI3MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iOC41IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzAyODRjNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0xWUzwvdGV4dD48Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSI1MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEuMiIgc3Ryb2tlLWRhc2hhcnJheT0iMywzIi8+PC9zdmc+'
  },
  {
    id: 'academic-school',
    name: '現代學府 卓越校徽',
    desc: '莊嚴現代學校建築殿堂與教務卓越象徵',
    icon: <School className="w-8 h-8 text-indigo-400" />,
    svg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzQzMzhjYSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzMxMmU4MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iMjgiIGZpbGw9InVybCgjYmcpIiBzdHJva2U9IiM4MThjZjgiIHN0cm9rZS13aWR0aD0iMyIvPjxwYXRoIGQ9Ik02MCAyMiBMOTIgMzggTDI4IDM4IFoiIGZpbGw9IiNmYmJmMjQiLz48cmVjdCB4PSIzNCIgeT0iNDIiIHdpZHRoPSIxMCIgaGVpZ2h0PSI0MiIgZmlsbD0iI2UwZTdmZiIgcng9IjIiLz48cmVjdCB4PSI1NSIgeT0iNDIiIHdpZHRoPSIxMCIgaGVpZ2h0PSI0MiIgZmlsbD0iI2UwZTdmZiIgcng9IjIiLz48cmVjdCB4PSI3NiIgeT0iNDIiIHdpZHRoPSIxMCIgaGVpZ2h0PSI0MiIgZmlsbD0iI2UwZTdmZiIgcng9IjIiLz48cmVjdCB4PSIyNSIgeT0iODQiIHdpZHRoPSI3MCIgaGVpZ2h0PSI4IiBmaWxsPSIjYzdkMmZlIiByeD0iMiIvPjx0ZXh0IHg9IjYwIiB5PSIxMDUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjkiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMSI+5pWZ5YuZ6JmVwrfmlZnlrbjoqK3lgpk8L3RleHQ+PC9zdmc+'
  },
  {
    id: 'vocational-crest',
    name: '技術高工 榮譽院徽',
    desc: '深造學術、教育榮耀與金質桂冠徽記',
    icon: <GraduationCap className="w-8 h-8 text-emerald-400" />,
    svg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJlZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzA2NWY0NiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA2NGUzYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjU2IiBmaWxsPSJ1cmwoI2VnKSIgc3Ryb2tlPSIjMzRkMzk5IiBzdHJva2Utd2lkdGg9IjMiLz48cGF0aCBkPSJNNjAgMjggTDk0IDQ0IEw2MCA2MCBMMjYgNDQgWiIgZmlsbD0iI2ZiYmYyNCIvPjxwYXRoIGQ9Ik00MiA1MyBMNDIgNzQgUTYwIDg0IDc4IDc4IEw3OCA1MyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMuNSIvPjx0ZXh0IHg9IjYwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjkiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjNmVlN2I3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UQUlDSFVORyBTTFZTPC90ZXh0Pjwvc3ZnPg=='
  }
];

export const LogoModal: React.FC = () => {
  const { 
    isLogoModalOpen, 
    setIsLogoModalOpen, 
    customLogo, 
    setCustomLogo, 
    showToast,
    currentUser,
    allUsers,
    setCurrentUser,
    isAuthenticated,
    setIsLoginModalOpen
  } = useApp();

  // 權限檢核：僅教務主任且通過認證身分可更換校徽
  const isAcademicDirector = currentUser.role === 'academic_director' && isAuthenticated;

  const [previewLogo, setPreviewLogo] = useState<string | null>(customLogo);
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 當開啟視窗或外部 customLogo 變動時同步更新預覽
  useEffect(() => {
    if (isLogoModalOpen) {
      setPreviewLogo(customLogo);
      setUrlInput('');
    }
  }, [isLogoModalOpen, customLogo]);

  // 全域拖曳攔截防護（避免使用者拖曳圖片至視窗外部導致瀏覽器預設開啟圖檔）
  useEffect(() => {
    if (!isLogoModalOpen) return;
    const handleWindowDragOver = (e: DragEvent) => e.preventDefault();
    const handleWindowDrop = (e: DragEvent) => e.preventDefault();
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);
    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [isLogoModalOpen]);

  const handleFileChange = (file: File) => {
    if (!isAcademicDirector) {
      showToast('error', '權限受限', '系統校徽已固定鎖定，僅限【教務主任】可更換！');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('error', '格式錯誤', '請選擇 PNG、JPG、JPEG、SVG 或 WebP 圖檔。');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('error', '檔案過大', '圖片大小請限制在 10MB 以內。');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onerror = () => {
      setIsProcessing(false);
      showToast('error', '檔案讀取異常', '無法讀取該圖檔，請重試或更換圖片。');
    };

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        setIsProcessing(false);
        return;
      }

      // 若為 SVG 向量圖檔，直接套用
      if (file.type.includes('svg')) {
        setPreviewLogo(result);
        setIsProcessing(false);
        return;
      }

      // 位元圖檔：透過 HTML Canvas 自動等比壓縮至適當解析度（上限 256px），杜絕 localStorage 配額超載
      try {
        const img = new Image();
        img.onerror = () => {
          setPreviewLogo(result);
          setIsProcessing(false);
        };
        img.onload = () => {
          try {
            const maxDim = 256;
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, w, h);
              const compressedUrl = canvas.toDataURL('image/png', 0.9);
              setPreviewLogo(compressedUrl);
            } else {
              setPreviewLogo(result);
            }
          } catch {
            setPreviewLogo(result);
          } finally {
            setIsProcessing(false);
          }
        };
        img.src = result;
      } catch {
        setPreviewLogo(result);
        setIsProcessing(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isAcademicDirector) {
      showToast('error', '權限受限', '系統校徽已固定鎖定，僅限【教務主任】可更換！');
      return;
    }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (!isAcademicDirector) {
      showToast('error', '權限受限', '系統校徽已固定鎖定，僅限【教務主任】可更換！');
      return;
    }
    const trimmed = urlInput.trim();
    if (!trimmed) {
      showToast('warning', '請輸入網址', '請輸入正確的圖片網址。');
      return;
    }
    setPreviewLogo(trimmed);
    showToast('info', '網址已帶入預覽', '若圖片正常顯示，請點選下方「確認套用更換」儲存。');
  };

  const handleSave = () => {
    if (!isAcademicDirector) {
      showToast('error', '權限受限', '系統校徽已固定鎖定，僅限【教務主任】登入後方可更換！');
      return;
    }
    setCustomLogo(previewLogo);
    setIsLogoModalOpen(false);
    showToast('success', '校徽 LOGO 已更新', '教務主任已成功更換全校系統校徽！');
  };

  const handleReset = () => {
    if (!isAcademicDirector) {
      showToast('error', '權限受限', '系統校徽已固定鎖定，僅限【教務主任】登入後方可更換！');
      return;
    }
    setPreviewLogo(null);
    setCustomLogo(null);
    setUrlInput('');
    setIsLogoModalOpen(false);
    showToast('info', '已恢復預設圖示', '已還原為系統標準校徽圖示。');
  };

  const handleSwitchToDirectorLogin = () => {
    const directorUser = allUsers.find(u => u.role === 'academic_director');
    if (directorUser) {
      setCurrentUser(directorUser);
    }
    setIsLogoModalOpen(false);
    setIsLoginModalOpen(true);
    showToast('info', '請以教務主任帳號登入', '請輸入教務主任 (魏主任) 之驗證密碼進行登入認證。');
  };

  if (!isLogoModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* 頂部標題列 */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isAcademicDirector 
                ? 'bg-amber-500/20 text-amber-400 border-amber-400/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {isAcademicDirector ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">系統校徽 LOGO 圖示管理</h3>
                {isAcademicDirector ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> 主任專屬授權
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-amber-400 border border-amber-500/40 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> 已安全固定
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isAcademicDirector 
                  ? '教務主任具備全校首頁及各項公務借用單據校徽更換管理權限' 
                  : '系統校徽已固定鎖定，除教務主任登入外無法更換'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsLogoModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 當前即時預覽區 */}
          <div className="bg-slate-900 rounded-xl p-4 text-white border border-slate-800 flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-sky-500/50 flex items-center justify-center overflow-hidden shadow-inner p-1">
                {previewLogo ? (
                  <img 
                    src={previewLogo} 
                    alt="校徽預覽" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                    <School className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-sky-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-slate-900">
                預覽
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-sky-400 font-semibold uppercase tracking-wider">
                  全校主頁與單據效果
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  已固定鎖定保護
                </span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white tracking-tight truncate mt-0.5">
                教務處教學設備與教室借用系統
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {customLogo ? '已套用學校固定自訂校徽，全校教職員使用介面均以此圖示呈現' : '目前使用標準預設校徽圖示'}
              </p>
            </div>
          </div>

          {/* 非教務主任身分：安全鎖定提示與登入切換 */}
          {!isAcademicDirector ? (
            <div className="space-y-4">
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-left space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>權限受限：校徽圖示已固定鎖定</span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  依據學校資訊安全管理規範，本系統校徽已固定設定完畢。為確保校級系統介面嚴謹與統一性，<strong>除【教務主任】登入後可進行更換外，一般教職員與承辦人員均無法修改此圖示</strong>。
                </p>

                <div className="bg-white/80 rounded-lg p-3 border border-amber-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">目前登入帳號：</span>
                    <span className="font-bold text-slate-800">{currentUser.username} - {currentUser.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">目前職稱單位：</span>
                    <span className="text-slate-700">{currentUser.title} / {currentUser.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">校徽管理權限：</span>
                    <span className="font-semibold text-rose-600 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> 無權限變更 (僅檢視)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogoModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  關閉視窗
                </button>
                <button
                  type="button"
                  onClick={handleSwitchToDirectorLogin}
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  以【教務主任】身分登入更換
                </button>
              </div>
            </div>
          ) : (
            /* 教務主任專屬更換介面 */
            <>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>教務主任權限認證通過 ({currentUser.name})：您可以執行更換校徽、上傳新圖檔或還原預設。</span>
              </div>

              {/* 模式切換分頁 */}
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'upload'
                      ? 'border-sky-600 text-sky-600 bg-sky-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  本地上傳圖檔
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'presets'
                      ? 'border-sky-600 text-sky-600 bg-sky-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  內建精選校徽
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'url'
                      ? 'border-sky-600 text-sky-600 bg-sky-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Link className="w-4 h-4" />
                  輸入圖片網址
                </button>
              </div>

              {/* Tab 1: 本地上傳 */}
              {activeTab === 'upload' && (
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-sky-500 bg-sky-50/80 scale-[0.99]'
                        : 'border-slate-300 hover:border-sky-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      {isProcessing ? '正在處理圖檔...' : '點擊選擇校徽圖檔 或 將圖片拖曳至此'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      支援格式：PNG、JPG、JPEG、SVG、WebP（建議使用透明背景圖，系統會自動優化儲存）
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: 內建精選樣式 */}
              {activeTab === 'presets' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    點選以下任一徽章樣式即可直接套用為首頁 LOGO：
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PRESET_LOGOS.map((preset) => (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => setPreviewLogo(preset.svg)}
                        className={`p-3 rounded-xl border text-left flex flex-col items-center text-center transition-all cursor-pointer ${
                          previewLogo === preset.svg
                            ? 'border-sky-600 bg-sky-50 shadow-md ring-2 ring-sky-500/20'
                            : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden mb-2 shadow-sm border border-slate-200/80 bg-white flex items-center justify-center p-1">
                          <img 
                            src={preset.svg} 
                            alt={preset.name} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-bold text-xs text-slate-800">{preset.name}</span>
                        <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{preset.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: 圖片網址 */}
              {activeTab === 'url' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    線上圖片網址 (URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer"
                    >
                      載入測試
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-sky-500" />
                    可輸入各機關學校官方網站公開發布之校徽圖檔連結。
                  </p>
                </div>
              )}

              {/* 底部操作按鈕 */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  恢復預設圖示
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLogoModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    確認套用更換
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
