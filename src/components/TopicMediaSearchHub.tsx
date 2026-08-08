import React, { useState } from 'react';
import { GradeLevel, TeachingMaterial, Question } from '../types';
import { PHYSICS_TOPICS_BY_GRADE } from '../data/mockData';
import { parseVideoLink, ParsedVideo } from '../utils/videoHelper';
import { Search, Globe, Video, Image as ImageIcon, FileText, Activity, Sparkles, Filter, ExternalLink, Play, Eye, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface TopicMediaSearchHubProps {
  isDarkMode: boolean;
  materials?: TeachingMaterial[];
  questions?: Question[];
}

export interface MediaResultItem {
  id: string;
  title: string;
  mediaType: 'VIRTUAL_LAB' | 'VIDEO' | 'IMAGE' | 'DOCUMENT';
  grade: GradeLevel;
  topic: string;
  lessonName: string;
  description: string;
  url: string;
  embedUrl?: string;
  thumbnailUrl: string;
  authorOrSource: string;
}

export const TopicMediaSearchHub: React.FC<TopicMediaSearchHubProps> = ({
  isDarkMode,
  materials = [],
  questions = []
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('Dao động');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [mediaFilter, setMediaFilter] = useState<'ALL' | 'VIRTUAL_LAB' | 'VIDEO' | 'IMAGE' | 'DOCUMENT'>('ALL');

  // Active View Modals
  const [activeVideoModal, setActiveVideoModal] = useState<{ item: MediaResultItem; parsed: ParsedVideo } | null>(null);
  const [activeLabModal, setActiveLabModal] = useState<MediaResultItem | null>(null);
  const [activeImageModal, setActiveImageModal] = useState<MediaResultItem | null>(null);
  const [activeDocModal, setActiveDocModal] = useState<MediaResultItem | null>(null);

  // Comprehensive Multi-Media Database for GDPT 2018 Physics Lessons
  const mediaDatabase: MediaResultItem[] = [
    // --- VIRTUAL LABS ---
    {
      id: 'lab_101',
      title: 'Mô phỏng Thí nghiệm Ảo Tương tác Khúc xạ Ánh sáng & Chiết suất - LMS360',
      mediaType: 'VIRTUAL_LAB',
      grade: 11,
      topic: 'Sóng ánh sáng & Giao thoa',
      lessonName: 'Bài: Khúc xạ ánh sáng & Phản xạ toàn phần',
      description: 'Mô hình thí nghiệm ảo tương tác trực tiếp LMS360 thay đổi góc tới i, quan sát góc khúc xạ r và đo góc giới hạn phản xạ toàn phần.',
      url: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_all.html',
      embedUrl: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_all.html',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
      authorOrSource: 'LMS360 Virtual Lab'
    },
    {
      id: 'lab_102',
      title: 'Thí nghiệm Ảo Khí Lý Tưởng & Định luật Boyle-Mariotte - PhET Colorado',
      mediaType: 'VIRTUAL_LAB',
      grade: 12,
      topic: 'Vật lý Nhiệt & Thuyết động học chất khí',
      lessonName: 'Bài: Mô hình phân tử khí & Đồ thị đẳng nhiệt',
      description: 'Mô phỏng 3D va chạm phân tử khí tác dụng áp suất P lên thành bình, giữ nhiệt độ T không đổi nén thể tích V.',
      url: 'https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_all.html',
      embedUrl: 'https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_all.html',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      authorOrSource: 'PhET Interactive'
    },
    {
      id: 'lab_103',
      title: 'Thí nghiệm Con Lắc Đơn & Con Lắc Lò Xo Dao Động Điều Hòa - LMS360',
      mediaType: 'VIRTUAL_LAB',
      grade: 11,
      topic: 'Dao động điều hòa & Con lắc',
      lessonName: 'Bài: Chu kỳ & Biên độ dao động điều hòa',
      description: 'Thử nghiệm ảo đo chu kỳ T con lắc đơn trên Trái Đất, Mặt Trăng và quan sát sự biến thiên Động năng - Thế năng.',
      url: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_all.html',
      embedUrl: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_all.html',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      authorOrSource: 'LMS360.vn'
    },

    // --- VIDEOS ---
    {
      id: 'vid_201',
      title: 'Video Bài Giảng: Phương Trình Dao Động Điều Hòa & Đồ Thị Pha',
      mediaType: 'VIDEO',
      grade: 11,
      topic: 'Dao động điều hòa & Con lắc',
      lessonName: 'Bài: Phương trình li độ, vận tốc và gia tốc',
      description: 'Video ngắn 15 phút hướng dẫn trực quan đọc đồ thị x(t), v(t), a(t), tìm pha ban đầu φ và cách bấm máy tính Casio.',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80',
      authorOrSource: 'YouTube Physics Channel'
    },
    {
      id: 'vid_202',
      title: 'Video Thí Nghiệm Thực Hành: Cảm Ứng Điện Từ Faraday & Định Luật Lenz',
      mediaType: 'VIDEO',
      grade: 12,
      topic: 'Từ trường & Cảm ứng điện từ',
      lessonName: 'Bài: Suất điện động cảm ứng trong cuộn dây',
      description: 'Video quay trực tiếp chuyển động nam châm qua cuộn dây solenoid gây ra dòng điện cảm ứng làm kim điện kế G lệch.',
      url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
      embedUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ?autoplay=1',
      thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
      authorOrSource: 'Vật Lý THPT 247'
    },
    {
      id: 'vid_203',
      title: 'Video Tóm Tắt: Phương Trình Sóng Cơ & Độ Lệch Pha Giữa 2 Điểm',
      mediaType: 'VIDEO',
      grade: 11,
      topic: 'Sóng cơ & Sóng âm',
      lessonName: 'Bài: Sự truyền sóng cơ & Khoảng vân sóng',
      description: 'Giải thích trực quan khái niệm bước sóng λ, chu kỳ T sóng và độ lệch pha Δφ = 2πd / λ trên cùng một phương truyền sóng.',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      authorOrSource: 'Giáo Viên Đồng Giảng'
    },

    // --- IMAGES & INFOGRAPHICS ---
    {
      id: 'img_301',
      title: 'Infographic Tóm Tắt Sơ Đồ Công Thức Dao Động Điều Hòa',
      mediaType: 'IMAGE',
      grade: 11,
      topic: 'Dao động điều hòa & Con lắc',
      lessonName: 'Bài: Tổng hợp công thức Dao động điều hòa',
      description: 'Sơ đồ hình ảnh tổng hợp mối liên hệ li độ x, vận tốc v, gia tốc a vuông pha, năng lượng E = 1/2 m w² A².',
      url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      authorOrSource: 'Infographic Vật Lý'
    },
    {
      id: 'img_302',
      title: 'Sơ Đồ Đường Truyền Tia Sáng Khúc Xạ & Phản Xạ Toàn Phần',
      mediaType: 'IMAGE',
      grade: 11,
      topic: 'Sóng ánh sáng & Giao thoa',
      lessonName: 'Bài: Định luật Snell & Góc giới hạn i_gh',
      description: 'Hình ảnh minh họa tia tới, tia khúc xạ, tia phản xạ toàn phần kèm véc-tơ pháp tuyến và công thức n1 sin i = n2 sin r.',
      url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1200&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
      authorOrSource: 'Sơ Đồ Minh Họa THPT'
    },
    {
      id: 'img_303',
      title: 'Đồ Thị Biến Thiên Nhiệt Độ & Áp Suất Khí Lý Tưởng (p-V, T-V)',
      mediaType: 'IMAGE',
      grade: 12,
      topic: 'Vật lý Nhiệt & Thuyết động học chất khí',
      lessonName: 'Bài: Đồ thị Đẳng nhiệt, Đẳng tích, Đẳng áp',
      description: 'Hình ảnh đường cong hyperbol đẳng nhiệt Boyle-Mariotte và đường thẳng kéo dài qua gốc tọa độ đẳng tích Gay-Lussac.',
      url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
      authorOrSource: 'Đồ Thị Lý Thuyết'
    },

    // --- DOCUMENTS & SLIDES ---
    {
      id: 'doc_401',
      title: 'Trang Web Đọc: Chuyên Đề Tổng Hợp Công Thức & Dạng Bài Tập Vật Lý 12 GDPT 2018',
      mediaType: 'DOCUMENT',
      grade: 12,
      topic: 'Vật lý Nhiệt & Thuyết động học chất khí',
      lessonName: 'Bài: Tổng hợp Nhiệt học & Động học chất khí',
      description: 'Tài liệu tra cứu trực tuyến chứa 50 dạng bài tập phân loại theo 4 mức độ tư duy Nhận biết, Thông hiểu, Vận dụng.',
      url: 'https://vi.wikipedia.org/wiki/Thuy%E1%BA%BFt_%C4%91%E1%BB%99ng_h%E1%BB%8Dc_ph%C3%A2n_t%E1%BB%AD',
      thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
      authorOrSource: 'Thư Viện Học Liệu Vật Lý'
    },
    {
      id: 'doc_402',
      title: 'Phiếu Bài Tập Nâng Cao: Bẫy Đồ Thị Pha & Phương Trình Dao Động',
      mediaType: 'DOCUMENT',
      grade: 11,
      topic: 'Dao động điều hòa & Con lắc',
      lessonName: 'Bài: Phân loại bẫy trắc nghiệm Đúng/Sai',
      description: 'Tài liệu PDF chứa 25 câu hỏi trắc nghiệm Đúng/Sai 4 ý và Trả lời ngắn tổng hợp độ lệch pha và chu kỳ T độc lập biên độ A.',
      url: 'https://vi.wikipedia.org/wiki/Dao_%C4%91%E1%BB%99ng_%C4%91i%E1 me%BB%81u_h%C3%B2a',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      authorOrSource: 'Tài Liệu Soạn Bài THPT'
    }
  ];

  // Filter Items
  const filteredResults = mediaDatabase.filter(item => {
    const matchesQuery = !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lessonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = selectedGrade === 'ALL' || item.grade === Number(selectedGrade);
    const matchesTopic = selectedTopic === 'ALL' || item.topic === selectedTopic;
    const matchesMediaType = mediaFilter === 'ALL' || item.mediaType === mediaFilter;

    return matchesQuery && matchesGrade && matchesTopic && matchesMediaType;
  });

  // Open Video Modal
  const handleOpenVideo = (item: MediaResultItem) => {
    const parsed = parseVideoLink(item.embedUrl || item.url);
    setActiveVideoModal({ item, parsed });
  };

  // Get Media Badge Icon
  const getMediaBadge = (type: MediaResultItem['mediaType']) => {
    switch (type) {
      case 'VIRTUAL_LAB':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"><Globe className="w-3 h-3" /> Thí Nghiệm Ảo</span>;
      case 'VIDEO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1"><Video className="w-3 h-3" /> Video Bài Giảng</span>;
      case 'IMAGE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Sơ Đồ / Hình Ảnh</span>;
      case 'DOCUMENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1"><FileText className="w-3 h-3" /> Tài Liệu & Slide</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header Banner */}
      <div className={`p-6 rounded-xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 ${
        isDarkMode ? 'bg-gradient-to-r from-[#121215] via-[#18181b] to-[#121215] border-[#27272a] text-zinc-100' : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200 text-slate-900'
      }`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Tính Năng Mới • Tìm Kiếm 4-Trong-1
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              HỌC VẬT LÍ THẬT THÚ VỊ
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Search className="w-6 h-6 text-emerald-400" />
            Tra Cứu Học Liệu Tổng Hợp Theo Bài Học & Chuyên Đề
          </h2>

          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Nhập tên bài học hoặc chọn chuyên đề bất kỳ để tra cứu đồng thời **Thí nghiệm ảo, Video bài giảng thực hành, Hình ảnh sơ đồ công thức** và **Tài liệu đọc PDF/PPT**.
          </p>
        </div>

        {/* Global Search Input Box */}
        <div className="w-full md:w-80 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-400" />
            <input
              type="text"
              placeholder="Nhập tên bài học (VD: Đẳng nhiệt, Khúc xạ, Sóng cơ)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-xs border border-[#27272a] bg-[#09090b] text-emerald-300 font-mono focus:outline-none focus:border-emerald-500 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Filter Bar: Media Types & Grade Levels */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#27272a] pb-4">
        
        {/* Media Type Tabs */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setMediaFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              mediaFilter === 'ALL'
                ? 'bg-emerald-600 text-white font-bold shadow'
                : 'bg-[#18181b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            Tất Cả ({filteredResults.length})
          </button>

          <button
            onClick={() => setMediaFilter('VIRTUAL_LAB')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              mediaFilter === 'VIRTUAL_LAB'
                ? 'bg-emerald-600 text-white font-bold shadow'
                : 'bg-[#18181b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>🧪 Thí Nghiệm Ảo ({mediaDatabase.filter(m => m.mediaType === 'VIRTUAL_LAB').length})</span>
          </button>

          <button
            onClick={() => setMediaFilter('VIDEO')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              mediaFilter === 'VIDEO'
                ? 'bg-rose-600 text-white font-bold shadow'
                : 'bg-[#18181b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-400" />
            <span>📹 Video Bài Giảng ({mediaDatabase.filter(m => m.mediaType === 'VIDEO').length})</span>
          </button>

          <button
            onClick={() => setMediaFilter('IMAGE')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              mediaFilter === 'IMAGE'
                ? 'bg-amber-600 text-white font-bold shadow'
                : 'bg-[#18181b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>🖼️ Sơ Đồ & Đồ Thị ({mediaDatabase.filter(m => m.mediaType === 'IMAGE').length})</span>
          </button>

          <button
            onClick={() => setMediaFilter('DOCUMENT')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              mediaFilter === 'DOCUMENT'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'bg-[#18181b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>📄 Tài Liệu & Slide ({mediaDatabase.filter(m => m.mediaType === 'DOCUMENT').length})</span>
          </button>
        </div>

        {/* Grade Level Select */}
        <div className="flex items-center gap-2">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs border border-[#27272a] bg-[#18181b] text-zinc-200 font-mono focus:outline-none"
          >
            <option value="ALL">Khối Lớp: Tất Cả</option>
            <option value="10">Khối 10</option>
            <option value="11">Khối 11</option>
            <option value="12">Khối 12</option>
          </select>
        </div>

      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map(item => (
          <div
            key={item.id}
            className={`group rounded-xl border overflow-hidden transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl flex flex-col justify-between ${
              isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              {/* Media Thumbnail */}
              <div className="relative aspect-video w-full bg-black overflow-hidden">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                  {item.mediaType === 'VIDEO' && (
                    <button
                      onClick={() => handleOpenVideo(item)}
                      className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </button>
                  )}

                  {item.mediaType === 'VIRTUAL_LAB' && (
                    <button
                      onClick={() => setActiveLabModal(item)}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-mono text-xs font-bold shadow-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Mở Thí Nghiệm Ảo</span>
                    </button>
                  )}

                  {item.mediaType === 'IMAGE' && (
                    <button
                      onClick={() => setActiveImageModal(item)}
                      className="px-3.5 py-1.5 rounded-full bg-amber-600 text-white font-mono text-xs font-bold shadow-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem Sơ Đồ Phóng To</span>
                    </button>
                  )}

                  {item.mediaType === 'DOCUMENT' && (
                    <button
                      onClick={() => setActiveDocModal(item)}
                      className="px-3.5 py-1.5 rounded-full bg-cyan-600 text-white font-mono text-xs font-bold shadow-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Đọc Tài Liệu</span>
                    </button>
                  )}
                </div>

                <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-black/80 text-emerald-400 border border-emerald-500/40 font-bold backdrop-blur-sm">
                    Lớp {item.grade}
                  </span>
                  {getMediaBadge(item.mediaType)}
                </div>
              </div>

              {/* Title & Lesson Details */}
              <div className="p-5 space-y-2">
                <span className="text-[11px] font-mono text-emerald-400 block font-semibold">
                  📌 {item.lessonName}
                </span>

                <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 border-t border-[#27272a] bg-[#09090b]/50 flex items-center justify-between font-mono text-xs">
              <span className="text-[11px] text-zinc-500">Nguồn: {item.authorOrSource}</span>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-[#18181b] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-[#27272a]"
                  title="Mở link gốc"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: VIDEO PLAYER MODAL */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#121215] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-sm text-white line-clamp-1">
                  Video Bài Giảng: {activeVideoModal.item.title}
                </h3>
              </div>
              <button onClick={() => setActiveVideoModal(null)} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs font-mono cursor-pointer">Đóng ✕</button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe src={activeVideoModal.parsed.embedUrl} title={activeVideoModal.item.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE LAB MODAL */}
      {activeLabModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-6xl h-[90vh] bg-[#121215] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white line-clamp-1">
                  Mô Phỏng Thí Nghiệm Ảo Tương Tác ({activeLabModal.authorOrSource}): {activeLabModal.title}
                </h3>
              </div>
              <button onClick={() => setActiveLabModal(null)} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs font-mono cursor-pointer">Đóng ✕</button>
            </div>
            <div className="flex-1 bg-white relative">
              <iframe src={activeLabModal.embedUrl || activeLabModal.url} title={activeLabModal.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: IMAGE ZOOM MODAL */}
      {activeImageModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#121215] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white line-clamp-1">
                  Sơ Đồ Phóng To: {activeImageModal.title}
                </h3>
              </div>
              <button onClick={() => setActiveImageModal(null)} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs font-mono cursor-pointer">Đóng ✕</button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center max-h-[75vh] overflow-auto">
              <img src={activeImageModal.url} alt={activeImageModal.title} className="max-w-full max-h-[70vh] object-contain rounded" />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DOCUMENT READER MODAL */}
      {activeDocModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-5xl h-[85vh] bg-[#121215] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white line-clamp-1">
                  Đọc Tài Liệu Trực Tiếp: {activeDocModal.title}
                </h3>
              </div>
              <button onClick={() => setActiveDocModal(null)} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs font-mono cursor-pointer">Đóng ✕</button>
            </div>
            <div className="flex-1 bg-white relative">
              <iframe src={activeDocModal.url} title={activeDocModal.title} className="w-full h-full border-0" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
