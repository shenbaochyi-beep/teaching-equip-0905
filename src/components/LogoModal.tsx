import React, { useState, useRef, useEffect } from 'react';
import { useApp, DEFAULT_SCHOOL_LOGO } from '../context/AppContext';
import { 
  X, 
  Upload, 
  RotateCcw, 
  Check, 
  School, 
  GraduationCap, 
  Sparkles,
  Info,
  CheckCircle2,
  FileImage,
  ArrowRight
} from 'lucide-react';

// 精選校徽預設 Data URIs
const PRESET_LOGOS = [
  {
    id: 'ckvs-official-web',
    name: '國立成功商水 官方網站正式校徽 (正版實體徽章)',
    desc: '臺東縣國立成功商業水產職業學校官方首頁正版標準校徽',
    icon: <Sparkles className="w-8 h-8 text-sky-400" />,
    svg: '/official_ckvs_logo.jpg'
  },
  {
    id: 'ckvs-official',
    name: '國立成功商水 官方紀念校徽 (海豚躍浪·深藍金環款)',
    desc: '躍起海豚象徵大躍進，融合商業古幣與水產浩瀚太平洋浪花',
    icon: <Sparkles className="w-8 h-8 text-sky-400" />,
    svg: '/ckvs_logo.svg'
  },
  {
    id: 'ckvs-coin-water',
    name: '成功商水 創校精神徽 (古幣與流水)',
    desc: '以「錢幣」代表商業、「流水」代表水產之經典創校意象',
    icon: <School className="w-8 h-8 text-indigo-400" />,
    svg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InAyX2JnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzBjNGE2ZSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMzY5YTEiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InAyX2dvbGQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmRlMDQ3Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2Q5NzcwNiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPGNpcmNsZSBjeD0iODAiIGN5PSI4MCIgcj0iNzYiIGZpbGw9InVybCgjcDJfYmcpIiBzdHJva2U9IiMzOGJkZjgiIHN0cm9rZS13aWR0aD0iMyIvPgogIDwhLS0g5Y+k5bmj5aSW55KwICjku6PooajllYbogqopIC0tPgogIDxjaXJjbGUgY3g9IjgwIiBjeT0iODAiIHI9IjUyIiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjcDJfZ29sZCkiIHN0cm9rZS13aWR0aD0iNSIvPgogIDxyZWN0IHg9IjY1IiB5PSI2NSIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJ1cmwoI3AyX2dvbGQpIiBzdHJva2Utd2lkdGg9IjMiLz4KICA8IS0tIOa1gemwsua1qua9riAo5Luj6KGo5rC055SiKSAtLT4KICA8cGF0aCBkPSJNIDMyIDg4IFEgNTYgNjggODAgODggVCAxMjggODgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM4YmRmOCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNIDMyIDEwMiBRIDU2IDgyIDgwIDEwMiBUIDEyOCAxMDIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzdkZDNmYyIgc3Ryb2tlLXdpZHRoPSIzLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDx0ZXh0IHg9IjgwIiB5PSI0NiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtd2VpZ2h0PSI5MDAiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGxldHRlci1zcGFjaW5nPSIxIj7lnIvnv4vmiJDlip/llYbogrE8L3RleHQ+CiAgPHRleHQgeD0iODAiIHk9IjgxIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI5IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzAzNjlhMSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5ZWGIMK3IOawtDwvdGV4dD4KICA8dGV4dCB4PSI4MCIgeT0iMTMyIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZkZTA0NyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VEFJVFVORyBDS1ZTPC90ZXh0Pgo8L3N2Zz4='
  },
  {
    id: 'ckvs-30th',
    name: '成功商水 30週年校慶「旗魚破浪」紀念徽',
    desc: '旗魚破浪、商水揚帆，象徵昂首邁進新里程碑',
    icon: <GraduationCap className="w-8 h-8 text-emerald-400" />,
    svg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InAzX2JnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InAzX2dvbGQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmRlMDQ3Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2VhYjMwOCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPGNpcmNsZSBjeD0iODAiIGN5PSI4MCIgcj0iNzYiIGZpbGw9InVybCgjcDNfYmcpIiBzdHJva2U9IiMzNGQzOTkiIHN0cm9rZS13aWR0aD0iMyIvPgogIDxjaXJjbGUgY3g9IjgwIiBjeT0iODAiIHI9IjY4IiBmaWxsPSJub25lIiBzdHJva2U9IiM2ZWU3YjciIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSIzLDMiLz4KICA8IS0tIOegtOa1qumZveW4humIh+aXl+mtmOaEj+ixoSAtLT4KICA8cGF0aCBkPSJNIDQwIDEwNSBMIDgwIDMyIEwgODAgMTA1IFoiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOTUiLz4KICA8cGF0aCBkPSJNIDg1IDQ1IEwgMTIwIDEwNSBMIDg1IDEwNSBaIiBmaWxsPSIjYTdmM2QwIi8+CiAgPHBhdGggZD0iTSAzMCAxMTIgUSA4MCA5NiAxMzAgMTEyIiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjcDNfZ29sZCkiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHRleHQgeD0iODAiIHk9IjEzNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iOC41IiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMS41Ij7ml5fprZjnoLTmtarlt7sg5ZWG5rC05oWP5bidPC90ZXh0PgogIDx0ZXh0IHg9IjgwIiB5PSIyNSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZGUwNDciIHRleHQtYW5jaG9yPSJtaWRkbGUiPuaIkOWKn+aVn+awtCAzMHRoPC90ZXh0Pgo8L3N2Zz4='
  }
];

export const LogoModal: React.FC = () => {
  const { 
    isLogoModalOpen, 
    setIsLogoModalOpen, 
    customLogo, 
    setCustomLogo, 
    showToast
  } = useApp();

  const [previewLogo, setPreviewLogo] = useState<string | null>(customLogo || DEFAULT_SCHOOL_LOGO);
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 當開啟視窗或外部 customLogo 變動時同步更新預覽
  useEffect(() => {
    if (isLogoModalOpen) {
      setPreviewLogo(customLogo || DEFAULT_SCHOOL_LOGO);
      setUrlInput('');
      setUploadedFileName(null);
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

  // 核心圖檔解析、最佳化與套用邏輯 (支援寬鬆格式檢查、SVG 免 Canvas 跨域轉換、自動平滑壓縮)
  const processImageFile = (file: File, autoApply: boolean = false) => {
    const isImageByMime = file.type && file.type.startsWith('image/');
    const isImageByExt = /\.(png|jpe?g|svg|webp|gif|bmp|ico|jfif)$/i.test(file.name);
    
    if (!isImageByMime && !isImageByExt) {
      showToast('error', '格式不支援', '請選擇 PNG、JPG、JPEG、SVG、WebP 或 GIF 等圖片檔案。');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('error', '檔案過大', '圖檔大小請控制在 15MB 以內。');
      return;
    }

    setIsProcessing(true);
    setUploadedFileName(file.name);

    const finishSuccess = (finalDataUri: string) => {
      setPreviewLogo(finalDataUri);
      setIsProcessing(false);
      if (autoApply) {
        setCustomLogo(finalDataUri);
        setIsLogoModalOpen(false);
        showToast('success', '校徽更換成功！', '已成功套用您上傳的校徽 LOGO！');
      } else {
        showToast('success', '圖檔載入成功', `已讀取「${file.name}」，可點擊下方按鈕立即套用更換！`);
      }
    };

    // 處理 SVG 向量圖：直接使用文字讀取轉 Data URI，杜絕 Canvas 跨域/污染錯誤
    if (file.name.toLowerCase().endsWith('.svg') || (file.type && file.type.includes('svg'))) {
      const textReader = new FileReader();
      textReader.onload = (e) => {
        const text = e.target?.result as string;
        if (text && text.includes('<svg')) {
          const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(text)}`;
          finishSuccess(svgDataUrl);
        } else {
          const dataReader = new FileReader();
          dataReader.onload = (ev) => {
            finishSuccess(ev.target?.result as string);
          };
          dataReader.readAsDataURL(file);
        }
      };
      textReader.onerror = () => {
        setIsProcessing(false);
        showToast('error', '讀取失敗', '無法讀取該向量圖檔，請重試。');
      };
      textReader.readAsText(file);
      return;
    }

    // 處理點陣圖 (PNG/JPG/WebP)：透過 Canvas 高畫質平滑縮圖（上限 280px，檔案極小且完全適配 Header）
    const reader = new FileReader();
    reader.onerror = () => {
      setIsProcessing(false);
      showToast('error', '讀取失敗', '無法讀取該圖片，請確認檔案未損毀。');
    };
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        setIsProcessing(false);
        return;
      }

      try {
        const img = new Image();
        img.onerror = () => {
          finishSuccess(rawDataUrl);
        };
        img.onload = () => {
          try {
            const maxDim = 280;
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
            canvas.width = Math.max(1, w);
            canvas.height = Math.max(1, h);
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, w, h);
              const compressed = canvas.toDataURL('image/png', 0.95);
              finishSuccess(compressed);
            } else {
              finishSuccess(rawDataUrl);
            }
          } catch {
            finishSuccess(rawDataUrl);
          }
        };
        img.src = rawDataUrl;
      } catch {
        finishSuccess(rawDataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // 剪貼簿貼上圖片 (Ctrl+V) 支援
  useEffect(() => {
    if (!isLogoModalOpen) return;
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processImageFile(file, true);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isLogoModalOpen]);

  const handleFileChange = (file: File) => {
    processImageFile(file, true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0], true);
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      showToast('warning', '請輸入網址', '請輸入正確的圖片網址。');
      return;
    }
    setPreviewLogo(trimmed);
    showToast('info', '網址已帶入預覽', '若圖片正常顯示，請點選下方「確認套用更換」儲存。');
  };

  const handleSave = () => {
    if (!previewLogo) {
      showToast('warning', '請先選擇或上傳圖片', '請選擇預設校徽或上傳圖檔。');
      return;
    }
    setCustomLogo(previewLogo);
    setIsLogoModalOpen(false);
    showToast('success', '校徽更換完成', '全校系統首頁 LOGO 已更新為新校徽！');
  };

  const handleReset = () => {
    setPreviewLogo(DEFAULT_SCHOOL_LOGO);
    setCustomLogo(DEFAULT_SCHOOL_LOGO);
    setIsLogoModalOpen(false);
    showToast('info', '已恢復預設校徽', '系統校徽已恢復為國立成功商水官方標準校徽。');
  };

  if (!isLogoModalOpen) return null;

  const isDifferentFromCurrent = previewLogo !== customLogo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200">
        
        {/* 頂部標題列 (固定) */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center border bg-sky-500/20 text-sky-400 border-sky-400/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">更換系統首頁校徽 LOGO</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 自訂上傳即時生效
                </span>
              </div>
              <p className="text-xs text-slate-400">
                可上傳本機圖檔、輸入圖片網址或選擇精選校徽，更換後將即時同步於首頁導覽列
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

        {/* 內容主體區 (可平滑滾動) */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
          
          {/* 當前即時預覽區 */}
          <div className="bg-slate-900 rounded-xl p-4 text-white border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-xl bg-white border-2 border-sky-500/70 flex items-center justify-center overflow-hidden shadow-inner p-1.5">
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
                    <School className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 text-[9px] font-bold bg-sky-500 text-white rounded-full">
                  預覽
                </span>
              </div>
              <div>
                <div className="text-xs text-sky-400 font-semibold mb-0.5">目前選取之校徽效果</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  國立成功商水
                  {previewLogo === DEFAULT_SCHOOL_LOGO && (
                    <span className="text-[10px] font-normal px-1.5 py-0.5 bg-sky-950 text-sky-300 rounded border border-sky-700/50">
                      官方標準款
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {uploadedFileName ? `已載入本機檔案：${uploadedFileName}` : '套用後首頁導覽列與單據將即刻更新'}
                </div>
              </div>
            </div>

            {/* 若有新選取的預覽，提供頂部捷徑立即套用 */}
            {isDifferentFromCurrent && (
              <button
                type="button"
                onClick={handleSave}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition-all cursor-pointer shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                立即套用
              </button>
            )}
          </div>

          {/* 分頁切換 */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              本地上傳圖檔 (推薦)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'presets'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              精選校徽樣式
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'url'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileImage className="w-3.5 h-3.5" />
              圖片網址 (URL)
            </button>
          </div>

          {/* Tab 1: 本地上傳 */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.svg,.png,.jpg,.jpeg,.webp,.gif"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    processImageFile(e.target.files[0], true);
                  }
                  e.target.value = '';
                }}
              />

              {/* 拖曳與點擊上傳區 */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-sky-500 bg-sky-50/90 scale-[0.99] ring-2 ring-sky-300'
                    : 'border-slate-300 hover:border-sky-400 hover:bg-slate-50/80 bg-slate-50/40'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-2.5">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  {isProcessing ? '正在處理與最佳化圖檔...' : '點擊選擇校徽圖檔 或 將圖片拖曳至此'}
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  支援格式：PNG、JPG、JPEG、SVG、WebP（亦可直接按下 <kbd className="px-1 py-0.5 bg-slate-200 rounded text-slate-700 font-mono text-[10px]">Ctrl+V</kbd> 貼上截圖）
                </p>
                
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    瀏覽電腦檔案
                  </span>
                </div>
              </div>

              {/* 當有載入新圖檔時的特別提示與立即套用按鈕 */}
              {isDifferentFromCurrent && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-900">新校徽已載入就緒！</div>
                      <div className="text-[11px] text-emerald-700">點選右側按鈕立即完成系統首頁更換</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    立即套用更換
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: 內建精選樣式 */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                點選以下任一徽章樣式即可預覽並更換為首頁校徽：
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_LOGOS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setPreviewLogo(preset.svg);
                      setUploadedFileName(null);
                      showToast('info', '已載入樣式預覽', `已載入「${preset.name}」`);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      previewLogo === preset.svg
                        ? 'border-sky-600 bg-sky-50 shadow-md ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white flex items-center justify-center p-1 shrink-0">
                        <img 
                          src={preset.svg} 
                          alt={preset.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-800 block truncate">{preset.name}</span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">{preset.desc}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewLogo(preset.svg);
                        setCustomLogo(preset.svg);
                        setIsLogoModalOpen(false);
                        showToast('success', '校徽更換成功！', `已成功套用「${preset.name}」！`);
                      }}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer shadow-sm transition-all"
                    >
                      立即套用
                    </button>
                  </div>
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
                  placeholder="https://example.com/school_logo.png"
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
                可輸入官方公開發布之校徽圖檔連結，載入確認後點選下方「確認套用更換」。
              </p>
            </div>
          )}

        </div>

        {/* 底部固定操作列 (固定不隨內容滑動) */}
        <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-sky-600 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-sky-50 transition-colors cursor-pointer"
            title="將首頁校徽恢復為國立成功商水官方標準校徽"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            恢復國立成功商水官方校徽
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow ${
                isDifferentFromCurrent
                  ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/30 ring-2 ring-sky-400/40 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              <Check className="w-4 h-4" />
              確認套用更換
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
