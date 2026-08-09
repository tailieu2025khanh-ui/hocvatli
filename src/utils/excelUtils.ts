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

/**
 * Download editable Excel Answer Key template for current THPT GDPT 2018 Physics exam format (3 Parts)
 * - Part 1: 18 MCQ (4 options A, B, C, D)
 * - Part 2: 4 True/False (4 sub-items a, b, c, d: Đ/S or TRUE/FALSE)
 * - Part 3: 6 Short Answer (Numeric value or concise text)
 */
export const downloadExamKeyTemplate = () => {
  const part1Data = Array.from({ length: 18 }, (_, idx) => ({
    'STT Câu': `Câu ${idx + 1}`,
    'Loại Câu Hỏi': 'Phần 1: Trắc Nghiệm 4 Lựa Chọn (0.25đ/câu)',
    'Mã Đề 101 (*)': ['A', 'B', 'C', 'D'][idx % 4],
    'Mã Đề 102 (*)': ['B', 'C', 'D', 'A'][idx % 4],
    'Mã Đề 103 (*)': ['C', 'D', 'A', 'B'][idx % 4],
    'Mã Đề 104 (*)': ['D', 'A', 'B', 'C'][idx % 4],
    'Ghi Chú Trọng Tâm': 'Chọn 1 phương án đúng A/B/C/D'
  }));

  const part2Data = Array.from({ length: 4 }, (_, qIdx) => {
    const qNum = qIdx + 1;
    return [
      { 'STT Câu': `Câu ${qNum} - Ý a`, 'Loại Câu Hỏi': 'Phần 2: Đúng / Sai', 'Mã Đề 101 (*)': 'Đ', 'Mã Đề 102 (*)': 'S', 'Mã Đề 103 (*)': 'Đ', 'Mã Đề 104 (*)': 'S', 'Ghi Chú Trọng Tâm': 'Điền Đ hoặc S (hoặc T/F)' },
      { 'STT Câu': `Câu ${qNum} - Ý b`, 'Loại Câu Hỏi': 'Phần 2: Đúng / Sai', 'Mã Đề 101 (*)': 'S', 'Mã Đề 102 (*)': 'Đ', 'Mã Đề 103 (*)': 'S', 'Mã Đề 104 (*)': 'Đ', 'Ghi Chú Trọng Tâm': 'Điền Đ hoặc S (hoặc T/F)' },
      { 'STT Câu': `Câu ${qNum} - Ý c`, 'Loại Câu Hỏi': 'Phần 2: Đúng / Sai', 'Mã Đề 101 (*)': 'Đ', 'Mã Đề 102 (*)': 'Đ', 'Mã Đề 103 (*)': 'S', 'Mã Đề 104 (*)': 'S', 'Ghi Chú Trọng Tâm': 'Điền Đ hoặc S (hoặc T/F)' },
      { 'STT Câu': `Câu ${qNum} - Ý d`, 'Loại Câu Hỏi': 'Phần 2: Đúng / Sai', 'Mã Đề 101 (*)': 'S', 'Mã Đề 102 (*)': 'S', 'Mã Đề 103 (*)': 'Đ', 'Mã Đề 104 (*)': 'Đ', 'Ghi Chú Trọng Tâm': 'Điền Đ hoặc S (hoặc T/F)' }
    ];
  }).flat();

  const part3Data = [
    { 'STT Câu': 'Câu 1', 'Loại Câu Hỏi': 'Phần 3: Trả Lời Ngắn (Số / Chữ)', 'Mã Đề 101 (*)': '2.5', 'Mã Đề 102 (*)': '-4.2', 'Mã Đề 103 (*)': '100', 'Mã Đề 104 (*)': '0.75', 'Ghi Chú Trọng Tâm': 'Nhập số / kết quả ngắn' },
    { 'STT Câu': 'Câu 2', 'Loại Câu Hỏi': 'Phần 3: Trả Lời Ngắn (Số / Chữ)', 'Mã Đề 101 (*)': '12.8', 'Mã Đề 102 (*)': '0.5', 'Mã Đề 103 (*)': '30', 'Mã Đề 104 (*)': '1.5', 'Ghi Chú Trọng Tâm': 'Nhập số / kết quả ngắn' },
    { 'STT Câu': 'Câu 3', 'Loại Câu Hỏi': 'Phần 3: Trả Lời Ngắn (Số / Chữ)', 'Mã Đề 101 (*)': '50', 'Mã Đề 102 (*)': '10', 'Mã Đề 103 (*)': '4.5', 'Mã Đề 104 (*)': '20', 'Ghi Chú Trọng Tâm': 'Nhập số / kết quả ngắn' },
    { 'STT Câu': 'Câu 4', 'Loại Câu Hỏi': 'Phần 3: Trả Lời Ngắn (Số / Chữ)', 'Mã Đề 101 (*)': '-2', 'Mã Đề 102 (*)': '6.4', 'Mã Đề 103 (*)': '0.12', 'Mã Đề 104 (*)': '80', 'Ghi Chú Trọng Tâm': 'Nhập số / kết quả ngắn' },
    { 'STT Câu': 'Câu 5', 'Loại Câu Hỏi': 'Phần 3: Trả Lời Ngắn (Số / Chữ)', 'Mã Đề 101 (*)': '3.14', 'Mã Đề 102 (*)': '220', 'Mã Đề 103 (*)': '15', 'Mã Đề 104 (*)': '5', 'Ghi Chú Trọng Tâm': 'Nhập số / kết quả ngắn' },
    { 'STT Câu': 'Câu 6', 'Loại Câu Hỏi': 'Phần 3: Trả Lời Ngắn (Số / Chữ)', 'Mã Đề 101 (*)': '10', 'Mã Đề 102 (*)': '45', 'Mã Đề 103 (*)': '2.4', 'Mã Đề 104 (*)': '360', 'Ghi Chú Trọng Tâm': 'Nhập số / kết quả ngắn' }
  ];

  const guideInfo = [
    { 'HƯỚNG DẪN TẠO MÃ ĐỀ THI VẬT LÝ GDPT 2018 (3 PHẦN)': 'Thầy/Cô có thể chỉnh sửa đáp án hoặc thêm các cột mã đề khác như "Mã Đề 105", "Mã Đề 106"...' },
    { 'HƯỚNG DẪN TẠO MÃ ĐỀ THI VẬT LÝ GDPT 2018 (3 PHẦN)': 'PHẦN 1 (18 Câu MCQ 4 đáp án A/B/C/D): Điền chữ A, B, C, hoặc D.' },
    { 'HƯỚNG DẪN TẠO MÃ ĐỀ THI VẬT LÝ GDPT 2018 (3 PHẦN)': 'PHẦN 2 (4 Câu Đúng/Sai, mỗi câu 4 ý a-b-c-d): Điền Đ hoặc S (hoặc T/F).' },
    { 'HƯỚNG DẪN TẠO MÃ ĐỀ THI VẬT LÝ GDPT 2018 (3 PHẦN)': 'PHẦN 3 (6 Câu Trả Lời Ngắn): Điền con số hoặc từ đáp án ngắn.' }
  ];

  const wb = XLSX.utils.book_new();
  const wsPart1 = XLSX.utils.json_to_sheet(part1Data);
  const wsPart2 = XLSX.utils.json_to_sheet(part2Data);
  const wsPart3 = XLSX.utils.json_to_sheet(part3Data);
  const wsGuide = XLSX.utils.json_to_sheet(guideInfo);

  wsPart1['!cols'] = [{ wch: 12 }, { wch: 42 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 30 }];
  wsPart2['!cols'] = [{ wch: 16 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 30 }];
  wsPart3['!cols'] = [{ wch: 12 }, { wch: 35 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 30 }];

  XLSX.utils.book_append_sheet(wb, wsPart1, 'Phần 1 - Trắc Nghiệm 4 Chọn');
  XLSX.utils.book_append_sheet(wb, wsPart2, 'Phần 2 - Đúng Sai');
  XLSX.utils.book_append_sheet(wb, wsPart3, 'Phần 3 - Trả Lời Ngắn');
  XLSX.utils.book_append_sheet(wb, wsGuide, 'Hướng Dẫn Sử Dụng');

  XLSX.writeFile(wb, 'Mau_DapAn_MaDe_VatLy_GDPT2018_3Phan.xlsx');
};

/**
 * Parse an uploaded Excel/CSV file containing answer keys for multiple exam codes
 */
export const parseExamKeyExcelImport = (file: File): Promise<Array<{ code: string; title: string; answers: any[] }>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const examKeysMap: { [code: string]: any[] } = {};

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

          jsonData.forEach((row, idx) => {
            Object.keys(row).forEach(key => {
              if (key.startsWith('Mã Đề') || key.startsWith('Mã đề') || key.startsWith('Đề')) {
                const code = key.replace(/[^0-9]/g, '') || key;
                if (!examKeysMap[code]) examKeysMap[code] = [];

                const rawAns = String(row[key] || '').trim();
                const qNumStr = row['STT Câu'] || `Câu ${idx + 1}`;

                examKeysMap[code].push({
                  questionNumber: idx + 1,
                  questionLabel: qNumStr,
                  type: sheetName.includes('Đúng') ? 'TRUE_FALSE_4' : (sheetName.includes('Ngắn') ? 'SHORT_ANSWER' : 'MCQ_4'),
                  correctAnswer: rawAns
                });
              }
            });
          });
        });

        const examKeys = Object.keys(examKeysMap).map(code => ({
          code: code || '101',
          title: `Đề thi mã ${code} - GDPT 2018 (Excel Import)`,
          answers: examKeysMap[code]
        }));

        if (examKeys.length === 0) {
          resolve([
            {
              code: '101',
              title: 'Mã đề 101 (Tải từ Excel)',
              answers: Array.from({ length: 18 }, (_, i) => ({ questionNumber: i + 1, type: 'MCQ_4', correctAnswer: ['A','B','C','D'][i%4] }))
            }
          ]);
          return;
        }

        resolve(examKeys);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
