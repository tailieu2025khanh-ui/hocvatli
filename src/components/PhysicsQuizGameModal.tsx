import React, { useState, useEffect } from 'react';
import { Question, StudentProfile } from '../types';
import { MOCK_QUESTIONS } from '../data/mockData';
import { Gamepad2, Flame, Zap, Trophy, Timer, Swords, CheckCircle2, XCircle, RotateCcw, Award, Volume2, Sparkles } from 'lucide-react';

interface PhysicsQuizGameModalProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onUpdateXp?: (xpToAdd: number) => void;
}

export const PhysicsQuizGameModal: React.FC<PhysicsQuizGameModalProps> = ({
  isDarkMode,
  isOpen,
  onClose,
  student,
  onUpdateXp,
}) => {
  const [gameMode, setGameMode] = useState<'SPEED_RUN' | 'VS_AI'>('SPEED_RUN');
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAME_OVER'>('IDLE');
  
  // Speed Run States
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);

  // VS AI States
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [aiHp, setAiHp] = useState<number>(100);
  const [aiActionText, setAiActionText] = useState<string>('');

  const questionsList = MOCK_QUESTIONS;
  const currentQ = questionsList[currentQIndex % questionsList.length];

  // Timer Effect for Speed Run
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('GAME_OVER');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  if (!isOpen) return null;

  // Start Game
  const startGame = (mode: 'SPEED_RUN' | 'VS_AI') => {
    setGameMode(mode);
    setGameState('PLAYING');
    setCurrentQIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setPlayerHp(100);
    setAiHp(100);
    setSelectedOption(null);
    setFeedback(null);
    setAiActionText('AI Bot Vật Lý đã sẵn sàng thách đấu!');
  };

  // Option Click Handler
  const handleAnswerSelect = (optionIdx: number) => {
    if (feedback !== null) return;
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === currentQ.correctOptionIndex;

    if (isCorrect) {
      setFeedback('CORRECT');
      const bonus = (streak + 1) * 50;
      setScore(prev => prev + 100 + bonus);
      setStreak(prev => prev + 1);

      if (gameMode === 'VS_AI') {
        const damage = 25 + streak * 5;
        setAiHp(prev => Math.max(0, prev - damage));
        setAiActionText(`⚡ Bạn đã ra đòn chính xác! AI Bot mất ${damage} HP!`);

        if (aiHp - damage <= 0) {
          setGameState('GAME_OVER');
          if (onUpdateXp) onUpdateXp(300);
          return;
        }
      }
    } else {
      setFeedback('WRONG');
      setStreak(0);

      if (gameMode === 'VS_AI') {
        const damage = 20;
        setPlayerHp(prev => Math.max(0, prev - damage));
        setAiActionText(`🔴 Rất tiếc! AI Bot phản công và gây ${damage} HP sát thương!`);

        if (playerHp - damage <= 0) {
          setGameState('GAME_OVER');
          return;
        }
      }
    }

    setTimeout(() => {
      setSelectedOption(null);
      setFeedback(null);
      setCurrentQIndex(prev => prev + 1);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`w-full max-w-3xl rounded-xl border p-6 shadow-2xl transition-all overflow-hidden flex flex-col ${
        isDarkMode ? 'bg-[#121215] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Gamepad2 className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white tracking-wide flex items-center gap-2">
                Minigame Đấu Trí Vật Lý 1v1 & Đua Tốc Độ
              </h3>
              <span className="text-xs text-zinc-400 font-mono">
                HỌC VẬT LÍ THẬT THÚ VỊ • Gamification XP & Badges
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-xs font-mono text-zinc-400 hover:text-white cursor-pointer">Đóng ✕</button>
        </div>

        {/* IDLE MODE SELECTOR */}
        {gameState === 'IDLE' && (
          <div className="py-8 space-y-6 text-center">
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl font-extrabold text-white">Vừa Học Vừa Chơi • Chinh Phục Đỉnh Cao</h2>
              <p className="text-xs text-zinc-400">
                Thử thách kiến thức Vật lý GDPT 2018 với 2 chế độ thi đấu đỉnh cao. Tích lũy XP để thăng cấp và nhận Huy hiệu Vinh Danh!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left font-mono">
              <div 
                onClick={() => startGame('SPEED_RUN')}
                className="p-5 rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-[#18181b] to-[#121215] hover:border-amber-400 cursor-pointer transition-all hover:scale-105"
              >
                <div className="flex items-center justify-between mb-2">
                  <Timer className="w-8 h-8 text-amber-400" />
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">60 Giây</span>
                </div>
                <h4 className="font-bold text-sm text-white mb-1">⚡ Đua Tốc Độ 60s Solo</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Trả lời nhiều câu trắc nghiệm nhất có thể trong 60 giây. Nhân đôi điểm với Chuỗi Combo Streak!
                </p>
              </div>

              <div 
                onClick={() => startGame('VS_AI')}
                className="p-5 rounded-xl border border-rose-500/40 bg-gradient-to-br from-rose-500/10 via-[#18181b] to-[#121215] hover:border-rose-400 cursor-pointer transition-all hover:scale-105"
              >
                <div className="flex items-center justify-between mb-2">
                  <Swords className="w-8 h-8 text-rose-400" />
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">1v1 PvP / AI</span>
                </div>
                <h4 className="font-bold text-sm text-white mb-1">⚔️ Đấu Trí 1v1 Với AI Bot</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Thi đấu đối kháng thanh máu HP với AI Bot Vật lý. Trả lời đúng để tung đòn sát thương!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PLAYING STATE */}
        {gameState === 'PLAYING' && (
          <div className="space-y-6">
            
            {/* HUD Status Bar */}
            <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              {gameMode === 'SPEED_RUN' ? (
                <>
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>Thời gian: <strong className="text-amber-400 text-sm">{timeLeft}s</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span>Combo Streak: <strong className="text-rose-400 text-sm">x{streak}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <span>Điểm: <strong className="text-emerald-400 text-sm">{score}</strong></span>
                  </div>
                </>
              ) : (
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold">🎓 Bạn ({student.name}): {playerHp} HP</span>
                    <span className="text-rose-400 font-bold">🤖 AI Bot Vật Lý: {aiHp} HP</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${playerHp}%` }} />
                    </div>
                    <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${aiHp}%` }} />
                    </div>
                  </div>

                  <p className="text-[11px] text-amber-300 font-mono text-center pt-1">{aiActionText}</p>
                </div>
              )}
            </div>

            {/* Question Screen */}
            <div className="p-5 rounded-xl bg-[#09090b] border border-[#27272a] space-y-4">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>Câu {currentQIndex + 1} ({currentQ.cognitiveLevel})</span>
                <span className="text-emerald-400">{currentQ.topic}</span>
              </div>

              <h3 className="font-bold text-base text-white leading-relaxed">
                {currentQ.prompt}
              </h3>

              {currentQ.type === 'MCQ_4' && currentQ.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctOptionIndex;
                    let btnStyle = 'bg-[#18181b] border-[#27272a] text-zinc-200 hover:border-emerald-500/50';

                    if (feedback !== null && isSelected) {
                      btnStyle = isCorrect
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={feedback !== null}
                        className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-black flex items-center justify-center font-bold text-zinc-400 text-[11px]">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* GAME OVER STATE */}
        {gameState === 'GAME_OVER' && (
          <div className="py-8 space-y-6 text-center font-mono">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">KẾT THÚC THÁCH ĐẤU!</h2>
              <p className="text-xs text-zinc-400">
                {gameMode === 'SPEED_RUN' ? `TỔNG ĐIỂM ĐẠT ĐƯỢC: ${score} ĐIỂM` : playerHp > 0 ? '🏆 BẠN ĐÃ CHIẾN THẮNG AI BOT VẬT LÝ!' : '🔴 RẤT TIẾC, AI BOT ĐÃ THẮNG'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] max-w-sm mx-auto space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Số câu đã trả lời:</span>
                <span className="text-white font-bold">{currentQIndex} câu</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Phần thưởng XP:</span>
                <span className="text-emerald-400 font-bold">+{gameMode === 'SPEED_RUN' ? Math.floor(score / 5) : 300} XP</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => startGame(gameMode)}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi Lại Chế Độ Phút Này</span>
              </button>

              <button
                onClick={() => setGameState('IDLE')}
                className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer"
              >
                Chọn Chế Độ Khác
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
