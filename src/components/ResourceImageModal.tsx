import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ResourceItem } from '../types';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Sparkles,
  Link,
  Camera
} from 'lucide-react';
import { LOCKED_ROOM_IMAGES, INITIAL_RESOURCES } from '../data/mockData';

interface ResourceImageModalProps {
  resource: ResourceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ResourceImageModal: React.FC<ResourceImageModalProps> = ({
  resource,
  isOpen,
  onClose
}) => {
  const { updateResourceImage, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');

  // 初始化預覽圖
  React.useEffect(() => {
    if (resource && isOpen) {
      setPreviewUrl(resource.imageUrl);
      setUrlInput(resource.imageUrl.startsWith('data:') ? '' : resource.imageUrl);
    }
  }, [resource, isOpen]);

  if (!isOpen || !resource) return null;

  // 壓縮圖片成合適大小的 DataURL，避免超出 localStorage 容量
  const handleFileSelect = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', '格式錯誤', '僅支援上傳 JPG、PNG、WEBP 或 SVG 格式圖檔');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('error', '檔案過大', '圖片原始大小請勿超過 15MB');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onerror = () => {
      setIsProcessing(false);
      showToast('error', '讀取失敗', '無法讀取該圖檔，請重試或更換圖片');
    };

    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        setIsProcessing(false);
        return;
      }

      if (file.type.includes('svg')) {
        setPreviewUrl(rawDataUrl);
        setIsProcessing(false);
        return;
      }

      // 等比壓縮處理，長寬上限 1280px，品質 0.85
      const img = new Image();
      img.onerror = () => {
        setPreviewUrl(rawDataUrl);
        setIsProcessing(false);
      };
      img.onload = () => {
        try {
          const maxDim = 1280;
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
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            setPreviewUrl(compressed);
          } else {
            setPreviewUrl(rawDataUrl);
          }
        } catch {
          setPreviewUrl(rawDataUrl);
        } finally {
          setIsProcessing(false);
        }
      };
      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      showToast('warning', '請輸入網址', '請貼上合法的圖片直接連結網址');
      return;
    }
    setPreviewUrl(urlInput.trim());
  };

  const handleSave = () => {
    if (!previewUrl) {
      showToast('warning', '無圖片', '請先選擇或輸入欲更換之圖片');
      return;
    }
    updateResourceImage(resource.id, previewUrl);
    onClose();
  };

  const handleResetToDefault = () => {
    const defaultUrl = LOCKED_ROOM_IMAGES[resource.id] || INITIAL_RESOURCES.find(r => r.id === resource.id)?.imageUrl || resource.imageUrl || '/1.jpg';
    setPreviewUrl(defaultUrl);
    setUrlInput(defaultUrl);
    showToast('info', '已重設為預設圖片', '點選「確認儲存修訂」後即可正式生效。');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        id="resource-image-modal"
        className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* 標題欄 */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                修訂場地實景圖片
                <span className="text-xs font-mono font-normal bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded">
                  {resource.code}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{resource.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 內容區 */}
        <div className="p-6 space-y-5">
          {/* 即時預覽卡片 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>當前預覽效果</span>
              {previewUrl.startsWith('data:') && (
                <span className="text-emerald-600 font-normal">已載入本機自訂圖檔</span>
              )}
            </div>
            <div className="relative h-56 w-full rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-900 shadow-inner group">
              <img
                src={previewUrl}
                alt={resource.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 text-white text-xs drop-shadow font-medium">
                {resource.name}（系統卡片與預約單將同步以此圖片呈現）
              </div>
            </div>
          </div>

          {/* 上傳方式分頁切換 */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveMode('upload')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeMode === 'upload'
                  ? 'bg-white text-sky-700 shadow-sm font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              上傳本機新照片
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('url')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeMode === 'url'
                  ? 'bg-white text-sky-700 shadow-sm font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              輸入圖片網址
            </button>
          </div>

          {/* 分頁內容 */}
          {activeMode === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/50 hover:bg-sky-50/80 transition-all rounded-xl p-6 text-center cursor-pointer space-y-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    點擊此處瀏覽電腦檔案 或 將圖片拖曳至此
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    支援 JPG、PNG、WEBP 等實景照片，系統將自動進行高清等比最佳化
                  </p>
                </div>
                {isProcessing && (
                  <div className="text-xs font-semibold text-sky-600 animate-pulse pt-1">
                    圖片壓縮處理中，請稍候...
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">圖片網址 Direct URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/audiovisual-room.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
                >
                  預覽
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                可輸入校內網頁、雲端公開圖片連結或已放置於伺服器之絕對路徑（如 /1.jpg）。
              </p>
            </div>
          )}

          {/* 說明提示 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-600">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              更換後將立即同步套用至首頁探索卡片、教室詳細規格彈窗、借用單排程與預約登記表單。若日後需要亦可隨時更換或還原。
            </div>
          </div>
        </div>

        {/* 底部按鈕區 */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            還原預設實景照
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isProcessing}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              確認儲存修訂
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
