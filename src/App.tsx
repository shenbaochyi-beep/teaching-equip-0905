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
import { ResourceItem, Reservation } from './types';
import { motion, AnimatePresence } from 'motion/react';

const MainAppContent: React.FC = () => {
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

        {/* 動態分頁內容 */}
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
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
