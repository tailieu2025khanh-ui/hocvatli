export type UserRole = 'TEACHER' | 'STUDENT';

export type TeacherRole = 'HEAD_TEACHER' | 'CO_TEACHER' | 'ASSISTANT' | 'OBSERVER';

export type GradeLevel = 10 | 11 | 12;

export type CognitiveLevel = 'NHAN_BIET' | 'THONG_HIEU' | 'VAN_DUNG' | 'VAN_DUNG_CAO';

export type QuestionType = 'MCQ_4' | 'TRUE_FALSE_4' | 'SHORT_ANSWER';

export interface TrueFalseItem {
  id: string;
  statement: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  grade: GradeLevel;
  topic: string; // e.g. "Dao động cơ", "Khúc xạ ánh sáng"
  cognitiveLevel: CognitiveLevel;
  type: QuestionType;
  prompt: string;
  imageUrl?: string;
  // For MCQ_4
  options?: string[];
  correctOptionIndex?: number;
  // For TRUE_FALSE_4
  trueFalseItems?: TrueFalseItem[];
  // For SHORT_ANSWER
  shortAnswerKey?: string; // e.g. "2.5" or "10"
  shortAnswerUnit?: string; // e.g. "m/s²", "N", "V"
  shortAnswerTolerance?: number; // e.g. 0.1
  explanation: string;
}

export interface ClassRoom {
  id: string;
  code: string; // e.g. "PHY12-PRO"
  name: string; // e.g. "Lớp 12 Chuyên Lý - K68"
  grade: GradeLevel;
  studentCount: number;
  teacherName: string;
  createdDate: string;
  activeExamsCount: number;
  averageScore: number;
}

export interface ColleagueTeacher {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: TeacherRole;
  subject: string;
  assignedClassCodes: string[];
  status: 'ACTIVE' | 'PENDING';
  permissions: {
    canUploadMaterials: boolean;
    canAssignTasks: boolean;
    canManageStudents: boolean;
    canEditExams: boolean;
  };
  joinedDate: string;
  // Contact & Personal Profile Fields
  phone?: string;
  degreeTitle?: string; // e.g. "ThS. Vật Lý", "TS. Vật Lý Kỹ Thuật", "NGƯT"
  schoolName?: string; // e.g. "Trường THPT Chuyên Vật Lý"
  socialLink?: string; // e.g. "facebook.com/thayduc.vatly"
  bio?: string; // e.g. "Khơi gợi niềm đam mê tri thức và tư duy bản chất hiện tượng."
}

export type MaterialType = 'SLIDE' | 'DOCUMENT' | 'WORKSHEET' | 'VIDEO' | 'LAB_GUIDE' | 'WEB_ARTICLE';

export interface TeachingMaterial {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  uploadedByTeacherId: string;
  uploadedByTeacherName: string;
  uploadedDate: string;
  grade: GradeLevel;
  subjectName?: string; // e.g. "Vật Lý", "Hóa Học", "Toán Học"
  folderPath?: string; // e.g. "Vật Lý/Tài Liệu Khối 12/Chuyên Đề Động Học"
  topic: string;
  assignedClassCodes: string[];
  assignedSubGroups?: string[]; // e.g. ["Tổ 1", "Tổ 2"]
  viewCount: number;
  downloadCount: number;
  // Online Web Document & Embedded Video Fields
  isExternalWeb?: boolean;
  webUrl?: string;
  embedUrl?: string;
  videoHost?: 'YOUTUBE' | 'VIMEO' | 'DIRECT_MP4' | 'WEB_EMBED';
  siteName?: string;
  thumbnailUrl?: string;
}

export interface OnlineDatabaseConfig {
  endpointUrl: string;
  apiKey?: string;
  dbType: 'CLOUD_REST' | 'SUPABASE' | 'GOOGLE_SHEETS' | 'FIREBASE';
  status: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING';
  lastSyncedAt?: string;
  autoSync: boolean;
}


export interface AssignedTask {
  id: string;
  title: string;
  materialId?: string;
  materialTitle?: string;
  assignedByTeacherName: string;
  assignedByTeacherId: string;
  targetClassCode: string;
  targetSubGroup?: string; // e.g. "Tổ 1"
  targetStudentName?: string;
  dueDate: string;
  note: string;
  status: 'OPEN' | 'COMPLETED';
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  classCode: string;
  grade: GradeLevel;
  subGroup?: string; // e.g. "Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4"
  subjectGroup?: string; // e.g. "Khối A00 (Toán-Lý-Hóa)", "Khối A01 (Toán-Lý-Anh)"
  username: string;
  password: string;
  managerId: string;
  managerName: string;
  status: 'ACTIVE' | 'LOCKED';
  createdDate: string;
  xp: number;
  level: number;
  streakDays: number;
  badges: Badge[];
  topicProficiency: Record<string, number>; // topic -> percentage 0-100
  weakTopics: string[];
  // Contact & Personal Profile Fields
  email?: string;
  phone?: string;
  parentPhone?: string;
  parentName?: string;
  address?: string;
  dob?: string;
  bio?: string;
  targetExamScore?: string; // e.g. "9.5+ Mục tiêu ĐH Bách Khoa"
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  unlockedAt?: string;
  category: 'DAO_DONG' | 'DIEN_HOC' | 'QUANG_HOC' | 'NHIET_HOC' | 'STREAK';
}

export interface SubmissionResult {
  id: string;
  studentId: string;
  studentName: string;
  classCode: string;
  examTitle: string;
  score: number;
  maxScore: number;
  gradedAt: string;
  gradedByOCR?: boolean;
  ocrConfidence?: number;
  detailedResults: {
    questionId: string;
    questionPrompt: string;
    studentAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    earnedScore: number;
    maxScore: number;
    aiComment?: string;
  }[];
  aiDiagnosis: {
    weakTopics: string[];
    strongTopics: string[];
    recommendedRemediation: string;
    feedbackSummary: string;
  };
}

export interface ExamMatrix {
  id: string;
  title: string;
  grade: GradeLevel;
  totalQuestions: number;
  durationMinutes: number;
  nhanBietCount: number;
  thongHieuCount: number;
  vanDungCount: number;
  vanDungCaoCount: number;
  topicsDistribution: Record<string, number>;
}

export type HonorCategory = 
  | 'ACADEMIC_TOP'         // Học Sinh Cao Điểm Nhất (Thủ Khoa Học Tập)
  | 'TRAINING_EXCELLENCE'  // Học Sinh Rèn Luyện & Dấu Ấn Tiêu Biểu
  | 'MOST_IMPROVED'        // Học Sinh Tiến Bộ Nhất (Bứt Phá Điểm Số)
  | 'MOST_ACTIVE'          // Học Sinh Tích Cực Nhất (Năng Nổ Đóng Góp)
  | 'MOST_DILIGENT';       // Học Sinh Chuyên Cần Nhất (Chuỗi Học & Kỷ Luật)

export interface HonorAward {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  classCode: string;
  category: HonorCategory;
  title: string;
  subtitle: string;
  awardedDate: string;
  awardedByTeacher: string;
  citation: string;
  scoreValue?: string;
  badgeIcon: string;
  themeStyle: 'GOLD' | 'ROYAL_BLUE' | 'EMERALD_LAUREL' | 'RUBY_PHOENIX' | 'PURPLE_CROWN';
}

