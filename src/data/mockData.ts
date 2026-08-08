import { Question, ClassRoom, StudentProfile, Badge, SubmissionResult, ExamMatrix, ColleagueTeacher, TeachingMaterial, AssignedTask } from '../types';

export const PHYSICS_TOPICS_BY_GRADE = {
  10: [
    'Mở đầu & Cơ học Cơ bản',
    'Chuyển động thẳng biến đổi đều',
    'Các lực trong tự nhiên & Định luật Newton',
    'Năng lượng, Công & Công suất',
    'Động lượng & Va chạm',
    'Chuyển động tròn đều & Cân bằng',
    'Vật lý Nhiệt & Áp suất chất khí'
  ],
  11: [
    'Dao động điều hòa & Con lắc',
    'Sóng cơ & Sóng âm',
    'Sóng ánh sáng & Giao thoa',
    'Điện trường & Điện thế',
    'Dòng điện không đổi & Mạch điện',
    'Từ trường & Cảm ứng điện từ'
  ],
  12: [
    'Vật lý Nhiệt & Thuyết động học chất khí',
    'Khí lý tưởng & Các định luật khí',
    'Từ trường & Lực Lorentz',
    'Hạt nhân Vật lý & Sóng điện từ',
    'Vật lý Lượng tử & Quang điện',
    'Vật lý Hạt & Mới GDPT 2018'
  ]
};

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b1',
    title: 'Bậc Thầy Dao Động',
    description: 'Hoàn thành 100% bài tập Dao động điều hòa mức Vận dụng cao',
    icon: 'Activity',
    unlockedAt: '2026-08-01',
    category: 'DAO_DONG'
  },
  {
    id: 'b2',
    title: 'Thần Đồng Điện Học',
    description: 'Đạt điểm 10/10 kiểm tra Định luật Ohm và Mạch điện phức hợp',
    icon: 'Zap',
    unlockedAt: '2026-08-04',
    category: 'DIEN_HOC'
  },
  {
    id: 'b3',
    title: 'Chuyên Gia Quang Học',
    description: 'Giải chính xác 5 bài toán Khúc xạ & Thấu kính liên tiếp',
    icon: 'Eye',
    unlockedAt: '2026-08-06',
    category: 'QUANG_HOC'
  },
  {
    id: 'b4',
    title: 'Chiến Binh 7 Ngày',
    description: 'Duy trì chuỗi học tập liên tục 7 ngày trên LMS',
    icon: 'Flame',
    unlockedAt: '2026-08-07',
    category: 'STREAK'
  },
  {
    id: 'b5',
    title: 'Nhà Nhiệt Học Xuất Sắc',
    description: 'Làm chủ Thuyết động học chất khí GDPT 2018 Lớp 12',
    icon: 'Thermometer',
    category: 'NHIET_HOC'
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q101',
    grade: 12,
    topic: 'Vật lý Nhiệt & Thuyết động học chất khí',
    cognitiveLevel: 'NHAN_BIET',
    type: 'MCQ_4',
    prompt: 'Theo thuyết động học chất khí, áp suất của chất khí tác dụng lên thành bình gây ra bởi:',
    options: [
      'Lực hút giữa các phân tử khí và thành bình',
      'Sự va chạm liên tục của các phân tử khí vào thành bình',
      'Trọng lực của các phân tử khí nén xuống đáy bình',
      'Sự nở vì nhiệt của chất khí khi nhiệt độ tăng'
    ],
    correctOptionIndex: 1,
    explanation: 'Áp suất chất khí lên thành bình là do vô số các phân tử khí chuyển động hỗn loạn không ngừng và va chạm liên tục vào thành bình.'
  },
  {
    id: 'q102',
    grade: 12,
    topic: 'Vật lý Nhiệt & Thuyết động học chất khí',
    cognitiveLevel: 'VAN_DUNG',
    type: 'SHORT_ANSWER',
    prompt: 'Một lượng khí lý tưởng ở áp suất 1,0×10⁵ Pa có thể tích 4,0 lít. Giữ nhiệt độ không đổi, nén khí đến thể tích 1,6 lít. Áp suất của khí sau khi nén là bao nhiêu (tính theo đơn vị ×10⁵ Pa)?',
    shortAnswerKey: '2.5',
    shortAnswerUnit: '×10⁵ Pa',
    shortAnswerTolerance: 0.05,
    explanation: 'Áp dụng định luật Đẳng nhiệt (Boyle-Mariotte): p₁V₁ = p₂V₂ => 1.0 × 4.0 = p₂ × 1.6 => p₂ = 2.5 × 10⁵ Pa.'
  },
  {
    id: 'q103',
    grade: 11,
    topic: 'Dao động điều hòa & Con lắc',
    cognitiveLevel: 'THONG_HIEU',
    type: 'TRUE_FALSE_4',
    prompt: 'Một con lắc lò xo gồm vật nhỏ khối lượng m và lò xo nhẹ độ cứng k đang dao động điều hòa theo phương ngang. Xét các phát biểu sau:',
    trueFalseItems: [
      { id: 'tf1', statement: 'Lực kéo về tác dụng lên vật luôn hướng về vị trí cân bằng và có độ lớn tỉ lệ với độ dịch chuyển.', isCorrect: true },
      { id: 'tf2', statement: 'Khi vật đi từ vị trí cân bằng ra vị trí biên, thế năng của con lắc giảm dần.', isCorrect: false },
      { id: 'tf3', statement: 'Chu kỳ dao động T = 2π√(m/k) phụ thuộc vào biên độ dao động A.', isCorrect: false },
      { id: 'tf4', statement: 'Gia tốc của vật cực đại khi vật ở vị trí biên.', isCorrect: true }
    ],
    explanation: 'a) Đúng: F = -kx. b) Sai: từ VTCB ra biên thế năng tăng. c) Sai: T độc lập với biên độ. d) Đúng: a_max = ω²A tại biên.'
  },
  {
    id: 'q104',
    grade: 11,
    topic: 'Sóng cơ & Sóng âm',
    cognitiveLevel: 'VAN_DUNG_CAO',
    type: 'SHORT_ANSWER',
    prompt: 'Một sóng cơ truyền trên sợi dây với tần số f = 50 Hz và vận tốc truyền sóng v = 2,0 m/s. Khoảng cách ngắn nhất giữa hai điểm trên dây dao động ngược pha nhau là bao nhiêu cm?',
    shortAnswerKey: '2',
    shortAnswerUnit: 'cm',
    shortAnswerTolerance: 0.1,
    explanation: 'Bước sóng λ = v / f = 200 cm/s / 50 Hz = 4 cm. Hai điểm ngược pha ngắn nhất cách nhau d = λ / 2 = 4 / 2 = 2 cm.'
  },
  {
    id: 'q105',
    grade: 10,
    topic: 'Năng lượng, Công & Công suất',
    cognitiveLevel: 'VAN_DUNG',
    type: 'MCQ_4',
    prompt: 'Một vật khối lượng m = 2 kg được kéo trượt đều trên mặt sàn nằm ngang bởi lực F = 10 N hợp với phương ngang góc 60°. Lực ma sát kìm hãm vật chuyển động. Công của lực F khi vật di chuyển 5 m là:',
    options: [
      '25 J',
      '50 J',
      '43.3 J',
      '100 J'
    ],
    correctOptionIndex: 0,
    explanation: 'A = F . s . cos(α) = 10 N * 5 m * cos(60°) = 10 * 5 * 0.5 = 25 J.'
  },
  {
    id: 'q106',
    grade: 11,
    topic: 'Sóng ánh sáng & Giao thoa',
    cognitiveLevel: 'VAN_DUNG',
    type: 'SHORT_ANSWER',
    prompt: 'Trong thí nghiệm Y-ăng về giao thoa ánh sáng, khoảng cách giữa 2 khe a = 1 mm, khoảng cách đến màn D = 2 m. Chiếu bằng ánh sáng đơn sắc có bước sóng λ = 0,6 μm. Khoảng vân giao thoa i thu được trên màn bằng bao nhiêu mm?',
    shortAnswerKey: '1.2',
    shortAnswerUnit: 'mm',
    shortAnswerTolerance: 0.05,
    explanation: 'Khoảng vân i = (λ * D) / a = (0.6 * 10⁻⁶ m * 2 m) / (1 * 10⁻³ m) = 1.2 * 10⁻³ m = 1.2 mm.'
  }
];

export const MOCK_CLASSES: ClassRoom[] = [
  {
    id: 'cls1',
    code: 'PHY12-PRO',
    name: '12A1 - Chuyên Vật Lý Luyện Thi 2026',
    grade: 12,
    studentCount: 38,
    teacherName: 'ThS. Nguyễn Văn Đức',
    createdDate: '2026-08-01',
    activeExamsCount: 3,
    averageScore: 8.45
  },
  {
    id: 'cls2',
    code: 'PHY11-X1',
    name: '11B2 - Lý Nâng Cao GDPT 2018',
    grade: 11,
    studentCount: 42,
    teacherName: 'ThS. Nguyễn Văn Đức',
    createdDate: '2026-08-02',
    activeExamsCount: 2,
    averageScore: 7.82
  },
  {
    id: 'cls3',
    code: 'PHY10-A1',
    name: '10A1 - Vật Lý Cơ Bản & Thí Nghiệm',
    grade: 10,
    studentCount: 40,
    teacherName: 'ThS. Nguyễn Văn Đức',
    createdDate: '2026-08-03',
    activeExamsCount: 1,
    averageScore: 8.10
  }
];

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    id: 'std100',
    name: 'Trần Minh Huy',
    username: 'std_minhhuy',
    password: 'MinhHuy2026@',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    classCode: 'PHY12-PRO',
    grade: 12,
    subGroup: 'Tổ 1',
    subjectGroup: 'Khối A00 (Toán-Lý-Hóa)',
    managerId: 'tch_1',
    managerName: 'ThS. Nguyễn Văn Đức',
    status: 'ACTIVE',
    createdDate: '2026-08-01',
    xp: 2850,
    level: 8,
    streakDays: 12,
    badges: INITIAL_BADGES,
    topicProficiency: {
      'Vật lý Nhiệt & Thuyết động học chất khí': 88,
      'Dao động điều hòa & Con lắc': 92,
      'Sóng cơ & Sóng âm': 75,
      'Sóng ánh sáng & Giao thoa': 62,
      'Khúc xạ ánh sáng': 45,
      'Từ trường & Cảm ứng điện từ': 80
    },
    weakTopics: ['Khúc xạ ánh sáng', 'Sóng ánh sáng & Giao thoa']
  },
  {
    id: 'std101',
    name: 'Nguyễn Hoàng Nam',
    username: 'std_hoangnam',
    password: 'HoangNam2026@',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    classCode: 'PHY12-PRO',
    grade: 12,
    subGroup: 'Tổ 2',
    subjectGroup: 'Khối A01 (Toán-Lý-Anh)',
    managerId: 'tch_2',
    managerName: 'Cô Lê Thị Hoa',
    status: 'ACTIVE',
    createdDate: '2026-08-02',
    xp: 1920,
    level: 6,
    streakDays: 5,
    badges: [INITIAL_BADGES[0], INITIAL_BADGES[3]],
    topicProficiency: {
      'Vật lý Nhiệt & Thuyết động học chất khí': 70,
      'Khúc xạ ánh sáng': 35
    },
    weakTopics: ['Khúc xạ ánh sáng']
  },
  {
    id: 'std102',
    name: 'Lê Bảo Ngọc',
    username: 'std_baongoc',
    password: 'BaoNgoc2026@',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    classCode: 'PHY11-X1',
    grade: 11,
    subGroup: 'Tổ 1',
    subjectGroup: 'Khối A00 (Toán-Lý-Hóa)',
    managerId: 'tch_3',
    managerName: 'Thầy Phạm Đức Minh',
    status: 'ACTIVE',
    createdDate: '2026-08-03',
    xp: 3100,
    level: 9,
    streakDays: 14,
    badges: [INITIAL_BADGES[1], INITIAL_BADGES[2], INITIAL_BADGES[3]],
    topicProficiency: {
      'Dao động điều hòa & Con lắc': 95,
      'Sóng cơ & Sóng âm': 88
    },
    weakTopics: []
  },
  {
    id: 'std103',
    name: 'Phạm Quốc Bảo',
    username: 'std_quocbao',
    password: 'QuocBao2026@',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    classCode: 'PHY11-X1',
    grade: 11,
    subGroup: 'Tổ 3',
    subjectGroup: 'Khối A01 (Toán-Lý-Anh)',
    managerId: 'tch_1',
    managerName: 'ThS. Nguyễn Văn Đức',
    status: 'ACTIVE',
    createdDate: '2026-08-04',
    xp: 1450,
    level: 4,
    streakDays: 3,
    badges: [INITIAL_BADGES[0]],
    topicProficiency: {
      'Sóng ánh sáng & Giao thoa': 60
    },
    weakTopics: ['Điện trường & Điện thế']
  },
  {
    id: 'std104',
    name: 'Phùng Khánh Linh',
    username: 'std_khanhlinh',
    password: 'KhanhLinh2026@',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    classCode: 'PHY10-A1',
    grade: 10,
    subGroup: 'Tổ 1',
    subjectGroup: 'Khối B00 (Toán-Hóa-Sinh)',
    managerId: 'tch_3',
    managerName: 'Thầy Phạm Đức Minh',
    status: 'ACTIVE',
    createdDate: '2026-08-05',
    xp: 2200,
    level: 7,
    streakDays: 8,
    badges: [INITIAL_BADGES[3]],
    topicProficiency: {
      'Năng lượng, Công & Công suất': 90
    },
    weakTopics: ['Động lượng & Va chạm']
  },
  {
    id: 'std105',
    name: 'Đỗ Tuấn Anh',
    username: 'std_tuananh',
    password: 'TuanAnh2026@',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    classCode: 'PHY10-A1',
    grade: 10,
    subGroup: 'Tổ 4',
    subjectGroup: 'Khối D01 (Toán-Văn-Anh)',
    managerId: 'tch_1',
    managerName: 'ThS. Nguyễn Văn Đức',
    status: 'LOCKED',
    createdDate: '2026-08-06',
    xp: 800,
    level: 2,
    streakDays: 0,
    badges: [],
    topicProficiency: {},
    weakTopics: ['Mở đầu & Cơ học Cơ bản']
  }
];

export const CURRENT_STUDENT: StudentProfile = MOCK_STUDENTS[0];

export const MOCK_SUBMISSIONS: SubmissionResult[] = [
  {
    id: 'sub1',
    studentId: 'std100',
    studentName: 'Trần Minh Huy',
    classCode: 'PHY12-PRO',
    examTitle: 'Kiểm Tra Chuyên Đề Nhiệt Học & Dao Động 12',
    score: 8.5,
    maxScore: 10,
    gradedAt: '2026-08-07 14:30',
    gradedByOCR: true,
    ocrConfidence: 98.4,
    detailedResults: [
      {
        questionId: 'q101',
        questionPrompt: 'Theo thuyết động học chất khí, áp suất chất khí do...',
        studentAnswer: 'B. Sự va chạm liên tục của các phân tử khí',
        correctAnswer: 'B. Sự va chạm liên tục của các phân tử khí',
        isCorrect: true,
        earnedScore: 2.5,
        maxScore: 2.5,
        aiComment: 'Trả lời đúng chuẩn kiến thức thuyết động học!'
      },
      {
        questionId: 'q102',
        questionPrompt: 'Tính áp suất khí sau khi nén từ 4.0L xuống 1.6L...',
        studentAnswer: '2.5',
        correctAnswer: '2.5 ×10⁵ Pa',
        isCorrect: true,
        earnedScore: 2.5,
        maxScore: 2.5,
        aiComment: 'Tính chính xác định luật Boyle-Mariotte.'
      },
      {
        questionId: 'q103',
        questionPrompt: 'Trắc nghiệm Đúng/Sai: Con lắc lò xo dao động...',
        studentAnswer: 'a)Đ, b)S, c)Đ, d)Đ',
        correctAnswer: 'a)Đ, b)S, c)S, d)Đ',
        isCorrect: false,
        earnedScore: 1.5,
        maxScore: 2.5,
        aiComment: 'Nhầm lẫn ở câu c): Chu kỳ con lắc lò xo T = 2π√(m/k) không phụ thuộc vào biên độ A!'
      },
      {
        questionId: 'q104',
        questionPrompt: 'Sóng cơ f=50Hz, v=2m/s. Khoảng cách ngược pha...',
        studentAnswer: '2 cm',
        correctAnswer: '2 cm',
        isCorrect: true,
        earnedScore: 2.0,
        maxScore: 2.5,
        aiComment: 'Tốt! Áp dụng d = λ/2 đúng chuẩn.'
      }
    ],
    aiDiagnosis: {
      weakTopics: ['Nhầm lẫn tính độc lập của chu kỳ dao động với biên độ'],
      strongTopics: ['Định luật khí lý tưởng', 'Sóng cơ cơ bản'],
      recommendedRemediation: 'Ôn tập lại các yếu tố ảnh hưởng đến Chu kỳ T của con lắc đơn và con lắc lò xo trong chương Dao Động Lớp 11.',
      feedbackSummary: 'Học sinh có tư duy lý thuyết nhiệt và toán sóng rất tốt. Cần lưu ý bẫy trắc nghiệm Đúng/Sai về sự phụ thuộc biên độ.'
    }
  }
];

export const SAMPLE_EXAM_MATRIX: ExamMatrix = {
  id: 'mat12',
  title: 'Ma Trận Đề Thi Thử Tốt Nghiệp THPT Vật Lý 2026 (GDPT 2018)',
  grade: 12,
  totalQuestions: 28,
  durationMinutes: 50,
  nhanBietCount: 12,
  thongHieuCount: 8,
  vanDungCount: 6,
  vanDungCaoCount: 2,
  topicsDistribution: {
    'Vật lý Nhiệt & Khí lý tưởng': 10,
    'Từ trường & Lực Lorentz': 8,
    'Hạt nhân Vật lý & Sóng điện từ': 6,
    'Vật lý Lượng tử': 4
  }
};

export const MOCK_COLLEAGUES: ColleagueTeacher[] = [
  {
    id: 'tch_1',
    name: 'ThS. Nguyễn Văn Đức',
    email: 'nguyenvanduc.physics@edu.vn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'HEAD_TEACHER',
    subject: 'Trưởng Bộ Môn Vật Lý',
    assignedClassCodes: ['PHY12-PRO', 'PHY11-X1', 'PHY10-A1'],
    status: 'ACTIVE',
    permissions: {
      canUploadMaterials: true,
      canAssignTasks: true,
      canManageStudents: true,
      canEditExams: true
    },
    joinedDate: '2025-09-01'
  },
  {
    id: 'tch_2',
    name: 'Cô Lê Thị Hoa',
    email: 'lethihoa.phys@edu.vn',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'CO_TEACHER',
    subject: 'Giáo Viên Đồng Giảng Lớp 12',
    assignedClassCodes: ['PHY12-PRO', 'PHY11-X1'],
    status: 'ACTIVE',
    permissions: {
      canUploadMaterials: true,
      canAssignTasks: true,
      canManageStudents: true,
      canEditExams: false
    },
    joinedDate: '2026-01-10'
  },
  {
    id: 'tch_3',
    name: 'Thầy Phạm Đức Minh',
    email: 'phamducminh.physics@edu.vn',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'ASSISTANT',
    subject: 'Trợ Giảng & Soạn Bài Lớp 10-11',
    assignedClassCodes: ['PHY11-X1', 'PHY10-A1'],
    status: 'ACTIVE',
    permissions: {
      canUploadMaterials: true,
      canAssignTasks: true,
      canManageStudents: false,
      canEditExams: false
    },
    joinedDate: '2026-02-15'
  },
  {
    id: 'tch_4',
    name: 'ThS. Hoàng Bích Ngọc',
    email: 'hoangbichngoc.eval@edu.vn',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'OBSERVER',
    subject: 'Dự Giờ & Quản Lý Chất Lượng',
    assignedClassCodes: ['PHY12-PRO'],
    status: 'PENDING',
    permissions: {
      canUploadMaterials: false,
      canAssignTasks: false,
      canManageStudents: false,
      canEditExams: false
    },
    joinedDate: '2026-08-01'
  }
];

export const MOCK_MATERIALS: TeachingMaterial[] = [
  {
    id: 'mat_101',
    title: 'Slide Bài Giảng: Thuyết Động Học Chất Khí & Đẳng Nhiệt (GDPT 2018)',
    description: 'Bộ slide PowerPoint tương tác minh họa mô hình phân tử khí va chạm thành bình, đồ thị đẳng nhiệt Boyle-Mariotte.',
    type: 'SLIDE',
    fileName: 'BaiGiang_ThuyetDongHoc_Lop12.pptx',
    fileSize: '14.2 MB',
    uploadedByTeacherId: 'tch_2',
    uploadedByTeacherName: 'Cô Lê Thị Hoa',
    uploadedDate: '2026-08-05',
    grade: 12,
    topic: 'Vật lý Nhiệt & Thuyết động học chất khí',
    assignedClassCodes: ['PHY12-PRO'],
    viewCount: 142,
    downloadCount: 38
  },
  {
    id: 'mat_102',
    title: 'Phiếu Bài Tập Nâng Cao: Dao Động Điều Hòa & Bẫy Đồ Thị Pha',
    description: 'File PDF chứa 20 câu trắc nghiệm Đúng/Sai & Trả lời ngắn tổng hợp bẫy pha ban đầu và độ lệch pha.',
    type: 'WORKSHEET',
    fileName: 'PhieuBaiTap_DaoDong_Chuong1.pdf',
    fileSize: '3.8 MB',
    uploadedByTeacherId: 'tch_3',
    uploadedByTeacherName: 'Thầy Phạm Đức Minh',
    uploadedDate: '2026-08-06',
    grade: 11,
    topic: 'Dao động điều hòa & Con lắc',
    assignedClassCodes: ['PHY11-X1', 'PHY12-PRO'],
    viewCount: 98,
    downloadCount: 45
  },
  {
    id: 'mat_103',
    title: 'Tài Liệu Hướng Dẫn Thí Nghiệm: Khúc Xạ Ánh Sáng & Chiết Suất Môi Trường',
    description: 'Tài liệu hướng dẫn thực hành kết hợp Phòng Thí Nghiệm Virtual Lab Snell Law.',
    type: 'LAB_GUIDE',
    fileName: 'HuongDan_ThiNghiem_KhucXa.docx',
    fileSize: '5.1 MB',
    uploadedByTeacherId: 'tch_1',
    uploadedByTeacherName: 'ThS. Nguyễn Văn Đức',
    uploadedDate: '2026-08-07',
    grade: 11,
    topic: 'Sóng ánh sáng & Giao thoa',
    assignedClassCodes: ['PHY11-X1'],
    viewCount: 76,
    downloadCount: 29
  },
  {
    id: 'mat_104',
    title: 'Video Giảng Tóm Tắt: Phương Trình Sóng Cơ & Truyền Sóng',
    description: 'Video ngắn 15 phút giải thích trực quan về bước sóng, chu kỳ sóng và độ lệch pha giữa 2 điểm.',
    type: 'VIDEO',
    fileName: 'Video_PhuongTrinhSongCo_15p.mp4',
    fileSize: '85.0 MB',
    uploadedByTeacherId: 'tch_2',
    uploadedByTeacherName: 'Cô Lê Thị Hoa',
    uploadedDate: '2026-08-07',
    grade: 11,
    topic: 'Sóng cơ & Sóng âm',
    assignedClassCodes: ['PHY11-X1', 'PHY12-PRO'],
    viewCount: 210,
    downloadCount: 62
  }
];

export const MOCK_TASKS: AssignedTask[] = [
  {
    id: 'task_1',
    title: 'Nhiệm vụ 12A1: Đọc Slide Thuyết Động Học & Hoàn thành 5 câu trắc nghiệm',
    materialId: 'mat_101',
    materialTitle: 'Slide Bài Giảng: Thuyết Động Học Chất Khí & Đẳng Nhiệt',
    assignedByTeacherName: 'Cô Lê Thị Hoa',
    assignedByTeacherId: 'tch_2',
    targetClassCode: 'PHY12-PRO',
    dueDate: '2026-08-12 23:59',
    note: 'Đồng nghiệp Lê Thị Hoa đã giao bài giảng này cho toàn bộ học sinh Lớp 12A1 trước buổi học trực tiếp.',
    status: 'OPEN',
    createdAt: '2026-08-05 16:00'
  },
  {
    id: 'task_2',
    title: 'Bài tập bổ trợ riêng: Khắc phục lỗ hổng Khúc xạ ánh sáng',
    materialId: 'mat_103',
    materialTitle: 'Tài Liệu Hướng Dẫn Thí Nghiệm: Khúc Xạ Ánh Sáng',
    assignedByTeacherName: 'ThS. Nguyễn Văn Đức',
    assignedByTeacherId: 'tch_1',
    targetClassCode: 'PHY12-PRO',
    targetStudentName: 'Nguyễn Hoàng Nam',
    dueDate: '2026-08-10 18:00',
    note: 'Bài tập bổ trợ được giáo viên đồng giảng giao riêng dựa trên kết quả phát hiện lỗ hổng kiến thức AI Gap Detection.',
    status: 'OPEN',
    createdAt: '2026-08-07 09:30'
  }
];

export const MOCK_HONOR_AWARDS: any[] = [
  {
    id: 'award_101',
    studentId: 'std100',
    studentName: 'Trần Minh Huy',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    classCode: 'PHY12-PRO',
    category: 'ACADEMIC_TOP',
    title: 'Thủ Khoa Học Tập Khối Chuyên Lý 12',
    subtitle: 'Đạt thành tích xuất sắc nhất với điểm số trung bình 9.8/10 tuyệt đối',
    awardedDate: '2026-08-08',
    awardedByTeacher: 'ThS. Nguyễn Văn Đức',
    citation: 'Duy trì phong độ học tập xuất sắc đỉnh cao, làm chủ 100% các câu hỏi vận dụng cao chương Vật lý Nhiệt & Dao động điều hòa theo định hướng GDPT 2018.',
    scoreValue: '9.8 / 10',
    badgeIcon: 'Trophy',
    themeStyle: 'GOLD'
  },
  {
    id: 'award_102',
    studentId: 'std102',
    studentName: 'Lê Bảo Ngọc',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    classCode: 'PHY11-X1',
    category: 'TRAINING_EXCELLENCE',
    title: 'Gương Mặt Rèn Luyện & Dấu Ấn Tiêu Biểu',
    subtitle: 'Đạt điểm rèn luyện 100/100, tích cực hỗ trợ các nhóm bạn học yếu',
    awardedDate: '2026-08-07',
    awardedByTeacher: 'Thầy Phạm Đức Minh',
    citation: 'Thể hiện tinh thần kỷ luật tuyệt vời, liên tục làm nhóm trưởng điều hành thảo luận bài tập nhóm và đóng góp kho bài giải chất lượng cao cho lớp.',
    scoreValue: '100 / 100 ĐRL',
    badgeIcon: 'Award',
    themeStyle: 'ROYAL_BLUE'
  },
  {
    id: 'award_103',
    studentId: 'std101',
    studentName: 'Nguyễn Hoàng Nam',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    classCode: 'PHY12-PRO',
    category: 'MOST_IMPROVED',
    title: 'Học Sinh Bứt Phá Tiến Bộ Nhất Kỳ',
    subtitle: 'Tăng 3.5 điểm từ mốc 5.0 lên 8.5/10 chỉ sau 2 tuần ôn tập AI',
    awardedDate: '2026-08-06',
    awardedByTeacher: 'Cô Lê Thị Hoa',
    citation: 'Thể hiện ý chí bứt phá kiên cường! Sau khi nhận báo cáo chẩn đoán lỗ hổng kiến thức từ AI, em đã làm lại 15 câu bài tập khúc xạ và nâng vọt điểm thi thử.',
    scoreValue: '+3.5 Điểm',
    badgeIcon: 'TrendingUp',
    themeStyle: 'RUBY_PHOENIX'
  },
  {
    id: 'award_104',
    studentId: 'std103',
    studentName: 'Phạm Quốc Bảo',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    classCode: 'PHY11-X1',
    category: 'MOST_ACTIVE',
    title: 'Học Sinh Năng Nổ & Tích Cực Nhất',
    subtitle: 'Đóng góp 48 câu hỏi thảo luận & nộp bài tập về nhà sớm nhất',
    awardedDate: '2026-08-05',
    awardedByTeacher: 'ThS. Nguyễn Văn Đức',
    citation: 'Luôn là người giơ tay phát biểu đầu tiên trong các tiết học trực tuyến và tích cực trao đổi phương pháp bấm máy tính Casio giải nhanh bài tập.',
    scoreValue: '48 Lượt phát biểu',
    badgeIcon: 'Zap',
    themeStyle: 'PURPLE_CROWN'
  },
  {
    id: 'award_105',
    studentId: 'std100',
    studentName: 'Trần Minh Huy',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    classCode: 'PHY12-PRO',
    category: 'MOST_DILIGENT',
    title: 'Ngôi Sao Chuyên Cần & Chuỗi Học Tuyệt Đối',
    subtitle: 'Duy trì chuỗi học tập liên tục 12 ngày không gián đoạn trên LMS',
    awardedDate: '2026-08-04',
    awardedByTeacher: 'ThS. Nguyễn Văn Đức',
    citation: 'Hoàn thành 100% nhiệm vụ tự học đúng hạn chót, không nghỉ một buổi luyện đề nào và luôn ôn bài lúc 5h30 sáng.',
    scoreValue: '12 Ngày Streak',
    badgeIcon: 'Sparkles',
    themeStyle: 'EMERALD_LAUREL'
  }
];


