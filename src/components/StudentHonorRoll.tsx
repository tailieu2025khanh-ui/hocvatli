import React, { useState } from 'react';
import { HonorAward, HonorCategory, StudentProfile, ClassRoom, UserRole } from '../types';
import { 
  Trophy, Award, TrendingUp, Zap, Sparkles, Star, Crown, Shield, Heart, 
  Printer, Plus, Search, Filter, CheckCircle2, ChevronRight, UserCheck, Flame, 
  Medal, GraduationCap, FileText, Send, Share2, Download
} from 'lucide-react';

interface StudentHonorRollProps {
  isDarkMode: boolean;
  role: UserRole;
  awards: HonorAward[];
  students: StudentProfile[];
  classList: ClassRoom[];
  activeClass: ClassRoom;
  onAddAward?: (newAward: HonorAward) => void;
  onDeleteAward?: (awardId: string) => void;
}

export const StudentHonorRoll: React.FC<StudentHonorRollProps> = ({
  isDarkMode,
  role,
  awards,
  students,
  classList,
  activeClass,
  onAddAward,
  onDeleteAward
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCertificateAward, setSelectedCertificateAward] = useState<HonorAward | null>(null);

  // Nominate New Award Modal State
  const [showNominateModal, setShowNominateModal] = useState<boolean>(false);
  const [nominateStudentId, setNominateStudentId] = useState<string>(students[0]?.id || '');
  const [nominateCategory, setNominateCategory] = useState<HonorCategory>('ACADEMIC_TOP');
  const [nominateTitle, setNominateTitle] = useState<string>('');
  const [nominateSubtitle, setNominateSubtitle] = useState<string>('');
  const [nominateCitation, setNominateCitation] = useState<string>('');
  const [nominateScoreValue, setNominateScoreValue] = useState<string>('');
  const [nominateThemeStyle, setNominateThemeStyle] = useState<HonorAward['themeStyle']>('GOLD');

  // Filter awards
  const filteredAwards = awards.filter(award => {
    const matchesCategory = selectedCategory === 'ALL' || award.category === selectedCategory;
    const matchesClass = selectedClassFilter === 'ALL' || award.classCode === selectedClassFilter;
    const matchesSearch = award.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          award.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          award.citation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesClass && matchesSearch;
  });

  // Handle auto-preset values when changing award category in Nomination Form
  const handleCategoryChangeInForm = (cat: HonorCategory) => {
    setNominateCategory(cat);
    switch (cat) {
      case 'ACADEMIC_TOP':
        setNominateTitle('Thủ Khoa Học Tập Khối Chuyên Lý');
        setNominateSubtitle('Đạt thành tích học tập cao nhất lớp với điểm trung bình 10.0');
        setNominateThemeStyle('GOLD');
        setNominateScoreValue('9.8 / 10');
        break;
      case 'TRAINING_EXCELLENCE':
        setNominateTitle('Gương Mặt Rèn Luyện & Dấu Ấn Tiêu Biểu');
        setNominateSubtitle('Gương mẫu trong nề nếp, tích cực hỗ trợ phong trào học tập');
        setNominateThemeStyle('ROYAL_BLUE');
        setNominateScoreValue('100 / 100 ĐRL');
        break;
      case 'MOST_IMPROVED':
        setNominateTitle('Học Sinh Bứt Phá Tiến Bộ Nhất Kỳ');
        setNominateSubtitle('Có bước tiến vượt bậc về điểm số và kỹ năng giải bài tập');
        setNominateThemeStyle('RUBY_PHOENIX');
        setNominateScoreValue('+3.0 Điểm');
        break;
      case 'MOST_ACTIVE':
        setNominateTitle('Học Sinh Năng Nổ & Tích Cực Nhất');
        setNominateSubtitle('Tích cực hăng hái phát biểu và tham gia thảo luận bài giảng');
        setNominateThemeStyle('PURPLE_CROWN');
        setNominateScoreValue('35 Lượt phát biểu');
        break;
      case 'MOST_DILIGENT':
        setNominateTitle('Ngôi Sao Chuyên Cần & Chuỗi Học Tuyệt Đối');
        setNominateSubtitle('Siêng năng nộp bài đúng hạn và duy trì chuỗi học tập liên tục');
        setNominateThemeStyle('EMERALD_LAUREL');
        setNominateScoreValue('15 Ngày Streak');
        break;
    }
  };

  // Submit Nomination
  const handleSubmitNomination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddAward) return;

    const targetStudent = students.find(s => s.id === nominateStudentId) || students[0];

    const newAward: HonorAward = {
      id: 'award_' + Date.now().toString().slice(-6),
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      studentAvatar: targetStudent.avatar,
      classCode: targetStudent.classCode,
      category: nominateCategory,
      title: nominateTitle || 'Danh Hiệu Tuyên Dương Học Sinh',
      subtitle: nominateSubtitle || 'Đạt thành tích xuất sắc trong học tập & rèn luyện',
      awardedDate: new Date().toISOString().slice(0, 10),
      awardedByTeacher: activeClass.teacherName || 'ThS. Nguyễn Văn Đức',
      citation: nominateCitation || `Tuyên dương học sinh ${targetStudent.name} đã nỗ lực không ngừng trong quá trình học tập.`,
      scoreValue: nominateScoreValue || 'Xuất sắc',
      badgeIcon: nominateCategory === 'ACADEMIC_TOP' ? 'Trophy' : (nominateCategory === 'TRAINING_EXCELLENCE' ? 'Award' : 'Star'),
      themeStyle: nominateThemeStyle
    };

    onAddAward(newAward);
    setShowNominateModal(false);
    // Reset
    setNominateTitle('');
    setNominateCitation('');
  };

  // Visual Theme Helper for Award Cards
  const getCardThemeClasses = (style: HonorAward['themeStyle']) => {
    switch (style) {
      case 'GOLD':
        return {
          wrapper: 'bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#1c1917] border-2 border-amber-500/60 shadow-xl shadow-amber-950/40 text-amber-100',
          badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold shadow-lg shadow-amber-500/30',
          iconColor: 'text-amber-400',
          borderAccent: 'border-amber-500/30',
          tagBg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
          headerBg: 'from-amber-500/20 via-yellow-500/10 to-transparent',
          certFrame: 'border-amber-500/80 bg-gradient-to-br from-amber-950/40 via-[#18181b] to-yellow-950/30'
        };
      case 'ROYAL_BLUE':
        return {
          wrapper: 'bg-gradient-to-br from-[#091e3a] via-[#102a45] to-[#0a192f] border-2 border-blue-400/60 shadow-xl shadow-blue-950/40 text-blue-100',
          badgeBg: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-extrabold shadow-lg shadow-blue-500/30',
          iconColor: 'text-cyan-400',
          borderAccent: 'border-blue-400/30',
          tagBg: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
          headerBg: 'from-blue-500/20 via-cyan-500/10 to-transparent',
          certFrame: 'border-blue-400/80 bg-gradient-to-br from-blue-950/40 via-[#18181b] to-cyan-950/30'
        };
      case 'RUBY_PHOENIX':
        return {
          wrapper: 'bg-gradient-to-br from-[#3b0764] via-[#4c0519] to-[#2e020d] border-2 border-rose-500/60 shadow-xl shadow-rose-950/40 text-rose-100',
          badgeBg: 'bg-gradient-to-r from-rose-600 to-orange-500 text-white font-extrabold shadow-lg shadow-rose-500/30',
          iconColor: 'text-rose-400',
          borderAccent: 'border-rose-500/30',
          tagBg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
          headerBg: 'from-rose-500/20 via-orange-500/10 to-transparent',
          certFrame: 'border-rose-500/80 bg-gradient-to-br from-rose-950/40 via-[#18181b] to-orange-950/30'
        };
      case 'PURPLE_CROWN':
        return {
          wrapper: 'bg-gradient-to-br from-[#1e1b4b] via-[#31104b] to-[#170a2c] border-2 border-purple-400/60 shadow-xl shadow-purple-950/40 text-purple-100',
          badgeBg: 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-extrabold shadow-lg shadow-purple-500/30',
          iconColor: 'text-fuchsia-400',
          borderAccent: 'border-purple-400/30',
          tagBg: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
          headerBg: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
          certFrame: 'border-purple-400/80 bg-gradient-to-br from-purple-950/40 via-[#18181b] to-fuchsia-950/30'
        };
      case 'EMERALD_LAUREL':
      default:
        return {
          wrapper: 'bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#022c22] border-2 border-emerald-400/60 shadow-xl shadow-emerald-950/40 text-emerald-100',
          badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold shadow-lg shadow-emerald-500/30',
          iconColor: 'text-emerald-400',
          borderAccent: 'border-emerald-400/30',
          tagBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
          headerBg: 'from-emerald-500/20 via-teal-500/10 to-transparent',
          certFrame: 'border-emerald-400/80 bg-gradient-to-br from-emerald-950/40 via-[#18181b] to-teal-950/30'
        };
    }
  };

  // Get Icon Component based on category
  const renderCategoryIcon = (cat: HonorCategory, className: string = "w-5 h-5") => {
    switch (cat) {
      case 'ACADEMIC_TOP':
        return <Trophy className={`${className} text-amber-400`} />;
      case 'TRAINING_EXCELLENCE':
        return <Award className={`${className} text-cyan-400`} />;
      case 'MOST_IMPROVED':
        return <TrendingUp className={`${className} text-rose-400`} />;
      case 'MOST_ACTIVE':
        return <Zap className={`${className} text-purple-400`} />;
      case 'MOST_DILIGENT':
        return <Flame className={`${className} text-emerald-400`} />;
    }
  };

  return (
    <div className="space-y-8">

      {/* Top Ceremonial Banner Header */}
      <div className={`relative p-8 rounded-2xl border overflow-hidden shadow-2xl transition-all ${
        isDarkMode 
          ? 'bg-gradient-to-r from-[#18181b] via-[#09090b] to-[#18181b] border-amber-500/40 text-zinc-100' 
          : 'bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-900 border-amber-400/50 text-white'
      }`}>
        {/* Background Decorative Gold Watermarks & Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-widest flex items-center gap-1.5 shadow">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                HỌC VIỆN VẬT LÝ VÀNG 2026
              </span>
              <span className="text-zinc-400">• Phòng: <strong className="text-emerald-400">{activeClass.code}</strong></span>
              <span className="text-zinc-400">• Cập nhật vinh danh định kỳ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>BẢNG VINH DANH HỌC SINH TIÊU BIỂU</span>
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse hidden sm:inline" />
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Nơi tôn vinh những gương mặt xuất sắc nhất về <strong className="text-amber-300">Điểm số Thủ Khoa</strong>, <strong className="text-cyan-300">Rèn Luyện Tiêu Biểu</strong>, <strong className="text-rose-300">Bứt Phá Tiến Bộ</strong>, <strong className="text-purple-300">Năng Nổ Tích Cực</strong> và <strong className="text-emerald-300">Chuyên Cần Kiên Trì</strong> qua từng chặng đường học tập.
            </p>
          </div>

          {/* Right Action: Nominate Button for Teachers */}
          {role === 'TEACHER' && onAddAward && (
            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setShowNominateModal(true)}
                className="px-5 py-3 rounded-xl font-mono text-xs font-extrabold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer border border-amber-300"
              >
                <Plus className="w-4 h-4 text-black stroke-[3]" />
                <span>Tuyên Dương & Vinh Danh Học Sinh</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className={`p-4 rounded-xl border flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 font-mono text-xs ${
        isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200'
      }`}>
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'ALL'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-[#09090b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <span>Tất Cả Danh Hiệu ({awards.length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('ACADEMIC_TOP')}
            className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'ACADEMIC_TOP'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'bg-[#09090b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>1. Cao Điểm Nhất (Thủ Khoa)</span>
          </button>

          <button
            onClick={() => setSelectedCategory('TRAINING_EXCELLENCE')}
            className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'TRAINING_EXCELLENCE'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                : 'bg-[#09090b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>2. Rèn Luyện Tiêu Biểu</span>
          </button>

          <button
            onClick={() => setSelectedCategory('MOST_IMPROVED')}
            className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'MOST_IMPROVED'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                : 'bg-[#09090b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
            <span>3. Tiến Bộ Nhất</span>
          </button>

          <button
            onClick={() => setSelectedCategory('MOST_ACTIVE')}
            className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'MOST_ACTIVE'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                : 'bg-[#09090b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>4. Tích Cực Nhất</span>
          </button>

          <button
            onClick={() => setSelectedCategory('MOST_DILIGENT')}
            className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'MOST_DILIGENT'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'bg-[#09090b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span>5. Chuyên Cần Nhất</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative shrink-0 sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm tên học sinh, danh hiệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#09090b] border border-[#27272a] text-zinc-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>

      </div>

      {/* Main Honor Cards Grid */}
      {filteredAwards.length === 0 ? (
        <div className="p-12 rounded-2xl border border-[#27272a] bg-[#09090b] text-center space-y-3 font-mono">
          <Crown className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-zinc-400 text-sm">Chưa có thông tin vinh danh phù hợp với bộ lọc đã chọn.</p>
          <button
            onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
            className="px-4 py-2 rounded text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAwards.map((award, index) => {
            const theme = getCardThemeClasses(award.themeStyle);

            return (
              <div
                key={award.id}
                className={`relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between overflow-hidden ${theme.wrapper}`}
              >
                {/* Top Corner Ribbons / Badges */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${theme.badgeBg}`}>
                    {renderCategoryIcon(award.category, "w-3.5 h-3.5")}
                    <span>#{index + 1} VINH DANH</span>
                  </span>

                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-black/40 border border-white/20 text-white">
                    Lớp {award.classCode}
                  </span>
                </div>

                {/* Main Avatar & Student Info Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={award.studentAvatar}
                      alt={award.studentName}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400/80 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-500 text-black font-extrabold flex items-center justify-center text-xs shadow-md border-2 border-black">
                      🥇
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{award.studentName}</h3>
                    <p className="text-xs text-amber-300 font-mono font-semibold mt-0.5">{award.scoreValue}</p>
                    <p className="text-[11px] text-zinc-400 font-mono">Ngày khen thưởng: {award.awardedDate}</p>
                  </div>
                </div>

                {/* Award Title & Subtitle */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1 mb-4">
                  <h4 className="text-sm font-extrabold text-white leading-snug flex items-center gap-1.5">
                    <span>{award.title}</span>
                  </h4>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">{award.subtitle}</p>
                </div>

                {/* Citation Note */}
                <div className="text-xs text-zinc-300 italic mb-5 leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5 relative">
                  <span className="text-amber-400 font-bold font-mono block not-italic mb-1">
                    💬 Lời tuyên dương từ GV ({award.awardedByTeacher}):
                  </span>
                  "{award.citation}"
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 font-mono text-xs">
                  <button
                    onClick={() => setSelectedCertificateAward(award)}
                    className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 flex items-center justify-center gap-2 cursor-pointer transition-all shadow"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Xem & In Bằng Khen Trang Trọng</span>
                  </button>

                  {role === 'TEACHER' && onDeleteAward && (
                    <button
                      onClick={() => {
                        if (confirm(`Bạn có chắc muốn gỡ vinh danh của ${award.studentName}?`)) {
                          onDeleteAward(award.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 cursor-pointer"
                      title="Gỡ vinh danh"
                    >
                      ✕
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* FORMAL CERTIFICATE MODAL (BẰNG KHEN TRANG TRỌNG) */}
      {selectedCertificateAward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8">
            
            {/* Modal Controls Bar */}
            <div className="flex items-center justify-between mb-3 text-white font-mono text-xs">
              <span className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                Giấy Tuyên Dương Thành Tích Học Tập Trang Trọng
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>In / Xuất PDF Giấy Khen</span>
                </button>
                <button
                  onClick={() => setSelectedCertificateAward(null)}
                  className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Print Area Certificate Document */}
            <div className="p-8 sm:p-12 rounded-2xl bg-[#faf8f5] text-slate-900 border-8 border-amber-600/80 shadow-2xl relative overflow-hidden font-serif">
              
              {/* Outer Golden Certificate Frame Lines */}
              <div className="absolute inset-2 border-2 border-amber-700/60 pointer-events-none" />
              <div className="absolute inset-4 border border-amber-600/30 pointer-events-none" />

              {/* Top Crest / Seal Header */}
              <div className="text-center space-y-2 mb-8 relative z-10">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500 text-black flex items-center justify-center font-extrabold text-2xl shadow-xl border-4 border-amber-200">
                  Φ
                </div>
                <span className="text-xs font-mono font-bold tracking-widest text-amber-800 uppercase block">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM — ĐỘC LẬP - TỰ DO - HẠNH PHÚC
                </span>
                <div className="w-32 h-0.5 bg-amber-600/50 mx-auto my-1" />
                <span className="text-xs font-mono text-slate-600 uppercase tracking-wider block">
                  HỆ THỐNG GIÁO DỤC VẬT LÝ HIGH SCHOOL - LMS PHYS ARCHITECT 2026
                </span>
              </div>

              {/* Main Banner Title */}
              <div className="text-center space-y-2 my-8 relative z-10">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-amber-900 tracking-wider font-serif uppercase drop-shadow-sm">
                  GIẤY TUYÊN DƯƠNG
                </h1>
                <p className="text-sm font-sans font-bold text-amber-700 tracking-widest uppercase">
                  DANH HIỆU: {selectedCertificateAward.title.toUpperCase()}
                </p>
              </div>

              {/* Honored Student Name & Details */}
              <div className="text-center space-y-4 my-8 relative z-10 font-sans">
                <p className="text-base text-slate-700">Trân trọng trao tặng cho Học sinh:</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 border-b-2 border-amber-500/40 inline-block pb-2 px-6">
                  {selectedCertificateAward.studentName}
                </h2>
                <p className="text-sm text-slate-600">
                  Học sinh Lớp: <strong className="text-amber-900">{selectedCertificateAward.classCode}</strong> • Mã định danh: STD_{selectedCertificateAward.studentId}
                </p>
              </div>

              {/* Award Citation Text */}
              <div className="max-w-2xl mx-auto text-center space-y-3 my-8 text-sm sm:text-base text-slate-800 leading-relaxed italic bg-amber-50/60 p-6 rounded-xl border border-amber-200">
                <p className="not-italic font-bold text-amber-900 font-mono text-xs uppercase tracking-wider">
                  Thành Tích Khen Thưởng:
                </p>
                <p>"{selectedCertificateAward.citation}"</p>
                <p className="not-italic font-mono text-xs font-bold text-amber-800">
                  Ghi nhận chỉ số: {selectedCertificateAward.scoreValue}
                </p>
              </div>

              {/* Signatures & Seal Block */}
              <div className="mt-12 pt-8 border-t border-amber-300 flex justify-between items-end text-xs font-sans text-slate-700 relative z-10">
                <div className="text-center space-y-1">
                  <p className="font-bold text-slate-900">XÁC NHẬN CỦA HỘI ĐỒNG BỘ MÔN</p>
                  <p className="text-[10px] text-slate-500">Ký tên & Đóng dấu điện tử LMS</p>
                  <div className="h-12 flex items-center justify-center font-serif text-amber-700 font-bold italic text-sm">
                    PhysArchitect Verified Seal
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-[11px] text-slate-500 font-mono">
                    Hà Nội, ngày {new Date(selectedCertificateAward.awardedDate).getDate()} tháng {new Date(selectedCertificateAward.awardedDate).getMonth() + 1} năm 2026
                  </p>
                  <p className="font-bold text-slate-900 uppercase">GIÁO VIÊN PHỤ TRÁCH</p>
                  <div className="h-10" />
                  <p className="font-bold text-amber-900 text-sm">{selectedCertificateAward.awardedByTeacher}</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TEACHER NOMINATE NEW AWARD MODAL */}
      {showNominateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className={`relative w-full max-w-xl rounded-2xl border p-6 shadow-2xl space-y-5 my-8 ${
            isDarkMode ? 'bg-[#121215] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Tuyên Dương & Vinh Danh Học Sinh Mới</h3>
              </div>
              <button
                onClick={() => setShowNominateModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNomination} className="space-y-4 font-mono text-xs">
              
              {/* Select Student */}
              <div>
                <label className="block text-zinc-400 mb-1 font-bold">1. Chọn Học Sinh Vinh Danh:</label>
                <select
                  value={nominateStudentId}
                  onChange={(e) => setNominateStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-white focus:outline-none focus:border-amber-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.classCode} - {s.subGroup || 'Tổ 1'}) - {s.xp} XP
                    </option>
                  ))}
                </select>
              </div>

              {/* Award Category */}
              <div>
                <label className="block text-zinc-400 mb-1 font-bold">2. Hạng Mục Vinh Danh:</label>
                <select
                  value={nominateCategory}
                  onChange={(e) => handleCategoryChangeInForm(e.target.value as HonorCategory)}
                  className="w-full p-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="ACADEMIC_TOP">🏆 Học Sinh Cao Điểm Nhất (Thủ Khoa Học Tập)</option>
                  <option value="TRAINING_EXCELLENCE">🎖️ Học Sinh Rèn Luyện & Dấu Ấn Tiêu Biểu</option>
                  <option value="MOST_IMPROVED">🚀 Học Sinh Tiến Bộ Nhất (Bứt Phá Điểm Số)</option>
                  <option value="MOST_ACTIVE">⚡ Học Sinh Tích Cực Nhất (Năng Nổ Đóng Góp)</option>
                  <option value="MOST_DILIGENT">🌟 Học Sinh Chuyên Cần Nhất (Chuỗi Học & Kỷ Luật)</option>
                </select>
              </div>

              {/* Visual Theme Style */}
              <div>
                <label className="block text-zinc-400 mb-1 font-bold">3. Phong Cách Hình Ảnh Trang Trọng:</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'GOLD', label: 'Dát Vàng', color: 'bg-amber-500/20 text-amber-300 border-amber-500' },
                    { id: 'ROYAL_BLUE', label: 'Xanh Hoàng Gia', color: 'bg-blue-500/20 text-blue-300 border-blue-500' },
                    { id: 'RUBY_PHOENIX', label: 'Đỏ Phượng Hoàng', color: 'bg-rose-500/20 text-rose-300 border-rose-500' },
                    { id: 'PURPLE_CROWN', label: 'Tím Vương Miện', color: 'bg-purple-500/20 text-purple-300 border-purple-500' },
                    { id: 'EMERALD_LAUREL', label: 'Nguyệt Quế', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500' }
                  ].map(themeItem => (
                    <button
                      type="button"
                      key={themeItem.id}
                      onClick={() => setNominateThemeStyle(themeItem.id as any)}
                      className={`p-2 rounded-lg border text-[10px] text-center font-bold cursor-pointer transition-all ${themeItem.color} ${
                        nominateThemeStyle === themeItem.id ? 'ring-2 ring-amber-400 scale-105' : 'opacity-60'
                      }`}
                    >
                      {themeItem.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">Tên Danh Hiệu:</label>
                  <input
                    type="text"
                    value={nominateTitle}
                    onChange={(e) => setNominateTitle(e.target.value)}
                    placeholder="VD: Thủ Khoa Học Tập Khối 12"
                    className="w-full p-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">Chỉ Số Ghi Nhận:</label>
                  <input
                    type="text"
                    value={nominateScoreValue}
                    onChange={(e) => setNominateScoreValue(e.target.value)}
                    placeholder="VD: 9.8/10 hoặc 15 Ngày Streak"
                    className="w-full p-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-bold">Mô Tả Ngắn Thành Tích:</label>
                <input
                  type="text"
                  value={nominateSubtitle}
                  onChange={(e) => setNominateSubtitle(e.target.value)}
                  placeholder="Mô tả ngắn gọn về lý do vinh danh..."
                  className="w-full p-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-white"
                />
              </div>

              {/* Citation */}
              <div>
                <label className="block text-zinc-400 mb-1 font-bold">Lời Nhận Xét & Tuyên Dương Từ Giáo Viên:</label>
                <textarea
                  rows={3}
                  value={nominateCitation}
                  onChange={(e) => setNominateCitation(e.target.value)}
                  placeholder="Nhập lời nhắn nhủ, khen ngợi từ giáo viên..."
                  className="w-full p-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-white"
                />
              </div>

              {/* Footer Submit */}
              <div className="pt-3 border-t border-[#27272a] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNominateModal(false)}
                  className="px-4 py-2 rounded bg-[#18181b] hover:bg-zinc-800 text-zinc-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded font-bold bg-amber-500 hover:bg-amber-400 text-black shadow"
                >
                  Xác Nhận Vinh Danh
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
