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
      
      {/* Top Application Navigation Bar */}
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
      />

      {/* Primary Section Navigation Tabs */}
      <div className={`border-b sticky top-16 z-40 ${
        isDarkMode ? 'bg-[#0c0c0e]/95 border-[#27272a] backdrop-blur-md' : 'bg-white/95 border-slate-200/90 backdrop-blur-md shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5 text-xs font-mono">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
              activeTab === 'DASHBOARD'
                ? (isDarkMode ? 'bg-[#18181b] text-white border border-emerald-500/40 shadow-sm' : 'bg-teal-700 text-white font-bold shadow-sm')
                : (isDarkMode ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40' : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200')
            }`}
          >
            <LayoutDashboard className={`w-3.5 h-3.5 ${activeTab === 'DASHBOARD' ? (isDarkMode ? 'text-emerald-500' : 'text-white') : ''}`} />
            <span>{role === 'TEACHER' ? 'LMS Core Engine' : 'Lộ Trình Cá Nhân'}</span>
          </button>

          {/* Global Topic & Media Search Tab */}
          <button
            onClick={() => setActiveTab('TOPIC_SEARCH')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'TOPIC_SEARCH'
                ? (isDarkMode ? 'bg-emerald-600 text-white border border-emerald-400 shadow-md' : 'bg-emerald-600 text-white shadow-sm')
                : (isDarkMode ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30' : 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100')
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>🔍 Tra Cứu Bài Học 4-in-1</span>
          </button>

          {/* Web Resources & Embedded Videos Tab */}
          <button
            onClick={() => setActiveTab('WEB_RESOURCES')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'WEB_RESOURCES'
                ? (isDarkMode ? 'bg-rose-600 text-white border border-rose-400 shadow-md' : 'bg-rose-600 text-white shadow-sm')
                : (isDarkMode ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30' : 'text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100')
            }`}
          >
            <Video className="w-3.5 h-3.5 fill-current" />
            <span>📺 Kho Video & Tài Liệu Mạng</span>
          </button>

          {/* Honor Roll Tab */}
          <button
            onClick={() => setActiveTab('HONOR')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'HONOR'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 border border-amber-300 shadow-sm'
                : (isDarkMode ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30' : 'text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100')
            }`}
          >
            <Trophy className={`w-3.5 h-3.5 ${activeTab === 'HONOR' ? 'text-slate-900 fill-slate-900' : 'fill-current'}`} />
            <span>🏆 Vinh Danh Tiêu Biểu ({awards.length})</span>
          </button>

          {role === 'TEACHER' && (
            <>
              <button
                onClick={() => setActiveTab('STUDENT_MGMT')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
                  activeTab === 'STUDENT_MGMT'
                    ? (isDarkMode ? 'bg-[#18181b] text-white border border-emerald-500/40 shadow-sm font-bold' : 'bg-teal-700 text-white font-bold shadow-sm')
                    : (isDarkMode ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40' : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200')
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Quản Lý Học Sinh & Tài Khoản ({students.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('COLLABORATION')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
                  activeTab === 'COLLABORATION'
                    ? (isDarkMode ? 'bg-[#18181b] text-white border border-emerald-500/40 shadow-sm' : 'bg-teal-700 text-white font-bold shadow-sm')
                    : (isDarkMode ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40' : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200')
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Phân Quyền & Kho Bài Giảng ({colleagues.length})</span>
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('OCR')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
              activeTab === 'OCR'
                ? (isDarkMode ? 'bg-[#18181b] text-white border border-emerald-500/40 shadow-sm' : 'bg-teal-700 text-white font-bold shadow-sm')
                : (isDarkMode ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40' : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200')
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Smart Grading (OCR)</span>
          </button>

          <button
            onClick={() => setActiveTab('LAB')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
              activeTab === 'LAB'
                ? (isDarkMode ? 'bg-[#18181b] text-white border border-emerald-500/40 shadow-sm' : 'bg-teal-700 text-white font-bold shadow-sm')
                : (isDarkMode ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40' : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200')
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Phòng Thí Nghiệm Ảo</span>
          </button>

          {/* Analytics Radar & Heatmap Tab */}
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'ANALYTICS'
                ? (isDarkMode ? 'bg-cyan-600 text-white border border-cyan-400 shadow-md' : 'bg-cyan-600 text-white shadow-sm')
                : (isDarkMode ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30' : 'text-cyan-700 bg-cyan-50 border border-cyan-200 hover:bg-cyan-100')
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>📊 Báo Cáo Radar & Heatmap</span>
          </button>

          {/* Minigame Quiz Trigger */}
          <button
            onClick={() => setShowQuizGameModal(true)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              isDarkMode ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30' : 'text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 animate-bounce" />
            <span>🎮 Minigame 1v1 & Speed Run</span>
          </button>

          {/* AI Physics Tutor Trigger */}
          <button
            onClick={() => setShowAITutorModal(true)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              isDarkMode ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30' : 'text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
            <span>🤖 AI Physics Tutor 24/7</span>
          </button>

          {/* AI Problem Solver & Diagnostic Advisor Trigger */}
          <button
            onClick={() => setShowAISolverModal(true)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              isDarkMode ? 'text-purple-400 bg-purple-500/10 border border-purple-500/30' : 'text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>🧠 AI Giải Bài & Rút Bài Học</span>
          </button>

          <button
            onClick={() => setActiveTab('BANK')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
              activeTab === 'BANK'
                ? (isDarkMode ? 'bg-[#18181b] text-white border border-emerald-500/40 shadow-sm' : 'bg-teal-700 text-white font-bold shadow-sm')
                : (isDarkMode ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40' : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200')
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ngân Hàng Câu Hỏi GDPT</span>
          </button>
        </div>
      </div>

      {/* Main Container Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
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

        {activeTab === 'WEB_RESOURCES' && (
          <WebResourceAndVideoHub
            isDarkMode={isDarkMode}
            materials={materials}
            currentTeacher={currentTeacher}
            onAddMaterial={handleAddMaterial}
            onDeleteMaterial={handleDeleteMaterial}
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

        {activeTab === 'BANK' && (
          <QuestionBank
            isDarkMode={isDarkMode}
            questions={questions}
            onAddQuestion={handleAddQuestion}
            onAddMultipleQuestions={handleAddMultipleQuestions}
          />
        )}

        {activeTab === 'ANALYTICS' && (
          <PhysicsAnalyticsDashboard
            isDarkMode={isDarkMode}
            students={students}
            submissions={submissions}
            classList={classList}
          />
        )}

        {activeTab === 'TOPIC_SEARCH' && (
          <TopicMediaSearchHub
            isDarkMode={isDarkMode}
            materials={materials}
            questions={questions}
          />
        )}

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
