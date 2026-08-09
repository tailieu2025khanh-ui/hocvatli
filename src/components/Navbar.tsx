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
        ? 'bg-[#0c0c0e]/95 border-[#27272a] text-zinc-100 backdrop-blur-md' 
        : 'bg-white/95 border-slate-200/90 text-slate-800 backdrop-blur-md shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo & System Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md">
            Φ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-black text-base tracking-tight ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent' 
                  : 'text-teal-800 font-extrabold'
              }`}>
                HỌC VẬT LÍ THẬT THÚ VỊ
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded font-mono ${
                isDarkMode ? 'border border-emerald-500/40 text-emerald-300 bg-emerald-500/10' : 'border border-teal-300 text-teal-700 bg-teal-50'
              }`}>
                GDPT 2018
              </span>
            </div>
            <p className={`text-[10px] font-mono tracking-tight hidden sm:block ${
              isDarkMode ? 'text-zinc-400' : 'text-slate-500'
            }`}>
              Hệ Thống Lớp Học LMS • DB Trực Tuyến & Video Nhúng Link
            </p>
          </div>
        </div>

        {/* Room / Class Selector & Database Status */}
        <div className="flex items-center gap-2.5">
          
          {/* ALWAYS VISIBLE SETTINGS (API KEY) BUTTON WITH RED TEXT AS DIRECTED BY AI_INSTRUCTIONS.MD */}
          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border transition-all font-mono text-xs sm:text-sm font-bold cursor-pointer whitespace-nowrap ${
                isDarkMode 
                  ? 'border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 animate-pulse' 
                  : 'border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 shadow-xs'
              }`}
              title="Thiết lập Model AI & Nhập Gemini API Key cá nhân"
            >
              <KeyRound className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Settings (API Key)</span>
              <span className={`text-[11px] hidden xl:inline ml-1 font-extrabold ${
                isDarkMode ? 'text-rose-400' : 'text-rose-700'
              }`}>• Lấy API key để sử dụng app</span>
            </button>
          )}

          <div className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs sm:text-sm font-mono ${
            isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}>
            <KeyRound className="w-4 h-4 text-teal-600 shrink-0" />
            <span className={`text-xs uppercase tracking-wider font-bold hidden md:inline ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>Phòng:</span>
            <select
              value={activeClass.code}
              onChange={(e) => {
                const found = classList.find(c => c.code === e.target.value);
                if (found) onSelectClass(found);
              }}
              className={`bg-transparent border-none font-extrabold focus:ring-0 cursor-pointer text-xs sm:text-sm ${
                isDarkMode ? 'text-emerald-400' : 'text-teal-800'
              }`}
            >
              {classList.map(cls => (
                <option key={cls.id} value={cls.code} className={isDarkMode ? 'bg-[#18181b] text-zinc-200' : 'bg-white text-slate-800'}>
                  {cls.code} - {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Database Online Link Button */}
          {onOpenOnlineDb && (
            <button
              onClick={onOpenOnlineDb}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                isDbConnected
                  ? (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100')
                  : (isDarkMode ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100')
              }`}
              title="Cấu hình & Đồng bộ Database trực tuyến danh sách lớp"
            >
              <Database className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">
                {isDbConnected ? 'DB Trực Tuyến: Online' : 'DB Trực Tuyến: Offline'}
              </span>
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isDbConnected ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
            </button>
          )}
        </div>

        {/* User Profile Avatar & Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* User Profile Avatar Button */}
          {onOpenProfileEdit && (
            <button
              onClick={onOpenProfileEdit}
              className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer group whitespace-nowrap ${
                isDarkMode 
                  ? 'bg-[#18181b] hover:bg-zinc-800 border-[#27272a] hover:border-emerald-500/50' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
              title="Chỉnh sửa Hồ sơ cá nhân & Ảnh đại diện Avatar"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-teal-500 shrink-0">
                <img src={activeAvatar} alt={activeName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <div className="text-left hidden md:block font-mono">
                <span className={`text-xs sm:text-sm font-extrabold block line-clamp-1 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeName}</span>
                <span className={`text-[10px] block leading-tight ${isDarkMode ? 'text-emerald-400' : 'text-teal-700 font-bold'}`}>Chỉnh sửa hồ sơ ✎</span>
              </div>
            </button>
          )}

          {onOpenStudentLogin && (
            <button
              onClick={onOpenStudentLogin}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs sm:text-sm font-mono transition-all cursor-pointer whitespace-nowrap ${
                role === 'STUDENT'
                  ? (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-teal-50 border-teal-300 text-teal-800 font-bold')
                  : (isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-300' : 'bg-white border-slate-200 text-slate-700')
              }`}
              title="Đăng nhập tài khoản học sinh"
            >
              <LogIn className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="hidden sm:inline font-bold">
                {role === 'STUDENT' && currentStudent ? `HS: ${currentStudent.name}` : 'Đăng Nhập HS'}
              </span>
            </button>
          )}

          {role === 'STUDENT' ? (
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-mono ${
                isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
              }`}>
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse shrink-0" />
                <span>{studentStreak} ngày</span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-mono ${
                isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
              }`}>
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600 shrink-0" />
                <span>{studentXp} XP</span>
              </div>
            </div>
          ) : (
            <div className={`hidden lg:flex items-center gap-2 text-xs sm:text-sm font-mono ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="text-xs">LMS Engine: <span className="text-teal-700 font-extrabold">Active</span></span>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
              isDarkMode ? 'bg-[#18181b] border-[#27272a] text-amber-400 hover:bg-zinc-800' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Chuyển chế độ Giao diện"
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Role Switcher Switch */}
          <button
            onClick={onToggleRole}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer whitespace-nowrap ${
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



