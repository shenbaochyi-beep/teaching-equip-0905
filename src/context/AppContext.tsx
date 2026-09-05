import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  UserProfile, 
  ResourceItem, 
  Reservation, 
  SystemNotification, 
  UserRole,
  ReservationStatus,
  ApprovalLog
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_RESOURCES, 
  INITIAL_RESERVATIONS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { 
  getTodayString, 
  formatDateTime, 
  generateTrackingNumber,
  isValidAdvanceBookingDate,
  isValidLoanDuration,
  daysBetween
} from '../utils/dateUtils';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  
  resources: ResourceItem[];
  reservations: Reservation[];
  notifications: SystemNotification[];
  toasts: ToastMessage[];
  
  showToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
  
  // 業務動作
  createReservation: (data: {
    resourceId: string;
    startDate: string;
    startTime: string;
    expectedReturnDate: string;
    expectedReturnTime: string;
    purpose: string;
    courseName?: string;
    targetClass?: string;
    estimatedAttendees?: number;
    applicantId?: string;
  }) => { success: boolean; error?: string; reservation?: Reservation };
  
  cancelReservation: (reservationId: string, reason?: string) => void;
  
  // 招設組審查業務
  reviewBySection: (
    reservationId: string, 
    decision: 'approve' | 'reject', 
    note: string
  ) => void;
  
  // 教務主任核定業務
  reviewByDirector: (
    reservationId: string, 
    decision: 'approve' | 'reject', 
    note: string
  ) => void;
  
  // 借出登記 (實體出借)
  checkoutReservation: (reservationId: string, notes?: string) => void;
  
  // 歸還點收
  checkinReservation: (
    reservationId: string, 
    conditionNote: string
  ) => void;
  
  // 延長借用申請 (教職員送出)
  submitExtensionRequest: (
    reservationId: string, 
    newReturnDate: string, 
    reason: string
  ) => { success: boolean; error?: string };
  
  // 招設組審核延長
  reviewExtensionBySection: (
    reservationId: string, 
    decision: 'approve' | 'reject', 
    note: string
  ) => void;
  
  // 教務主任核定延長
  reviewExtensionByDirector: (
    reservationId: string, 
    decision: 'approve' | 'reject', 
    note: string
  ) => void;
  
  // 資源狀態調整 (招設組維護)
  updateResourceStatus: (resourceId: string, status: ResourceItem['status']) => void;
  
  // 通知
  markNotificationRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  
  // 統計數據
  stats: {
    totalResources: number;
    availableResources: number;
    pendingSectionCount: number;
    pendingDirectorCount: number;
    pendingExtensionCount: number;
    inUseCount: number;
    completedCount: number;
  };
  
  // 重設為展示預設資料
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  RESOURCES: 'school_equip_resources_v6',
  RESERVATIONS: 'school_equip_reservations_v6',
  NOTIFICATIONS: 'school_equip_notifications_v6',
  CURRENT_USER_ID: 'school_equip_current_user_id_v6'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 載入持久化或預設資料
  const [resources, setResources] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    const found = INITIAL_USERS.find(u => u.id === savedId);
    return found || INITIAL_USERS[0]; // 預設為許書齊老師
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 儲存至 LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
  }, [currentUser]);

  const showToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = Date.now().toString() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const switchRole = (role: UserRole) => {
    const targetUser = INITIAL_USERS.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      showToast('info', '身分切換成功', `已切換為：${targetUser.name}（${targetUser.title}）`);
    }
  };

  const addNotification = (userId: string, title: string, message: string, type: SystemNotification['type'], reservationId?: string) => {
    const newNotif: SystemNotification = {
      id: 'notif-' + Date.now() + Math.random().toString(36).substring(2, 5),
      userId,
      title,
      message,
      type,
      timestamp: formatDateTime(new Date()),
      read: false,
      reservationId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 建立借用申請
  const createReservation = (data: {
    resourceId: string;
    startDate: string;
    startTime: string;
    expectedReturnDate: string;
    expectedReturnTime: string;
    purpose: string;
    courseName?: string;
    targetClass?: string;
    estimatedAttendees?: number;
    applicantId?: string;
  }) => {
    const targetResource = resources.find(r => r.id === data.resourceId);
    if (!targetResource) {
      return { success: false, error: '找不到指定設備或教室' };
    }

    const todayStr = getTodayString();
    
    // 規則1: 必須於借用日 3 日前先行登記
    const advanceCheck = isValidAdvanceBookingDate(data.startDate, todayStr);
    if (!advanceCheck.valid) {
      return {
        success: false,
        error: `不符合借用規定：設備與教室預約須於借用日前 3 天登記。今日為 ${todayStr}，最早可登記借用日為 ${advanceCheck.minAllowedDate}。`
      };
    }

    // 規則2: 借用後須於 3 日內歸還
    const durationCheck = isValidLoanDuration(data.startDate, data.expectedReturnDate);
    if (!durationCheck.valid) {
      return {
        success: false,
        error: `不符合借用規定：一般借用期限最長為 3 日（預計最遲歸還日為 ${durationCheck.maxAllowedDate}）。若有特殊長度需求，請於核定後提出特殊延長借用申請。`
      };
    }

    const newTracking = generateTrackingNumber();
    const nowTimeStr = formatDateTime(new Date());

    const applicant = (data.applicantId ? INITIAL_USERS.find(u => u.id === data.applicantId) : null) || currentUser;

    const newReservation: Reservation = {
      id: 'resv-' + Date.now(),
      trackingNumber: newTracking,
      resourceId: targetResource.id,
      resourceName: targetResource.name,
      resourceCode: targetResource.code,
      resourceCategory: targetResource.category,
      applicantId: applicant.id,
      applicantName: applicant.name,
      applicantTitle: applicant.title,
      applicantDepartment: applicant.department,
      applicantPhone: applicant.phone,
      applicantEmail: applicant.email,
      
      purpose: data.purpose,
      courseName: data.courseName,
      targetClass: data.targetClass,
      estimatedAttendees: data.estimatedAttendees,
      
      startDate: data.startDate,
      startTime: data.startTime,
      expectedReturnDate: data.expectedReturnDate,
      expectedReturnTime: data.expectedReturnTime,
      
      status: 'pending_section',
      submittedAt: nowTimeStr,
      approvalLogs: [
        {
          id: 'log-' + Date.now(),
          step: 'submission',
          actorName: applicant.name,
          actorRole: `${applicant.title} (${applicant.department})`,
          action: '送出借用登記申請 (符合借用前3日預約規定)',
          timestamp: nowTimeStr,
          statusChange: '待招設組業務審核'
        }
      ]
    };

    setReservations(prev => [newReservation, ...prev]);

    // 通知招設組
    const sectionOfficer = INITIAL_USERS.find(u => u.role === 'section_officer');
    if (sectionOfficer) {
      addNotification(
        sectionOfficer.id,
        '新設備借用申請通知',
        `${applicant.name} 申請借用【${targetResource.name}】（單號：${newTracking}），借用期間：${data.startDate} 至 ${data.expectedReturnDate}，請招設組進行初審。`,
        'info',
        newReservation.id
      );
    }

    showToast('success', '借用預約申請已送出', `借用單號：${newTracking}，已送交教務處招設組審核。`);
    return { success: true, reservation: newReservation };
  };

  // 取消申請
  const cancelReservation = (reservationId: string, reason = '申請人主動取消') => {
    setReservations(prev => prev.map(res => {
      if (res.id !== reservationId) return res;
      const log: ApprovalLog = {
        id: 'log-' + Date.now(),
        step: 'submission',
        actorName: currentUser.name,
        actorRole: currentUser.title,
        action: `取消借用預約 (${reason})`,
        timestamp: formatDateTime(new Date()),
        statusChange: '已取消'
      };
      return {
        ...res,
        status: 'cancelled',
        approvalLogs: [...res.approvalLogs, log]
      };
    }));
    showToast('info', '已取消借用申請', '該筆預約已變更為取消狀態。');
  };

  // 招設組審查
  const reviewBySection = (reservationId: string, decision: 'approve' | 'reject', note: string) => {
    const nowTimeStr = formatDateTime(new Date());
    setReservations(prev => prev.map(res => {
      if (res.id !== reservationId) return res;
      
      const newStatus: ReservationStatus = decision === 'approve' ? 'section_approved' : 'rejected_section';
      const log: ApprovalLog = {
        id: 'log-' + Date.now(),
        step: 'section_review',
        actorName: currentUser.name,
        actorRole: '教務處招設組承辦人',
        action: decision === 'approve' ? '招設組初審同意，呈送教務主任核定' : '招設組初審退回',
        timestamp: nowTimeStr,
        comment: note,
        statusChange: decision === 'approve' ? '待教務主任核定' : '招設組退回'
      };

      // 通知教務主任 (若審核通過) 或 通知申請人 (若退回)
      if (decision === 'approve') {
        const director = INITIAL_USERS.find(u => u.role === 'academic_director');
        if (director) {
          addNotification(
            director.id,
            '待核定借用案呈報',
            `招設組已初審完成【${res.resourceName}】（申請人：${res.applicantName}，單號：${res.trackingNumber}），請主任核定。`,
            'info',
            res.id
          );
        }
      } else {
        addNotification(
          res.applicantId,
          '借用申請招設組退回通知',
          `您申請的【${res.resourceName}】（單號：${res.trackingNumber}）經招設組審查未通過，原因：${note || '未符合設備配置要件'}。`,
          'warning',
          res.id
        );
      }

      return {
        ...res,
        status: newStatus,
        sectionReviewer: currentUser.name,
        sectionNote: note,
        sectionReviewedAt: nowTimeStr,
        approvalLogs: [...res.approvalLogs, log]
      };
    }));

    showToast(
      decision === 'approve' ? 'success' : 'warning',
      decision === 'approve' ? '招設組初審通過' : '已退回借用申請',
      decision === 'approve' ? '已呈轉教務主任進行最終核定。' : `退回備註：${note || '無'}`
    );
  };

  // 教務主任核定
  const reviewByDirector = (reservationId: string, decision: 'approve' | 'reject', note: string) => {
    const nowTimeStr = formatDateTime(new Date());
    setReservations(prev => prev.map(res => {
      if (res.id !== reservationId) return res;
      
      const newStatus: ReservationStatus = decision === 'approve' ? 'approved' : 'rejected_director';
      const log: ApprovalLog = {
        id: 'log-' + Date.now(),
        step: 'director_approval',
        actorName: currentUser.name,
        actorRole: '教務主任',
        action: decision === 'approve' ? '教務主任最終核定同意借用' : '教務主任退回申請',
        timestamp: nowTimeStr,
        comment: note,
        statusChange: decision === 'approve' ? '核定通過 (待出借)' : '主任退回'
      };

      // 通知申請人
      addNotification(
        res.applicantId,
        decision === 'approve' ? '借用申請核定通過通知' : '借用申請主任退回通知',
        decision === 'approve' 
          ? `恭喜！您借用的【${res.resourceName}】（單號：${res.trackingNumber}）已獲教務主任核定同意。請於借用日前往招設組領取/辦理使用。`
          : `您借用的【${res.resourceName}】（單號：${res.trackingNumber}）經教務主任裁示退回，理由：${note || '配合全校重大校務另有調度'}。`,
        decision === 'approve' ? 'success' : 'warning',
        res.id
      );

      return {
        ...res,
        status: newStatus,
        directorReviewer: currentUser.name,
        directorNote: note,
        directorReviewedAt: nowTimeStr,
        approvalLogs: [...res.approvalLogs, log]
      };
    }));

    showToast(
      decision === 'approve' ? 'success' : 'warning',
      decision === 'approve' ? '教務主任核定通過' : '教務主任退回此案',
      decision === 'approve' ? '已完成正式簽核程序，可供出借。' : `退回意見：${note || '無'}`
    );
  };

  // 實體設備借出 (招設組點交)
  const checkoutReservation = (reservationId: string, notes = '設備與配件已於櫃檯清點無誤點交') => {
    const nowTimeStr = formatDateTime(new Date());
    setReservations(prev => prev.map(res => {
      if (res.id !== reservationId) return res;
      const log: ApprovalLog = {
        id: 'log-' + Date.now(),
        step: 'checkout',
        actorName: currentUser.name,
        actorRole: '教務處招設組承辦人',
        action: '完成實體設備/教室點交出借',
        timestamp: nowTimeStr,
        comment: notes,
        statusChange: '使用中 (已借出)'
      };

      addNotification(
        res.applicantId,
        '設備出借確認',
        `您借用的【${res.resourceName}】（單號：${res.trackingNumber}）已完成點交出借。請於 ${res.expectedReturnDate} ${res.expectedReturnTime} 前依規定歸還。`,
        'info',
        res.id
      );

      return {
        ...res,
        status: 'borrowed',
        checkoutOfficer: currentUser.name,
        checkoutAt: nowTimeStr,
        approvalLogs: [...res.approvalLogs, log]
      };
    }));

    showToast('success', '設備出借登記成功', '狀態已轉為【使用中】，請提醒借用人於期限內歸還。');
  };

  // 設備歸還點收
  const checkinReservation = (reservationId: string, conditionNote: string) => {
    const nowTimeStr = formatDateTime(new Date());
    setReservations(prev => prev.map(res => {
      if (res.id !== reservationId) return res;
      const log: ApprovalLog = {
        id: 'log-' + Date.now(),
        step: 'checkin',
        actorName: currentUser.name,
        actorRole: '教務處招設組承辦人',
        action: '完成設備/教室歸還點檢驗收',
        timestamp: nowTimeStr,
        comment: conditionNote || '設備功能正常、配件完整，場地整潔復原。',
        statusChange: '已歸還結案'
      };

      addNotification(
        res.applicantId,
        '設備歸還完成結案通知',
        `您借用的【${res.resourceName}】（單號：${res.trackingNumber}）已順利完成歸還驗收。感謝配合教務處設備管理規範！`,
        'success',
        res.id
      );

      return {
        ...res,
        status: 'returned',
        actualReturnDate: nowTimeStr,
        checkinOfficer: currentUser.name,
        checkinAt: nowTimeStr,
        checkinConditionNote: conditionNote || '設備功能完好，場地復原良好。',
        approvalLogs: [...res.approvalLogs, log]
      };
    }));

    showToast('success', '設備歸還點收完成', '借用單已正式結案，設備恢復為可借用狀態。');
  };

  // 申請延長借用 (特殊原因)
  const submitExtensionRequest = (reservationId: string, newReturnDate: string, reason: string) => {
    const target = reservations.find(r => r.id === reservationId);
    if (!target) return { success: false, error: '找不到該筆借用紀錄' };

    if (!reason.trim()) {
      return { success: false, error: '請填寫延長借用之具體特殊原因' };
    }

    const daysExt = daysBetween(target.expectedReturnDate, newReturnDate);
    if (daysExt <= 0) {
      return { success: false, error: '延長歸還日期必須晚於原定歸還日（' + target.expectedReturnDate + '）' };
    }

    const nowTimeStr = formatDateTime(new Date());
    const extId = 'ext-' + Date.now();

    const log: ApprovalLog = {
      id: 'log-' + Date.now(),
      step: 'extension_submission',
      actorName: currentUser.name,
      actorRole: currentUser.title,
      action: `提出特殊原因延長借用申請 (原歸還日: ${target.expectedReturnDate} -> 申請延長至: ${newReturnDate}, 延長 ${daysExt} 天)`,
      timestamp: nowTimeStr,
      comment: reason,
      statusChange: '延長借用審核中'
    };

    setReservations(prev => prev.map(res => {
      if (res.id !== reservationId) return res;
      return {
        ...res,
        status: 'extension_pending',
        extension: {
          id: extId,
          originalReturnDate: res.expectedReturnDate,
          requestedReturnDate: newReturnDate,
          daysExtended: daysExt,
          reason,
          submittedAt: nowTimeStr,
          sectionStatus: 'pending',
          directorStatus: 'pending'
        },
        approvalLogs: [...res.approvalLogs, log]
      };
    }));

    // 通知招設組
    const sectionOfficer = INITIAL_USERS.find(u => u.role === 'section_officer');
    if (sectionOfficer) {
      addNotification(
        sectionOfficer.id,
        '特殊延長借用申請',
        `${currentUser.name} 就【${target.resourceName}】（單號：${target.trackingNumber}）提出延長借用申請至 ${newReturnDate}，原因：${reason}。請進行業務審查。`,
        'warning',
        target.id
      );
    }

    showToast('success', '延長借用申請已送出', '已呈送教務處招設組及教務主任進行特殊案件核定。');
    return { success: true };
  };

  // 招設組審查延長借用
  const reviewExtensionBySection = (reservationId: string, decision: 'approve' | 'reject', note: string) => {
    const nowTimeStr = formatDateTime(new Date());
    setReservations(prev => prev.map(res => {
      if (res.id !== reservationId || !res.extension) return res;

      const updatedExt = {
        ...res.extension,
        sectionStatus: decision === 'approve' ? ('approved' as const) : ('rejected' as const),
        sectionNote: note,
        sectionReviewer: currentUser.name,
        sectionReviewedAt: nowTimeStr
      };

      const log: ApprovalLog = {
        id: 'log-' + Date.now(),
        step: 'extension_section',
        actorName: currentUser.name,
        actorRole: '教務處招設組承辦人',
        action: decision === 'approve' ? '招設組初審同意延長，呈送教務主任核定' : '招設組退回延長申請',
        timestamp: nowTimeStr,
        comment: note,
        statusChange: decision === 'approve' ? '待教務主任核定延長' : '招設組退回延長'
      };

      if (decision === 'approve') {
        const director = INITIAL_USERS.find(u => u.role === 'academic_director');
        if (director) {
          addNotification(
            director.id,
            '待核定特殊延長借用案',
            `招設組已初審完成【${res.resourceName}】之延長申請（申請人：${res.applicantName}，延長至 ${res.extension.requestedReturnDate}），請主任核定。`,
            'urgent',
            res.id
          );
        }
      }

      return {
        ...res,
        extension: updatedExt,
        approvalLogs: [...res.approvalLogs, log]
      };
    }));

    showToast(
      decision === 'approve' ? 'success' : 'warning',
      decision === 'approve' ? '延長申請招設組初審通過' : '招設組退回延長申請',
      decision === 'approve' ? '已呈報教務主任進行最後裁示。' : note
    );
  };

  // 教務主任核定延長借用
  const reviewExtensionByDirector = (reservationId: string, decision: 'approve' | 'reject', note: string) => {
    const nowTimeStr = formatDateTime(new Date());
    setReservations(prev => prev.map(res => {
      if (res.id !== reservationId || !res.extension) return res;

      const approved = decision === 'approve';
      const updatedExt = {
        ...res.extension,
        directorStatus: approved ? ('approved' as const) : ('rejected' as const),
        directorNote: note,
        directorReviewer: currentUser.name,
        directorReviewedAt: nowTimeStr
      };

      const log: ApprovalLog = {
        id: 'log-' + Date.now(),
        step: 'extension_director',
        actorName: currentUser.name,
        actorRole: '教務主任',
        action: approved ? `教務主任核定同意延長借用至 ${res.extension.requestedReturnDate}` : '教務主任退回延長借用申請',
        timestamp: nowTimeStr,
        comment: note,
        statusChange: approved ? '延長核定通過 (生效)' : '延長申請遭退回'
      };

      // 若核定通過，更新預計歸還日期
      const finalReturnDate = approved ? res.extension.requestedReturnDate : res.expectedReturnDate;
      const finalStatus: ReservationStatus = 'borrowed';

      addNotification(
        res.applicantId,
        approved ? '延長借用申請核定通過' : '延長借用申請退回通知',
        approved 
          ? `您申請的【${res.resourceName}】延長借用已獲教務主任核定通過！新歸還期限為：${res.extension.requestedReturnDate}。`
          : `您申請的【${res.resourceName}】延長借用經教務主任審核未予同意，請依原期限（${res.expectedReturnDate}）如期歸還。`,
        approved ? 'success' : 'warning',
        res.id
      );

      return {
        ...res,
        expectedReturnDate: finalReturnDate,
        status: finalStatus,
        extension: updatedExt,
        approvalLogs: [...res.approvalLogs, log]
      };
    }));

    showToast(
      decision === 'approve' ? 'success' : 'warning',
      decision === 'approve' ? '延長借用已核定通過' : '延長申請已退回',
      decision === 'approve' ? '已更新歸還期限並通知申請教師。' : note
    );
  };

  // 資源狀態更新
  const updateResourceStatus = (resourceId: string, status: ResourceItem['status']) => {
    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, status } : r));
    showToast('info', '資源狀態已更新', '設備/教室現況已即時變更');
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    setResources(INITIAL_RESOURCES);
    setReservations(INITIAL_RESERVATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('info', '系統資料已還原', '已重設為標準展示範例資料。');
  };

  // 統計
  const stats = useMemo(() => {
    const availableResources = resources.filter(r => r.status === 'available').length;
    const pendingSectionCount = reservations.filter(r => r.status === 'pending_section').length;
    const pendingDirectorCount = reservations.filter(r => r.status === 'section_approved').length;
    const pendingExtensionCount = reservations.filter(r => 
      r.status === 'extension_pending' || 
      (r.extension && r.extension.directorStatus === 'pending')
    ).length;
    const inUseCount = reservations.filter(r => r.status === 'borrowed' || r.status === 'extension_pending').length;
    const completedCount = reservations.filter(r => r.status === 'returned').length;

    return {
      totalResources: resources.length,
      availableResources,
      pendingSectionCount,
      pendingDirectorCount,
      pendingExtensionCount,
      inUseCount,
      completedCount
    };
  }, [resources, reservations]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers: INITIAL_USERS,
        setCurrentUser,
        switchRole,
        resources,
        reservations,
        notifications,
        toasts,
        showToast,
        removeToast,
        createReservation,
        cancelReservation,
        reviewBySection,
        reviewByDirector,
        checkoutReservation,
        checkinReservation,
        submitExtensionRequest,
        reviewExtensionBySection,
        reviewExtensionByDirector,
        updateResourceStatus,
        markNotificationRead,
        clearAllNotifications,
        stats,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
