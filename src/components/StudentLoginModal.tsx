import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { LogIn, KeyRound, ShieldAlert, CheckCircle, UserCheck, Lock } from 'lucide-react';

interface StudentLoginModalProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  onLoginSuccess: (student: StudentProfile) => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isDarkMode,
  isOpen,
  onClose,
  students,
  onLoginSuccess
}) => {
  const [usernameInput, setUsernameInput] = useState<string>('std_minhhuy');
  const [passwordInput, setPasswordInput] = useState<string>('MinhHuy2026@');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const found = students.find(
      s => s.username.toLowerCase() === usernameInput.trim().toLowerCase()
    );

    if (!found) {
      setErrorMsg('Không tìm thấy tên đăng nhập học sinh này.');
      return;
    }

    if (found.password !== passwordInput.trim()) {
      setErrorMsg('Mật khẩu không chính xác. Vui lòng kiểm tra lại hoặc liên hệ Thầy Cô quản lý.');
      return;
    }

    if (found.status === 'LOCKED') {
      setErrorMsg(`Tài khoản "${found.name}" hiện đang bị KHÓA bởi Thầy Cô quản lý (${found.managerName}).`);
      return;
    }

    // Success
    onLoginSuccess(found);
    onClose();
  };

  const handleQuickSelectStudent = (std: StudentProfile) => {
    setUsernameInput(std.username);
    setPasswordInput(std.password);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#18181b] border border-[#27272a] rounded-lg max-w-md w-full p-6 text-zinc-100 shadow-2xl space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                Đăng Nhập Tài Khoản Học Sinh
              </h3>
              <p className="text-[11px] text-zinc-400">
                Nhập Tên Đăng Nhập & Mật Khẩu được Thầy Cô cấp
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white cursor-pointer">
            ✕
          </button>
        </div>

        {/* Quick Demo Student Selector */}
        <div className="p-3 rounded bg-[#09090b] border border-[#27272a]">
          <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
            Chọn nhanh tài khoản mẫu để đăng nhập thử:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {students.slice(0, 4).map((s) => (
              <button
                key={s.id}
                onClick={() => handleQuickSelectStudent(s)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all cursor-pointer ${
                  usernameInput === s.username
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 font-bold'
                    : 'bg-[#18181b] text-zinc-300 border-[#27272a] hover:bg-zinc-800'
                }`}
              >
                {s.name} ({s.username})
              </button>
            ))}
          </div>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Tên Đăng Nhập / Username:</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: std_minhhuy"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-emerald-400 font-mono text-sm font-bold focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-mono mb-1 uppercase text-[10px]">Mật Khẩu Tài Khoản:</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-white font-mono text-sm font-bold focus:border-emerald-500 outline-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 border-t border-[#27272a] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-mono bg-[#09090b] text-zinc-400 border border-[#27272a] cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Xác Nhận Đăng Nhập</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
