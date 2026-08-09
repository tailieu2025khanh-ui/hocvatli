import React, { useState } from 'react';
import { ColleagueTeacher, TeachingMaterial, AssignedTask, ClassRoom, TeacherRole, MaterialType, GradeLevel } from '../types';
import { PHYSICS_TOPICS_BY_GRADE } from '../data/mockData';
import { Users, Upload, Send, ShieldCheck, UserPlus, FileText, Video, Presentation, BookOpen, CheckCircle, Clock, Search, Lock, Download, Trash2, Edit, AlertCircle, Sparkles, Check, RefreshCw } from 'lucide-react';

interface TeacherCollaborationProps {
  isDarkMode: boolean;
  classList: ClassRoom[];
  colleagues: ColleagueTeacher[];
  materials: TeachingMaterial[];
  tasks: AssignedTask[];
  currentTeacher: ColleagueTeacher;
  onSelectTeacher: (teacher: ColleagueTeacher) => void;
  onAddColleague: (teacher: ColleagueTeacher) => void;
  onUpdatePermissions: (teacherId: string, permissions: ColleagueTeacher['permissions']) => void;
  onAddMaterial: (material: TeachingMaterial) => void;
  onDeleteMaterial: (materialId: string) => void;
  onUpdateMaterial?: (material: TeachingMaterial) => void;
  onAddTask: (task: AssignedTask) => void;
}

export const TeacherCollaboration: React.FC<TeacherCollaborationProps> = ({
  isDarkMode,
  classList,
  colleagues,
  materials,
  tasks,
  currentTeacher,
  onSelectTeacher,
  onAddColleague,
  onUpdatePermissions,
  onAddMaterial,
  onDeleteMaterial,
  onUpdateMaterial,
  onAddTask,
}) => {
  const [subTab, setSubTab] = useState<'COLLEAGUES' | 'MATERIALS' | 'TASKS'>('COLLEAGUES');

  // Modals state
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState<boolean>(false);
  const [selectedMaterialForTask, setSelectedMaterialForTask] = useState<TeachingMaterial | null>(null);

  // Filter States
  const [colleagueSearch, setColleagueSearch] = useState<string>('');
  const [materialSearch, setMaterialSearch] = useState<string>('');
  const [materialGradeFilter, setMaterialGradeFilter] = useState<string>('ALL');
  const [materialTypeFilter, setMaterialTypeFilter] = useState<string>('ALL');
  const [materialSubjectFilter, setMaterialSubjectFilter] = useState<string>('ALL');
  const [materialFolderFilter, setMaterialFolderFilter] = useState<string>('ALL');
  const [materialSubGroupFilter, setMaterialSubGroupFilter] = useState<string>('ALL');

  // New Colleague Form State
  const [newColleagueName, setNewColleagueName] = useState<string>('');
  const [newColleagueEmail, setNewColleagueEmail] = useState<string>('');
  const [newColleagueRole, setNewColleagueRole] = useState<TeacherRole>('CO_TEACHER');
  const [newColleagueSubject, setNewColleagueSubject] = useState<string>('Vật lý Lớp 12 & 11');
  const [newColleagueClasses, setNewColleagueClasses] = useState<string[]>(['PHY12-PRO']);
  const [newColleaguePerms, setNewColleaguePerms] = useState({
    canUploadMaterials: true,
    canAssignTasks: true,
    canManageStudents: true,
    canEditExams: false,
  });

  // New Material Upload Form State
  const [newMatTitle, setNewMatTitle] = useState<string>('');
  const [newMatDesc, setNewMatDesc] = useState<string>('');
  const [newMatType, setNewMatType] = useState<MaterialType>('SLIDE');
  const [newMatGrade, setNewMatGrade] = useState<GradeLevel>(12);
  const [newMatSubject, setNewMatSubject] = useState<string>('Vật Lý');
  const [newMatFolder, setNewMatFolder] = useState<string>('Vật Lý 12/Chương 1: Nhiệt Học');
  const [newMatSubGroup, setNewMatSubGroup] = useState<string>('Tất cả các Tổ');
  const [newMatTopic, setNewMatTopic] = useState<string>('Vật lý Nhiệt & Thuyết động học chất khí');
  const [newMatClasses, setNewMatClasses] = useState<string[]>(['PHY12-PRO']);
  const [newMatFileName, setNewMatFileName] = useState<string>('');
  const [newMatFileSize, setNewMatFileSize] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // New Assign Task Form State
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskClassCode, setTaskClassCode] = useState<string>('PHY12-PRO');
  const [taskSubGroup, setTaskSubGroup] = useState<string>('Tổ 1');
  const [taskStudentName, setTaskStudentName] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState<string>('2026-08-15 23:59');
  const [taskNote, setTaskNote] = useState<string>('');

  // Handle Invite Colleague Submit
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColleagueName.trim() || !newColleagueEmail.trim()) return;

    const created: ColleagueTeacher = {
      id: `tch_${Date.now()}`,
      name: newColleagueName,
      email: newColleagueEmail,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150&auto=format&fit=crop&q=80`,
      role: newColleagueRole,
      subject: newColleagueSubject,
      assignedClassCodes: newColleagueClasses,
      status: 'ACTIVE',
      permissions: newColleaguePerms,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    onAddColleague(created);
    setShowInviteModal(false);
    setNewColleagueName('');
    setNewColleagueEmail('');
  };

  // Handle File Drag & Upload Simulation
  const handleFileSelectSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewMatFileName(file.name);
      setNewMatFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      if (!newMatTitle) {
        setNewMatTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  // Handle Material Upload Submit
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatTitle.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      const created: TeachingMaterial = {
        id: `mat_${Date.now()}`,
        title: newMatTitle,
        description: newMatDesc || 'Bài giảng và tài liệu học tập bổ trợ trực quan dành cho học sinh.',
        type: newMatType,
        fileName: newMatFileName || `${newMatTitle.replace(/\s+/g, '_')}.${newMatType === 'SLIDE' ? 'pptx' : newMatType === 'VIDEO' ? 'mp4' : 'pdf'}`,
        fileSize: newMatFileSize || '12.5 MB',
        uploadedByTeacherId: currentTeacher.id,
        uploadedByTeacherName: currentTeacher.name,
        uploadedDate: new Date().toISOString().split('T')[0],
        grade: newMatGrade,
        subjectName: newMatSubject || 'Vật Lý',
        folderPath: newMatFolder || 'Vật Lý 12/Thư Mục Chung',
        topic: newMatTopic,
        assignedClassCodes: newMatClasses,
        assignedSubGroups: newMatSubGroup === 'Tất cả các Tổ' ? undefined : [newMatSubGroup],
        viewCount: 1,
        downloadCount: 0,
      };

      onAddMaterial(created);
      setIsUploading(false);
      setShowUploadModal(false);
      setNewMatTitle('');
      setNewMatDesc('');
      setNewMatFileName('');
    }, 1000);
  };

  // Handle Open Assign Task Modal
  const handleOpenAssignModal = (mat?: TeachingMaterial) => {
    if (mat) {
      setSelectedMaterialForTask(mat);
      setTaskTitle(`Giao bài học: ${mat.title}`);
      setTaskClassCode(mat.assignedClassCodes[0] || 'PHY12-PRO');
      setTaskSubGroup(mat.assignedSubGroups?.[0] || 'Tổ 1');
    } else {
      setSelectedMaterialForTask(null);
      setTaskTitle('Nhiệm vụ học tập / Bài tập tự luyện');
    }
    setShowAssignTaskModal(true);
  };

  // Handle Assign Task Submit
  const handleAssignTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const created: AssignedTask = {
      id: `task_${Date.now()}`,
      title: taskTitle,
      materialId: selectedMaterialForTask?.id,
      materialTitle: selectedMaterialForTask?.title,
      assignedByTeacherName: currentTeacher.name,
      assignedByTeacherId: currentTeacher.id,
      targetClassCode: taskClassCode,
      targetSubGroup: taskSubGroup,
      targetStudentName: taskStudentName.trim() || undefined,
      dueDate: taskDueDate,
      note: taskNote || 'Vui lòng hoàn thành theo đúng thời hạn để được chấm điểm quá trình.',
      status: 'OPEN',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onAddTask(created);
    setShowAssignTaskModal(false);
    setTaskTitle('');
    setTaskStudentName('');
  };

  const getRoleBadge = (role: TeacherRole) => {
    switch (role) {
      case 'HEAD_TEACHER':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">Trưởng Bộ Môn</span>;
      case 'CO_TEACHER':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Đồng Giảng Dạy</span>;
      case 'ASSISTANT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Trợ Giảng & Soạn Đề</span>;
      case 'OBSERVER':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">Dự Giờ & Quan Sát</span>;
    }
  };

  const getMaterialIcon = (type: MaterialType) => {
    switch (type) {
      case 'SLIDE':
        return <Presentation className="w-4 h-4 text-amber-400" />;
      case 'DOCUMENT':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'WORKSHEET':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'VIDEO':
        return <Video className="w-4 h-4 text-rose-400" />;
      case 'LAB_GUIDE':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  const filteredColleagues = colleagues.filter(c =>
    c.name.toLowerCase().includes(colleagueSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(colleagueSearch.toLowerCase()) ||
    c.subject.toLowerCase().includes(colleagueSearch.toLowerCase())
  );

  const availableSubjects = (Array.from(new Set(materials.map(m => m.subjectName || 'Vật Lý'))) as string[]).sort();
  const availableFolders = (Array.from(new Set(materials.map(m => m.folderPath || 'Vật Lý 12/Thư Mục Chung'))) as string[]).sort();

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(materialSearch.toLowerCase()) || 
      m.topic.toLowerCase().includes(materialSearch.toLowerCase()) ||
      (m.folderPath && m.folderPath.toLowerCase().includes(materialSearch.toLowerCase()));
    const matchesGrade = materialGradeFilter === 'ALL' || m.grade === Number(materialGradeFilter);
    const matchesType = materialTypeFilter === 'ALL' || m.type === materialTypeFilter;
    const matchesSubject = materialSubjectFilter === 'ALL' || (m.subjectName || 'Vật Lý') === materialSubjectFilter;
    const matchesFolder = materialFolderFilter === 'ALL' || (m.folderPath || 'Vật Lý 12/Thư Mục Chung') === materialFolderFilter;
    const matchesSubGroup = materialSubGroupFilter === 'ALL' || (m.assignedSubGroups && m.assignedSubGroups.includes(materialSubGroupFilter));
    
    return matchesSearch && matchesGrade && matchesType && matchesSubject && matchesFolder && matchesSubGroup;
  });

  return (
    <div className="space-y-6">
      
      {/* Active Teacher Profile Bar & Selector */}
      <div className={`p-5 rounded-lg border transition-colors shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <img
            src={currentTeacher.avatar}
            alt={currentTeacher.name}
            className="w-12 h-12 rounded-full border-2 border-emerald-500/40 object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400">Đang thao tác với tư cách:</span>
              {getRoleBadge(currentTeacher.role)}
            </div>
            <h2 className="text-base font-bold text-white mt-0.5">{currentTeacher.name}</h2>
            <p className="text-xs text-zinc-400">
              {currentTeacher.subject} • <span className="text-emerald-400 font-mono">{currentTeacher.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="block text-[10px] text-zinc-500 font-mono uppercase">Chuyển Hồ Sơ Giáo Viên:</span>
            <select
              value={currentTeacher.id}
              onChange={(e) => {
                const found = colleagues.find(c => c.id === e.target.value);
                if (found) onSelectTeacher(found);
              }}
              className="bg-[#09090b] text-emerald-400 border border-[#27272a] rounded px-3 py-1.5 text-xs font-mono cursor-pointer focus:outline-none focus:border-emerald-500"
            >
              {colleagues.map(c => (
                <option key={c.id} value={c.id} className="bg-[#18181b] text-zinc-200">
                  {c.name} ({c.role === 'HEAD_TEACHER' ? 'Trưởng BM' : c.role === 'CO_TEACHER' ? 'Đồng giảng' : 'Trợ giảng'})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-3.5 py-2 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Mời Đồng Nghiệp Mới</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#27272a] pb-3 font-mono text-xs">
        <button
          onClick={() => setSubTab('COLLEAGUES')}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-all cursor-pointer ${
            subTab === 'COLLEAGUES'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-bold'
              : 'bg-[#09090b] text-zinc-400 hover:text-white border border-[#27272a]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh Sách & Phân Quyền Đồng Nghiệp ({colleagues.length})</span>
        </button>

        <button
          onClick={() => setSubTab('MATERIALS')}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-all cursor-pointer ${
            subTab === 'MATERIALS'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-bold'
              : 'bg-[#09090b] text-zinc-400 hover:text-white border border-[#27272a]'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Kho Bài Giảng & Tài Liệu ({materials.length})</span>
        </button>

        <button
          onClick={() => setSubTab('TASKS')}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-all cursor-pointer ${
            subTab === 'TASKS'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-bold'
              : 'bg-[#09090b] text-zinc-400 hover:text-white border border-[#27272a]'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Nhiệm Vụ Đã Giao Cho Học Sinh ({tasks.length})</span>
        </button>
      </div>

      {/* TAB 1: COLLEAGUES & PERMISSIONS */}
      {subTab === 'COLLEAGUES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Tìm đồng nghiệp theo tên, email, môn..."
                value={colleagueSearch}
                onChange={(e) => setColleagueSearch(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded text-xs border focus:outline-none focus:border-emerald-500 ${
                  isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-white border-slate-300'
                }`}
              />
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              Quyền hiện tại: <span className="text-emerald-400 font-bold">{currentTeacher.permissions.canAssignTasks ? 'Có thể giao bài & tải tài liệu' : 'Chỉ xem'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredColleagues.map((colleague) => (
              <div
                key={colleague.id}
                className={`p-5 rounded-lg border transition-all ${
                  colleague.id === currentTeacher.id
                    ? 'border-emerald-500/50 bg-[#18181b] shadow-lg shadow-emerald-950/20'
                    : isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={colleague.avatar}
                      alt={colleague.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#27272a]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-white">{colleague.name}</h3>
                        {getRoleBadge(colleague.role)}
                      </div>
                      <p className="text-xs text-zinc-400">{colleague.subject}</p>
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{colleague.email}</p>
                    </div>
                  </div>

                  {colleague.id === currentTeacher.id && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Tài Khoản Hiện Tại
                    </span>
                  )}
                </div>

                {/* Class Assignment Badges */}
                <div className="mb-4">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block mb-1">Lớp Học Phụ Trách Giảng Dạy:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {colleague.assignedClassCodes.map(code => (
                      <span key={code} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#09090b] text-zinc-300 border border-[#27272a]">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Permission Matrix Toggles */}
                <div className="p-3 rounded bg-[#09090b] border border-[#27272a] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      Quyền Tải Bài Giảng & Tài Liệu:
                    </span>
                    <button
                      disabled={currentTeacher.role !== 'HEAD_TEACHER'}
                      onClick={() => onUpdatePermissions(colleague.id, { ...colleague.permissions, canUploadMaterials: !colleague.permissions.canUploadMaterials })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                        colleague.permissions.canUploadMaterials
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      {colleague.permissions.canUploadMaterials ? 'CHO PHÉP' : 'KHÓA'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-cyan-400" />
                      Quyền Giao Bài & Nhiệm Vụ Cho HS:
                    </span>
                    <button
                      disabled={currentTeacher.role !== 'HEAD_TEACHER'}
                      onClick={() => onUpdatePermissions(colleague.id, { ...colleague.permissions, canAssignTasks: !colleague.permissions.canAssignTasks })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                        colleague.permissions.canAssignTasks
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      {colleague.permissions.canAssignTasks ? 'CHO PHÉP' : 'KHÓA'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      Quyền Quản Lý Danh Sách HS:
                    </span>
                    <button
                      disabled={currentTeacher.role !== 'HEAD_TEACHER'}
                      onClick={() => onUpdatePermissions(colleague.id, { ...colleague.permissions, canManageStudents: !colleague.permissions.canManageStudents })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                        colleague.permissions.canManageStudents
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      {colleague.permissions.canManageStudents ? 'CHO PHÉP' : 'KHÓA'}
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Ngày tham gia: {colleague.joinedDate}</span>
                  {colleague.id !== currentTeacher.id && (
                    <button
                      onClick={() => onSelectTeacher(colleague)}
                      className="text-emerald-400 hover:underline font-mono text-xs cursor-pointer"
                    >
                      Đăng nhập hồ sơ này →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TEACHING MATERIALS & LECTURES REPOSITORY */}
      {subTab === 'MATERIALS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Tìm tài liệu, bài giảng..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  className={`pl-9 pr-3 py-2 rounded text-xs border focus:outline-none focus:border-emerald-500 ${
                    isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-white border-slate-300'
                  }`}
                />
              </div>

              <select
                value={materialGradeFilter}
                onChange={(e) => setMaterialGradeFilter(e.target.value)}
                className={`px-3 py-2 rounded text-xs border focus:outline-none focus:border-emerald-500 font-mono ${
                  isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-white border-slate-300'
                }`}
              >
                <option value="ALL">Tất cả Khối Lớp</option>
                <option value="10">Khối 10</option>
                <option value="11">Khối 11</option>
                <option value="12">Khối 12</option>
              </select>

              <select
                value={materialSubjectFilter}
                onChange={(e) => setMaterialSubjectFilter(e.target.value)}
                className={`px-3 py-2 rounded text-xs border focus:outline-none focus:border-emerald-500 font-mono ${
                  isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-white border-slate-300'
                }`}
              >
                <option value="ALL">Tất cả Môn Học</option>
                <option value="Vật Lý">Môn Vật Lý</option>
                <option value="Hóa Học">Môn Hóa Học</option>
                <option value="Sinh Học">Môn Sinh Học</option>
                <option value="Toán Học">Môn Toán Học</option>
                <option value="Chuyên Đề Liên Môn">Chuyên Đề Liên Môn</option>
                {availableSubjects.map(sub => (
                  !['Vật Lý', 'Hóa Học', 'Sinh Học', 'Toán Học', 'Chuyên Đề Liên Môn'].includes(sub) && (
                    <option key={sub} value={sub}>{sub}</option>
                  )
                ))}
              </select>

              <select
                value={materialFolderFilter}
                onChange={(e) => setMaterialFolderFilter(e.target.value)}
                className={`px-3 py-2 rounded text-xs border focus:outline-none focus:border-emerald-500 font-mono ${
                  isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-white border-slate-300'
                }`}
              >
                <option value="ALL">📁 Tất cả Thư Mục Con</option>
                {availableFolders.map(folder => (
                  <option key={folder} value={folder}>📁 {folder}</option>
                ))}
              </select>

              <select
                value={materialSubGroupFilter}
                onChange={(e) => setMaterialSubGroupFilter(e.target.value)}
                className={`px-3 py-2 rounded text-xs border focus:outline-none focus:border-emerald-500 font-mono ${
                  isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-white border-slate-300'
                }`}
              >
                <option value="ALL">👥 Tất cả các Tổ</option>
                <option value="Tổ 1">Tổ 1</option>
                <option value="Tổ 2">Tổ 2</option>
                <option value="Tổ 3">Tổ 3</option>
                <option value="Tổ 4">Tổ 4</option>
              </select>

              <select
                value={materialTypeFilter}
                onChange={(e) => setMaterialTypeFilter(e.target.value)}
                className={`px-3 py-2 rounded text-xs border focus:outline-none focus:border-emerald-500 font-mono ${
                  isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-white border-slate-300'
                }`}
              >
                <option value="ALL">Tất cả Loại Tài Liệu</option>
                <option value="SLIDE">Slide PowerPoint</option>
                <option value="DOCUMENT">Tài Liệu Đọc (PDF/Word)</option>
                <option value="WORKSHEET">Phiếu Bài Tập</option>
                <option value="VIDEO">Video Bài Giảng</option>
                <option value="LAB_GUIDE">Hướng Dẫn Thí Nghiệm</option>
              </select>
            </div>

            <button
              onClick={() => {
                if (!currentTeacher.permissions.canUploadMaterials) {
                  alert('Tài khoản của bạn chưa được cấp quyền Tải Tài Liệu. Vui lòng liên hệ Trưởng bộ môn.');
                  return;
                }
                setShowUploadModal(true);
              }}
              className="px-4 py-2 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Tải Lên Bài Giảng Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className={`p-5 rounded-lg border transition-all hover:border-emerald-500/40 ${
                  isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-[#09090b] border border-[#27272a]">
                      {getMaterialIcon(mat.type)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Lớp {mat.grade}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-1.5">
                        {mat.subjectName || 'Vật Lý'}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 ml-2">
                        {mat.type === 'SLIDE' ? 'Slide PPT' : mat.type === 'VIDEO' ? 'Video HD' : 'Tài liệu File'}
                      </span>
                    </div>
                  </div>

                  {mat.uploadedByTeacherId === currentTeacher.id && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Bạn có chắc chắn muốn XÓA bài giảng / tài liệu "${mat.title}" không?\n\nHành động này không thể phục hồi.`)) {
                          onDeleteMaterial(mat.id);
                        }
                      }}
                      className="p-1 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Xóa bài giảng/tài liệu không đạt yêu cầu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h3 className="font-bold text-sm text-white mb-1.5">{mat.title}</h3>
                <p className="text-xs text-zinc-400 mb-2 line-clamp-2">{mat.description}</p>

                <div className="p-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs font-mono space-y-1 mb-4">
                  <div className="flex justify-between text-zinc-400">
                    <span>📁 Thư mục con:</span>
                    <span className="text-amber-300 font-semibold">{mat.folderPath || 'Vật Lý 12/Thư Mục Chung'}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>👥 Dành cho Tổ:</span>
                    <span className="text-emerald-300 font-bold">
                      {mat.assignedSubGroups && mat.assignedSubGroups.length > 0 ? mat.assignedSubGroups.join(', ') : 'Tất cả các Tổ'}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Chuyên đề:</span>
                    <span className="text-zinc-200">{mat.topic}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Tải bởi giáo viên:</span>
                    <span className="text-emerald-400">{mat.uploadedByTeacherName}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-[11px] pt-1 border-t border-[#18181b]">
                    <span>File: {mat.fileName} ({mat.fileSize})</span>
                    <span>{mat.uploadedDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="text-[11px] text-zinc-500 font-mono">
                    👁 {mat.viewCount} lượt xem • 📥 {mat.downloadCount} lượt tải
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Đã tải xuống file: ${mat.fileName}`)}
                      className="px-3 py-1.5 rounded text-xs font-mono bg-[#09090b] text-zinc-300 hover:bg-zinc-800 border border-[#27272a] flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải về</span>
                    </button>

                    <button
                      onClick={() => handleOpenAssignModal(mat)}
                      className="px-3 py-1.5 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 cursor-pointer shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Giao Cho HS</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNED TASKS */}
      {subTab === 'TASKS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Nhiệm Vụ Đã Giao Cho Học Sinh & Các Lớp Phụ Trách
            </h3>

            <button
              onClick={() => handleOpenAssignModal()}
              className="px-4 py-2 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Giao Nhiệm Vụ Trực Tiếp</span>
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border transition-all ${
                  isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Lớp {task.targetClassCode}
                    </span>
                    {task.targetStudentName && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Giao riêng: {task.targetStudentName}
                      </span>
                    )}
                    <span className="text-xs text-zinc-400">Giao bởi: <strong className="text-zinc-200">{task.assignedByTeacherName}</strong></span>
                  </div>

                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Hạn chót: <strong className="text-amber-300">{task.dueDate}</strong>
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white mb-1">{task.title}</h4>
                {task.materialTitle && (
                  <p className="text-xs text-emerald-400 font-mono mb-2">
                    📎 Đính kèm tài liệu: {task.materialTitle}
                  </p>
                )}
                <p className="text-xs text-zinc-400 bg-[#09090b] p-2.5 rounded border border-[#27272a] mb-2">
                  {task.note}
                </p>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Khởi tạo lúc: {task.createdAt}</span>
                  <span className="text-emerald-400 font-bold">● Đã đồng bộ lên hệ thống LMS học sinh</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: INVITE COLLEAGUE */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-lg border p-6 shadow-2xl transition-colors ${
            isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-4 border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-base text-white">Mời Đồng Nghiệp / Giáo Viên Mới</h3>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="text-xs text-zinc-400 hover:text-white font-mono cursor-pointer">Đóng ✕</button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-300 mb-1">Họ & Tên Giáo Viên:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: ThS. Trần Thị Mai"
                  value={newColleagueName}
                  onChange={(e) => setNewColleagueName(e.target.value)}
                  className={`w-full p-2.5 rounded border focus:outline-none focus:border-emerald-500 ${
                    isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Email Công Tác / Đăng Nhập:</label>
                <input
                  type="email"
                  required
                  placeholder="VD: tranmaiphysics@school.edu.vn"
                  value={newColleagueEmail}
                  onChange={(e) => setNewColleagueEmail(e.target.value)}
                  className={`w-full p-2.5 rounded border focus:outline-none focus:border-emerald-500 ${
                    isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Chức Danh & Phân Quyền Vai Trò:</label>
                <select
                  value={newColleagueRole}
                  onChange={(e) => setNewColleagueRole(e.target.value as TeacherRole)}
                  className={`w-full p-2.5 rounded border ${isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-200' : 'bg-slate-50 border-slate-300'}`}
                >
                  <option value="CO_TEACHER">Giáo Viên Đồng Giảng Dạy (Co-Teacher)</option>
                  <option value="ASSISTANT">Trợ Giảng & Soạn Bài (Teaching Assistant)</option>
                  <option value="OBSERVER">Dự Giờ & Quản Lý Chất Lượng (Observer)</option>
                  <option value="HEAD_TEACHER">Trưởng Bộ Môn (Full Control)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Phụ Trách Lớp Học:</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {classList.map(cls => (
                    <label key={cls.code} className="flex items-center gap-1.5 bg-[#09090b] px-3 py-1.5 rounded border border-[#27272a] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newColleagueClasses.includes(cls.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewColleagueClasses([...newColleagueClasses, cls.code]);
                          } else {
                            setNewColleagueClasses(newColleagueClasses.filter(c => c !== cls.code));
                          }
                        }}
                        className="accent-emerald-500"
                      />
                      <span>{cls.code} - {cls.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded bg-[#09090b] border border-[#27272a] space-y-2">
                <span className="text-zinc-400 block font-bold mb-1">Chi Tiết Quyền Hạn Kích Hoạt:</span>
                <label className="flex items-center justify-between text-zinc-300 cursor-pointer">
                  <span>Quyền Tải Lên Bài Giảng & Tài Liệu</span>
                  <input
                    type="checkbox"
                    checked={newColleaguePerms.canUploadMaterials}
                    onChange={(e) => setNewColleaguePerms({ ...newColleaguePerms, canUploadMaterials: e.target.checked })}
                    className="accent-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between text-zinc-300 cursor-pointer">
                  <span>Quyền Giao Bài Tập & Nhiệm Vụ Cho Học Sinh</span>
                  <input
                    type="checkbox"
                    checked={newColleaguePerms.canAssignTasks}
                    onChange={(e) => setNewColleaguePerms({ ...newColleaguePerms, canAssignTasks: e.target.checked })}
                    className="accent-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between text-zinc-300 cursor-pointer">
                  <span>Quyền Quản Lý Học Sinh Trong Lớp</span>
                  <input
                    type="checkbox"
                    checked={newColleaguePerms.canManageStudents}
                    onChange={(e) => setNewColleaguePerms({ ...newColleaguePerms, canManageStudents: e.target.checked })}
                    className="accent-emerald-500"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded text-xs font-mono bg-[#09090b] text-zinc-300 hover:bg-zinc-800 border border-[#27272a] cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-mono font-bold bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer shadow"
                >
                  Kích Hoạt & Gửi Lời Mời
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD MATERIAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-xl rounded-lg border p-6 shadow-2xl transition-colors ${
            isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-4 border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-base text-white">Tải Lên Bài Giảng / Tài Liệu Mới</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-xs text-zinc-400 hover:text-white font-mono cursor-pointer">Đóng ✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-300 mb-1">Tên Bài Giảng / Tài Liệu:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Slide Bài Giảng: Sóng Ánh Sáng & Giao Thoa Y-ăng"
                  value={newMatTitle}
                  onChange={(e) => setNewMatTitle(e.target.value)}
                  className={`w-full p-2.5 rounded border focus:outline-none focus:border-emerald-500 ${
                    isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Môn Học:</label>
                  <select
                    value={newMatSubject}
                    onChange={(e) => setNewMatSubject(e.target.value)}
                    className={`w-full p-2.5 rounded border ${isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-200' : 'bg-slate-50 border-slate-300'}`}
                  >
                    <option value="Vật Lý">Vật Lý</option>
                    <option value="Hóa Học">Hóa Học</option>
                    <option value="Sinh Học">Sinh Học</option>
                    <option value="Toán Học">Toán Học</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Chuyên Đề Liên Môn">Chuyên Đề Liên Môn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">Loại Tài Liệu:</label>
                  <select
                    value={newMatType}
                    onChange={(e) => setNewMatType(e.target.value as MaterialType)}
                    className={`w-full p-2.5 rounded border ${isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-200' : 'bg-slate-50 border-slate-300'}`}
                  >
                    <option value="SLIDE">Slide Presentation (.pptx)</option>
                    <option value="DOCUMENT">Tài Liệu Đọc (.pdf, .docx)</option>
                    <option value="WORKSHEET">Phiếu Bài Tập (.pdf)</option>
                    <option value="VIDEO">Video Bài Giảng (.mp4)</option>
                    <option value="LAB_GUIDE">Hướng Dẫn Thí Nghiệm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Khối Lớp:</label>
                  <select
                    value={newMatGrade}
                    onChange={(e) => {
                      const g = Number(e.target.value) as GradeLevel;
                      setNewMatGrade(g);
                      setNewMatTopic(PHYSICS_TOPICS_BY_GRADE[g][0]);
                    }}
                    className={`w-full p-2.5 rounded border ${isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-200' : 'bg-slate-50 border-slate-300'}`}
                  >
                    <option value={10}>Lớp 10</option>
                    <option value={11}>Lớp 11</option>
                    <option value={12}>Lớp 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">Phân Nhóm / Tổ Học Sinh:</label>
                  <select
                    value={newMatSubGroup}
                    onChange={(e) => setNewMatSubGroup(e.target.value)}
                    className={`w-full p-2.5 rounded border ${isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-200' : 'bg-slate-50 border-slate-300'}`}
                  >
                    <option value="Tất cả các Tổ">Tất cả các Tổ trong Lớp</option>
                    <option value="Tổ 1">Chỉ Tổ 1</option>
                    <option value="Tổ 2">Chỉ Tổ 2</option>
                    <option value="Tổ 3">Chỉ Tổ 3</option>
                    <option value="Tổ 4">Chỉ Tổ 4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Thư Mục Con Lưu Trữ (Folder Path):</label>
                <input
                  type="text"
                  placeholder="VD: Vật Lý 12/Chương 1: Nhiệt Học/Thực Hành"
                  value={newMatFolder}
                  onChange={(e) => setNewMatFolder(e.target.value)}
                  className={`w-full p-2.5 rounded border focus:outline-none focus:border-emerald-500 ${
                    isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Chuyên Đề Vật Lý GDPT 2018:</label>
                <select
                  value={newMatTopic}
                  onChange={(e) => setNewMatTopic(e.target.value)}
                  className={`w-full p-2.5 rounded border ${isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-200' : 'bg-slate-50 border-slate-300'}`}
                >
                  {PHYSICS_TOPICS_BY_GRADE[newMatGrade].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Simulated File Dropzone */}
              <div>
                <label className="block text-zinc-300 mb-1">Tập Tin Tải Lên (PowerPoint, PDF, Word, MP4):</label>
                <div className="border-2 border-dashed border-[#27272a] hover:border-emerald-500/50 rounded-lg p-4 text-center bg-[#09090b] transition-all relative cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileSelectSimulated}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  <p className="text-zinc-300 font-semibold">Kéo thả file bài giảng vào đây hoặc click để chọn</p>
                  <p className="text-zinc-500 text-[10px] mt-0.5">Hỗ trợ .pptx, .pdf, .docx, .mp4 (Tối đa 200MB)</p>
                  {newMatFileName && (
                    <div className="mt-2 text-emerald-400 font-bold bg-emerald-500/10 py-1 px-2 rounded border border-emerald-500/20 inline-block">
                      ✓ Đã chọn: {newMatFileName} ({newMatFileSize})
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Mô Tả Bài Giảng / Ghi Chú:</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả tóm tắt nội dung chính hoặc dặn dò cho học sinh..."
                  value={newMatDesc}
                  onChange={(e) => setNewMatDesc(e.target.value)}
                  className={`w-full p-2.5 rounded border focus:outline-none focus:border-emerald-500 ${
                    isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded text-xs font-mono bg-[#09090b] text-zinc-300 hover:bg-zinc-800 border border-[#27272a] cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 rounded text-xs font-mono font-bold bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer shadow"
                >
                  {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{isUploading ? 'Đang Tải Lên...' : 'Đăng Bài Giảng Lên Kho'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGN TASK TO STUDENTS */}
      {showAssignTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-lg border p-6 shadow-2xl transition-colors ${
            isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-4 border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-base text-white">Giao Nhiệm Vụ & Bài Giảng Cho Học Sinh</h3>
              </div>
              <button onClick={() => setShowAssignTaskModal(false)} className="text-xs text-zinc-400 hover:text-white font-mono cursor-pointer">Đóng ✕</button>
            </div>

            <form onSubmit={handleAssignTaskSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-300 mb-1">Tên Nhiệm Vụ:</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className={`w-full p-2.5 rounded border focus:outline-none focus:border-emerald-500 ${
                    isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              {selectedMaterialForTask && (
                <div className="p-2.5 rounded bg-[#09090b] border border-emerald-500/30 text-emerald-300">
                  <span className="font-bold">Đính kèm bài giảng:</span> {selectedMaterialForTask.title}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Lớp Nhận Bài:</label>
                  <select
                    value={taskClassCode}
                    onChange={(e) => setTaskClassCode(e.target.value)}
                    className={`w-full p-2.5 rounded border ${isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-200' : 'bg-slate-50 border-slate-300'}`}
                  >
                    {classList.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">Hạn Chót Nộp / Đọc:</label>
                  <input
                    type="text"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className={`w-full p-2.5 rounded border focus:outline-none focus:border-emerald-500 ${
                      isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Giao Cho Học Sinh Cụ Thể (Để trống nếu giao toàn lớp):</label>
                <input
                  type="text"
                  placeholder="VD: Nguyễn Hoàng Nam (hoặc để trống cho toàn lớp)"
                  value={taskStudentName}
                  onChange={(e) => setTaskStudentName(e.target.value)}
                  className={`w-full p-2.5 rounded border focus:outline-none focus:border-emerald-500 ${
                    isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Hướng Dẫn & Ghi Chú:</label>
                <textarea
                  rows={2}
                  placeholder="Nhập yêu cầu chi tiết của giáo viên..."
                  value={taskNote}
                  onChange={(e) => setTaskNote(e.target.value)}
                  className={`w-full p-2.5 rounded border focus:outline-none focus:border-emerald-500 ${
                    isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignTaskModal(false)}
                  className="px-4 py-2 rounded text-xs font-mono bg-[#09090b] text-zinc-300 hover:bg-zinc-800 border border-[#27272a] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-mono font-bold bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer shadow"
                >
                  Xác Nhận Giao Nhiệm Vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
