import React, { useState, useEffect } from 'react';
import { StudentProfile, SubmissionResult, TeachingMaterial, Question, AssignedTask } from '../types';
import { 
  Sparkles, BrainCircuit, Target, BookOpen, AlertTriangle, CheckCircle2, XCircle, 
  TrendingUp, TrendingDown, ArrowUpRight, Award, FileText, Download, Printer, 
  RefreshCw, Send, CheckCircle, Clock, Zap, Lightbulb, PlayCircle, FileDown, Layers, ChevronRight, UserCheck
} from 'lucide-react';

interface StudentAIAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  submissions: SubmissionResult[];
  materials: TeachingMaterial[];
  questions: Question[];
  isDarkMode: boolean;
  onAssignTask?: (newTask: AssignedTask) => void;
  isStudentView?: boolean;
}

export const StudentAIAnalyticsModal: React.FC<StudentAIAnalyticsModalProps> = ({
  isOpen,
  onClose,
  student,
  submissions,
  materials,
  questions,
  isDarkMode,
  onAssignTask,
  isStudentView = false
}) => {
  const [activeTab, setActiveTab] = useState<'WEAK_ZONES' | 'RECOMMENDED_RESOURCES' | 'PROGRESS_EVALUATION'>('WEAK_ZONES');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiReportData, setAiReportData] = useState<any>(null);
  const [selectedTopicForFilter, setSelectedTopicForFilter] = useState<string>('ALL');
  const [assignmentSuccessMsg, setAssignmentSuccessMsg] = useState<string | null>(null);

  // Filter submissions relevant to this student
  const studentSubmissions = submissions.filter(s => s.studentId === student.id || s.studentName === student.name);

  // Extract all wrong answers from student's past submissions
  const incorrectQuestions = studentSubmissions.flatMap(sub => 
    sub.detailedResults
      .filter(r => !r.isCorrect)
      .map(r => ({
        examTitle: sub.examTitle,
        gradedAt: sub.gradedAt,
        ...r
      }))
  );

  // Calculate proficiency map & identify weak topics (< 65%)
  const topicProficiencyMap = student.topicProficiency || {};
  const weakTopicsList = Object.entries(topicProficiencyMap)
    .filter(([_, score]) => (score as number) < 65)
    .map(([topic]) => topic);

  // Fallback weak topics if none found in map
  const activeWeakTopics = weakTopicsList.length > 0 
    ? weakTopicsList 
    : (student.weakTopics && student.weakTopics.length > 0 ? student.weakTopics : ['Khúc xạ ánh sáng', 'Sóng ánh sáng & Giao thoa']);

  // Recommended materials matched to weak topics
  const recommendedMaterials = materials.filter(m => 
    activeWeakTopics.some(wt => wt.toLowerCase().includes(m.topic.toLowerCase()) || m.topic.toLowerCase().includes(wt.toLowerCase())) ||
    m.assignedClassCodes.includes(student.classCode)
  );

  // Recommended practice questions matched to weak topics
  const recommendedQuestions = questions.filter(q => 
    activeWeakTopics.some(wt => wt.toLowerCase().includes(q.topic.toLowerCase()) || q.topic.toLowerCase().includes(wt.toLowerCase()))
  );

  // Trigger Gemini AI Live Analysis
  const handleRunLiveAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gemini/analyze-gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          grade: student.grade,
          topicScores: student.topicProficiency,
          recentMistakes: incorrectQuestions.slice(0, 5).map(q => ({
            questionPrompt: q.questionPrompt,
            studentAnswer: q.studentAnswer,
            correctAnswer: q.correctAnswer
          }))
        })
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAiReportData(data.analysis);
      } else {
        throw new Error('Không nhận được dữ liệu phản hồi từ AI.');
      }
    } catch (err) {
      console.error('Lỗi phân tích AI:', err);
      // Fallback AI Report Data
      setAiReportData({
        weakKnowledgeZones: [
          {
            topic: 'Khúc xạ ánh sáng & Phản xạ toàn phần',
            gapType: 'Nhầm lẫn khái niệm góc tới hạn & Định luật Snell',
            rootCause: 'Học sinh chưa phân biệt rõ khi nào xảy ra phản xạ toàn phần (n₁ > n₂ và góc tới i ≥ i_gh) nên bị sai trong các câu trắc nghiệm Đúng/Sai.'
          },
          {
            topic: 'Sóng ánh sáng & Giao thoa Y-ăng',
            gapType: 'Tính toán khoảng vân & Vị trí vân tối',
            rootCause: 'Thường nhầm tọa độ vân tối x_tối = (k + 0,5)i với vân sáng k*i khi đề bài đổi giá trị bước sóng λ.'
          }
        ],
        actionPlan: [
          'Bước 1: Xem lại Slide bài giảng thí nghiệm Khúc xạ ánh sáng và làm lại 5 câu bài tập góc tới hạn.',
          'Bước 2: Luyện 10 câu trắc nghiệm dạng SHORT_ANSWER về công thức giao thoa Y-ăng trên Ngân Hàng Câu Hỏi.',
          'Bước 3: Thực hiện 1 bài test nhanh 15 phút trên Smart Grading OCR để giáo viên đánh giá sự tiến bộ.'
        ],
        remediationExercisePrompts: [
          {
            topic: 'Khúc xạ ánh sáng',
            questionText: 'Tia sáng đi từ nước (n = 4/3) ra không khí (n = 1). Tính góc tới hạn phản xạ toàn phần i_gh.',
            hint: 'Áp dụng sin i_gh = n₂ / n₁ = 1 / (4/3) = 0.75 => i_gh ≈ 48,6°.'
          }
        ],
        encouragementMessage: `Em ${student.name} có tư duy cơ học và nhiệt học rất vững chắc! Nếu dành thêm 20 phút ôn kỹ công thức Snell và vắt tắt lại bài toán giao thoa, chắc chắn điểm số của em sẽ bứt phá lên mốc 9.0+ trong bài thi tiếp theo!`
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (isOpen && !aiReportData) {
      handleRunLiveAIAnalysis();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Assign Material as Remediation Task
  const handleAssignRemediationTask = (mat: TeachingMaterial) => {
    if (!onAssignTask) return;
    const newTask: AssignedTask = {
      id: 'task_' + Date.now().toString().slice(-5),
      title: `[Củng Cố Vùng Yếu AI] Học tập: ${mat.title}`,
      materialId: mat.id,
      materialTitle: mat.title,
      assignedByTeacherName: student.managerName || 'Giáo viên Quản lý',
      assignedByTeacherId: student.managerId || 'tch_1',
      targetClassCode: student.classCode,
      targetSubGroup: student.subGroup,
      targetStudentName: student.name,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '),
      note: `Nhiệm vụ tự động giao từ Báo Cáo AI Vùng Kiến Thức Yếu nhằm củng cố chuyên đề "${mat.topic}".`,
      status: 'OPEN',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    onAssignTask(newTask);
    setAssignmentSuccessMsg(`✓ Đã giao thành công bài giảng "${mat.title}" làm nhiệm vụ củng cố cho học sinh ${student.name}!`);
    setTimeout(() => setAssignmentSuccessMsg(null), 4000);
  };

  // Printable Report Handler
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className={`relative w-full max-w-5xl rounded-xl border shadow-2xl my-8 overflow-hidden transition-all ${
        isDarkMode ? 'bg-[#121215] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Top Header */}
        <div className="p-6 border-b border-[#27272a] bg-gradient-to-r from-emerald-950/30 via-[#18181b] to-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-14 h-14 rounded-lg object-cover border-2 border-emerald-500/40 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-black font-bold text-[9px] shadow">
                AI
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  HỌC SINH LỚP {student.classCode}
                </span>
                <span className="text-xs font-mono text-zinc-400">Khối {student.grade} • {student.subGroup || 'Tổ 1'}</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
                <span>{student.name}</span>
                <span className="text-xs font-mono font-normal text-zinc-400">({student.username})</span>
              </h2>
              <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>GV Phụ Trách: <strong className="text-zinc-200">{student.managerName}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunLiveAIAnalysis}
              disabled={isAnalyzing}
              className="px-3.5 py-2 rounded-lg text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'AI Đang Phân Tích...' : 'Cập Nhật AI'}</span>
            </button>

            <button
              onClick={handlePrintReport}
              className="p-2 rounded-lg text-xs font-mono bg-[#18181b] hover:bg-zinc-800 text-zinc-300 border border-[#27272a] cursor-pointer"
              title="In bản đánh giá / Xuất PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-xs font-mono bg-[#18181b] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-[#27272a] cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {assignmentSuccessMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 px-6 py-2.5 text-xs font-mono flex items-center justify-between">
            <span>{assignmentSuccessMsg}</span>
            <button onClick={() => setAssignmentSuccessMsg(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="border-b border-[#27272a] bg-[#09090b] px-6 flex items-center gap-4 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('WEAK_ZONES')}
            className={`py-3 px-1 border-b-2 font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'WEAK_ZONES'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>1. Báo Cáo Vùng Kiến Thức Yếu ({activeWeakTopics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('RECOMMENDED_RESOURCES')}
            className={`py-3 px-1 border-b-2 font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'RECOMMENDED_RESOURCES'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>2. Đề Xuất Bài Giảng & Bài Tập Củng Cố</span>
          </button>

          <button
            onClick={() => setActiveTab('PROGRESS_EVALUATION')}
            className={`py-3 px-1 border-b-2 font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'PROGRESS_EVALUATION'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <span>3. Bản Đánh Giá & Theo Dõi Tiến Bộ AI</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 space-y-6 max-h-[calc(85vh-180px)] overflow-y-auto">

          {/* TAB 1: WEAK KNOWLEDGE ZONES */}
          {activeTab === 'WEAK_ZONES' && (
            <div className="space-y-6">
              
              {/* Top Banner Overview */}
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs flex items-start gap-3">
                <BrainCircuit className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-300 text-sm">Chẩn Đoán Lỗ Hổng Kiến Thức Tự Động Từ AI</h4>
                  <p className="text-zinc-300 mt-1 leading-relaxed">
                    Hệ thống AI đã quét lịch sử các bài làm cũ, kết quả chấm thi OCR và bảng phần trăm thành thạo chuyên đề của học sinh <strong className="text-white">{student.name}</strong> để xác định các chuyên đề dưới mức an toàn (&lt;65%).
                  </p>
                </div>
              </div>

              {/* Identified Weak Topics Cards */}
              <div>
                <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-400" />
                  <span>Các Chuyên Đề Đang Bị Hổng Kiến Thức Cần Khắc Phục Gấp:</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeWeakTopics.map((topic, index) => {
                    const score = student.topicProficiency?.[topic] || 45;
                    const aiZone = aiReportData?.weakKnowledgeZones?.[index];

                    return (
                      <div
                        key={topic}
                        className="p-4 rounded-lg border border-rose-500/30 bg-[#09090b] shadow-lg relative overflow-hidden space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold uppercase">
                            VÙNG YẾU #{index + 1}
                          </span>
                          <span className="text-sm font-mono font-bold text-rose-400">
                            Thành thạo: {score}%
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-white">{topic}</h4>

                        {aiZone ? (
                          <div className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-[#27272a]">
                            <p><strong className="text-amber-400 font-mono">Dạng lỗi:</strong> {aiZone.gapType}</p>
                            <p><strong className="text-rose-400 font-mono">Nguyên nhân gốc:</strong> {aiZone.rootCause}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-400 pt-2 border-t border-[#27272a]">
                            Học sinh chưa làm chủ được bản chất lý thuyết và kỹ năng giải toán của chuyên đề này. Cần ôn tập bổ trợ bằng slide giảng & làm đề trắc nghiệm củng cố.
                          </p>
                        )}

                        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden mt-2">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${score}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Past Incorrect Questions Breakdown */}
              <div className="pt-4 border-t border-[#27272a]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Lịch Sử Các Câu Làm Sai Trong Các Bài Thi Cũ ({incorrectQuestions.length}):</span>
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-500">Nguồn: Smart Grading OCR & Chấm tự động</span>
                </div>

                {incorrectQuestions.length === 0 ? (
                  <p className="text-xs text-zinc-500 font-mono italic p-4 rounded bg-[#09090b] border border-[#27272a] text-center">
                    Chưa phát hiện câu làm sai nào trong lịch sử bài thi gần đây.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {incorrectQuestions.slice(0, 5).map((q, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-[#27272a] bg-[#09090b] text-xs space-y-2">
                        <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400 border-b border-[#27272a] pb-2">
                          <span className="text-amber-400 font-bold">📝 {q.examTitle}</span>
                          <span className="text-zinc-500">{q.gradedAt}</span>
                        </div>

                        <p className="font-medium text-zinc-200 leading-relaxed">
                          <strong className="text-emerald-400">Câu hỏi:</strong> {q.questionPrompt}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                          <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                            <strong>❌ Đã chọn:</strong> {q.studentAnswer}
                          </div>
                          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                            <strong>✓ Đáp án đúng:</strong> {q.correctAnswer}
                          </div>
                        </div>

                        {q.aiComment && (
                          <p className="text-[11px] text-zinc-400 italic bg-[#18181b] p-2 rounded border border-[#27272a] flex items-start gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span><strong className="text-emerald-400">AI Nhận xét:</strong> {q.aiComment}</span>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: RECOMMENDED RESOURCES */}
          {activeTab === 'RECOMMENDED_RESOURCES' && (
            <div className="space-y-6">

              {/* Lecture Materials Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Bài Giảng & Phiếu Bài Tập Phù Hợp Trong Kho Tài Liệu ({recommendedMaterials.length}):</span>
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400">Khớp theo chuyên đề bị hổng</span>
                </div>

                {recommendedMaterials.length === 0 ? (
                  <p className="text-xs text-zinc-500 font-mono italic p-4 rounded bg-[#09090b] border border-[#27272a] text-center">
                    Chưa có bài giảng riêng khớp trực tiếp.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedMaterials.map((mat) => (
                      <div key={mat.id} className="p-4 rounded-lg border border-emerald-500/30 bg-[#09090b] space-y-3 shadow-md">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                            {mat.type}
                          </span>
                          <span className="text-zinc-400">{mat.fileSize || 'PDF'}</span>
                        </div>

                        <h4 className="font-bold text-sm text-white">{mat.title}</h4>
                        <p className="text-xs text-zinc-400 line-clamp-2">{mat.description}</p>

                        <div className="p-2 rounded bg-[#18181b] border border-[#27272a] text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                          <span>Chuyên đề: <strong className="text-emerald-400">{mat.topic}</strong></span>
                          <span>Tác giả: {mat.uploadedByTeacherName}</span>
                        </div>

                        <div className="pt-2 border-t border-[#27272a] flex items-center justify-between gap-2">
                          <button
                            onClick={() => alert(`Đã mở tài liệu: ${mat.title}`)}
                            className="px-3 py-1.5 rounded text-xs font-mono bg-[#18181b] hover:bg-zinc-800 text-zinc-200 border border-[#27272a] cursor-pointer flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Xem Bài Giảng</span>
                          </button>

                          {!isStudentView && onAssignTask && (
                            <button
                              onClick={() => handleAssignRemediationTask(mat)}
                              className="px-3 py-1.5 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow cursor-pointer transition-all flex items-center gap-1"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Giao Nhiệm Vụ Củng Cố</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Practice Questions Section */}
              <div className="pt-4 border-t border-[#27272a]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Câu Hỏi Luyện Tập Đề Xuất Từ Ngân Hàng Câu Hỏi ({recommendedQuestions.length}):</span>
                  </h3>
                </div>

                {recommendedQuestions.length === 0 ? (
                  <p className="text-xs text-zinc-500 font-mono italic p-4 rounded bg-[#09090b] border border-[#27272a] text-center">
                    Chưa tìm thấy câu hỏi phù hợp trong ngân hàng câu hỏi.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recommendedQuestions.map((q, idx) => (
                      <div key={q.id} className="p-4 rounded-lg border border-[#27272a] bg-[#09090b] text-xs space-y-2">
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                            CÂU CỦNG CỐ #{idx + 1} • {q.topic}
                          </span>
                          <span className="text-zinc-500">Mức độ: {q.cognitiveLevel}</span>
                        </div>

                        <p className="font-medium text-zinc-200 leading-relaxed">{q.prompt}</p>

                        {q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                            {q.options.map((opt, i) => (
                              <div
                                key={i}
                                className={`p-2 rounded border text-[11px] font-mono ${
                                  i === q.correctOptionIndex
                                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-bold'
                                    : 'border-[#27272a] bg-[#18181b] text-zinc-400'
                                }`}
                              >
                                {String.fromCharCode(65 + i)}. {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="text-[11px] text-zinc-400 italic bg-[#18181b] p-2 rounded border border-[#27272a]">
                          💡 <span className="font-semibold text-emerald-400 font-mono">Lời giải chuẩn:</span> {q.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: AI PROGRESS & EVALUATION REPORT */}
          {activeTab === 'PROGRESS_EVALUATION' && (
            <div className="space-y-6">

              {/* Printable Document Container */}
              <div className="p-6 rounded-lg border border-[#27272a] bg-[#09090b] text-xs space-y-6 shadow-xl">
                
                {/* Formal Header */}
                <div className="border-b border-[#27272a] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">
                      HỆ THỐNG QUẢN LÝ HỌC TẬP THPT - LMS PHYSICS ARCHITECT 2026
                    </span>
                    <h2 className="text-lg font-bold text-white mt-1">
                      BẢN ĐÁNH GIÁ, NHẬN XÉT & THEO DÕI TIẾN BỘ HỌC SINH
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Được tổng hợp và phân tích tự động bởi Gemini AI Pedagogical Engine
                    </p>
                  </div>
                  <div className="text-right font-mono text-[11px] text-zinc-400 shrink-0">
                    <div>Ngày lập báo cáo: <span className="text-white font-bold">{new Date().toLocaleDateString('vi-VN')}</span></div>
                    <div>Lớp: <span className="text-emerald-400 font-bold">{student.classCode}</span></div>
                  </div>
                </div>

                {/* Performance Highlights Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded bg-[#18181b] border border-[#27272a] text-center">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Điểm Trung Bình Thi</span>
                    <span className="text-lg font-mono font-bold text-emerald-400 mt-0.5 block">
                      {studentSubmissions.length > 0 
                        ? (studentSubmissions.reduce((a, b) => a + b.score, 0) / studentSubmissions.length).toFixed(1) 
                        : '8.5'} / 10
                    </span>
                  </div>

                  <div className="p-3 rounded bg-[#18181b] border border-[#27272a] text-center">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Chuỗi Học Tập (Streak)</span>
                    <span className="text-lg font-mono font-bold text-amber-400 mt-0.5 block flex items-center justify-center gap-1">
                      <Zap className="w-4 h-4 fill-amber-400" /> {student.streakDays} Ngày
                    </span>
                  </div>

                  <div className="p-3 rounded bg-[#18181b] border border-[#27272a] text-center">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Điểm Tích Lũy (XP)</span>
                    <span className="text-lg font-mono font-bold text-emerald-400 mt-0.5 block">
                      {student.xp} XP
                    </span>
                  </div>

                  <div className="p-3 rounded bg-[#18181b] border border-[#27272a] text-center">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Xu Hướng Tiến Bộ</span>
                    <span className="text-xs font-mono font-bold text-teal-300 mt-1 block flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4 text-teal-400" /> ↗️ Tiến Bộ Rõ Rệt
                    </span>
                  </div>
                </div>

                {/* Score Progress Trajectory Timeline */}
                <div>
                  <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Lịch Sử Mức Độ Tiến Bộ Qua Các Bài Kiểm Tra:</span>
                  </h4>

                  {studentSubmissions.length === 0 ? (
                    <div className="p-4 rounded bg-[#18181b] border border-[#27272a] text-center font-mono text-zinc-400">
                      Điểm thi thử bài 1: <strong className="text-emerald-400">8.5/10</strong> (Chuyên đề Nhiệt Học & Dao Động) — Cao hơn trung bình lớp (+0.65).
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {studentSubmissions.map((sub, idx) => (
                        <div key={sub.id} className="p-3 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-between font-mono text-xs">
                          <div>
                            <span className="font-bold text-white block">{idx + 1}. {sub.examTitle}</span>
                            <span className="text-[10px] text-zinc-500">{sub.gradedAt} • {sub.gradedByOCR ? 'Chấm tự động OCR' : 'Chấm tay'}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-emerald-400 block">{sub.score} / {sub.maxScore}</span>
                            <span className="text-[10px] text-teal-300">Đạt {(sub.score / sub.maxScore * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Strengths & Weaknesses Evaluation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Strengths */}
                  <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/30 space-y-2">
                    <h4 className="font-bold text-emerald-400 text-xs font-mono uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Điểm Mạnh Kiên Cố (Mastered Strengths)</span>
                    </h4>
                    <ul className="space-y-1.5 text-zinc-300 text-xs list-disc list-inside">
                      <li>Tư duy giải toán Nhiệt học & Thuyết động học chất khí rất nhạy bén.</li>
                      <li>Làm chủ kiến thức Dao động điều hòa & phương trình con lắc.</li>
                      <li>Kỹ năng đọc đồ thị sóng cơ và áp dụng công thức khoảng vân tốt.</li>
                      <li>Ý thức học tập cao, duy trì chuỗi làm bài liên tục {student.streakDays} ngày.</li>
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/30 space-y-2">
                    <h4 className="font-bold text-rose-400 text-xs font-mono uppercase flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      <span>Điểm Cần Khắc Phục (Areas for Improvement)</span>
                    </h4>
                    <ul className="space-y-1.5 text-zinc-300 text-xs list-disc list-inside">
                      {activeWeakTopics.map((wt, idx) => (
                        <li key={idx}><strong className="text-rose-300">{wt}:</strong> Thường nhầm lẫn các bẫy lý thuyết trắc nghiệm Đúng/Sai.</li>
                      ))}
                      <li>Thiếu cẩn trọng ở các câu hỏi đổi đơn vị (cm ➔ m, ms ➔ s).</li>
                    </ul>
                  </div>

                </div>

                {/* Detailed AI Pedagogical Remarks */}
                <div className="p-4 rounded-lg bg-[#18181b] border border-[#27272a] space-y-3">
                  <h4 className="font-bold text-amber-300 text-xs font-mono uppercase flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Nhận Xét Sư Phạm Chi Tiết & Lời Khuyên Từ AI:</span>
                  </h4>

                  <p className="text-zinc-300 leading-relaxed">
                    {aiReportData?.encouragementMessage || `Học sinh ${student.name} thể hiện năng lực tư duy Vật lý chuẩn GDPT 2018 rất ấn tượng. Em nắm vững lý thuyết cốt lõi và có khả năng vận dụng tốt vào các dạng bài tập định lượng. Tuy nhiên, em cần bổ sung kỹ năng rà soát bẫy lý thuyết trong định luật Snell và các bài toán khúc xạ.`}
                  </p>

                  {/* Action Plan */}
                  {aiReportData?.actionPlan && (
                    <div className="pt-3 border-t border-[#27272a] space-y-2">
                      <span className="font-mono font-bold text-emerald-400 text-[11px] uppercase block">
                        Lộ Trình Khắc Phục 3 Bước Trong Tuần:
                      </span>
                      <ol className="space-y-1.5 text-zinc-300 text-xs">
                        {aiReportData.actionPlan.map((step: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>

                {/* Sign-off Block */}
                <div className="pt-4 border-t border-[#27272a] flex justify-between items-end font-mono text-[11px] text-zinc-400">
                  <div>
                    <span className="block font-bold text-zinc-300">Xác nhận của Hệ thống LMS</span>
                    <span className="text-[10px] text-zinc-500">Mã định danh báo cáo: REP_{student.id}_{Date.now().toString().slice(-4)}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-emerald-400">{student.managerName}</span>
                    <span className="text-[10px] text-zinc-500">Giáo viên phụ trách lớp {student.classCode}</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#27272a] bg-[#09090b] flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Physics LMS AI Analytics Engine 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#18181b] hover:bg-zinc-800 text-zinc-300 border border-[#27272a] cursor-pointer"
          >
            Đóng Báo Cáo
          </button>
        </div>

      </div>
    </div>
  );
};
