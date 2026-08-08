import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { BrainCircuit, Sparkles, Send, Bot, User, HelpCircle, CheckCircle, RefreshCw, Lightbulb, BookOpen } from 'lucide-react';

interface PhysicsAITutorModalProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
}

interface ChatMessage {
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  hintStep?: string;
  remediationQuestions?: { topic: string; questionText: string; hint: string }[];
}

export const PhysicsAITutorModal: React.FC<PhysicsAITutorModalProps> = ({
  isDarkMode,
  isOpen,
  onClose,
  student
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'AI',
      text: `Xin chào ${student.name}! Thầy là Trợ Lý AI Tutor Sư Phạm Vật Lý 24/7. Thầy sẽ giúp em hiểu sâu bản chất hiện tượng và hướng dẫn từng bước tư duy giải bài tập mà không làm hộ bài. Em đang gặp thắc mắc ở câu hỏi hay bài tập Vật lý nào?`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      hintStep: 'Bước 1: Xác định đại lượng đã cho và đại lượng cần tìm'
    }
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;

    const userMsgText = inputText;
    setInputText('');

    const userMsg: ChatMessage = {
      sender: 'USER',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      // Call Gemini API gap detection & tutor endpoint
      const response = await fetch('/api/gemini/analyze-gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          grade: student.grade,
          topicScores: student.topicProficiency,
          recentMistakes: [{ userQuery: userMsgText }]
        })
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        const aiMsg: ChatMessage = {
          sender: 'AI',
          text: data.analysis.encouragementMessage || `Thầy hiểu thắc mắc của em. Hãy cùng phân tích câu hỏi này nhé:\n\n1. Hiện tượng vật lý cốt lõi: Liên quan đến ${data.analysis.weakKnowledgeZones?.[0]?.topic || 'bản chất hiện tượng'}.\n2. Gợi ý tư duy: ${data.analysis.weakKnowledgeZones?.[0]?.rootCause || 'Hãy áp dụng công thức bảo toàn năng lượng/định luật bảo toàn'}.\n3. Lộ trình giải 3 bước:\n${(data.analysis.actionPlan || []).join('\n')}`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          remediationQuestions: data.analysis.remediationExercisePrompts
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('Không thể kết nối Gemini Tutor.');
      }
    } catch (err) {
      // Fallback pedagogical response
      setTimeout(() => {
        const fallbackMsg: ChatMessage = {
          sender: 'AI',
          text: `Cảm ơn em! Để giải bài toán này (${userMsgText}), em hãy thực hiện theo 3 bước tư duy sư phạm này nhé:\n\n• Bước 1: Liệt kê các đại lượng đề bài đã cho (ví dụ: m, v, T, p...).\n• Bước 2: Nhận diện xem đây là quá trình nào (Đẳng nhiệt, Đẳng tích, hay Con lắc lò xo).\n• Bước 3: Áp dụng công thức tương ứng và kiểm tra lại đơn vị chuẩn SI trước khi bấm máy tính!`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }, 1000);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`w-full max-w-3xl h-[85vh] rounded-xl border shadow-2xl transition-all overflow-hidden flex flex-col ${
        isDarkMode ? 'bg-[#121215] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className="p-4 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Trợ Lý AI Physics Tutor Sư Phạm 24/7
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Gemini Socratic AI
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Hướng dẫn tư duy giải bài tập Vật lý THPT • Không cho sẵn đáp án • Chuẩn GDPT 2018
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-xs font-mono text-zinc-400 hover:text-white cursor-pointer">Đóng ✕</button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'AI' && (
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-xl rounded-xl p-4 space-y-2 ${
                msg.sender === 'USER'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-[#18181b] border border-[#27272a] text-zinc-200 rounded-tl-none'
              }`}>
                <div className="flex justify-between items-center text-[10px] opacity-70 border-b border-white/10 pb-1">
                  <span>{msg.sender === 'USER' ? student.name : 'AI Physics Tutor'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap leading-relaxed text-xs">
                  {msg.text}
                </div>

                {msg.remediationQuestions && msg.remediationQuestions.length > 0 && (
                  <div className="mt-3 p-3 rounded bg-[#09090b] border border-[#27272a] space-y-2">
                    <span className="text-amber-400 font-bold block flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4" />
                      3 Bài Tập Luyện Phản Xạ Tương Tự:
                    </span>
                    {msg.remediationQuestions.map((rq, qIdx) => (
                      <div key={qIdx} className="p-2 rounded bg-[#18181b] border border-[#27272a] text-zinc-300">
                        <strong className="text-emerald-400">{rq.topic}:</strong> {rq.questionText}
                        <div className="text-[10px] text-zinc-500 italic mt-0.5">Gợi ý: {rq.hint}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'USER' && (
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 items-center text-zinc-400 text-xs font-mono">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <span>AI Physics Tutor đang phân tích hiện tượng và soạn câu trả lời sư phạm...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 bg-[#09090b] border-t border-[#27272a] flex items-center gap-2">
          <input
            type="text"
            placeholder="Nhập câu hỏi hoặc đề bài Vật lý em đang thắc mắc tại đây..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-[#18181b] border border-[#27272a] text-zinc-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Hỏi AI</span>
          </button>
        </form>

      </div>
    </div>
  );
};
