import React, { useState, useEffect } from 'react';
import { UserRole, ClassRoom, StudentProfile, ColleagueTeacher } from '../types';
import { UserCheck, GraduationCap, Flame, Zap, Moon, Sun, KeyRound, Sparkles, LogIn, User, Database, Camera, Edit3, Home, Search, Grid, Bell, Radio } from 'lucide-react';

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
  activeTab?: string;
  onSelectTab?: (tab: any) => void;
  onOpenQuizGame?: () => void;
  onOpenAITutor?: () => void;
  onOpenAISolver?: () => void;
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
  isDbConnected = true,
  activeTab = 'DASHBOARD',
  onSelectTab,
  onOpenQuizGame,
  onOpenAITutor,
  onOpenAISolver
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[now.getDay()];
      const formatted = `${dayName}, ngày ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.toLocaleTimeString('vi-VN')}`;
      setCurrentTime(formatted);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeAvatar = role === 'TEACHER'
    ? (currentTeacher?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80')
    : (currentStudent?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80');

  const activeName = role === 'TEACHER' ? (currentTeacher?.name || 'Giáo viên') : (currentStudent?.name || 'Học sinh');

  return (
    <div className="w-full flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. TOP UTILITY HEADER BAR (Trắng chuẩn Portal HCM-EDU) */}
      <div className={`border-b transition-colors ${
        isDarkMode ? 'bg-[#0f172a] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo HCM-EDU Style */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-black text-2xl tracking-tighter">
              <span className="text-[#cb1c24] font-extrabold text-2xl sm:text-3xl">HỌC VẬT LÍ</span>
              <span className="text-[#0284c7] font-black text-2xl sm:text-3xl">-EDU</span>
            </div>
            
            {/* Top Category Tags */}
            <div className="hidden xl:flex items-center gap-2 ml-4 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">SỞ GD&ĐT</span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">GDPT 2018</span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">THPT LÝ 10</span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">THPT LÝ 11</span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">THPT LÝ 12</span>
            </div>
          </div>

          {/* Top Right Utility Section: Search, System Controls & Teacher/Student Login Suite */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Red Portal Search Box */}
            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
              <input
                type="text"
                placeholder="Từ khóa tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none w-32 sm:w-44 font-sans"
              />
              <button
                onClick={() => onSelectTab && onSelectTab('TOPIC_SEARCH')}
                className="bg-[#cb1c24] hover:bg-[#b91c1c] text-white px-3 py-1.5 transition-colors cursor-pointer flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Room Selector */}
            <div className="flex items-center gap-1 px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono">
              <span className="text-slate-500 font-bold hidden md:inline">Phòng:</span>
              <select
                value={activeClass.code}
                onChange={(e) => {
                  const found = classList.find(c => c.code === e.target.value);
                  if (found) onSelectClass(found);
                }}
                className="bg-transparent border-none font-bold text-sky-700 dark:text-sky-400 focus:ring-0 cursor-pointer text-xs"
              >
                {classList.map(cls => (
                  <option key={cls.id} value={cls.code} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                    {cls.code} - {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DB Online Indicator */}
            {onOpenOnlineDb && (
              <button
                onClick={onOpenOnlineDb}
                className={`flex items-center gap-1 px-2 py-1.5 rounded border text-xs font-mono font-bold transition-all cursor-pointer ${
                  isDbConnected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-400'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-700 dark:text-rose-400'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{isDbConnected ? 'DB: Online' : 'DB: Offline'}</span>
                <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
              </button>
            )}

            {/* Settings (API Key) Button */}
            {onOpenApiKeyModal && (
              <button
                onClick={onOpenApiKeyModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100 font-mono text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Thiết lập Model AI & Nhập Gemini API Key"
              >
                <KeyRound className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Settings (API Key)</span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold hidden xl:inline">• Lấy API key</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Chuyển giao diện"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* 🌟 PROMINENT TOP-RIGHT TEACHER & STUDENT LOGIN SUITE (NỔI BẬT GÓC TRÊN CÙNG BÊN PHẢI MÀN HÌNH) */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl border-2 border-[#cb1c24] bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 dark:from-slate-900 dark:via-rose-950/40 dark:to-slate-900 shadow-md">
              
              {/* Profile Avatar & Info Badge */}
              {onOpenProfileEdit && (
                <button
                  onClick={onOpenProfileEdit}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 hover:border-sky-500 transition-all cursor-pointer shadow-xs"
                  title="Chỉnh sửa Hồ sơ cá nhân Giáo viên / Học sinh"
                >
                  <div className="relative">
                    <img src={activeAvatar} alt={activeName} className="w-7 h-7 rounded-full object-cover border-2 border-sky-600 shrink-0" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <span className="text-xs font-black block text-slate-900 dark:text-slate-100 leading-tight line-clamp-1">{activeName}</span>
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 block leading-tight">Chỉnh sửa hồ sơ ✎</span>
                  </div>
                </button>
              )}

              {/* Student Login Action Button */}
              {onOpenStudentLogin && (
                <button
                  onClick={onOpenStudentLogin}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
                    role === 'STUDENT'
                      ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white border border-amber-300'
                      : 'bg-white text-sky-800 border border-sky-300 hover:bg-sky-50 dark:bg-slate-900 dark:text-sky-300'
                  }`}
                  title="Mở bảng Đăng nhập Học sinh"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>
                    {role === 'STUDENT' && currentStudent ? `HS: ${currentStudent.name}` : 'ĐĂNG NHẬP HS'}
                  </span>
                </button>
              )}

              {/* Main Prominent Role Switcher Button (ĐĂNG NHẬP GIÁO VIÊN ↔ HỌC SINH) */}
              <button
                onClick={onToggleRole}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all shadow-md cursor-pointer ${
                  role === 'TEACHER'
                    ? 'bg-[#cb1c24] hover:bg-[#b91c1c] text-white border border-amber-300 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border border-amber-300 animate-pulse'
                }`}
                title="Đăng nhập & Chuyển đổi vai trò Giáo viên / Học sinh"
              >
                {role === 'TEACHER' ? (
                  <>
                    <UserCheck className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>🔑 ĐĂNG NHẬP GIÁO VIÊN</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>🎓 ĐĂNG NHẬP HỌC SINH</span>
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* 2. OFFICIAL BLUE HERO BANNER (Tone Xanh Dương Cổng GD&ĐT Thành Phố) */}
      <div className="bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#075985] text-white shadow-md border-b-2 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Coat-of-Arms Badge & System Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-[#cb1c24] border-4 border-amber-300 flex items-center justify-center shadow-lg font-black text-2xl shrink-0">
              🇻🇳
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-amber-300 uppercase font-sans">
                CỔNG THÔNG TIN ĐIỆN TỬ & HỆ THỐNG LỚP HỌC LMS GDPT 2018
              </p>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white uppercase mt-0.5">
                NGÀNH GD&ĐT THÀNH PHỐ HỒ CHÍ MINH • VẬT LÝ THPT
              </h1>
              <p className="text-xs sm:text-sm font-medium text-sky-100 tracking-wide font-sans">
                DEPARTMENT OF PHYSICS EDUCATION AND TRAINING • HỌC VẬT LÍ THẬT THÚ VỊ
              </p>
            </div>
          </div>

          {/* Right Circular Photo Spotlights */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&auto=format&fit=crop&q=80" alt="Phòng Thí Nghiệm" className="w-full h-full object-cover" />
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow">
              <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&auto=format&fit=crop&q=80" alt="Lớp Học LMS" className="w-full h-full object-cover" />
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow">
              <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=200&auto=format&fit=crop&q=80" alt="Học Sinh Năng Động" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </div>

      {/* 3. VIBRANT CRIMSON RED NAVIGATION BAR (Thanh Menu Đỏ Chuẩn Portal HCM-EDU) */}
      <div className="bg-[#cb1c24] text-white sticky top-0 z-50 shadow-md border-b border-rose-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto text-xs sm:text-sm font-bold uppercase tracking-wide">
          
          <div className="flex items-center">
            
            {/* Home Icon */}
            <button
              onClick={() => onSelectTab && onSelectTab('DASHBOARD')}
              className={`p-3 hover:bg-[#b91c1c] transition-colors flex items-center justify-center border-r border-rose-700 cursor-pointer ${
                activeTab === 'DASHBOARD' ? 'bg-[#991b1b]' : ''
              }`}
              title="Trang Chủ LMS"
            >
              <Home className="w-4 h-4 text-white" />
            </button>

            {/* Menu Items */}
            <button
              onClick={() => onSelectTab && onSelectTab('DASHBOARD')}
              className={`px-3.5 py-3 hover:bg-[#b91c1c] transition-colors border-r border-rose-700 whitespace-nowrap cursor-pointer ${
                activeTab === 'DASHBOARD' ? 'bg-[#991b1b]' : ''
              }`}
            >
              TRANG CHỦ LMS
            </button>

            <button
              onClick={() => onSelectTab && onSelectTab('TOPIC_SEARCH')}
              className={`px-3.5 py-3 hover:bg-[#b91c1c] transition-colors border-r border-rose-700 whitespace-nowrap cursor-pointer ${
                activeTab === 'TOPIC_SEARCH' ? 'bg-[#991b1b]' : ''
              }`}
            >
              TRA CỨU 4-IN-1
            </button>

            <button
              onClick={() => onSelectTab && onSelectTab('WEB_RESOURCES')}
              className={`px-3.5 py-3 hover:bg-[#b91c1c] transition-colors border-r border-rose-700 whitespace-nowrap cursor-pointer ${
                activeTab === 'WEB_RESOURCES' ? 'bg-[#991b1b]' : ''
              }`}
            >
              KHO VIDEO & MẠNG
            </button>

            <button
              onClick={() => onSelectTab && onSelectTab('HONOR')}
              className={`px-3.5 py-3 hover:bg-[#b91c1c] transition-colors border-r border-rose-700 whitespace-nowrap cursor-pointer ${
                activeTab === 'HONOR' ? 'bg-[#991b1b]' : ''
              }`}
            >
              VINH DANH TIÊU BIỂU
            </button>

            <button
              onClick={() => onSelectTab && onSelectTab('OCR')}
              className={`px-3.5 py-3 hover:bg-[#b91c1c] transition-colors border-r border-rose-700 whitespace-nowrap cursor-pointer ${
                activeTab === 'OCR' ? 'bg-[#991b1b]' : ''
              }`}
            >
              SMART GRADING (OCR)
            </button>

            <button
              onClick={() => onSelectTab && onSelectTab('LAB')}
              className={`px-3.5 py-3 hover:bg-[#b91c1c] transition-colors border-r border-rose-700 whitespace-nowrap cursor-pointer ${
                activeTab === 'LAB' ? 'bg-[#991b1b]' : ''
              }`}
            >
              THÍ NGHIỆM ẢO
            </button>

            <button
              onClick={() => onSelectTab && onSelectTab('BANK')}
              className={`px-3.5 py-3 hover:bg-[#b91c1c] transition-colors border-r border-rose-700 whitespace-nowrap cursor-pointer ${
                activeTab === 'BANK' ? 'bg-[#991b1b]' : ''
              }`}
            >
              NGÂN HÀNG GDPT
            </button>

            <button
              onClick={() => onSelectTab && onSelectTab('ANALYTICS')}
              className={`px-3.5 py-3 hover:bg-[#b91c1c] transition-colors border-r border-rose-700 whitespace-nowrap cursor-pointer ${
                activeTab === 'ANALYTICS' ? 'bg-[#991b1b]' : ''
              }`}
            >
              BÁO CÁO RADAR
            </button>

            {onOpenQuizGame && (
              <button
                onClick={onOpenQuizGame}
                className="px-3.5 py-3 hover:bg-[#b91c1c] transition-colors border-r border-rose-700 whitespace-nowrap cursor-pointer text-yellow-300 font-extrabold flex items-center gap-1"
              >
                <span>🎮 MINIGAME 1V1</span>
              </button>
            )}

            {onOpenAITutor && (
              <button
                onClick={onOpenAITutor}
                className="px-3.5 py-3 hover:bg-[#b91c1c] transition-colors border-r border-rose-700 whitespace-nowrap cursor-pointer text-emerald-300 font-extrabold flex items-center gap-1"
              >
                <span>🤖 AI TUTOR 24/7</span>
              </button>
            )}

            {onOpenAISolver && (
              <button
                onClick={onOpenAISolver}
                className="px-3.5 py-3 hover:bg-[#b91c1c] transition-colors border-r border-rose-700 whitespace-nowrap cursor-pointer text-cyan-200 font-extrabold flex items-center gap-1"
              >
                <span>🧠 AI GIẢI BÀI</span>
              </button>
            )}

          </div>

          <div className="p-3 hover:bg-[#b91c1c] cursor-pointer hidden md:block">
            <Grid className="w-4 h-4 text-white" />
          </div>

        </div>
      </div>

      {/* 4. REALTIME TICKER BAR (Thanh Thông Báo Chạy Chữ Chuẩn Portal) */}
      <div className={`border-b text-xs font-mono py-2 ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-semibold">
            <span>📅 {currentTime}</span>
          </div>

          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[#cb1c24] font-black uppercase tracking-wider animate-pulse flex items-center gap-1 shrink-0">
              📢 THÔNG BÁO:
            </span>
            <marquee className="text-slate-800 dark:text-slate-200 font-bold whitespace-nowrap">
              🔥 NHIỆT LIỆT CHÀO MỪNG NĂM HỌC MỚI GDPT 2018 • ĐÃ ĐỒNG BỘ {activeClass.studentCount} HỌC SINH LỚP {activeClass.code} • DATABASE ONLINE ACTIVE • PHÒNG THÍ NGHIỆM ẢO LMS360 VÀ KHO VIDEO ĐÃ SẴN SÀNG
            </marquee>
          </div>

        </div>
      </div>

    </div>
  );
};



