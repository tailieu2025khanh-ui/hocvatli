import React, { useState } from 'react';
import { Question, GradeLevel, CognitiveLevel, QuestionType } from '../types';
import { PHYSICS_TOPICS_BY_GRADE } from '../data/mockData';
import { BookOpen, Sparkles, RefreshCw, Upload } from 'lucide-react';

interface QuestionBankProps {
  isDarkMode: boolean;
  questions: Question[];
  onAddQuestion: (q: Question) => void;
  onAddMultipleQuestions: (qs: Question[]) => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  isDarkMode,
  questions,
  onAddQuestion,
  onAddMultipleQuestions
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'ALL'>('ALL');
  const [selectedCognitive, setSelectedCognitive] = useState<CognitiveLevel | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<QuestionType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals / Tabs for Doc Parsing & AI Gen
  const [showParserModal, setShowParserModal] = useState<boolean>(false);
  const [showAiGenModal, setShowAiGenModal] = useState<boolean>(false);
  const [rawTextDoc, setRawTextDoc] = useState<string>('');
  const [isParsingDoc, setIsParsingDoc] = useState<boolean>(false);

  // AI Gen State
  const [genGrade, setGenGrade] = useState<GradeLevel>(12);
  const [genTopic, setGenTopic] = useState<string>('Vật lý Nhiệt & Thuyết động học chất khí');
  const [genCognitive, setGenCognitive] = useState<CognitiveLevel>('VAN_DUNG');
  const [genType, setGenType] = useState<QuestionType>('MCQ_4');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Filtered Questions List
  const filteredQuestions = questions.filter(q => {
    if (selectedGrade !== 'ALL' && q.grade !== selectedGrade) return false;
    if (selectedCognitive !== 'ALL' && q.cognitiveLevel !== selectedCognitive) return false;
    if (selectedType !== 'ALL' && q.type !== selectedType) return false;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return (
        q.prompt.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term) ||
        q.explanation.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Handle Document Parser via `/api/gemini/parse-doc`
  const handleParseDocument = async () => {
    if (!rawTextDoc.trim()) return;
    setIsParsingDoc(true);

    try {
      const response = await fetch('/api/gemini/parse-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent: rawTextDoc,
          grade: selectedGrade === 'ALL' ? 12 : selectedGrade
        })
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.questions)) {
        const newQs: Question[] = data.questions.map((q: any, i: number) => ({
          id: 'parsed_' + Date.now() + '_' + i,
          grade: q.grade || 12,
          topic: q.topic || 'Tổng hợp GDPT 2018',
          cognitiveLevel: q.cognitiveLevel || 'THONG_HIEU',
          type: q.type || 'MCQ_4',
          prompt: q.prompt || 'Câu hỏi trích xuất từ văn bản',
          options: q.options || ['Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D'],
          correctOptionIndex: q.correctOptionIndex ?? 0,
          shortAnswerKey: q.shortAnswerKey,
          shortAnswerUnit: q.shortAnswerUnit,
          trueFalseItems: q.trueFalseItems,
          explanation: q.explanation || 'Giải thích bóc tách bởi Gemini AI Parser.'
        }));

        onAddMultipleQuestions(newQs);
        setShowParserModal(false);
        setRawTextDoc('');
      }
    } catch (error) {
      console.error('Lỗi parse doc:', error);
    } finally {
      setIsParsingDoc(false);
    }
  };

  // Handle AI Question Generator via `/api/gemini/generate-questions`
  const handleGenerateAiQuestions = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/gemini/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: genGrade,
          topic: genTopic,
          cognitiveLevel: genCognitive,
          questionType: genType,
          count: 3
        })
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.questions)) {
        const generatedQs: Question[] = data.questions.map((q: any, i: number) => ({
          id: 'gen_' + Date.now() + '_' + i,
          grade: genGrade,
          topic: genTopic,
          cognitiveLevel: genCognitive,
          type: genType,
          prompt: q.prompt,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          shortAnswerKey: q.shortAnswerKey,
          shortAnswerUnit: q.shortAnswerUnit,
          trueFalseItems: q.trueFalseItems,
          explanation: q.explanation || 'Soạn bởi AI theo tiêu chuẩn GDPT 2018.'
        }));

        onAddMultipleQuestions(generatedQs);
        setShowAiGenModal(false);
      }
    } catch (error) {
      console.error('Lỗi tạo câu hỏi:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCognitiveBadge = (level: CognitiveLevel) => {
    switch (level) {
      case 'NHAN_BIET':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Nhận biết</span>;
      case 'THONG_HIEU':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Thông hiểu</span>;
      case 'VAN_DUNG':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Vận dụng</span>;
      case 'VAN_DUNG_CAO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Vận dụng cao</span>;
    }
  };

  return (
    <div className={`rounded-lg border p-6 transition-colors shadow-lg ${
      isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#27272a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Ngân Hàng Câu Hỏi Vật Lý GDPT 2018</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Tổng số: <span className="font-mono font-bold text-emerald-400">{questions.length} câu hỏi</span> chuẩn hóa theo 4 mức độ tư duy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Doc Parser Trigger Button */}
          <button
            onClick={() => setShowParserModal(true)}
            className="px-3 py-2 rounded text-xs font-mono font-bold bg-[#09090b] hover:bg-zinc-800 text-zinc-200 border border-[#27272a] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Parser Word/PDF</span>
          </button>

          {/* AI Question Generator Trigger Button */}
          <button
            onClick={() => setShowAiGenModal(true)}
            className="px-3 py-2 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Soạn Đề AI Tự Động</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded bg-[#09090b] border border-[#27272a] space-y-3 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          
          {/* Grade Filter */}
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Khối Lớp:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value) as GradeLevel)}
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:border-emerald-500 ${
                isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-white border-slate-300'
              }`}
            >
              <option value="ALL">Tất cả Khối (10, 11, 12)</option>
              <option value="10">Vật lý Lớp 10</option>
              <option value="11">Vật lý Lớp 11</option>
              <option value="12">Vật lý Lớp 12</option>
            </select>
          </div>

          {/* Cognitive Level Filter */}
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Mức Độ Tư Duy:</label>
            <select
              value={selectedCognitive}
              onChange={(e) => setSelectedCognitive(e.target.value as any)}
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:border-emerald-500 ${
                isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-white border-slate-300'
              }`}
            >
              <option value="ALL">Tất cả 4 Mức độ</option>
              <option value="NHAN_BIET">Nhận biết</option>
              <option value="THONG_HIEU">Thông hiểu</option>
              <option value="VAN_DUNG">Vận dụng</option>
              <option value="VAN_DUNG_CAO">Vận dụng cao</option>
            </select>
          </div>

          {/* Question Type Filter */}
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Dạng Câu Hỏi:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:border-emerald-500 ${
                isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-white border-slate-300'
              }`}
            >
              <option value="ALL">Tất cả dạng câu hỏi</option>
              <option value="MCQ_4">Trắc nghiệm 4 Lựa chọn</option>
              <option value="TRUE_FALSE_4">Trắc nghiệm Đúng/Sai (4 ý)</option>
              <option value="SHORT_ANSWER">Trả lời ngắn số/đơn vị</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Tìm Kiếm Từ Khóa:</label>
            <input
              type="text"
              placeholder="VD: Dao động, Khúc xạ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:border-emerald-500 ${
                isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-white border-slate-300'
              }`}
            />
          </div>

        </div>
      </div>

      {/* Questions Cards Grid */}
      <div className="space-y-4">
        {filteredQuestions.map((q, index) => (
          <div
            key={q.id}
            className={`p-4 rounded border transition-all hover:border-emerald-500/40 ${
              isDarkMode ? 'bg-[#09090b] border-[#27272a]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Lớp {q.grade}
                </span>
                {getCognitiveBadge(q.cognitiveLevel)}
                <span className="text-xs font-mono text-zinc-400">
                  {q.topic}
                </span>
              </div>

              <span className="text-[11px] font-mono text-zinc-500">
                {q.type === 'MCQ_4' ? 'Trắc nghiệm 4 lựa chọn' : q.type === 'TRUE_FALSE_4' ? 'Trắc nghiệm Đúng/Sai' : 'Trả lời ngắn'}
              </span>
            </div>

            <p className="font-semibold text-sm mb-3 text-zinc-100">{index + 1}. {q.prompt}</p>

            {/* Answer Display based on type */}
            {q.type === 'MCQ_4' && q.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs">
                {q.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded border font-mono ${
                      i === q.correctOptionIndex
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                        : isDarkMode ? 'border-[#27272a] text-zinc-400' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}. {opt} {i === q.correctOptionIndex && '✓'}
                  </div>
                ))}
              </div>
            )}

            {q.type === 'TRUE_FALSE_4' && q.trueFalseItems && (
              <div className="space-y-1.5 mb-3 text-xs font-mono">
                {q.trueFalseItems.map((tf, i) => (
                  <div
                    key={i}
                    className="p-2 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-between"
                  >
                    <span>{String.fromCharCode(97 + i)}) {tf.statement}</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${
                      tf.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {tf.isCorrect ? 'ĐÚNG' : 'SAI'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {q.type === 'SHORT_ANSWER' && (
              <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 mb-3">
                <span className="font-bold">Đáp án ngắn:</span> {q.shortAnswerKey} {q.shortAnswerUnit} (Dung sai ±{q.shortAnswerTolerance || 0.1})
              </div>
            )}

            <div className="text-xs text-zinc-400 bg-[#18181b] p-2.5 rounded border border-[#27272a]">
              <span className="font-mono text-emerald-400 font-bold">Lời giải chi tiết:</span> {q.explanation}
            </div>
          </div>
        ))}
      </div>

      {/* DOC PARSER MODAL */}
      {showParserModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-lg border p-6 shadow-2xl transition-colors ${
            isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-4 border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-base text-white">Bóc Tách Tự Động Từ Văn Bản (Word / PDF)</h3>
              </div>
              <button onClick={() => setShowParserModal(false)} className="text-xs text-zinc-400 hover:text-white font-mono cursor-pointer">Đóng ✕</button>
            </div>

            <p className="text-xs text-zinc-400 mb-3">
              Dán đoạn văn bản chứa câu hỏi đề thi (Word .docx, PDF hoặc TXT). Gemini AI sẽ tự động bóc tách thành các câu hỏi chuẩn hóa.
            </p>

            <textarea
              rows={8}
              value={rawTextDoc}
              onChange={(e) => setRawTextDoc(e.target.value)}
              placeholder="Dán nội dung câu hỏi từ file Word vào đây... (Ví dụ: Câu 1. Một vật dao động điều hòa... A. ... B. ...)"
              className={`w-full p-3 rounded border text-xs font-mono mb-4 focus:outline-none focus:border-emerald-500 ${
                isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-100' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowParserModal(false)}
                className="px-4 py-2 rounded text-xs font-mono bg-[#09090b] text-zinc-300 hover:bg-zinc-800 border border-[#27272a] cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleParseDocument}
                disabled={isParsingDoc || !rawTextDoc.trim()}
                className="px-4 py-2 rounded text-xs font-mono font-bold bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer"
              >
                {isParsingDoc ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Bắt Đầu Bóc Tách Gemini AI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI GENERATOR MODAL */}
      {showAiGenModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-lg border p-6 shadow-2xl transition-colors ${
            isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-4 border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-base text-white">Soạn Đề Thi Tự Động Với Gemini AI</h3>
              </div>
              <button onClick={() => setShowAiGenModal(false)} className="text-xs text-zinc-400 hover:text-white font-mono cursor-pointer">Đóng ✕</button>
            </div>

            <div className="space-y-3 text-xs mb-6 font-mono">
              <div>
                <label className="block text-zinc-300 mb-1">Chọn Khối Lớp:</label>
                <select
                  value={genGrade}
                  onChange={(e) => setGenGrade(Number(e.target.value) as GradeLevel)}
                  className={`w-full p-2.5 rounded border ${isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-200' : 'bg-slate-50 border-slate-300'}`}
                >
                  <option value={10}>Vật lý Lớp 10</option>
                  <option value={11}>Vật lý Lớp 11</option>
                  <option value={12}>Vật lý Lớp 12</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Chuyên đề Vật lý GDPT 2018:</label>
                <select
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className={`w-full p-2.5 rounded border ${isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-200' : 'bg-slate-50 border-slate-300'}`}
                >
                  {PHYSICS_TOPICS_BY_GRADE[genGrade].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Mức độ tư duy:</label>
                <select
                  value={genCognitive}
                  onChange={(e) => setGenCognitive(e.target.value as CognitiveLevel)}
                  className={`w-full p-2.5 rounded border ${isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-200' : 'bg-slate-50 border-slate-300'}`}
                >
                  <option value="NHAN_BIET">Nhận biết</option>
                  <option value="THONG_HIEU">Thông hiểu</option>
                  <option value="VAN_DUNG">Vận dụng</option>
                  <option value="VAN_DUNG_CAO">Vận dụng cao</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Dạng bài thi:</label>
                <select
                  value={genType}
                  onChange={(e) => setGenType(e.target.value as QuestionType)}
                  className={`w-full p-2.5 rounded border ${isDarkMode ? 'bg-[#09090b] border-[#27272a] text-zinc-200' : 'bg-slate-50 border-slate-300'}`}
                >
                  <option value="MCQ_4">Trắc nghiệm 4 Lựa chọn</option>
                  <option value="TRUE_FALSE_4">Trắc nghiệm Đúng/Sai 4 ý</option>
                  <option value="SHORT_ANSWER">Trả lời ngắn số/đơn vị</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAiGenModal(false)}
                className="px-4 py-2 rounded text-xs font-mono bg-[#09090b] text-zinc-300 hover:bg-zinc-800 border border-[#27272a] cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleGenerateAiQuestions}
                disabled={isGenerating}
                className="px-4 py-2 rounded text-xs font-mono font-bold bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Soạn 3 Câu Tự Động</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

