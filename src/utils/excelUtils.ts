import * as XLSX from 'xlsx';
import { StudentProfile, SubmissionResult, GradeLevel } from '../types';

/**
 * Download standard Excel template for bulk importing students into the system
 */
export const downloadStudentTemplate = () => {
  const templateData = [
    {
      'Mã Học Sinh (Để trống tự sinh)': 'std_1001',
      'Họ và Tên (*)': 'Nguyễn Văn An',
      'Tên Đăng Nhập (*)': 'std_vanan',
      'Mật Khẩu (Để trống ngẫu nhiên)': 'VanAn2026@',
      'Khối Lớp (10/11/12) (*)': 12,
      'Lớp Học (*)': 'PHY12-PRO',
      'Phân Tổ / Nhóm': 'Tổ 1',
      'Khối Thi / Định Hướng': 'Khối A00 (Toán-Lý-Hóa)',
      'ID Giáo Viên Quản Lý': 'tch_1',
      'Tên Giáo Viên Quản Lý': 'ThS. Nguyễn Văn Đức'
    },
    {
      'Mã Học Sinh (Để trống tự sinh)': 'std_1002',
      'Họ và Tên (*)': 'Tran Thi Bình',
      'Tên Đăng Nhập (*)': 'std_thibinh',
      'Mật Khẩu (Để trống ngẫu nhiên)': 'ThiBinh2026@',
      'Khối Lớp (10/11/12) (*)': 12,
      'Lớp Học (*)': 'PHY12-PRO',
      'Phân Tổ / Nhóm': 'Tổ 2',
      'Khối Thi / Định Hướng': 'Khối A01 (Toán-Lý-Anh)',
      'ID Giáo Viên Quản Lý': 'tch_2',
      'Tên Giáo Viên Quản Lý': 'Cô Lê Thị Hoa'
    },
    {
      'Mã Học Sinh (Để trống tự sinh)': '',
      'Họ và Tên (*)': 'Lê Hoàng Cường',
      'Tên Đăng Nhập (*)': 'std_hoangcuong',
      'Mật Khẩu (Để trống ngẫu nhiên)': '',
      'Khối Lớp (10/11/12) (*)': 11,
      'Lớp Học (*)': 'PHY11-X1',
      'Phân Tổ / Nhóm': 'Tổ 1',
      'Khối Thi / Định Hướng': 'Khối B00 (Toán-Hóa-Sinh)',
      'ID Giáo Viên Quản Lý': 'tch_3',
      'Tên Giáo Viên Quản Lý': 'Thầy Phạm Đức Minh'
    }
  ];

  const guideData = [
    { 'HƯỚNG DẪN NHẬP DỮ LIỆU': 'Cột có dấu (*) là bắt buộc.' },
    { 'HƯỚNG DẪN NHẬP DỮ LIỆU': 'Mã học sinh: để trống hệ thống sẽ tự sinh ID ngẫu nhiên.' },
    { 'HƯỚNG DẪN NHẬP DỮ LIỆU': 'Mật khẩu: để trống hệ thống sẽ tạo mật khẩu bảo mật tự động.' },
    { 'HƯỚNG DẪN NHẬP DỮ LIỆU': 'Phân Tổ / Nhóm: Ví dụ Tổ 1, Tổ 2, Tổ 3, Tổ 4 hoặc Nhóm Chuyên Đề.' },
    { 'HƯỚNG DẪN NHẬP DỮ LIỆU': 'Khối Lớp: Nhập số 10, 11, hoặc 12.' }
  ];

  const wb = XLSX.utils.book_new();
  const wsStudents = XLSX.utils.json_to_sheet(templateData);
  const wsGuide = XLSX.utils.json_to_sheet(guideData);

  // Column width auto-fit
  wsStudents['!cols'] = [
    { wch: 28 }, // ID
    { wch: 22 }, // Name
    { wch: 20 }, // Username
    { wch: 25 }, // Password
    { wch: 20 }, // Grade
    { wch: 15 }, // Class
    { wch: 15 }, // Subgroup
    { wch: 25 }, // Subject Group
    { wch: 22 }, // Mgr ID
    { wch: 25 }  // Mgr Name
  ];

  XLSX.utils.book_append_sheet(wb, wsStudents, 'Danh Sách Học Sinh');
  XLSX.utils.book_append_sheet(wb, wsGuide, 'Hướng Dẫn Nhập');

  XLSX.writeFile(wb, 'Mau_DanhSach_HocSinh_PhanTo_LMS.xlsx');
};

/**
 * Export full student list with subgroups and managers to Excel
 */
export const downloadStudentListExport = (students: StudentProfile[]) => {
  const exportData = students.map((s, idx) => ({
    'STT': idx + 1,
    'Mã Học Sinh': s.id,
    'Họ và Tên': s.name,
    'Tên Đăng Nhập': s.username,
    'Mật Khẩu': s.password,
    'Khối': `Khối ${s.grade}`,
    'Lớp Học': s.classCode,
    'Phân Tổ / Nhóm': s.subGroup || 'Tổ 1',
    'Khối Thi': s.subjectGroup || 'Khối A00',
    'Thầy Cô Quản Lý': s.managerName,
    'Trạng Thái': s.status === 'ACTIVE' ? 'Đang Hoạt Động' : 'Tạm Khóa',
    'Cấp Độ (Level)': `Lv.${s.level}`,
    'Điểm Kinh Nghiệm (XP)': s.xp,
    'Ngày Tạo': s.createdDate
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);
  ws['!cols'] = [
    { wch: 6 }, { wch: 14 }, { wch: 22 }, { wch: 18 }, { wch: 18 },
    { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 24 },
    { wch: 16 }, { wch: 14 }, { wch: 20 }, { wch: 14 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Roster Học Sinh');
  XLSX.writeFile(wb, `DanhSach_HocSinh_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Export exam results and score details to Excel
 */
export const downloadGradesExport = (submissions: SubmissionResult[], students: StudentProfile[]) => {
  const studentMap = new Map(students.map(s => [s.id, s]));

  const gradeRows = submissions.map((sub, idx) => {
    const std = studentMap.get(sub.studentId);
    return {
      'STT': idx + 1,
      'Mã Học Sinh': sub.studentId,
      'Họ và Tên Học Sinh': sub.studentName,
      'Lớp Học': sub.classCode,
      'Phân Tổ': std?.subGroup || 'Tổ 1',
      'Đề Bài / Bài Kiểm Tra': sub.examTitle,
      'Điểm Đạt Được': sub.score,
      'Thang Điểm Tối Đa': sub.maxScore,
      'Tỷ Lệ (%)': `${Math.round((sub.score / sub.maxScore) * 100)}%`,
      'Phương Thức Chấm': sub.gradedByOCR ? `OCR Chấm Tự Động (${sub.ocrConfidence || 95}%)` : 'Chấm Trực Tuyến',
      'Chủ Đề Yếu Cần Ôn Tập': sub.aiDiagnosis?.weakTopics?.join(', ') || 'Không có',
      'Chủ Đề Vững': sub.aiDiagnosis?.strongTopics?.join(', ') || 'Đạt chuẩn',
      'Lời Nhận Xét AI Pedagogy': sub.aiDiagnosis?.feedbackSummary || 'Bài làm tốt',
      'Thời Gian Chấm': sub.gradedAt
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(gradeRows);
  ws['!cols'] = [
    { wch: 6 }, { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 12 },
    { wch: 35 }, { wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 25 },
    { wch: 35 }, { wch: 30 }, { wch: 45 }, { wch: 20 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Bảng Điểm Kiểm Tra');
  XLSX.writeFile(wb, `BaoCao_DiemThi_OCR_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Parse an uploaded Excel/CSV file into StudentProfile objects
 */
export const parseStudentExcelImport = (
  file: File,
  defaultManagerId: string = 'tch_1',
  defaultManagerName: string = 'ThS. Nguyễn Văn Đức'
): Promise<StudentProfile[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Grab first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonData || jsonData.length === 0) {
          reject(new Error('File Excel không có dữ liệu hoặc sai định dạng.'));
          return;
        }

        const parsedStudents: StudentProfile[] = jsonData.map((row, idx) => {
          // Flexible key lookup
          const name = row['Họ và Tên (*)'] || row['Họ và Tên'] || row['Họ tên'] || row['Full Name'] || `Học sinh ${idx + 1}`;
          const username = row['Tên Đăng Nhập (*)'] || row['Tên Đăng Nhập'] || row['Username'] || `std_${Date.now().toString().slice(-4)}${idx}`;
          const password = row['Mật Khẩu (Để trống ngẫu nhiên)'] || row['Mật Khẩu'] || row['Password'] || `HocSinh${Math.floor(1000 + Math.random() * 9000)}@`;
          
          let gradeVal: GradeLevel = 12;
          const rawGrade = row['Khối Lớp (10/11/12) (*)'] || row['Khối Lớp'] || row['Khối'];
          if (rawGrade == 10 || rawGrade == '10') gradeVal = 10;
          if (rawGrade == 11 || rawGrade == '11') gradeVal = 11;

          const classCode = row['Lớp Học (*)'] || row['Lớp Học'] || row['Lớp'] || 'PHY12-PRO';
          const subGroup = row['Phân Tổ / Nhóm'] || row['Tổ'] || row['Phân Tổ'] || 'Tổ 1';
          const subjectGroup = row['Khối Thi / Định Hướng'] || row['Khối Thi'] || 'Khối A00 (Toán-Lý-Hóa)';
          const mgrId = row['ID Giáo Viên Quản Lý'] || defaultManagerId;
          const mgrName = row['Tên Giáo Viên Quản Lý'] || defaultManagerName;

          return {
            id: row['Mã Học Sinh (Để trống tự sinh)'] || row['Mã Học Sinh'] || `std_${Date.now().toString().slice(-5)}${idx}`,
            name: String(name).trim(),
            username: String(username).trim().toLowerCase(),
            password: String(password).trim(),
            grade: gradeVal,
            classCode: String(classCode).trim(),
            subGroup: String(subGroup).trim(),
            subjectGroup: String(subjectGroup).trim(),
            managerId: String(mgrId).trim(),
            managerName: String(mgrName).trim(),
            avatar: `https://images.unsplash.com/photo-${1534528741775 + (idx % 10)}?w=150&auto=format&fit=crop&q=80`,
            status: 'ACTIVE',
            createdDate: new Date().toISOString().split('T')[0],
            xp: 500,
            level: 1,
            streakDays: 1,
            badges: [],
            topicProficiency: {},
            weakTopics: []
          };
        });

        resolve(parsedStudents);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
