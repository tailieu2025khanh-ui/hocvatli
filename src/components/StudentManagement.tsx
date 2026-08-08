import React, { useState } from 'react';
import { StudentProfile, ClassRoom, ColleagueTeacher, GradeLevel, SubmissionResult, TeachingMaterial, Question, AssignedTask } from '../types';
import { 
  downloadStudentTemplate, 
  downloadStudentListExport, 
  downloadGradesExport, 
  parseStudentExcelImport 
} from '../utils/excelUtils';
import { 
  Users, UserPlus, Search, Filter, KeyRound, Lock, Unlock, RefreshCw, 
  Check, Copy, Eye, EyeOff, ShieldCheck, UserCheck, AlertCircle, Trash2, 
  Edit3, GraduationCap, Building, MoreVertical, Sparkles, LogIn, FileSpreadsheet,
  Download, Upload, FileCheck, Layers, FolderTree, BarChart3, BrainCircuit, Database
} from 'lucide-react';
import { StudentAIAnalyticsModal } from './StudentAIAnalyticsModal';

interface StudentManagementProps {
  isDarkMode: boolean;
  students: StudentProfile[];
  classList: ClassRoom[];
  colleagues: ColleagueTeacher[];
  submissions?: SubmissionResult[];
  materials?: TeachingMaterial[];
  questions?: Question[];
  onAddStudent: (newStudent: StudentProfile) => void;
  onUpdateStudent: (updatedStudent: StudentProfile) => void;
  onDeleteStudent: (studentId: string) => void;
  onSelectStudentForLogin?: (student: StudentProfile) => void;
  onAssignTask?: (newTask: AssignedTask) => void;
  onOpenOnlineDb?: () => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  isDarkMode,
  students,
  classList,
  colleagues,
  submissions = [],
  materials = [],
  questions = [],
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onSelectStudentForLogin,
  onAssignTask,
  onOpenOnlineDb
}) => {
  // AI Analytics Modal State
  const [selectedAnalyticsStudent, setSelectedAnalyticsStudent] = useState<StudentProfile | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedSubGroup, setSelectedSubGroup] = useState<string>('ALL');
  const [selectedManager, setSelectedManager] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importedPreviewStudents, setImportedPreviewStudents] = useState<StudentProfile[]>([]);
  const [importFileName, setImportFileName] = useState<string>('');
  const [importStatusMsg, setImportStatusMsg] = useState<string | null>(null);

  const [resetPasswordStudent, setResetPasswordStudent] = useState<StudentProfile | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [copySuccessMsg, setCopySuccessMsg] = useState<string | null>(null);

  // Add Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: 'HocSinh2026@',
    grade: 12 as GradeLevel,
    classCode: classList[0]?.code || 'PHY12-PRO',
    subGroup: 'Tổ 1',
    subjectGroup: 'Khối A00 (Toán-Lý-Hóa)',
    managerId: colleagues[0]?.id || 'tch_1',
    managerName: colleagues[0]?.name || 'ThS. Nguyễn Văn Đức',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  // Edit Student State
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);

  // Toggle Password Visibility for specific student
  const toggleShowPassword = (studentId: string) => {
    setShowPasswordMap(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  // Filter logic
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.classCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = selectedGrade === 'ALL' || s.grade.toString() === selectedGrade;
    const matchesClass = selectedClass === 'ALL' || s.classCode === selectedClass;
    const matchesSubGroup = selectedSubGroup === 'ALL' || (s.subGroup || 'Tổ 1') === selectedSubGroup;
    const matchesManager = selectedManager === 'ALL' || s.managerId === selectedManager || s.managerName === selectedManager;
    const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;

    return matchesSearch && matchesGrade && matchesClass && matchesSubGroup && matchesManager && matchesStatus;
  });

  // Unique subgroups list for filtering
  const availableSubGroups = (Array.from(new Set(students.map(s => s.subGroup || 'Tổ 1'))) as string[]).sort();

  // Handle Excel Import File Upload
  const handleExcelFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setImportStatusMsg('Đang đọc và phân tích tập tin Excel...');

    try {
      const parsed = await parseStudentExcelImport(file, colleagues[0]?.id, colleagues[0]?.name);
      setImportedPreviewStudents(parsed);
      setImportStatusMsg(`✓ Đã trích xuất thành công ${parsed.length} học sinh từ tập tin.`);
    } catch (err: any) {
      setImportStatusMsg(`❌ Lỗi đọc tập tin Excel: ${err?.message || 'Định dạng không hợp lệ'}`);
    }
  };

  // Confirm Import parsed students into system
  const handleConfirmImport = () => {
    if (importedPreviewStudents.length === 0) return;
    importedPreviewStudents.forEach(st => onAddStudent(st));
    alert(`Đã thêm thành công ${importedPreviewStudents.length} học sinh vào hệ thống!`);
    setShowImportModal(false);
    setImportedPreviewStudents([]);
    setImportFileName('');
    setImportStatusMsg(null);
  };

  // Handle Add Student Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim()) {
      alert('Vui lòng nhập đầy đủ Họ tên và Tên đăng nhập.');
      return;
    }

    const selectedMgr = colleagues.find(c => c.id === formData.managerId) || colleagues[0];

    const newStudent: StudentProfile = {
      id: 'std_' + Date.now().toString().slice(-5),
      name: formData.name.trim(),
      username: formData.username.trim().toLowerCase(),
      password: formData.password || 'HocSinh2026@',
      avatar: formData.avatar,
      classCode: formData.classCode,
      grade: formData.grade,
      subGroup: formData.subGroup || 'Tổ 1',
      subjectGroup: formData.subjectGroup || 'Khối A00 (Toán-Lý-Hóa)',
      managerId: selectedMgr ? selectedMgr.id : 'tch_1',
      managerName: selectedMgr ? selectedMgr.name : 'ThS. Nguyễn Văn Đức',
      status: 'ACTIVE',
      createdDate: new Date().toISOString().split('T')[0],
      xp: 500,
      level: 1,
      streakDays: 1,
      badges: [],
      topicProficiency: {},
      weakTopics: []
    };

    onAddStudent(newStudent);
    setShowAddModal(false);
    setFormData({
      name: '',
      username: '',
      password: 'HocSinh2026@',
      grade: 12,
      classCode: classList[0]?.code || 'PHY12-PRO',
      subGroup: 'Tổ 1',
      subjectGroup: 'Khối A00 (Toán-Lý-Hóa)',
      managerId: colleagues[0]?.id || 'tch_1',
      managerName: colleagues[0]?.name || 'ThS. Nguyễn Văn Đức',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });
  };

  // Generate Random Password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPasswordInput(res);
  };

  // Confirm Reset Password
  const handleConfirmResetPassword = () => {
    if (!resetPasswordStudent || !newPasswordInput.trim()) return;

    const updated = {
      ...resetPasswordStudent,
      password: newPasswordInput.trim()
    };

    onUpdateStudent(updated);

    // Copy to clipboard
    navigator.clipboard.writeText(`Tài khoản: ${updated.username}\nMật khẩu mới: ${updated.password}`);
    setCopySuccessMsg(`✓ Đã reset mật khẩu cho ${updated.name} và copy vào bộ nhớ đệm!`);

    setTimeout(() => {
      setCopySuccessMsg(null);
      setResetPasswordStudent(null);
      setNewPasswordInput('');
    }, 2000);
  };

  // Toggle Account Lock Status
  const handleToggleLockStatus = (student: StudentProfile) => {
    const newStatus = student.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    onUpdateStudent({
      ...student,
      status: newStatus
    });
  };

  // Save Edit Student
  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    onUpdateStudent(editingStudent);
    setEditingStudent(null);
  };

  return (
    <div className={`rounded-lg border p-6 transition-colors shadow-lg ${
      isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#27272a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Quản Lý Học Sinh & Phân Quyền Tài Khoản</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Quản trị viên / Thầy cô quản lý thêm học sinh, phân chia theo Lớp, Tổ/Nhóm, Khối Thi, phân công Người Quản Lý, reset mật khẩu và xuất nhập Excel.
          </p>
        </div>

        {/* Action Buttons: Add & Excel */}
        <div className="flex flex-wrap items-center gap-2">
          
          {onOpenOnlineDb && (
            <button
              onClick={onOpenOnlineDb}
              className="px-3.5 py-2 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow flex items-center gap-1.5 cursor-pointer transition-all"
              title="Đồng bộ danh sách lớp với Database trực tuyến"
            >
              <Database className="w-4 h-4" />
              <span>Liên Kết Database Trực Tuyến</span>
            </button>
          )}

          <button
            onClick={() => downloadStudentTemplate()}
            className="px-3 py-2 rounded text-xs font-mono bg-[#09090b] hover:bg-zinc-800 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer transition-all"
            title="Tải mẫu Excel chuẩn LMS để nhập học sinh hàng loạt"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tải Mẫu Excel</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-2 rounded text-xs font-mono bg-[#09090b] hover:bg-zinc-800 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 cursor-pointer transition-all"
            title="Nhập danh sách học sinh từ file Excel (.xlsx / .csv)"
          >
            <Upload className="w-3.5 h-3.5 text-teal-400" />
            <span>Nhập File Excel</span>
          </button>

          <button
            onClick={() => downloadStudentListExport(students)}
            className="px-3 py-2 rounded text-xs font-mono bg-[#09090b] hover:bg-zinc-800 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 cursor-pointer transition-all"
            title="Xuất bảng danh sách học sinh ra file Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
            <span>Xuất Excel HS</span>
          </button>

          <button
            onClick={() => downloadGradesExport(submissions, students)}
            className="px-3 py-2 rounded text-xs font-mono bg-[#09090b] hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer transition-all"
            title="Xuất bảng điểm kiểm tra & kết quả chấm thi OCR"
          >
            <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Xuất Điểm Thi</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/30 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Thêm Học Sinh</span>
          </button>

        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a]">
          <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Tổng Số Học Sinh</span>
          <div className="text-xl font-bold font-mono text-emerald-400">{students.length} HS</div>
          <span className="text-[10px] text-zinc-500">Đã đăng ký hệ thống</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a]">
          <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Phân Theo Khối Lớp</span>
          <div className="text-xs font-mono text-zinc-200 space-y-0.5">
            <div>Khối 12: <strong className="text-emerald-400">{students.filter(s => s.grade === 12).length}</strong></div>
            <div>Khối 11: <strong className="text-emerald-400">{students.filter(s => s.grade === 11).length}</strong> • Khối 10: <strong className="text-emerald-400">{students.filter(s => s.grade === 10).length}</strong></div>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a]">
          <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Phân Nhóm Tổ Học Tập</span>
          <div className="text-xs font-mono text-zinc-200">
            {availableSubGroups.map(grp => (
              <span key={grp} className="mr-2">
                {grp}: <strong className="text-emerald-400">{students.filter(s => (s.subGroup || 'Tổ 1') === grp).length}</strong>
              </span>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a]">
          <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Tài Khoản Hoạt Động</span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {students.filter(s => s.status === 'ACTIVE').length} / {students.length}
          </div>
          <span className="text-[10px] text-rose-400">
            {students.filter(s => s.status === 'LOCKED').length} tài khoản tạm khóa
          </span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] mb-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo Tên, Username, Lớp, Tổ..."
              className={`w-full pl-9 pr-3 py-2 rounded text-xs font-medium border ${
                isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100 focus:border-emerald-500 outline-none' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          {/* Grade Filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className={`w-full px-3 py-2 rounded text-xs font-mono border ${
                isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200 focus:border-emerald-500 outline-none' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value="ALL">Tất Cả Khối</option>
              <option value="12">Khối 12</option>
              <option value="11">Khối 11</option>
              <option value="10">Khối 10</option>
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={`w-full px-3 py-2 rounded text-xs font-mono border ${
                isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200 focus:border-emerald-500 outline-none' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value="ALL">Tất Cả Lớp Học</option>
              {classList.map(c => (
                <option key={c.id} value={c.code}>{c.code} ({c.name})</option>
              ))}
            </select>
          </div>

          {/* SubGroup Filter */}
          <div>
            <select
              value={selectedSubGroup}
              onChange={(e) => setSelectedSubGroup(e.target.value)}
              className={`w-full px-3 py-2 rounded text-xs font-mono border ${
                isDarkMode ? 'bg-[#18181b] border-[#27272a] text-emerald-400 focus:border-emerald-500 outline-none' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value="ALL">Tất Cả Phân Tổ</option>
              <option value="Tổ 1">Tổ 1</option>
              <option value="Tổ 2">Tổ 2</option>
              <option value="Tổ 3">Tổ 3</option>
              <option value="Tổ 4">Tổ 4</option>
              {availableSubGroups.filter(g => !['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'].includes(g)).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Managing Teacher Filter */}
          <div>
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              className={`w-full px-3 py-2 rounded text-xs font-mono border ${
                isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200 focus:border-emerald-500 outline-none' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value="ALL">Tất Cả Người Quản Lý</option>
              {colleagues.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* View Mode & Active Count */}
        <div className="flex items-center justify-between pt-2 border-t border-[#27272a] text-xs font-mono">
          <span className="text-zinc-400">
            Hiển thị <strong className="text-emerald-400">{filteredStudents.length}</strong> / {students.length} học sinh
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer ${
                viewMode === 'TABLE' ? 'bg-emerald-600 text-white border-emerald-500 font-bold' : 'bg-[#18181b] text-zinc-400 border-[#27272a]'
              }`}
            >
              Bảng Danh Sách
            </button>
            <button
              onClick={() => setViewMode('CARDS')}
              className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer ${
                viewMode === 'CARDS' ? 'bg-emerald-600 text-white border-emerald-500 font-bold' : 'bg-[#18181b] text-zinc-400 border-[#27272a]'
              }`}
            >
              Thẻ Học Sinh
            </button>
          </div>
        </div>
      </div>

      {/* STUDENT LIST: TABLE VIEW */}
      {viewMode === 'TABLE' && (
        <div className="overflow-x-auto rounded-lg border border-[#27272a]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#09090b] text-zinc-400 font-mono uppercase text-[10px] border-b border-[#27272a]">
              <tr>
                <th className="p-3">Học Sinh</th>
                <th className="p-3">Tài Khoản / Mật Khẩu</th>
                <th className="p-3">Khối / Lớp</th>
                <th className="p-3">Phân Tổ & Khối Thi</th>
                <th className="p-3">Người Quản Lý</th>
                <th className="p-3">Trạng Thái</th>
                <th className="p-3 text-right">Thao Tác Quản Lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a] font-mono">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-[#09090b]/50 transition-colors">
                    
                    {/* Name & Avatar */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5 font-sans">
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#27272a]"
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{std.name}</div>
                          <span className="text-[10px] font-mono text-zinc-500">ID: {std.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Username & Password */}
                    <td className="p-3">
                      <div>
                        <div className="text-emerald-400 font-bold text-xs">{std.username}</div>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mt-0.5">
                          <span>
                            {showPasswordMap[std.id] ? std.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => toggleShowPassword(std.id)}
                            className="text-zinc-500 hover:text-zinc-200 cursor-pointer"
                            title="Hiện/Ẩn Mật Khẩu"
                          >
                            {showPasswordMap[std.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Grade & Class */}
                    <td className="p-3">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          Lớp {std.classCode}
                        </span>
                        <div className="text-[10px] text-zinc-500 mt-1">Khối {std.grade}</div>
                      </div>
                    </td>

                    {/* SubGroup & Subject Group */}
                    <td className="p-3">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold">
                          {std.subGroup || 'Tổ 1'}
                        </span>
                        <div className="text-[10px] text-zinc-400 mt-1 font-sans">
                          {std.subjectGroup || 'Khối A00'}
                        </div>
                      </div>
                    </td>

                    {/* Managing Teacher */}
                    <td className="p-3">
                      <div className="text-zinc-200 text-xs font-sans font-medium flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{std.managerName}</span>
                      </div>
                    </td>

                    {/* Account Status */}
                    <td className="p-3">
                      {std.status === 'ACTIVE' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          ● Hoạt động
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit">
                          🔒 Đã khóa
                        </span>
                      )}
                    </td>

                    {/* Admin Management Actions */}
                    <td className="p-3 text-right space-x-1">
                      
                      {/* AI Analytics & Weak Knowledge Report Button */}
                      <button
                        onClick={() => setSelectedAnalyticsStudent(std)}
                        className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-pointer transition-all"
                        title="Xem Báo Cáo AI Vùng Kiến Thức Yếu & Tiến Bộ Học Sinh"
                      >
                        📊 AI Báo Cáo
                      </button>

                      {/* Password Reset Button */}
                      <button
                        onClick={() => {
                          setResetPasswordStudent(std);
                          generateRandomPassword();
                        }}
                        className="px-2.5 py-1 rounded text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-pointer transition-all"
                        title="Reset mật khẩu cho học sinh"
                      >
                        🔒 Reset Pass
                      </button>

                      {/* Edit Info */}
                      <button
                        onClick={() => setEditingStudent(std)}
                        className="px-2.5 py-1 rounded text-[10px] bg-[#18181b] hover:bg-zinc-800 text-zinc-300 border border-[#27272a] cursor-pointer"
                        title="Chỉnh sửa thông tin / lớp học / tổ / người quản lý"
                      >
                        ✏️ Sửa
                      </button>

                      {/* Toggle Lock */}
                      <button
                        onClick={() => handleToggleLockStatus(std)}
                        className={`px-2 py-1 rounded text-[10px] border cursor-pointer ${
                          std.status === 'ACTIVE'
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                        title={std.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {std.status === 'ACTIVE' ? 'Khóa' : 'Mở'}
                      </button>

                      {/* Instant Login Preview */}
                      {onSelectStudentForLogin && (
                        <button
                          onClick={() => onSelectStudentForLogin(std)}
                          className="px-2.5 py-1 rounded text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition-all ml-1"
                          title="Đăng nhập thử tài khoản học sinh này"
                        >
                          🔑 Vào
                        </button>
                      )}

                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* STUDENT LIST: CARD GRID VIEW */}
      {viewMode === 'CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((std) => (
            <div
              key={std.id}
              className={`p-4 rounded-lg border transition-all ${
                std.status === 'LOCKED'
                  ? 'bg-[#09090b]/60 border-rose-500/30 opacity-80'
                  : 'bg-[#09090b] border-[#27272a] hover:border-emerald-500/40 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={std.avatar}
                    alt={std.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#27272a]"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{std.name}</h4>
                    <span className="text-[11px] font-mono text-emerald-400">@{std.username}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  std.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {std.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm khóa'}
                </span>
              </div>

              <div className="space-y-1.5 p-3 rounded bg-[#18181b] border border-[#27272a] text-xs font-mono mb-3">
                <div className="flex justify-between text-zinc-400">
                  <span>Khối & Lớp:</span>
                  <strong className="text-white">Khối {std.grade} • Lớp {std.classCode}</strong>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Phân Tổ:</span>
                  <strong className="text-teal-300">{std.subGroup || 'Tổ 1'}</strong>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Thầy Cô Quản Lý:</span>
                  <strong className="text-emerald-400">{std.managerName}</strong>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Mật khẩu:</span>
                  <span className="flex items-center gap-1 text-zinc-200">
                    {showPasswordMap[std.id] ? std.password : '••••••••'}
                    <button onClick={() => toggleShowPassword(std.id)} className="text-zinc-500 hover:text-white">
                      {showPasswordMap[std.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="space-y-2 pt-2 border-t border-[#27272a] font-mono text-xs">
                <button
                  onClick={() => setSelectedAnalyticsStudent(std)}
                  className="w-full py-1.5 rounded text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>📊 Báo Cáo AI & Vùng Yếu</span>
                </button>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setResetPasswordStudent(std);
                      generateRandomPassword();
                    }}
                    className="px-2.5 py-1 rounded text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-pointer"
                  >
                    🔒 Reset Mật Khẩu
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingStudent(std)}
                      className="p-1.5 rounded bg-[#18181b] hover:bg-zinc-800 text-zinc-300 border border-[#27272a] cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteStudent(std.id)}
                      className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer"
                      title="Xóa học sinh"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* MODAL 0: IMPORT FROM EXCEL MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg max-w-3xl w-full p-6 text-zinc-100 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                  Nhập Danh Sách Học Sinh Từ File Excel / CSV
                </h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            {/* Upload Area */}
            <div className="p-4 rounded-lg bg-[#09090b] border-2 border-dashed border-[#27272a] hover:border-teal-500/50 text-center space-y-2">
              <Upload className="w-8 h-8 text-teal-400 mx-auto" />
              <p className="text-xs text-zinc-300 font-medium">
                Chọn file bảng tính Excel (<code className="text-teal-300">.xlsx</code>) hoặc CSV (<code className="text-teal-300">.csv</code>)
              </p>
              
              <div className="flex justify-center items-center gap-3 pt-1">
                <label className="px-4 py-2 rounded text-xs font-mono font-bold bg-teal-600 hover:bg-teal-500 text-white cursor-pointer transition-all">
                  Tải Lên Tập Tin Excel
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleExcelFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => downloadStudentTemplate()}
                  className="px-3 py-2 rounded text-xs font-mono bg-[#18181b] hover:bg-zinc-800 text-emerald-400 border border-emerald-500/30 cursor-pointer"
                >
                  📥 Tải Mẫu Excel
                </button>
              </div>

              {importFileName && (
                <div className="text-xs font-mono text-teal-300 font-bold mt-2">
                  Tập tin đã chọn: {importFileName}
                </div>
              )}
            </div>

            {importStatusMsg && (
              <div className={`p-3 rounded text-xs font-mono border ${
                importStatusMsg.startsWith('✓') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
                importStatusMsg.startsWith('❌') ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>
                {importStatusMsg}
              </div>
            )}

            {/* Imported Preview Table */}
            {importedPreviewStudents.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-bold">
                    Xem trước danh sách đọc được ({importedPreviewStudents.length} học sinh):
                  </span>
                  <span className="text-zinc-500">Mật khẩu tự sinh nếu để trống</span>
                </div>

                <div className="max-h-60 overflow-y-auto rounded border border-[#27272a] bg-[#09090b]">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#18181b] text-zinc-400 uppercase text-[10px] sticky top-0 border-b border-[#27272a]">
                      <tr>
                        <th className="p-2">Họ và Tên</th>
                        <th className="p-2">Username</th>
                        <th className="p-2">Mật Khẩu</th>
                        <th className="p-2">Lớp</th>
                        <th className="p-2">Tổ</th>
                        <th className="p-2">Quản Lý</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a]">
                      {importedPreviewStudents.map((st, i) => (
                        <tr key={i} className="hover:bg-[#18181b]/50">
                          <td className="p-2 text-white font-sans font-bold">{st.name}</td>
                          <td className="p-2 text-emerald-400">{st.username}</td>
                          <td className="p-2 text-zinc-300">{st.password}</td>
                          <td className="p-2 text-zinc-200">Lớp {st.classCode}</td>
                          <td className="p-2 text-teal-300">{st.subGroup}</td>
                          <td className="p-2 text-zinc-400 font-sans">{st.managerName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-[#27272a] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded text-xs font-mono bg-[#09090b] text-zinc-400 border border-[#27272a] cursor-pointer"
              >
                Hủy Bỏ
              </button>
              
              <button
                type="button"
                disabled={importedPreviewStudents.length === 0}
                onClick={handleConfirmImport}
                className={`px-5 py-2 rounded text-xs font-mono font-bold text-white shadow cursor-pointer flex items-center gap-1.5 ${
                  importedPreviewStudents.length > 0 ? 'bg-teal-600 hover:bg-teal-500' : 'bg-zinc-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận Import ({importedPreviewStudents.length} HS)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW STUDENT FORM */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg max-w-lg w-full p-6 text-zinc-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                  Thêm Học Sinh Mới Vào Hệ Thống
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Họ và Tên Học Sinh (*):</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Tên Đăng Nhập / Username (*):</label>
                  <input
                    type="text"
                    required
                    placeholder="std_vanan"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-emerald-400 font-mono focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Mật Khẩu Ban Đầu (*):</label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-white font-mono focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Khối Lớp (*):</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) as GradeLevel })}
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-white font-mono focus:border-emerald-500 outline-none"
                  >
                    <option value={12}>Khối 12</option>
                    <option value={11}>Khối 11</option>
                    <option value={10}>Khối 10</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Mã Lớp Học (*):</label>
                  <select
                    value={formData.classCode}
                    onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-white font-mono focus:border-emerald-500 outline-none"
                  >
                    {classList.map(c => (
                      <option key={c.id} value={c.code}>{c.code} ({c.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Phân Nhóm / Tổ (*):</label>
                  <input
                    type="text"
                    required
                    placeholder="Tổ 1 / Tổ 2 / Nhóm Chuyên Đề"
                    value={formData.subGroup}
                    onChange={(e) => setFormData({ ...formData, subGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-teal-300 font-mono focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Khối Thi Định Hướng:</label>
                  <select
                    value={formData.subjectGroup}
                    onChange={(e) => setFormData({ ...formData, subjectGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-white font-mono focus:border-emerald-500 outline-none"
                  >
                    <option value="Khối A00 (Toán-Lý-Hóa)">Khối A00 (Toán-Lý-Hóa)</option>
                    <option value="Khối A01 (Toán-Lý-Anh)">Khối A01 (Toán-Lý-Anh)</option>
                    <option value="Khối B00 (Toán-Hóa-Sinh)">Khối B00 (Toán-Hóa-Sinh)</option>
                    <option value="Khối D01 (Toán-Văn-Anh)">Khối D01 (Toán-Văn-Anh)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Phân Công Thầy Cô Quản Lý / Chủ Nhiệm (*):</label>
                <select
                  value={formData.managerId}
                  onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-emerald-400 font-mono focus:border-emerald-500 outline-none"
                >
                  {colleagues.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.subject}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-[#27272a] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded text-xs font-mono bg-[#09090b] hover:bg-zinc-800 text-zinc-400 border border-[#27272a] cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow cursor-pointer"
                >
                  Tạo Học Sinh Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESET PASSWORD MODAL */}
      {resetPasswordStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg max-w-md w-full p-6 text-zinc-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                  Reset Mật Khẩu Học Sinh
                </h3>
              </div>
              <button
                onClick={() => setResetPasswordStudent(null)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded bg-[#09090b] border border-[#27272a] text-xs font-mono space-y-1">
              <div>Học sinh: <strong className="text-white">{resetPasswordStudent.name}</strong></div>
              <div>Tài khoản: <strong className="text-emerald-400">@{resetPasswordStudent.username}</strong></div>
              <div>Quản lý: <span className="text-zinc-300">{resetPasswordStudent.managerName}</span></div>
            </div>

            <div>
              <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Mật Khẩu Mới Tự Tạo / Tùy Chỉnh:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-amber-400 font-mono text-sm font-bold outline-none"
                />
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="px-3 py-2 rounded bg-[#09090b] hover:bg-zinc-800 text-zinc-300 border border-[#27272a] text-xs font-mono shrink-0 cursor-pointer"
                  title="Sinh ngẫu nhiên"
                >
                  🔄 Tạo Ngẫu Nhiên
                </button>
              </div>
            </div>

            {copySuccessMsg && (
              <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                {copySuccessMsg}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setResetPasswordStudent(null)}
                className="px-4 py-2 rounded text-xs font-mono bg-[#09090b] hover:bg-zinc-800 text-zinc-400 border border-[#27272a] cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmResetPassword}
                className="px-4 py-2 rounded text-xs font-mono font-bold bg-amber-600 hover:bg-amber-500 text-white shadow cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận & Copy Mật Khẩu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT STUDENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg max-w-md w-full p-6 text-zinc-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                  Cập Nhật Thông Tin Học Sinh
                </h3>
              </div>
              <button onClick={() => setEditingStudent(null)} className="text-zinc-500 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditStudent} className="space-y-3 text-xs">
              {/* Avatar Preview & URL Input */}
              <div className="flex items-center gap-3 p-2.5 rounded bg-[#09090b] border border-[#27272a]">
                <div className="w-12 h-12 rounded-full border border-emerald-500 overflow-hidden shrink-0">
                  <img src={editingStudent.avatar} alt={editingStudent.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <label className="block text-zinc-400 font-mono mb-1 uppercase text-[9px]">URL Ảnh Đại Diện / Avatar:</label>
                  <input
                    type="text"
                    value={editingStudent.avatar}
                    onChange={(e) => setEditingStudent({ ...editingStudent, avatar: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-2.5 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-white font-mono text-[11px] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Họ và Tên Học Sinh:</label>
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-white outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Email Học Sinh:</label>
                  <input
                    type="email"
                    value={editingStudent.email || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    placeholder="student@gmail.com"
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Số Điện Thoại HS:</label>
                  <input
                    type="text"
                    value={editingStudent.phone || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    placeholder="09xx.xxx.xxx"
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Họ Tên Phụ Huynh:</label>
                  <input
                    type="text"
                    value={editingStudent.parentName || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                    placeholder="Nguyễn Văn A (Phụ huynh)"
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">SĐT Phụ Huynh:</label>
                  <input
                    type="text"
                    value={editingStudent.parentPhone || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                    placeholder="0912.xxx.xxx"
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Mã Lớp Học:</label>
                  <select
                    value={editingStudent.classCode}
                    onChange={(e) => setEditingStudent({ ...editingStudent, classCode: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-white font-mono outline-none"
                  >
                    {classList.map(c => (
                      <option key={c.id} value={c.code}>{c.code} ({c.name})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Phân Tổ / Nhóm:</label>
                  <input
                    type="text"
                    value={editingStudent.subGroup || 'Tổ 1'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, subGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-teal-300 font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Thầy Cô Quản Lý Phụ Trách:</label>
                <select
                  value={editingStudent.managerId}
                  onChange={(e) => {
                    const mgr = colleagues.find(c => c.id === e.target.value);
                    setEditingStudent({
                      ...editingStudent,
                      managerId: e.target.value,
                      managerName: mgr ? mgr.name : editingStudent.managerName
                    });
                  }}
                  className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-emerald-400 font-mono outline-none"
                >
                  {colleagues.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Trạng Thái Tài Khoản:</label>
                <select
                  value={editingStudent.status}
                  onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-white font-mono outline-none"
                >
                  <option value="ACTIVE">Đang Hoạt Động (Hoạt động bình thường)</option>
                  <option value="LOCKED">Đã Khóa (Không thể đăng nhập)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#27272a] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded text-xs font-mono bg-[#09090b] text-zinc-400 border border-[#27272a] cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow cursor-pointer"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Student Analytics & Progress Evaluation Report Modal */}
      {selectedAnalyticsStudent && (
        <StudentAIAnalyticsModal
          isOpen={!!selectedAnalyticsStudent}
          onClose={() => setSelectedAnalyticsStudent(null)}
          student={selectedAnalyticsStudent}
          submissions={submissions}
          materials={materials}
          questions={questions}
          isDarkMode={isDarkMode}
          onAssignTask={onAssignTask}
          isStudentView={false}
        />
      )}

    </div>
  );
};
