import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { RulesBanner } from './components/RulesBanner';
import { ResourceExplorer } from './components/ResourceExplorer';
import { MyReservations } from './components/MyReservations';
import { SectionReviewPanel } from './components/SectionReviewPanel';
import { DirectorApprovalPanel } from './components/DirectorApprovalPanel';
import { CalendarScheduleView } from './components/CalendarScheduleView';
import { ReservationModal } from './components/ReservationModal';
import { ResourceDetailModal } from './components/ResourceDetailModal';
import { ExtensionModal } from './components/ExtensionModal';
import { PrintSlipModal } from './components/PrintSlipModal';
import { ToastContainer } from './components/ToastContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ResourceItem, Reservation } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, KeyRound } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, setIsLoginModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<string>('explore');
  
  // Modal 狀態
  const [selectedResourceForDetail, setSelectedResourceForDetail] = useState<ResourceItem | null>(null);
  const [selectedResourceForBooking, setSelectedResourceForBooking] = useState<ResourceItem | null>(null);
  const [selectedReservationForExtension, setSelectedReservationForExtension] = useState<Reservation | null>(null);
  const [selectedReservationForPrint, setSelectedReservationForPrint] = useState<Reservation | null>(null);

  const handleBookResource = (resource: ResourceItem) => {
    setSelectedResourceForBooking(resource);
  };

  const handleSelectResource = (resource: ResourceItem) => {
    setSelectedResourceForDetail(resource);
  };

  const handleOpenExtension = (res: Reservation) => {
    setSelectedReservationForExtension(res);
  };

  const handleOpenPrint = (res: Reservation) => {
    setSelectedReservationForPrint(res);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white" id="main-app">
      
      {/* 頂部導覽 */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 主體內容容器 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 借用規則重要提示橫幅 */}
        <RulesBanner />

        {/* 資安防護：未登入時提示登入驗證 */}
        {!isAuthenticated ? (
          <div className="bg-white rounded-2xl shadow-xl border border-rose-200 p-8 text-center max-w-xl mx-auto my-12 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full">
                校園資通安全管制
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                請先輸入教職員帳號完成身分驗證
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              本教學設備與教室借用系統涉及校產保管與行政簽核權限，依教育部及校內資通安全規範，全體教職員必須輸入個人專屬公務帳號，需帳號完全符合名冊設定方能解鎖系統進行預約與管理操作。
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-600/20 transition-all inline-flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                開啟身分驗證登入視窗
              </button>
            </div>
          </div>
        ) : (
          /* 動態分頁內容 */
          <AnimatePresence mode="wait">
            {activeTab === 'explore' && (
              <motion.div
                key="explore"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ResourceExplorer
                  onSelectResource={handleSelectResource}
                  onBookResource={handleBookResource}
                />
              </motion.div>
            )}

            {activeTab === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarScheduleView
                  onBookResource={handleBookResource}
                />
              </motion.div>
            )}

            {activeTab === 'my_reservations' && (
              <motion.div
                key="my_reservations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <MyReservations
                  onOpenExtensionModal={handleOpenExtension}
                  onOpenPrintModal={handleOpenPrint}
                />
              </motion.div>
            )}

            {activeTab === 'section_review' && (
              <motion.div
                key="section_review"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SectionReviewPanel />
              </motion.div>
            )}

            {activeTab === 'director_approval' && (
              <motion.div
                key="director_approval"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DirectorApprovalPanel />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* 頁尾資訊 */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mt-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="text-slate-600 font-semibold">
            國立學校 教務處教學設備組（招設組）· 專用教室與教學設備預約管理系統
          </p>
          <p className="text-[11px] text-slate-500">
            借用規範：限全體教職員工 · 須於借用日前 3 日登記 · 借期 3 日內歸還 · 特殊延長另案專簽由招設組及教務主任核定
          </p>
        </div>
      </footer>

      {/* 彈出視窗群 */}
      {selectedResourceForBooking && (
        <ReservationModal
          resource={selectedResourceForBooking}
          isOpen={!!selectedResourceForBooking}
          onClose={() => setSelectedResourceForBooking(null)}
          onSuccess={() => setActiveTab('my_reservations')}
        />
      )}

      {selectedResourceForDetail && (
        <ResourceDetailModal
          resource={selectedResourceForDetail}
          isOpen={!!selectedResourceForDetail}
          onClose={() => setSelectedResourceForDetail(null)}
          onBook={(res) => {
            setSelectedResourceForDetail(null);
            setSelectedResourceForBooking(res);
          }}
        />
      )}

      {selectedReservationForExtension && (
        <ExtensionModal
          reservation={selectedReservationForExtension}
          isOpen={!!selectedReservationForExtension}
          onClose={() => setSelectedReservationForExtension(null)}
        />
      )}

      {selectedReservationForPrint && (
        <PrintSlipModal
          reservation={selectedReservationForPrint}
          isOpen={!!selectedReservationForPrint}
          onClose={() => setSelectedReservationForPrint(null)}
        />
      )}

      {/* Toast 提示容器 */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
