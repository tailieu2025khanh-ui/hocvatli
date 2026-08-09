import React, { useState } from 'react';
import { TeachingMaterial, GradeLevel, ColleagueTeacher } from '../types';
import { parseVideoLink, ParsedVideo } from '../utils/videoHelper';
import { Video, Globe, Play, ExternalLink, Search, Sparkles, Send, Trash2, Monitor, Edit, RefreshCw } from 'lucide-react';

interface WebResourceAndVideoHubProps {
  isDarkMode: boolean;
  materials: TeachingMaterial[];
  currentTeacher?: ColleagueTeacher;
  onAddMaterial: (mat: TeachingMaterial) => void;
  onDeleteMaterial: (matId: string) => void;
  onUpdateMaterial?: (mat: TeachingMaterial) => void;
  onAssignTask?: (mat: TeachingMaterial) => void;
}

export const WebResourceAndVideoHub: React.FC<WebResourceAndVideoHubProps> = ({
  isDarkMode,
  materials,
  currentTeacher,
  onAddMaterial,
  onDeleteMaterial,
  onUpdateMaterial,
  onAssignTask,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ALL' | 'VIDEOS' | 'WEB_PAGES'>('ALL');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [addMode, setAddMode] = useState<'VIDEO' | 'WEB_PAGE'>('VIDEO');
  const [activeVideoModal, setActiveVideoModal] = useState<{ mat: TeachingMaterial; parsed: ParsedVideo } | null>(null);
  const [activeWebDocModal, setActiveWebDocModal] = useState<TeachingMaterial | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<TeachingMaterial | null>(null);

  // Edit / Replace Form State
  const [editTitle, setEditTitle] = useState<string>('');
  const [editUrl, setEditUrl] = useState<string>('');
  const [editDesc, setEditDesc] = useState<string>('');
  const [editGrade, setEditGrade] = useState<GradeLevel>(12);
  const [editTopic, setEditTopic] = useState<string>('');
  const [editSiteName, setEditSiteName] = useState<string>('');

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');

  // Form State for Adding Video / Web Document Link
  const [formTitle, setFormTitle] = useState<string>('');
  const [formUrl, setFormUrl] = useState<string>('');
  const [formDesc, setFormDesc] = useState<string>('');
  const [formGrade, setFormGrade] = useState<GradeLevel>(12);
  const [formTopic, setFormTopic] = useState<string>('Vật lý Nhiệt & Thuyết động học chất khí');
  const [formSiteName, setFormSiteName] = useState<string>('YouTube / Mạng Giáo Dục');

  // Curated YouTube & Web Resources fallback list if none present
  const curatedMaterials: TeachingMaterial[] = [
    {
      id: 'web_v101',
      title: 'Chuyên Đề 12: Thuyết Động Học Chất Khí & Đẳng Nhiệt (Thí Nghiệm Mô Phỏng)',
      description: 'Video bài giảng minh họa mô hình phân tử va chạm, đồ thị đẳng nhiệt Boyle-Mariotte theo chuẩn GDPT 2018.',
      type: 'VIDEO',
      uploadedByTeacherId: 'tch_1',
      uploadedByTeacherName: 'ThS. Nguyễn Văn Đức',
      uploadedDate: '2026-08-08',
      grade: 12,
      topic: 'Vật lý Nhiệt & Thuyết động học chất khí',
      assignedClassCodes: ['PHY12-PRO'],
      viewCount: 342,
      downloadCount: 89,
      isExternalWeb: true,
      webUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
      videoHost: 'YOUTUBE',
      siteName: 'YouTube Physics Channel',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'web_v102',
      title: 'Chuyên Đề 11: Dao Động Điều Hòa & Con Lắc Đơn (Thí Nghiệm Thực Tế & Đồ Thị Pha)',
      description: 'Video nhúng link hướng dẫn cách đọc đồ thị li độ - thời gian, pha ban đầu φ và cách bấm máy tính Casio.',
      type: 'VIDEO',
      uploadedByTeacherId: 'tch_2',
      uploadedByTeacherName: 'Cô Lê Thị Hoa',
      uploadedDate: '2026-08-07',
      grade: 11,
      topic: 'Dao động điều hòa & Con lắc',
      assignedClassCodes: ['PHY11-X1'],
      viewCount: 280,
      downloadCount: 65,
      isExternalWeb: true,
      webUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
      embedUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ?autoplay=1',
      videoHost: 'YOUTUBE',
      siteName: 'Vật Lý THPT 247',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'web_doc101',
      title: 'Trang Web Đọc: Chuyên Đề Tổng Hợp Công Thức & Dạng Bài Tập Vật Lý 12 GDPT 2018',
      description: 'Trang tài liệu tra cứu trực tuyến toàn bộ lý thuyết Nhiệt Học, Từ Trường, Hạt Nhân Vật Lý đầy đủ chi tiết.',
      type: 'WEB_ARTICLE',
      uploadedByTeacherId: 'tch_1',
      uploadedByTeacherName: 'ThS. Nguyễn Văn Đức',
      uploadedDate: '2026-08-06',
      grade: 12,
      topic: 'Vật lý Nhiệt & Thuyết động học chất khí',
      assignedClassCodes: ['PHY12-PRO'],
      viewCount: 512,
      downloadCount: 140,
      isExternalWeb: true,
      webUrl: 'https://vi.wikipedia.org/wiki/Thuy%E1%BA%BFt_%C4%91%E1%BB%99ng_h%E1%BB%8Dc_ph%C3%A2n_t%E1%BB%AD',
      siteName: 'Thư Viện Học Liệu Vật Lý',
      thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'web_doc102',
      title: 'Trang Bài Viết: Hiện Tượng Sóng Dừng & Giao Thoa Sóng Ánh Sáng (Thư Viện Thí Nghiệm)',
      description: 'Bài viết học thuật trực tuyến phân tích chi tiết ứng dụng giao thoa ánh sáng Y-ăng và tính khoảng vân i.',
      type: 'WEB_ARTICLE',
      uploadedByTeacherId: 'tch_3',
      uploadedByTeacherName: 'Thầy Phạm Đức Minh',
      uploadedDate: '2026-08-05',
      grade: 11,
      topic: 'Sóng ánh sáng & Giao thoa',
      assignedClassCodes: ['PHY11-X1'],
      viewCount: 195,
      downloadCount: 42,
      isExternalWeb: true,
      webUrl: 'https://vi.wikipedia.org/wiki/Giao_thoa',
      siteName: 'Physics Web Portal',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // Combine parent materials with curated list
  const allWebMaterials = [
    ...materials.filter(m => m.type === 'VIDEO' || m.type === 'WEB_ARTICLE' || m.isExternalWeb || m.webUrl),
    ...curatedMaterials.filter(c => !materials.some(m => m.id === c.id))
  ];

  // Filter items
  const filteredList = allWebMaterials.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = gradeFilter === 'ALL' || item.grade === Number(gradeFilter);
    const matchesTab = activeSubTab === 'ALL' || 
      (activeSubTab === 'VIDEOS' && (item.type === 'VIDEO' || item.videoHost)) ||
      (activeSubTab === 'WEB_PAGES' && (item.type === 'WEB_ARTICLE' || !item.videoHost));

    return matchesSearch && matchesGrade && matchesTab;
  });

  // Handle Adding New Video / Web Document Link
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) return;

    const parsedVid = parseVideoLink(formUrl);
    const isVid = addMode === 'VIDEO' || parsedVid.type === 'YOUTUBE' || parsedVid.type === 'VIMEO' || parsedVid.type === 'DIRECT_MP4';

    const created: TeachingMaterial = {
      id: `web_${Date.now()}`,
      title: formTitle,
      description: formDesc || 'Tài liệu video / trang web được nhúng trực tiếp vào ứng dụng HỌC VẬT LÍ THẬT THÚ VỊ.',
      type: isVid ? 'VIDEO' : 'WEB_ARTICLE',
      uploadedByTeacherId: currentTeacher?.id || 'tch_1',
      uploadedByTeacherName: currentTeacher?.name || 'Giáo Viên Vật Lý',
      uploadedDate: new Date().toISOString().split('T')[0],
      grade: formGrade,
      topic: formTopic,
      assignedClassCodes: ['PHY12-PRO'],
      viewCount: 1,
      downloadCount: 0,
      isExternalWeb: true,
      webUrl: formUrl,
      embedUrl: parsedVid.embedUrl || formUrl,
      videoHost: isVid ? parsedVid.type : undefined,
      siteName: formSiteName || (isVid ? 'Video Mạng (YouTube/Vimeo)' : 'Trang Web Học Liệu'),
      thumbnailUrl: parsedVid.thumbnailUrl || (isVid 
        ? 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80')
    };

    onAddMaterial(created);
    setShowAddModal(false);
    setFormTitle('');
    setFormUrl('');
    setFormDesc('');
  };

  // Open edit / replace modal
  const handleOpenEditModal = (mat: TeachingMaterial) => {
    setEditingMaterial(mat);
    setEditTitle(mat.title);
    setEditUrl(mat.webUrl || mat.fileUrl || '');
    setEditDesc(mat.description);
    setEditGrade(mat.grade);
    setEditTopic(mat.topic);
    setEditSiteName(mat.siteName || '');
  };

  // Submit edit / replace material
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial || !editTitle.trim() || !editUrl.trim()) return;

    const parsedVid = parseVideoLink(editUrl);
    const isVid = editingMaterial.type === 'VIDEO' || parsedVid.type === 'YOUTUBE' || parsedVid.type === 'VIMEO' || parsedVid.type === 'DIRECT_MP4';

    const updated: TeachingMaterial = {
      ...editingMaterial,
      title: editTitle,
      description: editDesc,
      grade: editGrade,
      topic: editTopic,
      webUrl: editUrl,
      embedUrl: parsedVid.embedUrl || editUrl,
      videoHost: isVid ? parsedVid.type : undefined,
      siteName: editSiteName || editingMaterial.siteName || 'Video Mạng (Đã Thay Thế)',
      thumbnailUrl: parsedVid.thumbnailUrl || editingMaterial.thumbnailUrl || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80'
    };

    if (onUpdateMaterial) {
      onUpdateMaterial(updated);
    } else {
      onAddMaterial(updated);
    }

    setEditingMaterial(null);
    alert(`✓ Đã thay thế thành công nội dung/video bài giảng "${editTitle}"!`);
  };

  // Confirm and Delete Material
  const handleDeleteConfirm = (mat: TeachingMaterial) => {
    if (window.confirm(`Bạn có chắc chắn muốn XÓA video / bài giảng "${mat.title}" khỏi hệ thống không?\n\nHành động này không thể hoàn tác.`)) {
      onDeleteMaterial(mat.id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 ${
        isDarkMode ? 'bg-gradient-to-r from-[#121215] via-[#18181b] to-[#121215] border-[#27272a] text-zinc-100' : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200 text-slate-900'
      }`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Tính Năng Mới • Nhúng Link Xem Trực Tiếp
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              HỌC VẬT LÍ THẬT THÚ VỊ
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Monitor className="w-6 h-6 text-emerald-400" />
            Kho Trang Tài Liệu & Video Nhúng Link Trực Tuyến
          </h2>

          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Chỉ cần dán đường link video (YouTube, Vimeo, MP4) hoặc các trang tài liệu web tìm được trên mạng, bài học sẽ tự động hiển thị trình phát HD và chế độ xem đọc trực tiếp ngay trong ứng dụng!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setAddMode('VIDEO');
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>+ Nhúng Link Video Mạng</span>
          </button>

          <button
            onClick={() => {
              setAddMode('WEB_PAGE');
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>+ Thêm Trang Tài Liệu Web</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveSubTab('ALL')}
            className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
              activeSubTab === 'ALL'
                ? 'bg-emerald-600 text-white font-bold shadow'
                : 'bg-[#18181b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            Tất Cả ({allWebMaterials.length})
          </button>

          <button
            onClick={() => setActiveSubTab('VIDEOS')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
              activeSubTab === 'VIDEOS'
                ? 'bg-rose-600 text-white font-bold shadow'
                : 'bg-[#18181b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Nhúng Link ({allWebMaterials.filter(m => m.type === 'VIDEO' || m.videoHost).length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('WEB_PAGES')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
              activeSubTab === 'WEB_PAGES'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'bg-[#18181b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Trang Tài Liệu Mạng ({allWebMaterials.filter(m => m.type === 'WEB_ARTICLE' || !m.videoHost).length})</span>
          </button>
        </div>

        {/* Search & Grade Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Tìm video, tài liệu web..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-3 py-1.5 rounded text-xs border focus:outline-none focus:border-emerald-500 font-mono ${
                isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-white border-slate-300'
              }`}
            />
          </div>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className={`px-3 py-1.5 rounded text-xs border focus:outline-none focus:border-emerald-500 font-mono ${
              isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-200' : 'bg-white border-slate-300'
            }`}
          >
            <option value="ALL">Khối Lớp: Tất Cả</option>
            <option value="10">Khối 10</option>
            <option value="11">Khối 11</option>
            <option value="12">Khối 12</option>
          </select>
        </div>
      </div>

      {/* Grid of Video & Web Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredList.map((item) => {
          const isVid = item.type === 'VIDEO' || !!item.videoHost;
          const parsedVid = parseVideoLink(item.embedUrl || item.webUrl || '');

          return (
            <div
              key={item.id}
              className={`group rounded-xl border overflow-hidden transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl flex flex-col justify-between ${
                isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                {/* Media Thumbnail & Direct Play Badge */}
                <div className="relative aspect-video w-full bg-black overflow-hidden group-hover:opacity-95 transition-opacity">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                      {isVid ? <Video className="w-12 h-12" /> : <Globe className="w-12 h-12" />}
                    </div>
                  )}

                  {/* Play Overlay Button for Video */}
                  {isVid && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                      <button
                        onClick={() => handleOpenVideo(item)}
                        className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-rose-500 transition-all cursor-pointer"
                      >
                        <Play className="w-7 h-7 fill-white ml-1" />
                      </button>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-black/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-sm font-bold">
                      Khối {item.grade}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-sm">
                      {isVid ? '▶ Video Nhúng Link' : '🌐 Trang Web Đọc'}
                    </span>
                  </div>

                  {item.siteName && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-zinc-300 border border-zinc-700 text-[10px] font-mono backdrop-blur-sm">
                      {item.siteName}
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs font-mono space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span>Chuyên đề:</span>
                      <span className="text-emerald-400 font-semibold">{item.topic}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500 text-[11px]">
                      <span>Đăng bởi: {item.uploadedByTeacherName}</span>
                      <span>Ngày: {item.uploadedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-[#27272a] bg-[#09090b]/50 flex items-center justify-between gap-2 font-mono text-xs">
                {isVid ? (
                  <button
                    onClick={() => handleOpenVideo(item)}
                    className="px-3.5 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-rose-400" />
                    <span>Xem Video Trực Tiếp</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveWebDocModal(item)}
                    className="px-3.5 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Đọc Trang Web Trực Tiếp</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 cursor-pointer flex items-center gap-1"
                    title="Thay thế / Chỉnh sửa Video hoặc Bài giảng"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline text-[11px] font-bold">Thay Thế</span>
                  </button>

                  {onAssignTask && (
                    <button
                      onClick={() => onAssignTask(item)}
                      className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-pointer"
                      title="Giao cho học sinh"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}

                  {item.webUrl && (
                    <a
                      href={item.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#18181b] hover:bg-zinc-800 text-zinc-300 border border-[#27272a] cursor-pointer"
                      title="Mở trong tab mới"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDeleteConfirm(item)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 cursor-pointer"
                    title="Xóa bài giảng/video không đạt yêu cầu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: ADD VIDEO OR WEB DOCUMENT LINK */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-xl border p-6 shadow-2xl transition-all ${
            isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-4">
              <div className="flex items-center gap-2">
                {addMode === 'VIDEO' ? <Video className="w-5 h-5 text-rose-400" /> : <Globe className="w-5 h-5 text-cyan-400" />}
                <h3 className="font-bold text-base text-white">
                  {addMode === 'VIDEO' ? 'Nhúng Link Video Trực Tuyến (YouTube/Vimeo)' : 'Thêm Trang Tài Liệu Tìm Trên Mạng'}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-xs text-zinc-400 hover:text-white font-mono cursor-pointer">Đóng ✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-300 mb-1">
                  {addMode === 'VIDEO' ? 'Đường Link Video (YouTube / Vimeo / MP4):' : 'Đường Link Website / Trang Tài Liệu Web:'}
                </label>
                <input
                  type="url"
                  required
                  placeholder={addMode === 'VIDEO' ? 'https://www.youtube.com/watch?v=...' : 'https://thuvienhoclieu.com/...'}
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Tiêu Đề Bài Học / Tài Liệu:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Bài Giảng Dao Động Điều Hòa - Thí Nghiệm Con Lắc"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Khối Lớp GDPT:</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(Number(e.target.value) as GradeLevel)}
                    className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-100"
                  >
                    <option value={10}>Lớp 10</option>
                    <option value={11}>Lớp 11</option>
                    <option value={12}>Lớp 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">Tên Nguồn Website:</label>
                  <input
                    type="text"
                    placeholder="VD: YouTube / Wikipedia / Học Liệu 247"
                    value={formSiteName}
                    onChange={(e) => setFormSiteName(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Chuyên Đề Kiến Thức:</label>
                <select
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-100"
                >
                  <option value="Vật lý Nhiệt & Thuyết động học chất khí">Vật lý Nhiệt & Thuyết động học chất khí</option>
                  <option value="Dao động điều hòa & Con lắc">Dao động điều hòa & Con lắc</option>
                  <option value="Sóng cơ & Sóng âm">Sóng cơ & Sóng âm</option>
                  <option value="Sóng ánh sáng & Giao thoa">Sóng ánh sáng & Giao thoa</option>
                  <option value="Từ trường & Lực Lorentz">Từ trường & Lực Lorentz</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Mô Tả Tóm Tắt Nhanh:</label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú tóm tắt nội dung chính để học sinh nắm bắt..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow"
                >
                  Lưu & Nhúng Vào App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EMBEDDED VIDEO PLAYER MODAL */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#121215] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-sm text-white line-clamp-1">
                  Trình Phát Video Trực Tiếp: {activeVideoModal.mat.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-mono cursor-pointer"
              >
                Đóng Trình Phát ✕
              </button>
            </div>

            {/* Embedded Player Video Screen */}
            <div className="relative aspect-video w-full bg-black">
              {activeVideoModal.parsed.type === 'YOUTUBE' || activeVideoModal.parsed.type === 'VIMEO' || activeVideoModal.parsed.type === 'IFRAME' ? (
                <iframe
                  src={activeVideoModal.parsed.embedUrl}
                  title={activeVideoModal.mat.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  autoPlay
                  src={activeVideoModal.parsed.embedUrl}
                  className="w-full h-full"
                />
              )}
            </div>

            {/* Video Info Footer */}
            <div className="p-4 bg-[#09090b] border-t border-[#27272a] text-xs font-mono space-y-2">
              <div className="flex flex-wrap justify-between items-center text-zinc-400 gap-2">
                <span>Chuyên đề: <strong className="text-emerald-400">{activeVideoModal.mat.topic}</strong></span>
                <span>Nguồn: <strong className="text-cyan-400">{activeVideoModal.mat.siteName || 'Online Physics Video'}</strong></span>
                {activeVideoModal.mat.webUrl && (
                  <a
                    href={activeVideoModal.mat.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 underline hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>Mở link gốc trên YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-zinc-300 leading-relaxed bg-[#18181b] p-3 rounded border border-[#27272a]">
                {activeVideoModal.mat.description}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: EMBEDDED WEB DOCUMENT READER MODAL */}
      {activeWebDocModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-5xl h-[85vh] bg-[#121215] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Reader Header */}
            <div className="p-4 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white line-clamp-1">
                  Đọc Trang Web Trực Tiếp: {activeWebDocModal.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {activeWebDocModal.webUrl && (
                  <a
                    href={activeWebDocModal.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/40 rounded text-xs font-mono flex items-center gap-1"
                  >
                    <span>Mở trong Tab Mới</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => setActiveWebDocModal(null)}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-mono cursor-pointer"
                >
                  Đóng ✕
                </button>
              </div>
            </div>

            {/* Web Frame Content */}
            <div className="flex-1 bg-white relative">
              <iframe
                src={activeWebDocModal.webUrl || activeWebDocModal.embedUrl}
                title={activeWebDocModal.title}
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>

      {/* MODAL 4: EDIT / REPLACE VIDEO OR MATERIAL MODAL */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-xl border p-6 shadow-2xl transition-all ${
            isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-4">
              <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-400" />
                Thay Thế Video / Chỉnh Sửa Nội Dung Bài Giảng
              </h3>
              <button
                onClick={() => setEditingMaterial(null)}
                className="text-zinc-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">Tên Video / Tài Liệu (*):</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="VD: Thay thế Video Chuyên đề 12 - Nhiệt Học..."
                  className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">Đường Link Video Mới (YouTube / Vimeo / MP4 / Web Link):</label>
                <input
                  type="url"
                  required
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded bg-[#09090b] border border-amber-500/50 text-amber-300 focus:outline-none focus:border-amber-400 font-bold"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  💡 Dán link video mới để thay thế video cũ bị lỗi hoặc không đạt yêu cầu.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Khối Lớp:</label>
                  <select
                    value={editGrade}
                    onChange={(e) => setEditGrade(Number(e.target.value) as GradeLevel)}
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Nguồn / Kênh Video:</label>
                  <input
                    type="text"
                    value={editSiteName}
                    onChange={(e) => setEditSiteName(e.target.value)}
                    placeholder="VD: YouTube Physics"
                    className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-zinc-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Chuyên Đề Vật Lý:</label>
                <input
                  type="text"
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                  placeholder="VD: Dao động cơ / Vật lý Nhiệt"
                  className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Mô Tả Lý Do Thay Thế / Ghi Chú Bài Học:</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Nhập mô tả cập nhật mới..."
                  className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#27272a]">
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
                  className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Cập Nhật Thay Thế Video</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
