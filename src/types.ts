export type UserRole = 'faculty' | 'section_officer' | 'academic_director';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  email: string;
  phone: string;
  avatarBg: string;
}

export type ResourceCategory = 
  | 'audiovisual_room'   // 視聽教室
  | 'multifunction_room' // 多功能教室
  | 'resource_room'      // 資源班教室
  | 'special_classroom'  // 其他專科教室
  | 'av_equipment'       // 影音廣播設備
  | 'it_equipment'       // 資訊教學設備
  | 'experiment_gear';   // 教學實驗器材

export type ResourceStatus = 'available' | 'reserved' | 'in_use' | 'maintenance';

export interface ResourceItem {
  id: string;
  name: string;
  category: ResourceCategory;
  code: string; // 財產/教室編號
  location: string;
  capacity?: number;
  quantity: number;
  availableQuantity: number;
  specs: string[];
  imageUrl: string;
  status: ResourceStatus;
  custodian: string; // 管理單位 (e.g. 教務處招設組 / 特教組)
  description: string;
  cautionNotes: string;
}

export type ReservationStatus = 
  | 'pending_section'     // 待招設組業務審核
  | 'section_approved'    // 招設組初審通過，待教務主任核定
  | 'rejected_section'    // 招設組退回
  | 'approved'            // 教務主任核定通過 (待借出)
  | 'rejected_director'   // 教務主任退回
  | 'borrowed'            // 已領取/使用中
  | 'extension_pending'   // 延長借用審核中
  | 'returned'            // 已歸還結案
  | 'cancelled';          // 申請人取消

export interface ExtensionRequest {
  id: string;
  originalReturnDate: string;
  requestedReturnDate: string;
  daysExtended: number;
  reason: string;
  submittedAt: string;
  sectionStatus: 'pending' | 'approved' | 'rejected';
  sectionNote?: string;
  sectionReviewer?: string;
  sectionReviewedAt?: string;
  directorStatus: 'pending' | 'approved' | 'rejected';
  directorNote?: string;
  directorReviewer?: string;
  directorReviewedAt?: string;
}

export interface ApprovalLog {
  id: string;
  step: 'submission' | 'section_review' | 'director_approval' | 'checkout' | 'extension_submission' | 'extension_section' | 'extension_director' | 'checkin';
  actorName: string;
  actorRole: string;
  action: string;
  timestamp: string;
  comment?: string;
  statusChange: string;
}

export interface Reservation {
  id: string;
  trackingNumber: string; // 借用單號，如 EDU-20260829-001
  resourceId: string;
  resourceName: string;
  resourceCode: string;
  resourceCategory: ResourceCategory;
  applicantId: string;
  applicantName: string;
  applicantTitle: string;
  applicantDepartment: string;
  applicantPhone: string;
  applicantEmail: string;
  
  purpose: string;
  courseName?: string;
  targetClass?: string;
  estimatedAttendees?: number;
  
  startDate: string; // YYYY-MM-DD
  startTime: string; // e.g. "09:00"
  expectedReturnDate: string; // YYYY-MM-DD (須於借用後3日內)
  expectedReturnTime: string; // e.g. "17:00"
  actualReturnDate?: string;
  
  status: ReservationStatus;
  submittedAt: string;
  
  // 招設組審核欄位
  sectionReviewer?: string;
  sectionNote?: string;
  sectionReviewedAt?: string;
  
  // 教務主任核定欄位
  directorReviewer?: string;
  directorNote?: string;
  directorReviewedAt?: string;
  
  // 延長借用申請
  extension?: ExtensionRequest;
  
  // 借出與歸還點收備註
  checkoutOfficer?: string;
  checkoutAt?: string;
  checkinOfficer?: string;
  checkinAt?: string;
  checkinConditionNote?: string;
  
  approvalLogs: ApprovalLog[];
}

export interface SystemNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  timestamp: string;
  read: boolean;
  reservationId?: string;
}
