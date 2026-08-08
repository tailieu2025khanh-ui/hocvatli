import React, { useState } from 'react';
import { ClassRoom, SubmissionResult } from '../types';
import { AlertTriangle, TrendingUp, BarChart3, CheckCircle, Clock, Sparkles, FileSpreadsheet, Activity, Users, Crown, Trophy } from 'lucide-react';

interface TeacherDashboardProps {
  isDarkMode: boolean;
  activeClass: ClassRoom;
  submissions: SubmissionResult[];
  onOpenOCR: () => void;
  onOpenExportModal: () => void;
  onOpenCollaboration?: () => void;
  onOpenHonorRoll?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  isDarkMode,
  activeClass,
  submissions,
  onOpenOCR,
  onOpenExportModal,
  onOpenCollaboration,
  onOpenHonorRoll
}) => {
  // 4-Level Pedagogical Matrix summary
  const matrixLevels = [
    { name: 'Nhận biết', pct: '42%', color: 'bg-blue-500' },
    { name: 'Thông hiểu', pct: '28%', color: 'bg-emerald-500' },
    { name: 'Vận dụng', pct: '18%', color: 'bg-amber-500' },
    { name: 'Vận dụng cao', pct: '12%', color: 'bg-rose-500' },
  ];

  // Simulated score distribution
  const scoreSpectrum = [
    { range: '0 - 4.9', count: 2 },
    { range: '5.0 - 6.4', count: 5 },
    { range: '6.5 - 7.9', count: 12 },
    { range: '8.0 - 8.9', count: 14 },
    { range: '9.0 - 10', count: 5 }
  ];

  // List of struggling students requiring targeted AI intervention
  const strugglingStudents = [
    { name: 'Nguyễn Hoàng Nam', score: 4.5, weakTopic: 'Khúc xạ ánh sáng & Thấu kính', status: 'Cần gửi bài tập bổ trợ' },
    { name: 'Lê Thanh Mai', score: 5.2, weakTopic: 'Nhầm lẫn pha trong Dao động điều hòa', status: 'Cần gửi video giảng lại' },
    { name: 'Phạm Văn An', score: 5.8, weakTopic: 'Tính sai dung sai bài tập Trả lời ngắn', status: 'Cần hướng dẫn bấm máy tính' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Quick Actions Bar */}
      <div className={`p-6 rounded-xl border transition-colors shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
              isDarkMode ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-teal-300 text-teal-700 bg-teal-50'
            }`}>
              ROOM: {activeClass.code}
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>• {activeClass.studentCount} học sinh đã đồng bộ</span>
          </div>
          <h1 className={`text-xl font-bold tracking-tight mt-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeClass.name}</h1>
          <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
            Giáo viên phụ trách: <span className={`font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-slate-800'}`}>{activeClass.teacherName}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenHonorRoll && (
            <button
              onClick={onOpenHonorRoll}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-900 border border-amber-300 shadow flex items-center gap-2 transition-all cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-slate-900 fill-slate-900" />
              <span>🏆 Vinh Danh Học Sinh Tiêu Biểu</span>
            </button>
          )}

          {onOpenCollaboration && (
            <button
              onClick={onOpenCollaboration}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                isDarkMode ? 'bg-[#09090b] hover:bg-zinc-800 text-zinc-300 border-[#27272a]' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>Phân Quyền Đồng Nghiệp</span>
            </button>
          )}

          <button
            onClick={onOpenOCR}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40 shadow flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mở Chấm Điểm OCR</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
              isDarkMode ? 'bg-[#09090b] hover:bg-zinc-800 text-zinc-300 border-[#27272a]' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
            <span>Xuất Canva / Word / NotebookLM</span>
          </button>
        </div>
      </div>

      {/* 4-Level Pedagogical Matrix Bar */}
      <div className={`p-5 rounded-xl border transition-colors ${
        isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 font-mono ${
          isDarkMode ? 'text-zinc-400' : 'text-slate-600'
        }`}>
          <Activity className="w-4 h-4 text-emerald-500" />
          4-Level Pedagogical Matrix (Phân bổ Ma Trận Đề Thi GDPT)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {matrixLevels.map((lvl) => (
            <div key={lvl.name} className={`p-3 border rounded-lg ${
              isDarkMode ? 'bg-[#09090b] border-[#27272a]' : 'bg-slate-50 border-slate-200'
            }`}>
              <p className={`text-[10px] uppercase tracking-wider mb-1 font-mono ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>{lvl.name}</p>
              <p className={`text-2xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{lvl.pct}</p>
              <div className={`w-full h-1.5 mt-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-200'}`}>
                <div className={`h-full ${lvl.color} rounded-full`} style={{ width: lvl.pct }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className={`p-4 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`flex items-center justify-between mb-2 font-mono ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            <span className="text-[10px] uppercase tracking-wider">Điểm Trung Bình</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600">{activeClass.averageScore} / 10</div>
          <span className="text-[11px] text-emerald-600 font-medium">+0.35 so với kỳ kiểm tra trước</span>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`flex items-center justify-between mb-2 font-mono ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            <span className="text-[10px] uppercase tracking-wider">Tỷ Lệ Nộp Bài</span>
            <CheckCircle className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-600">94.7%</div>
          <span className={`text-[11px] ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>36 / 38 học sinh đã hoàn thành</span>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`flex items-center justify-between mb-2 font-mono ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            <span className="text-[10px] uppercase tracking-wider">Cảnh Báo Sa Sút</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">03 HS</div>
          <span className="text-[11px] text-amber-600 font-medium">Cần bổ trợ lỗ hổng kiến thức</span>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`flex items-center justify-between mb-2 font-mono ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            <span className="text-[10px] uppercase tracking-wider">Đề Thi Đang Mở</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-600">{activeClass.activeExamsCount} Đề thi</div>
          <span className={`text-[11px] ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Hạn chót: 23:59 Chủ Nhật</span>
        </div>

      </div>

      {/* Main Grid: Spectrum Chart & Struggling Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Score Spectrum Bar Chart */}
        <div className={`lg:col-span-7 p-5 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
        }`}>
          <div className={`flex items-center justify-between mb-4 border-b pb-3 ${isDarkMode ? 'border-[#27272a]' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <h3 className={`font-bold text-sm ${isDarkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Phổ Điểm Lớp Học {activeClass.code}</h3>
            </div>
            <span className={`text-[11px] font-mono ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Tổng 38 bài thi</span>
          </div>

          <div className="space-y-3.5 my-5">
            {scoreSpectrum.map((item, i) => {
              const maxVal = 16;
              const percent = (item.count / maxVal) * 100;
              return (
                <div key={i} className="text-xs space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className={isDarkMode ? 'text-zinc-400' : 'text-slate-600'}>Thang điểm {item.range}:</span>
                    <span className="text-emerald-600 font-bold">{item.count} HS</span>
                  </div>
                  <div className={`w-full h-2 rounded overflow-hidden border ${
                    isDarkMode ? 'bg-[#09090b] border-[#27272a]' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div
                      className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
            isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            💡 <span className={`font-bold ${isDarkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Đánh giá chung:</span> Phổ điểm lệch phải tích cực (Tập trung nhiều ở dải 8.0 - 8.9). Các câu phân hóa Vận dụng cao ở chương Khúc xạ ánh sáng có tỷ lệ đúng 42%.
          </div>
        </div>

        {/* Struggling Students Real-time Alerts */}
        <div className={`lg:col-span-5 p-5 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-emerald-500/20 text-zinc-100' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-zinc-200' : 'text-slate-800'}`}>AI Gap Detection (Phát hiện Lỗ Hổng)</h3>
          </div>

          <p className={`text-xs mb-4 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
            AI đã phân tích bài thi gần nhất và phát hiện 03 học sinh cần củng cố lại nền tảng:
          </p>

          <div className="space-y-3">
            {strugglingStudents.map((std, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                  isDarkMode ? 'bg-[#09090b] border-[#27272a]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono">
                  <span className={`font-bold ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>{std.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 font-bold text-[11px] border border-amber-300">
                    {std.score} đ
                  </span>
                </div>
                <p className={`text-[11px] ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                  <span className="text-amber-600 font-bold font-mono">Lỗ hổng:</span> {std.weakTopic}
                </p>
                <button
                  onClick={() => alert(`Đã tự động gửi bộ bài tập bổ trợ cho ${std.name} qua LMS!`)}
                  className="w-full py-1.5 rounded text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all cursor-pointer mt-1"
                >
                  🚀 Gửi Bài Tập Bổ Trợ Tự Động
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Submissions History Table */}
      <div className={`p-5 rounded-xl border transition-colors ${
        isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
      }`}>
        <h3 className={`font-bold text-sm mb-4 font-mono uppercase tracking-wider ${isDarkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Lịch Sử Bài Chấm Bài Thi Lớp {activeClass.code}</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b uppercase font-mono tracking-wider text-[10px] ${
                isDarkMode ? 'border-[#27272a] text-zinc-400' : 'border-slate-200 text-slate-500 bg-slate-50'
              }`}>
                <th className="py-2.5 px-3">Học sinh</th>
                <th className="py-2.5 px-3">Tên bài thi</th>
                <th className="py-2.5 px-3">Thời gian nộp</th>
                <th className="py-2.5 px-3">Phương thức</th>
                <th className="py-2.5 px-3">Điểm số</th>
                <th className="py-2.5 px-3">Đánh giá AI</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-[#27272a]/60' : 'divide-slate-200'}`}>
              {submissions.map((sub) => (
                <tr key={sub.id} className={isDarkMode ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-50'}>
                  <td className={`py-3 px-3 font-bold ${isDarkMode ? 'text-zinc-200' : 'text-slate-800'}`}>{sub.studentName}</td>
                  <td className={`py-3 px-3 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>{sub.examTitle}</td>
                  <td className={`py-3 px-3 font-mono text-[11px] ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>{sub.gradedAt}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      OCR Scan ({sub.ocrConfidence}%)
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-sm text-teal-700">
                    {sub.score} / {sub.maxScore}
                  </td>
                  <td className={`py-3 px-3 max-w-xs truncate ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {sub.aiDiagnosis.feedbackSummary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

