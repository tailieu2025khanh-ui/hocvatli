import React, { useState } from 'react';
import { StudentProfile, Question, AssignedTask, TeachingMaterial, SubmissionResult } from '../types';
import { Flame, Zap, Award, Target, BrainCircuit, RefreshCw, Sparkles, BookOpen, Clock, Download, CheckCircle, FileText, Presentation, Video, TrendingUp, BarChart3 } from 'lucide-react';
import { StudentAIAnalyticsModal } from './StudentAIAnalyticsModal';
import { MOCK_SUBMISSIONS } from '../data/mockData';

interface StudentDashboardProps {
  isDarkMode: boolean;
  student: StudentProfile;
  questions: Question[];
  assignedTasks?: AssignedTask[];
  materials?: TeachingMaterial[];
  submissions?: SubmissionResult[];
  onCompleteTask?: (taskId: string) => void;
  onOpenHonorRoll?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  isDarkMode,
  student,
  questions,
  assignedTasks = [],
  materials = [],
  submissions = MOCK_SUBMISSIONS,
  onCompleteTask,
  onOpenHonorRoll
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('Khúc xạ ánh sáng');
  const [isGeneratingRemediation, setIsGeneratingRemediation] = useState<boolean>(false);
  const [remediationQuestions, setRemediationQuestions] = useState<any[] | null>(null);
  const [showAIAnalyticsModal, setShowAIAnalyticsModal] = useState<boolean>(false);

  // Call Gemini AI `/api/gemini/analyze-gaps` or `/api/gemini/generate-questions` for auto remediation
  const handleGenerateRemediation = async () => {
    setIsGeneratingRemediation(true);
    try {
      const response = await fetch('/api/gemini/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: student.grade,
          topic: selectedTopic,
          cognitiveLevel: 'VAN_DUNG',
          questionType: 'MCQ_4',
          count: 3
        })
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.questions)) {
        setRemediationQuestions(data.questions);
      } else {
        throw new Error('Không tạo được bài tập bổ trợ.');
      }
    } catch (err) {
      console.error('Lỗi tạo bài tập bổ trợ:', err);
      // Fallback
      setRemediationQuestions([
        {
          prompt: 'Một tia sáng đơn sắc đi từ không khí (n₁ = 1) vào môi trường trong suốt có chiết suất n₂ = √3 dưới góc tới i = 60°. Góc khúc xạ r bằng bao nhiêu?',
          options: ['30°', '45°', '60°', '35°'],
          correctOptionIndex: 0,
          explanation: 'Áp dụng định luật Snell: n₁ sin i = n₂ sin r => 1 * sin 60° = √3 * sin r => (√3/2) = √3 sin r => sin r = 0.5 => r = 30°.'
        },
        {
          prompt: 'Hiện tượng phản xạ toàn phần có thể xảy ra khi ánh sáng truyền từ:',
          options: [
            'Môi trường có chiết suất nhỏ sang môi trường có chiết suất lớn hơn',
            'Môi trường có chiết suất lớn sang môi trường có chiết suất nhỏ hơn',
            'Không khí vào nước',
            'Chân không vào thủy tinh'
          ],
          correctOptionIndex: 1,
          explanation: 'Điều kiện xảy ra phản xạ toàn phần: 1) Ánh sáng truyền từ môi trường chiết quang hơn sang kém hơn (n₁ > n₂); 2) Góc tới i ≥ i_gh.'
        }
      ]);
    } finally {
      setIsGeneratingRemediation(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Student Welcome & Gamification Banner */}
      <div className={`p-6 rounded-xl border transition-colors shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
      }`}>
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-14 h-14 rounded-lg object-cover border border-teal-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                isDarkMode ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-teal-300 text-teal-700 bg-teal-50'
              }`}>
                CLASS: {student.classCode}
              </span>
              <span className={`text-xs font-mono font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Level {student.level}</span>
            </div>
            <h1 className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{student.name}</h1>
            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
              Lộ trình học tập cá nhân hóa Vật lý THPT GDPT 2018
            </p>
          </div>
        </div>

        {/* Gamification Stats & AI Analytics Button */}
        <div className="flex flex-wrap items-center gap-3">
          {onOpenHonorRoll && (
            <button
              onClick={onOpenHonorRoll}
              className="p-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-mono text-xs font-extrabold shadow flex items-center gap-2 cursor-pointer transition-all border border-amber-300"
            >
              <Award className="w-4 h-4 text-slate-900" />
              <span className="text-left">
                <span className="block text-[10px] text-amber-950 font-extrabold uppercase">Vinh Danh Tiêu Biểu</span>
                <span>🏆 Bảng Vàng Thành Tích</span>
              </span>
            </button>
          )}

          <button
            onClick={() => setShowAIAnalyticsModal(true)}
            className="p-3 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-mono text-xs font-bold shadow flex items-center gap-2 cursor-pointer transition-all border border-teal-400/40"
          >
            <BarChart3 className="w-4 h-4 text-emerald-100" />
            <span className="text-left">
              <span className="block text-[10px] text-emerald-100 font-normal uppercase">AI Phân Tích Dữ Liệu</span>
              <span>Báo Cáo Vùng Yếu & Tiến Bộ</span>
            </span>
          </button>

          <div className={`p-3 rounded-lg border text-center min-w-[85px] ${
            isDarkMode ? 'bg-[#09090b] border-[#27272a]' : 'bg-slate-50 border-slate-200 shadow-xs'
          }`}>
            <Flame className="w-4 h-4 text-amber-500 mx-auto mb-0.5 fill-amber-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-amber-600 block">{student.streakDays} Ngày</span>
            <span className={`text-[10px] uppercase tracking-tight ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>Chuỗi học</span>
          </div>

          <div className={`p-3 rounded-lg border text-center min-w-[85px] ${
            isDarkMode ? 'bg-[#09090b] border-[#27272a]' : 'bg-slate-50 border-slate-200 shadow-xs'
          }`}>
            <Zap className="w-4 h-4 text-emerald-600 mx-auto mb-0.5 fill-emerald-600" />
            <span className="text-xs font-mono font-bold text-emerald-600 block">{student.xp} XP</span>
            <span className={`text-[10px] uppercase tracking-tight ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>Điểm XP</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Topic Proficiency & Remediation Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Topic Proficiency Bars */}
        <div className={`lg:col-span-7 p-5 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
        }`}>
          <div className={`flex items-center justify-between mb-4 border-b pb-3 ${isDarkMode ? 'border-[#27272a]' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-emerald-600" />
              <h3 className={`font-bold text-sm ${isDarkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Đánh Giá Mức Độ Thành Thạo Chuyên Đề</h3>
            </div>
            <span className={`text-[11px] font-mono ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>AI Adaptive Heatmap</span>
          </div>

          <div className="space-y-3.5 my-4">
            {Object.entries(student.topicProficiency).map(([topic, pct]) => {
              const numPct = pct as number;
              const isWeak = numPct < 60;
              return (
                <div
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTopic === topic
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                      : isDarkMode ? 'border-[#27272a] bg-[#09090b] hover:border-zinc-700' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className="flex items-center gap-1.5">
                      {isWeak && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
                      <span className={isWeak ? 'text-rose-600 font-bold' : (isDarkMode ? 'text-zinc-200' : 'text-slate-800')}>{topic}</span>
                    </span>
                    <span className={`font-mono font-bold ${isWeak ? 'text-rose-600' : 'text-emerald-600'}`}>{numPct}%</span>
                  </div>

                  <div className={`w-full h-2 rounded overflow-hidden ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-200'}`}>
                    <div
                      className={`h-full rounded transition-all duration-500 ${
                        isWeak ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-gradient-to-r from-emerald-600 to-teal-500'
                      }`}
                      style={{ width: `${numPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {student.weakTopics.length > 0 && (
            <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
              <Target className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono font-bold block text-rose-400 uppercase text-[10px]">Critical Knowledge Gap:</span>
                <p className="mt-0.5 text-zinc-300">{student.weakTopics.join(', ')} — Hãy chọn các chuyên đề này để làm bài củng cố.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Auto Remediation Generator */}
        <div className={`lg:col-span-5 p-5 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-emerald-500/20 text-zinc-100 shadow-lg shadow-emerald-950/20' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-4 border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-medium text-sm text-zinc-200">Bài Tập Củng Cố Lỗ Hổng AI</h3>
            </div>
          </div>

          <div className="p-3 rounded bg-[#09090b] border border-[#27272a] text-xs mb-4">
            <span className="text-zinc-500 block text-[10px] uppercase font-mono">Chuyên đề được chọn:</span>
            <span className="font-semibold text-emerald-400 text-xs block mt-0.5">{selectedTopic}</span>
          </div>

          <button
            onClick={handleGenerateRemediation}
            disabled={isGeneratingRemediation}
            className="w-full py-2.5 rounded font-medium text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/30 flex items-center justify-center gap-2 transition-all cursor-pointer mb-4"
          >
            {isGeneratingRemediation ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI Đang Soạn Bài Củng Cố...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Tạo 3 Bài Tập Bổ Trợ Tương Ứng</span>
              </>
            )}
          </button>

          {/* Remediation Questions Display */}
          {remediationQuestions && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Bài Luyện Tập Khắc Phục:</h4>
              {remediationQuestions.map((q, idx) => (
                <div key={idx} className="p-3 rounded border border-[#27272a] text-xs space-y-2.5 bg-[#09090b]">
                  <p className="font-medium text-zinc-200 leading-relaxed">{idx + 1}. {q.prompt}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {(q.options || []).map((opt: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => alert(i === q.correctOptionIndex ? 'Chính xác! Bạn đã hiểu bài và nhận +20 XP' : 'Chưa đúng, xem kỹ lời giải bên dưới nhé.')}
                        className="p-2 rounded border border-[#27272a] hover:border-emerald-500 text-left text-[11px] font-medium text-zinc-300 hover:text-white bg-[#18181b] cursor-pointer transition-colors"
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-zinc-400 italic bg-[#18181b] p-2 rounded border border-[#27272a]">
                    💡 <span className="font-semibold text-emerald-400">Hướng dẫn:</span> {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Assigned Tasks & Co-Teacher Materials for Student */}
      <div className={`p-5 rounded-lg border transition-colors ${
        isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center justify-between mb-4 border-b border-[#27272a] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h3 className="font-medium text-sm text-zinc-200 font-mono uppercase tracking-wider">
              Nhiệm Vụ & Bài Giảng Được Giáo Viên / Đồng Nghiệp Giao
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">
            {assignedTasks.filter(t => t.status === 'OPEN').length} Nhiệm vụ chưa hoàn thành
          </span>
        </div>

        {assignedTasks.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 font-mono text-center">Chưa có nhiệm vụ học tập nào được giao.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border transition-all ${
                  task.status === 'COMPLETED'
                    ? 'border-zinc-800 bg-[#09090b]/50 opacity-75'
                    : 'border-emerald-500/30 bg-[#09090b] shadow-md shadow-emerald-950/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                  <span className="text-zinc-400">Giáo viên giao: <strong className="text-emerald-400">{task.assignedByTeacherName}</strong></span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.dueDate}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white mb-1">{task.title}</h4>
                {task.materialTitle && (
                  <div className="p-2 rounded bg-[#18181b] border border-[#27272a] text-xs font-mono text-zinc-300 mb-2 flex items-center justify-between">
                    <span className="truncate">📎 {task.materialTitle}</span>
                    <button
                      onClick={() => alert(`Đã tải xuống tài liệu học tập: ${task.materialTitle}`)}
                      className="px-2 py-0.5 rounded text-[10px] bg-emerald-600 text-white hover:bg-emerald-500 shrink-0 ml-2 cursor-pointer"
                    >
                      Tải File
                    </button>
                  </div>
                )}
                <p className="text-xs text-zinc-400 mb-3">{task.note}</p>

                <div className="flex items-center justify-between pt-2 border-t border-[#27272a]">
                  <span className="text-[10px] font-mono text-zinc-500">Mã Lớp: {task.targetClassCode}</span>
                  {task.status === 'COMPLETED' ? (
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Đã hoàn thành (+50 XP)
                    </span>
                  ) : (
                    <button
                      onClick={() => onCompleteTask && onCompleteTask(task.id)}
                      className="px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow cursor-pointer transition-all"
                    >
                      Đánh Dấu Hoàn Thành (+50 XP)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges & Achievements Unlocked */}
      <div className={`p-5 rounded-lg border transition-colors ${
        isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-amber-400" />
          <h3 className="font-medium text-sm text-zinc-200 font-mono uppercase tracking-wider">Bộ Sưu Tập Huy Hiệu (Badges & Achievements)</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {student.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded border text-center space-y-1.5 transition-all ${
                badge.unlockedAt
                  ? 'bg-[#09090b] border-amber-500/30 text-amber-200'
                  : 'bg-[#09090b] border-[#27272a] text-zinc-500 opacity-50'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto text-base">
                🏆
              </div>
              <h4 className="font-semibold text-xs text-zinc-200">{badge.title}</h4>
              <p className="text-[10px] text-zinc-400 line-clamp-2">{badge.description}</p>
              {badge.unlockedAt && (
                <span className="text-[9px] font-mono text-emerald-400 block">Unlocked: {badge.unlockedAt}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Student AI Analytics & Weak Knowledge Area Report Modal */}
      <StudentAIAnalyticsModal
        isOpen={showAIAnalyticsModal}
        onClose={() => setShowAIAnalyticsModal(false)}
        student={student}
        submissions={submissions}
        materials={materials}
        questions={questions}
        isDarkMode={isDarkMode}
        isStudentView={true}
      />

    </div>
  );
};

