import React, { useState } from 'react';
import { UserRole, ClassRoom, StudentProfile, Question, SubmissionResult, ColleagueTeacher, TeachingMaterial, AssignedTask, HonorAward, OnlineDatabaseConfig } from './types';
import { MOCK_CLASSES, CURRENT_STUDENT, MOCK_QUESTIONS, MOCK_SUBMISSIONS, SAMPLE_EXAM_MATRIX, MOCK_COLLEAGUES, MOCK_MATERIALS, MOCK_TASKS, MOCK_STUDENTS, MOCK_HONOR_AWARDS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { SmartGradingOCR } from './components/SmartGradingOCR';
import { PhysicsSimulations } from './components/PhysicsSimulations';
import { QuestionBank } from './components/QuestionBank';
import { TeacherCollaboration } from './components/TeacherCollaboration';
import { StudentManagement } from './components/StudentManagement';
import { StudentHonorRoll } from './components/StudentHonorRoll';
import { StudentLoginModal } from './components/StudentLoginModal';
import { ExportPluginModal } from './components/ExportPluginModal';
import { OnlineDatabaseModal } from './components/OnlineDatabaseModal';
import { WebResourceAndVideoHub } from './components/WebResourceAndVideoHub';
import { PhysicsQuizGameModal } from './components/PhysicsQuizGameModal';
import { PhysicsAITutorModal } from './components/PhysicsAITutorModal';
import { PhysicsAnalyticsDashboard } from './components/PhysicsAnalyticsDashboard';
import { TopicMediaSearchHub } from './components/TopicMediaSearchHub';
import { PhysicsAISolverModal } from './components/PhysicsAISolverModal';
import { UserProfileEditModal } from './components/UserProfileEditModal';
import { GeminiApiKeyModal } from './components/GeminiApiKeyModal';
import { getStoredApiKey } from './utils/geminiClient';
import { LayoutDashboard, Camera, Activity, BookOpen, Users, UserPlus, Trophy, Crown, Video, Globe, Database, Gamepad2, BrainCircuit, BarChart3, Search, Lightbulb } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<UserRole>('TEACHER');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'HONOR' | 'OCR' | 'LAB' | 'BANK' | 'COLLABORATION' | 'STUDENT_MGMT' | 'WEB_RESOURCES' | 'ANALYTICS' | 'TOPIC_SEARCH'>('DASHBOARD');

  // State Management
  const [classList, setClassList] = useState<ClassRoom[]>(MOCK_CLASSES);
  const [activeClass, setActiveClass] = useState<ClassRoom>(MOCK_CLASSES[0]);
  const [students, setStudents] = useState<StudentProfile[]>(MOCK_STUDENTS);
  const [student, setStudent] = useState<StudentProfile>(CURRENT_STUDENT);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [submissions, setSubmissions] = useState<SubmissionResult[]>(MOCK_SUBMISSIONS);
  const [awards, setAwards] = useState<HonorAward[]>(MOCK_HONOR_AWARDS);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showStudentLoginModal, setShowStudentLoginModal] = useState<boolean>(false);
  const [showQuizGameModal, setShowQuizGameModal] = useState<boolean>(false);
  const [showAITutorModal, setShowAITutorModal] = useState<boolean>(false);
  const [showAISolverModal, setShowAISolverModal] = useState<boolean>(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState<boolean>(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(!getStoredApiKey());

  // Online Database & Video/Web Hub States
  const [showOnlineDbModal, setShowOnlineDbModal] = useState<boolean>(false);
  const [dbConfig, setDbConfig] = useState<OnlineDatabaseConfig>({
    endpointUrl: '/api/database/classes',
    dbType: 'CLOUD_REST',
    status: 'CONNECTED',
    lastSyncedAt: new Date().toLocaleTimeString('vi-VN'),
    autoSync: true
  });

  // Co-Teacher Collaboration States
  const [colleagues, setColleagues] = useState<ColleagueTeacher[]>(MOCK_COLLEAGUES);
  const [currentTeacher, setCurrentTeacher] = useState<ColleagueTeacher>(MOCK_COLLEAGUES[0]);
  const [materials, setMaterials] = useState<TeachingMaterial[]>(MOCK_MATERIALS);
  const [tasks, setTasks] = useState<AssignedTask[]>(MOCK_TASKS);

  // Student Management Handlers
  const handleAddStudent = (newStudent: StudentProfile) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: StudentProfile) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const handleSelectStudentForLogin = (selectedStudent: StudentProfile) => {
    setStudent(selectedStudent);
    setRole('STUDENT');
    setShowStudentLoginModal(false);
  };

  // Questions Handlers
  const handleAddQuestion = (q: Question) => {
    setQuestions(prev => [q, ...prev]);
  };

  const handleAddMultipleQuestions = (qs: Question[]) => {
    setQuestions(prev => [...qs, ...prev]);
  };

  // Submissions Handler
  const handleSubmissionGraded = (result: SubmissionResult) => {
    setSubmissions(prev => [result, ...prev]);
    setStudents(prev => prev.map(s => {
      if (s.id === result.studentId) {
        return {
          ...s,
          xp: s.xp + Math.round(result.score * 10),
          level: Math.floor((s.xp + Math.round(result.score * 10)) / 100) + 1
        };
      }
      return s;
    }));
  };

  // Collaboration Handlers
  const handleAddColleague = (newColleague: ColleagueTeacher) => {
    setColleagues(prev => [...prev, newColleague]);
  };

  const handleUpdatePermissions = (teacherId: string, perms: ColleagueTeacher['permissions']) => {
    setColleagues(prev => prev.map(c => c.id === teacherId ? { ...c, permissions: perms } : c));
  };

  const handleAddMaterial = (newMat: TeachingMaterial) => {
    setMaterials(prev => [newMat, ...prev]);
  };

  const handleDeleteMaterial = (materialId: string) => {
    setMaterials(prev => prev.filter(m => m.id !== materialId));
  };

  const handleUpdateMaterial = (updatedMat: TeachingMaterial) => {
    setMaterials(prev => prev.map(m => m.id === updatedMat.id ? updatedMat : m));
  };

  const handleAddTask = (newTask: AssignedTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleAddAward = (award: HonorAward) => {
    setAwards(prev => [award, ...prev]);
  };

  const handleDeleteAward = (awardId: string) => {
    setAwards(prev => prev.filter(a => a.id !== awardId));
  };

  const handleCompleteStudentTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'COMPLETED' } : t));
    setStudent(prev => ({ ...prev, xp: prev.xp + 50 }));
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-200 ${
      isDarkMode ? 'bg-[#0c0c0e] text-zinc-100' : 'bg-[#f8fafc] text-slate-800'
    }`}>
      
      {/* Top Portal Navigation Bar (HCM-EDU Style) */}
      <Navbar
        role={role}
        onToggleRole={() => setRole(role === 'TEACHER' ? 'STUDENT' : 'TEACHER')}
        activeClass={activeClass}
        classList={classList}
        onSelectClass={setActiveClass}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        studentXp={student.xp}
        studentStreak={student.streakDays}
        currentStudent={student}
        currentTeacher={currentTeacher}
        onOpenStudentLogin={() => setShowStudentLoginModal(true)}
        onOpenOnlineDb={() => setShowOnlineDbModal(true)}
        onOpenProfileEdit={() => setShowProfileEditModal(true)}
        onOpenApiKeyModal={() => setShowApiKeyModal(true)}
        isDbConnected={dbConfig.status === 'CONNECTED'}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQuizGame={() => setShowQuizGameModal(true)}
        onOpenAITutor={() => setShowAITutorModal(true)}
        onOpenAISolver={() => setShowAISolverModal(true)}
      />

      {/* Main Portal Body (3-Column Layout: Left Category | Main Area | Right Highlights) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CỘT TRÁI (LEFT SIDEBAR) - DANH MỤC CHỨC NĂNG CHUẨN PORTAL SỞ GD&ĐT */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className={`rounded-md border overflow-hidden shadow-xs ${
              isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              
              {/* Header Cột Trái với gạch đỏ chỉ thị chuẩn Portal */}
              <div className={`p-3.5 border-b flex items-center gap-2 font-bold text-sm uppercase tracking-wide ${
                isDarkMode ? 'border-slate-800 text-slate-100 bg-slate-900' : 'border-slate-200 text-slate-900 bg-slate-50'
              }`}>
                <span className="w-1.5 h-4 bg-[#cb1c24] rounded-full inline-block" />
                <span className="text-[#cb1c24] font-extrabold">DANH MỤC</span> CHỨC NĂNG
              </div>

              {/* Menu Danh Mục Dọc Accordion Style */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                
                <button
                  onClick={() => setActiveTab('DASHBOARD')}
                  className={`w-full text-left p-3 flex items-center justify-between transition-colors cursor-pointer ${
                    activeTab === 'DASHBOARD'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-[#cb1c24] font-extrabold border-l-4 border-[#cb1c24]'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>CHUYỂN ĐỔI SỐ GIÁO DỤC</span>
                  <span className="text-slate-400">›</span>
                </button>

                <button
                  onClick={() => setActiveTab('TOPIC_SEARCH')}
                  className={`w-full text-left p-3 flex items-center justify-between transition-colors cursor-pointer ${
                    activeTab === 'TOPIC_SEARCH'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-[#cb1c24] font-extrabold border-l-4 border-[#cb1c24]'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>CT PHỔ THÔNG 2018 - THPT VẬT LÍ</span>
                  <span className="text-slate-400">›</span>
                </button>

                <button
                  onClick={() => setActiveTab('WEB_RESOURCES')}
                  className={`w-full text-left p-3 flex items-center justify-between transition-colors cursor-pointer ${
                    activeTab === 'WEB_RESOURCES'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-[#cb1c24] font-extrabold border-l-4 border-[#cb1c24]'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>KHO VIDEO & TÀI LIỆU MẠNG</span>
                  <span className="text-slate-400">›</span>
                </button>

                <button
                  onClick={() => setActiveTab('LAB')}
                  className={`w-full text-left p-3 flex items-center justify-between transition-colors cursor-pointer ${
                    activeTab === 'LAB'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-[#cb1c24] font-extrabold border-l-4 border-[#cb1c24]'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>PHÒNG THÍ NGHIỆM ẢO LMS360</span>
                  <span className="text-slate-400">›</span>
                </button>

                <button
                  onClick={() => setShowQuizGameModal(true)}
                  className="w-full text-left p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 text-[#cb1c24] font-bold cursor-pointer"
                >
                  <span>MINIGAME 1V1 & SPEED RUN</span>
                  <span className="text-rose-500">⚡</span>
                </button>

                <button
                  onClick={() => setShowAITutorModal(true)}
                  className="w-full text-left p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 text-emerald-600 font-bold cursor-pointer"
                >
                  <span>AI PHYSICS TUTOR 24/7</span>
                  <span className="text-emerald-500">🤖</span>
                </button>

                <button
                  onClick={() => setShowAISolverModal(true)}
                  className="w-full text-left p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 text-purple-600 font-bold cursor-pointer"
                >
                  <span>AI GIẢI BÀI & RÚT BÀI HỌC</span>
                  <span className="text-purple-500">🧠</span>
                </button>

                {role === 'TEACHER' && (
                  <>
                    <button
                      onClick={() => setActiveTab('STUDENT_MGMT')}
                      className={`w-full text-left p-3 flex items-center justify-between transition-colors cursor-pointer ${
                        activeTab === 'STUDENT_MGMT'
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-[#cb1c24] font-extrabold border-l-4 border-[#cb1c24]'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>QUẢN LÝ HỌC SINH ({students.length})</span>
                      <span className="text-slate-400">›</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('COLLABORATION')}
                      className={`w-full text-left p-3 flex items-center justify-between transition-colors cursor-pointer ${
                        activeTab === 'COLLABORATION'
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-[#cb1c24] font-extrabold border-l-4 border-[#cb1c24]'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>PHÂN QUYỀN ĐỒNG NGHIỆP</span>
                      <span className="text-slate-400">›</span>
                    </button>
                  </>
                )}

              </div>
            </div>

            {/* Quick Status Card */}
            <div className={`p-4 rounded-md border text-xs space-y-2 ${
              isDarkMode ? 'bg-[#0f172a] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sky-700 dark:text-sky-400">
                <Database className="w-4 h-4" />
                <span>TRẠNG THÁI HỆ THỐNG</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                • Mã phòng: <span className="font-bold text-[#cb1c24]">{activeClass.code}</span><br />
                • Đã kết nối DB: <span className="font-bold text-emerald-600">THÀNH CÔNG</span><br />
                • Học sinh online: <span className="font-bold text-sky-600">{students.length} em</span>
              </p>
            </div>

          </div>

          {/* CỘT GIỮA (CENTER CONTENT AREA - 6 COLS) */}
          <div className="lg:col-span-6 space-y-6">
            {activeTab === 'DASHBOARD' && (
              role === 'TEACHER' ? (
                <TeacherDashboard
                  isDarkMode={isDarkMode}
                  activeClass={activeClass}
                  submissions={submissions}
                  onOpenOCR={() => setActiveTab('OCR')}
                  onOpenExportModal={() => setShowExportModal(true)}
                  onOpenCollaboration={() => setActiveTab('COLLABORATION')}
                  onOpenHonorRoll={() => setActiveTab('HONOR')}
                />
              ) : (
                <StudentDashboard
                  isDarkMode={isDarkMode}
                  student={student}
                  questions={questions}
                  assignedTasks={tasks}
                  materials={materials}
                  submissions={submissions}
                  onCompleteTask={handleCompleteStudentTask}
                  onOpenHonorRoll={() => setActiveTab('HONOR')}
                />
              )
            )}

            {activeTab === 'TOPIC_SEARCH' && (
              <TopicMediaSearchHub
                isDarkMode={isDarkMode}
                materials={materials}
                questions={questions}
              />
            )}

            {activeTab === 'WEB_RESOURCES' && (
              <WebResourceAndVideoHub
                isDarkMode={isDarkMode}
                materials={materials}
                currentTeacher={currentTeacher}
                onAddMaterial={handleAddMaterial}
                onDeleteMaterial={handleDeleteMaterial}
                onUpdateMaterial={handleUpdateMaterial}
                onAssignTask={(mat) => {
                  handleAddTask({
                    id: `task_${Date.now()}`,
                    title: `Giao học liệu video/web: ${mat.title}`,
                    materialId: mat.id,
                    materialTitle: mat.title,
                    assignedByTeacherName: currentTeacher.name,
                    assignedByTeacherId: currentTeacher.id,
                    targetClassCode: activeClass.code,
                    dueDate: '2026-08-15 23:59',
                    note: 'Vui lòng xem kỹ video / bài đọc và ghi chép kiến thức trọng tâm.',
                    status: 'OPEN',
                    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
                  });
                  alert(`Đã giao tài liệu "${mat.title}" cho lớp ${activeClass.code}!`);
                }}
              />
            )}

            {activeTab === 'HONOR' && (
              <StudentHonorRoll
                isDarkMode={isDarkMode}
                role={role}
                awards={awards}
                students={students}
                classList={classList}
                activeClass={activeClass}
                onAddAward={handleAddAward}
                onDeleteAward={handleDeleteAward}
              />
            )}

            {activeTab === 'STUDENT_MGMT' && role === 'TEACHER' && (
              <StudentManagement
                isDarkMode={isDarkMode}
                students={students}
                classList={classList}
                colleagues={colleagues}
                submissions={submissions}
                materials={materials}
                questions={questions}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onSelectStudentForLogin={handleSelectStudentForLogin}
                onAssignTask={handleAddTask}
                onOpenOnlineDb={() => setShowOnlineDbModal(true)}
              />
            )}

            {activeTab === 'COLLABORATION' && role === 'TEACHER' && (
              <TeacherCollaboration
                isDarkMode={isDarkMode}
                classList={classList}
                colleagues={colleagues}
                materials={materials}
                tasks={tasks}
                currentTeacher={currentTeacher}
                onSelectTeacher={setCurrentTeacher}
                onAddColleague={handleAddColleague}
                onUpdatePermissions={handleUpdatePermissions}
                onAddMaterial={handleAddMaterial}
                onDeleteMaterial={handleDeleteMaterial}
                onUpdateMaterial={handleUpdateMaterial}
                onAddTask={handleAddTask}
              />
            )}

            {activeTab === 'OCR' && (
              <SmartGradingOCR
                isDarkMode={isDarkMode}
                questions={questions}
                submissions={submissions}
                onSubmissionGraded={handleSubmissionGraded}
              />
            )}

            {activeTab === 'LAB' && (
              <PhysicsSimulations isDarkMode={isDarkMode} />
            )}

            {activeTab === 'ANALYTICS' && (
              <PhysicsAnalyticsDashboard
                isDarkMode={isDarkMode}
                students={students}
                submissions={submissions}
                classList={classList}
              />
            )}

            {activeTab === 'BANK' && (
              <QuestionBank
                isDarkMode={isDarkMode}
                questions={questions}
                onAddQuestion={handleAddQuestion}
                onAddMultipleQuestions={handleAddMultipleQuestions}
              />
            )}
          </div>

          {/* CỘT PHẢI (RIGHT SIDEBAR) - TIÊU ĐIỂM & VINH DANH CHUẨN PORTAL */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className={`rounded-md border overflow-hidden shadow-xs ${
              isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              
              {/* Header Cột Phải */}
              <div className={`p-3.5 border-b flex items-center gap-2 font-bold text-sm uppercase tracking-wide ${
                isDarkMode ? 'border-slate-800 text-slate-100 bg-slate-900' : 'border-slate-200 text-slate-900 bg-slate-50'
              }`}>
                <span className="w-1.5 h-4 bg-[#cb1c24] rounded-full inline-block" />
                <span className="text-[#cb1c24] font-extrabold">TIÊU ĐIỂM</span> & THÔNG BÁO
              </div>

              {/* List of News & Honor Roll Highlights */}
              <div className="p-3.5 space-y-3.5 text-xs">
                
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-[#cb1c24] dark:bg-rose-950 dark:text-rose-300">
                    THÔNG BÁO TỪ SỞ GD&ĐT
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#cb1c24] cursor-pointer leading-snug">
                    Hướng dẫn thực hiện chương trình GDPT 2018 môn Vật lý năm học 2026 - 2027
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    Áp dụng ma trận đề thi 4 mức độ tư duy: Nhận biết, Thông hiểu, Vận dụng và Vận dụng cao.
                  </p>
                </div>

                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    🏆 VINH DANH TOP HỌC SINH
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    Vinh danh em Nguyễn Văn Đức đạt điểm 10 tuyệt đối môn Vật lý
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Lớp 12A1 • Hoàn thành xuất sắc bộ 50 câu hỏi ôn thi GDPT.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    🤖 AI GAP ALERT
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    Phát hiện 03 học sinh cần bổ trợ phần Dao động điều hòa
                  </h4>
                  <button
                    onClick={() => setActiveTab('DASHBOARD')}
                    className="w-full py-1.5 rounded text-[11px] font-bold bg-[#cb1c24] hover:bg-[#b91c1c] text-white transition-colors cursor-pointer mt-1"
                  >
                    🚀 Xem Báo Cáo AI Chi Tiết
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Student Authentication Modal */}
      <StudentLoginModal
        isDarkMode={isDarkMode}
        isOpen={showStudentLoginModal}
        onClose={() => setShowStudentLoginModal(false)}
        students={students}
        onLoginSuccess={handleSelectStudentForLogin}
      />

      {/* External Connectors Modal */}
      <ExportPluginModal
        isDarkMode={isDarkMode}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        examMatrix={SAMPLE_EXAM_MATRIX}
        questions={questions}
      />

      {/* Online Database Sync & Link Modal */}
      <OnlineDatabaseModal
        isDarkMode={isDarkMode}
        isOpen={showOnlineDbModal}
        onClose={() => setShowOnlineDbModal(false)}
        classList={classList}
        students={students}
        onUpdateClassList={setClassList}
        onUpdateStudents={setStudents}
        dbConfig={dbConfig}
        onUpdateDbConfig={setDbConfig}
      />

      {/* Minigame Quiz 1v1 & Speed Run Modal */}
      <PhysicsQuizGameModal
        isDarkMode={isDarkMode}
        isOpen={showQuizGameModal}
        onClose={() => setShowQuizGameModal(false)}
        student={student}
        onUpdateXp={(xp) => setStudent(prev => ({ ...prev, xp: prev.xp + xp }))}
      />

      {/* Socratic AI Physics Tutor Modal */}
      <PhysicsAITutorModal
        isDarkMode={isDarkMode}
        isOpen={showAITutorModal}
        onClose={() => setShowAITutorModal(false)}
        student={student}
      />

      {/* AI Physics Problem Solver & Diagnostic Advisor Modal */}
      <PhysicsAISolverModal
        isDarkMode={isDarkMode}
        isOpen={showAISolverModal}
        onClose={() => setShowAISolverModal(false)}
      />

      {/* User Profile & Avatar Edit Modal */}
      <UserProfileEditModal
        isDarkMode={isDarkMode}
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        role={role}
        currentTeacher={currentTeacher}
        currentStudent={student}
        onSaveTeacherProfile={(upd) => setCurrentTeacher(upd)}
        onSaveStudentProfile={(upd) => setStudent(upd)}
      />

      {/* Gemini API Key & Model Configuration Modal */}
      <GeminiApiKeyModal
        isDarkMode={isDarkMode}
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        isMandatory={!getStoredApiKey()}
      />

    </div>
  );
}
