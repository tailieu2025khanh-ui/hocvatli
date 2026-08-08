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
      <div className={`p-6 rounded-lg border transition-colors shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
              ROOM: {activeClass.code}
            </span>
            <span className="text-xs text-zinc-400">• {activeClass.studentCount} học sinh đã đồng bộ</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white mt-1.5">{activeClass.name}</h1>
          <p className="text-xs text-zinc-400">
            Giáo viên phụ trách: <span className="font-medium text-zinc-200">{activeClass.teacherName}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenHonorRoll && (
            <button
              onClick={onOpenHonorRoll}
              className="px-4 py-2 rounded text-xs font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black border border-amber-300 shadow-lg shadow-amber-950/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-black fill-black" />
              <span>🏆 Vinh Danh Học Sinh Tiêu Biểu</span>
            </button>
          )}

          {onOpenCollaboration && (
            <button
              onClick={onOpenCollaboration}
              className="px-4 py-2 rounded text-xs font-medium bg-[#09090b] hover:bg-zinc-800 text-zinc-300 border border-[#27272a] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phân Quyền Đồng Nghiệp</span>
            </button>
          )}

          <button
            onClick={onOpenOCR}
            className="px-4 py-2 rounded text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40 shadow-lg shadow-emerald-950/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mở Chấm Điểm OCR</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="px-4 py-2 rounded text-xs font-medium bg-[#09090b] hover:bg-zinc-800 text-zinc-300 border border-[#27272a] flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Xuất Canva / Word / NotebookLM</span>
          </button>
        </div>
      </div>

      {/* 4-Level Pedagogical Matrix Bar */}
      <div className={`p-5 rounded-lg border transition-colors ${
        isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200'
      }`}>
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
          <Activity className="w-4 h-4 text-emerald-500" />
          4-Level Pedagogical Matrix (Phân bổ Ma Trận Đề Thi GDPT)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {matrixLevels.map((lvl) => (
            <div key={lvl.name} className="p-3 bg-[#09090b] border border-[#27272a] rounded">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-mono">{lvl.name}</p>
              <p className="text-2xl font-light font-mono text-white">{lvl.pct}</p>
              <div className="w-full h-1 bg-zinc-800 mt-2 rounded-full overflow-hidden">
                <div className={`h-full ${lvl.color} rounded-full`} style={{ width: lvl.pct }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className={`p-4 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 mb-2 font-mono">
            <span className="text-[10px] uppercase tracking-wider">Điểm Trung Bình</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-light font-mono text-emerald-400">{activeClass.averageScore} / 10</div>
          <span className="text-[11px] text-emerald-500 font-medium">+0.35 so với kỳ kiểm tra trước</span>
        </div>

        <div className={`p-4 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 mb-2 font-mono">
            <span className="text-[10px] uppercase tracking-wider">Tỷ Lệ Nộp Bài</span>
            <CheckCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-light font-mono text-cyan-400">94.7%</div>
          <span className="text-[11px] text-zinc-400">36 / 38 học sinh đã hoàn thành</span>
        </div>

        <div className={`p-4 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 mb-2 font-mono">
            <span className="text-[10px] uppercase tracking-wider">Cảnh Báo Sa Sút</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-light font-mono text-amber-400">03 HS</div>
          <span className="text-[11px] text-amber-400 font-medium">Cần bổ trợ lỗ hổng kiến thức</span>
        </div>

        <div className={`p-4 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 mb-2 font-mono">
            <span className="text-[10px] uppercase tracking-wider">Đề Thi Đang Mở</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-light font-mono text-purple-400">{activeClass.activeExamsCount} Đề thi</div>
          <span className="text-[11px] text-zinc-400">Hạn chót: 23:59 Chủ Nhật</span>
        </div>

      </div>

      {/* Main Grid: Spectrum Chart & Struggling Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Score Spectrum Bar Chart */}
        <div className={`lg:col-span-7 p-5 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-4 border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h3 className="font-medium text-sm text-zinc-200">Phổ Điểm Lớp Học {activeClass.code}</h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">Tổng 38 bài thi</span>
          </div>

          <div className="space-y-3.5 my-5">
            {scoreSpectrum.map((item, i) => {
              const maxVal = 16;
              const percent = (item.count / maxVal) * 100;
              return (
                <div key={i} className="text-xs space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="text-zinc-400">Thang điểm {item.range}:</span>
                    <span className="text-emerald-400 font-bold">{item.count} HS</span>
                  </div>
                  <div className="w-full h-2 rounded bg-[#09090b] border border-[#27272a] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-cyan-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded bg-[#09090b] border border-[#27272a] text-xs text-zinc-400 leading-relaxed">
            💡 <span className="font-semibold text-zinc-200">Đánh giá chung:</span> Phổ điểm lệch phải tích cực (Tập trung nhiều ở dải 8.0 - 8.9). Các câu phân hóa Vận dụng cao ở chương Khúc xạ ánh sáng có tỷ lệ đúng 42%.
          </div>
        </div>

        {/* Struggling Students Real-time Alerts */}
        <div className={`lg:col-span-5 p-5 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-[#18181b] border-emerald-500/20 text-zinc-100 shadow-lg shadow-emerald-950/20' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="font-medium text-sm text-zinc-200">AI Gap Detection (Phát hiện Lỗ Hổng)</h3>
          </div>

          <p className="text-xs text-zinc-400 mb-4">
            AI đã phân tích bài thi gần nhất và phát hiện 03 học sinh cần củng cố lại nền tảng:
          </p>

          <div className="space-y-3">
            {strugglingStudents.map((std, i) => (
              <div
                key={i}
                className="p-3 rounded bg-[#09090b] border border-[#27272a] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="text-zinc-100 font-medium">{std.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-[11px] border border-amber-500/20">
                    {std.score} đ
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  <span className="text-amber-400 font-mono">Lỗ hổng:</span> {std.weakTopic}
                </p>
                <button
                  onClick={() => alert(`Đã tự động gửi bộ bài tập bổ trợ cho ${std.name} qua LMS!`)}
                  className="w-full py-1.5 rounded text-[11px] font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all cursor-pointer mt-1"
                >
                  🚀 Gửi Bài Tập Bổ Trợ Tự Động
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Submissions History Table */}
      <div className={`p-5 rounded-lg border transition-colors ${
        isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <h3 className="font-medium text-sm mb-4 text-zinc-200 font-mono uppercase tracking-wider">Lịch Sử Bài Chấm Bài Thi Lớp {activeClass.code}</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#27272a] text-zinc-500 uppercase font-mono tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Học sinh</th>
                <th className="py-2.5 px-3">Tên bài thi</th>
                <th className="py-2.5 px-3">Thời gian nộp</th>
                <th className="py-2.5 px-3">Phương thức</th>
                <th className="py-2.5 px-3">Điểm số</th>
                <th className="py-2.5 px-3">Đánh giá AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]/60">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-zinc-200">{sub.studentName}</td>
                  <td className="py-3 px-3 text-zinc-400">{sub.examTitle}</td>
                  <td className="py-3 px-3 font-mono text-zinc-500 text-[11px]">{sub.gradedAt}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      OCR Scan ({sub.ocrConfidence}%)
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-sm text-emerald-400">
                    {sub.score} / {sub.maxScore}
                  </td>
                  <td className="py-3 px-3 text-zinc-400 max-w-xs truncate">
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

