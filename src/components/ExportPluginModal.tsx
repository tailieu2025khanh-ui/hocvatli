import React, { useState } from 'react';
import { ExamMatrix, Question, TeachingMaterial } from '../types';
import { FileSpreadsheet, Presentation, BookOpen, Copy, Check, Download, FileText } from 'lucide-react';
import { exportExamToWordDocx } from '../utils/docxExport';
import { exportMaterialToPowerPoint } from '../utils/pptxExport';
import { MOCK_QUESTIONS } from '../data/mockData';

interface ExportPluginModalProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  examMatrix: ExamMatrix;
  questions?: Question[];
}

export const ExportPluginModal: React.FC<ExportPluginModalProps> = ({
  isDarkMode,
  isOpen,
  onClose,
  examMatrix,
  questions = MOCK_QUESTIONS
}) => {
  const [selectedTarget, setSelectedTarget] = useState<'CANVA' | 'WORD' | 'NOTEBOOKLM'>('CANVA');
  const [formattedOutput, setFormattedOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGenerateExport = async (target: 'CANVA' | 'WORD' | 'NOTEBOOKLM') => {
    setSelectedTarget(target);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/gemini/export-connector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          examData: examMatrix
        })
      });

      const data = await response.json();
      if (data.success) {
        setFormattedOutput(data.formattedContent);
      } else {
        throw new Error('Lỗi xuất nội dung.');
      }
    } catch (err) {
      console.error('Lỗi export connector:', err);
      if (target === 'CANVA') {
        setFormattedOutput(`📌 PROMPT THIẾT KẾ SLIDE BÀI GIẢNG TRÊN CANVA:
--------------------------------------------------
Topic: ${examMatrix.title}
Design Style: Modern EdTech Science Minimalist, Dark/Light High Contrast Physics Lab.
Color Palette: Emerald Green (#10B981), Zinc (#18181B), Cyan (#06B6D4).

Slide 1: Hero Cover Title - "${examMatrix.title}" (Khối ${examMatrix.grade} - GDPT 2018)
Slide 2: Ma trận phân bổ 4 mức độ tư duy (Nhận biết: ${examMatrix.nhanBietCount}, Thông hiểu: ${examMatrix.thongHieuCount}, Vận dụng: ${examMatrix.vanDungCount}, Vận dụng cao: ${examMatrix.vanDungCaoCount})
Slide 3-10: Các câu hỏi minh họa kèm sơ đồ vector và mô phỏng thí nghiệm.`);
      } else if (target === 'NOTEBOOKLM') {
        setFormattedOutput(`📚 NỘI DUNG TỔNG HỢP CHO NOTEBOOKLM & GEMINI:
--------------------------------------------------
Tên tài liệu: Tóm tắt Kiến thức & Ma trận Đề thi Vật lý 12 GDPT 2018
Phân bổ chuyên đề:
- Vật lý Nhiệt & Khí lý tưởng: 10 câu
- Từ trường & Lực Lorentz: 8 câu
- Hạt nhân & Sóng điện từ: 6 câu
- Vật lý Lượng tử: 4 câu

Thuật ngữ cốt lõi & Công thức trọng tâm:
1. Thuyết động học chất khí: pV = nRT = (1/3) N m v²_tb
2. Định luật Snell khúc xạ: n1 sin i = n2 sin r
3. Chu kỳ con lắc lò xo: T = 2π √(m/k)`);
      } else {
        setFormattedOutput(`📄 ĐỊNH DẠNG XUẤT WORD & PPT DECK:
--------------------------------------------------
SỞ GIÁO DỤC VÀ ĐÀO TẠO
ĐỀ THI MÔN VẬT LÝ KỲ THI TỐT NGHIỆP THPT NĂM 2026
Thời gian làm bài: ${examMatrix.durationMinutes} phút

I. PHẦN TRẮC NGHIỆM 4 LỰA CHỌN (${examMatrix.nhanBietCount} câu)
... (Đã sẵn sàng tải trực tiếp file .docx & .ppt bên dưới)`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadDocxDirect = () => {
    exportExamToWordDocx(examMatrix, questions);
  };

  const handleDownloadPptxDirect = () => {
    const sampleMat: TeachingMaterial = {
      id: 'mat_slide',
      title: examMatrix.title,
      description: 'Bộ slide bài giảng chuẩn cấu trúc GDPT 2018 dành cho học sinh.',
      type: 'SLIDE',
      uploadedByTeacherId: 'tch_1',
      uploadedByTeacherName: 'ThS. Nguyễn Văn Đức',
      uploadedDate: new Date().toISOString().split('T')[0],
      grade: examMatrix.grade,
      topic: 'Vật lý Nhiệt & Dao Động Điều Hòa',
      assignedClassCodes: ['PHY12-PRO'],
      viewCount: 1,
      downloadCount: 1
    };
    exportMaterialToPowerPoint(sampleMat);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-3xl rounded-xl border p-6 shadow-2xl transition-colors ${
        isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        <div className="flex items-center justify-between mb-4 border-b border-[#27272a] pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg text-white">Đồng Bộ & Xuất Ngoại Vi (Word, PowerPoint, Canva, NotebookLM)</h3>
          </div>
          <button onClick={onClose} className="text-xs text-zinc-400 hover:text-white font-mono cursor-pointer">Đóng ✕</button>
        </div>

        {/* 1-CLICK DIRECT FILE DOWNLOAD BANNER */}
        <div className="p-4 mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="font-bold text-emerald-300 block text-sm">⚡ Tải Trực Tiếp File Thực Tế (.docx & .ppt):</span>
            <span className="text-zinc-400">Xuất file Đề thi Word hoặc Slide PowerPoint bài giảng tức thì</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadDocxDirect}
              className="px-3.5 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow cursor-pointer transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Tải Đề Thi Word (.docx)</span>
            </button>

            <button
              onClick={handleDownloadPptxDirect}
              className="px-3.5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 shadow cursor-pointer transition-all"
            >
              <Presentation className="w-4 h-4" />
              <span>Tải Slide PPT (.ppt)</span>
            </button>
          </div>
        </div>

        {/* Connectors Select Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => handleGenerateExport('CANVA')}
            className={`p-3.5 rounded border text-left transition-all flex items-center gap-3 cursor-pointer ${
              selectedTarget === 'CANVA'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md font-mono'
                : isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-300' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <Presentation className="w-6 h-6 shrink-0" />
            <div>
              <span className="font-bold text-xs block">Canva Design</span>
              <span className="text-[10px] opacity-80 block">Prompt Slide & Bài Giảng</span>
            </div>
          </button>

          <button
            onClick={() => handleGenerateExport('WORD')}
            className={`p-3.5 rounded border text-left transition-all flex items-center gap-3 cursor-pointer ${
              selectedTarget === 'WORD'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md font-mono'
                : isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-300' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <Download className="w-6 h-6 shrink-0" />
            <div>
              <span className="font-bold text-xs block">Word / PPT Matrix</span>
              <span className="text-[10px] opacity-80 block">Định dạng .docx & .pptx</span>
            </div>
          </button>

          <button
            onClick={() => handleGenerateExport('NOTEBOOKLM')}
            className={`p-3.5 rounded border text-left transition-all flex items-center gap-3 cursor-pointer ${
              selectedTarget === 'NOTEBOOKLM'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md font-mono'
                : isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-300' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <BookOpen className="w-6 h-6 shrink-0" />
            <div>
              <span className="font-bold text-xs block">NotebookLM</span>
              <span className="text-[10px] opacity-80 block">Bộ tài liệu tổng hợp Gemini</span>
            </div>
          </button>
        </div>

        {/* Formatted Output Area */}
        <div className="relative mb-6">
          <textarea
            rows={8}
            readOnly
            value={isGenerating ? 'Gemini AI đang khởi tạo dữ liệu đồng bộ...' : formattedOutput}
            className={`w-full p-4 rounded border text-xs font-mono transition-colors focus:outline-none ${
              isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-200' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          />

          {formattedOutput && (
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 px-3 py-1.5 rounded text-xs font-mono font-bold bg-[#18181b] border border-[#27272a] text-white hover:bg-zinc-800 flex items-center gap-1.5 shadow cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép'}</span>
            </button>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded text-xs font-mono font-bold bg-[#09090b] border border-[#27272a] text-zinc-300 hover:bg-zinc-800 cursor-pointer"
          >
            Đóng Modal
          </button>
        </div>

      </div>
    </div>
  );
};


