import React from 'react';
import { UserRole, ClassRoom, StudentProfile, ColleagueTeacher } from '../types';
import { UserCheck, GraduationCap, Flame, Zap, Moon, Sun, KeyRound, Sparkles, LogIn, User, Database, Radio, Camera, Edit3 } from 'lucide-react';

interface NavbarProps {
  role: UserRole;
  onToggleRole: () => void;
  activeClass: ClassRoom;
  classList: ClassRoom[];
  onSelectClass: (cls: ClassRoom) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  studentXp: number;
  studentStreak: number;
  currentStudent?: StudentProfile;
  currentTeacher?: ColleagueTeacher;
  onOpenStudentLogin?: () => void;
  onOpenOnlineDb?: () => void;
  onOpenProfileEdit?: () => void;
  onOpenApiKeyModal?: () => void;
  isDbConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  onToggleRole,
  activeClass,
  classList,
  onSelectClass,
  isDarkMode,
  onToggleDarkMode,
  studentXp,
  studentStreak,
  currentStudent,
  currentTeacher,
  onOpenStudentLogin,
  onOpenOnlineDb,
  onOpenProfileEdit,
  onOpenApiKeyModal,
  isDbConnected = true
}) => {
  const activeAvatar = role === 'TEACHER'
    ? (currentTeacher?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80')
    : (currentStudent?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80');

  const activeName = role === 'TEACHER' ? (currentTeacher?.name || 'Giáo viên') : (currentStudent?.name || 'Học sinh');

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-[#09090b]/95 border-[#27272a] text-zinc-100 backdrop-blur-md' 
        : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & System Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-emerald-950/40">
            Φ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base tracking-tight text-white bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                HỌC VẬT LÍ THẬT THÚ VỊ
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded border border-emerald-500/40 text-emerald-300 bg-emerald-500/10 font-mono">
                GDPT 2018
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono tracking-tight hidden sm:block">
              Hệ Thống Lớp Học LMS • DB Trực Tuyến & Video Nhúng Link
            </p>
          </div>
        </div>

        {/* Room / Class Selector & Database Status */}
        <div className="flex items-center gap-2">
          
          {/* ALWAYS VISIBLE SETTINGS (API KEY) BUTTON WITH RED TEXT AS DIRECTED BY AI_INSTRUCTIONS.MD */}
          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all font-mono text-xs font-bold cursor-pointer animate-pulse"
              title="Thiết lập Model AI & Nhập Gemini API Key cá nhân"
            >
              <KeyRound className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-400">Settings (API Key)</span>
              <span className="text-rose-500 text-[10px] hidden xl:inline ml-1 font-extrabold">• Lấy API key để sử dụng app</span>
            </button>
          )}

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono ${
            isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider hidden md:inline">Phòng:</span>
            <select
              value={activeClass.code}
              onChange={(e) => {
                const found = classList.find(c => c.code === e.target.value);
                if (found) onSelectClass(found);
              }}
              className="bg-transparent border-none font-semibold text-emerald-400 focus:ring-0 cursor-pointer text-xs"
            >
              {classList.map(cls => (
                <option key={cls.id} value={cls.code} className="bg-[#18181b] text-zinc-200">
                  {cls.code} - {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Database Online Link Button */}
          {onOpenOnlineDb && (
            <button
              onClick={onOpenOnlineDb}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono font-bold transition-all cursor-pointer ${
                isDbConnected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
              }`}
              title="Cấu hình & Đồng bộ Database trực tuyến danh sách lớp"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">
                {isDbConnected ? 'DB Trực Tuyến: Online' : 'DB Trực Tuyến: Offline'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
            </button>
          )}
        </div>

        {/* User Profile Avatar & Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* User Profile Avatar Button */}
          {onOpenProfileEdit && (
            <button
              onClick={onOpenProfileEdit}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-[#18181b] hover:bg-zinc-800 border border-[#27272a] hover:border-emerald-500/50 transition-all cursor-pointer group"
              title="Chỉnh sửa Hồ sơ cá nhân & Ảnh đại diện Avatar"
            >
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-emerald-500/60 shrink-0">
                <img src={activeAvatar} alt={activeName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="w-3 h-3 text-emerald-400" />
                </div>
              </div>

              <div className="text-left hidden md:block font-mono">
                <span className="text-xs font-bold text-white block line-clamp-1 leading-tight">{activeName}</span>
                <span className="text-[9px] text-emerald-400 block leading-tight">Chỉnh sửa hồ sơ ✎</span>
              </div>
            </button>
          )}

          {onOpenStudentLogin && (
            <button
              onClick={onOpenStudentLogin}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono transition-all cursor-pointer ${
                role === 'STUDENT'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-[#18181b] border-[#27272a] text-zinc-300 hover:border-emerald-500/50'
              }`}
              title="Đăng nhập tài khoản học sinh"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-bold">
                {role === 'STUDENT' && currentStudent ? `HS: ${currentStudent.name}` : 'Đăng Nhập HS'}
              </span>
            </button>
          )}

          {role === 'STUDENT' ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{studentStreak} ngày</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
                <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                <span>{studentXp} XP</span>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">LMS Engine: <span className="text-emerald-400">Active</span></span>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-md border transition-colors ${
              isDarkMode ? 'bg-[#18181b] border-[#27272a] text-amber-400 hover:bg-zinc-800' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title="Chuyển chế độ Giao diện"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Role Switcher Switch */}
          <button
            onClick={onToggleRole}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide uppercase transition-all shadow-md ${
              role === 'TEACHER'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40 shadow-emerald-950/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/40'
            }`}
          >
            {role === 'TEACHER' ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Giáo viên</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Học sinh</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};



