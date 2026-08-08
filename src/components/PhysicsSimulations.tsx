import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity, Globe, Video, Sparkles, Plus, ExternalLink, Search, CheckCircle2, Bookmark, Monitor, Layers, Eye, Upload, Send, Trash2 } from 'lucide-react';
import { parseVideoLink, ParsedVideo } from '../utils/videoHelper';

export interface VirtualLabItem {
  id: string;
  title: string;
  sourceSite: string; // e.g. "LMS360", "PhET Colorado", "oPhysics"
  webUrl: string;
  embedUrl: string;
  description: string;
  grade: 10 | 11 | 12;
  topic: string;
  thumbnailUrl?: string;
}

export interface ExperimentVideoItem {
  id: string;
  title: string;
  uploaderName: string;
  uploadDate: string;
  videoUrl: string;
  embedUrl: string;
  description: string;
  grade: 10 | 11 | 12;
  topic: string;
  steps: string[];
  thumbnailUrl?: string;
}

export const PhysicsSimulations: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [labMode, setLabMode] = useState<'VIRTUAL_LABS' | 'EXPERIMENT_VIDEOS' | 'CANVAS_SIM'>('VIRTUAL_LABS');
  
  // Modals state
  const [showAddLabModal, setShowAddLabModal] = useState<boolean>(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState<boolean>(false);
  const [activeInteractiveLab, setActiveInteractiveLab] = useState<VirtualLabItem | null>(null);
  const [activeExpVideo, setActiveExpVideo] = useState<{ video: ExperimentVideoItem; parsed: ParsedVideo } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');

  // Canvas Sim Type
  const [activeSim, setActiveSim] = useState<'PENDULUM' | 'SPRING' | 'REFRACTION'>('PENDULUM');

  // Pendulum Parameters
  const [length, setLength] = useState<number>(1.2);
  const [gravity, setGravity] = useState<number>(9.81);
  const [mass, setMass] = useState<number>(0.5);
  const [damping, setDamping] = useState<number>(0.02);
  const [initAngle, setInitAngle] = useState<number>(25);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Spring Parameters
  const [springK, setSpringK] = useState<number>(50);
  const [springMass, setSpringMass] = useState<number>(0.5);
  const [amplitude, setAmplitude] = useState<number>(0.15);

  // Refraction Parameters
  const [n1, setN1] = useState<number>(1.0);
  const [n2, setN2] = useState<number>(1.33);
  const [incidentAngle, setIncidentAngle] = useState<number>(45);

  // Canvas Refs & Simulation State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef<number>((initAngle * Math.PI) / 180);
  const angularVelRef = useRef<number>(0);

  // Pre-loaded Curated Virtual Labs (LMS360, PhET, oPhysics)
  const [virtualLabs, setVirtualLabs] = useState<VirtualLabItem[]>([
    {
      id: 'vlab_lms360_1',
      title: 'Thí Nghiệm Quang Học & Khúc Xạ Ánh Sáng Tương Tác - LMS360',
      sourceSite: 'LMS360.vn',
      webUrl: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_all.html',
      embedUrl: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_all.html',
      description: 'Mô phỏng thí nghiệm ảo tương tác trực tiếp LMS360 cho phép thay đổi chiết suất môi trường n1, n2, quan sát tia khúc xạ và đo góc phản xạ toàn phần.',
      grade: 11,
      topic: 'Sóng ánh sáng & Giao thoa',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'vlab_phet_2',
      title: 'Thí Nghiệm Thuyết Động Học Khí Lý Tưởng & Áp Suất Phân Tử - PhET Colorado',
      sourceSite: 'PhET Colorado',
      webUrl: 'https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_all.html',
      embedUrl: 'https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_all.html',
      description: 'Thí nghiệm ảo tương tác PhET minh họa mô hình phân tử khí nén, nhiệt độ T, áp suất P và thể tích V theo định luật Boyle-Mariotte và Gay-Lussac GDPT 2018.',
      grade: 12,
      topic: 'Vật lý Nhiệt & Thuyết động học chất khí',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'vlab_phet_3',
      title: 'Thí Nghiệm Con Lắc Đơn & Con Lắc Lò Xo Dao Động - PhET Interactive',
      sourceSite: 'PhET Colorado',
      webUrl: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_all.html',
      embedUrl: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_all.html',
      description: 'Mô phỏng tương tác PhET đo chu kỳ T con lắc đơn trên Trái Đất, Mặt Trăng và Sao Hỏa, quan sát năng lượng Động năng & Thế năng biến thiên.',
      grade: 11,
      topic: 'Dao động điều hòa & Con lắc',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'vlab_ophysics_4',
      title: 'Thí Nghiệm Giao Thoa Sóng Nước 2 Dòng Sóng - LMS360 Virtual Lab',
      sourceSite: 'LMS360.vn',
      webUrl: 'https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_all.html',
      embedUrl: 'https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_all.html',
      description: 'Mô phỏng 3D hiện tượng giao thoa sóng nước và sóng âm, xác định các vân cực đại d2 - d1 = kλ và vân cực tiểu giao thoa.',
      grade: 11,
      topic: 'Sóng cơ & Sóng âm',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80'
    }
  ]);

  // Pre-loaded Practical Experiment Videos
  const [expVideos, setExpVideos] = useState<ExperimentVideoItem[]>([
    {
      id: 'exp_vid_1',
      title: 'Video Thực Hành: Đo Gia Tốc Trọng Trường g Bằng Con Lắc Đơn (Chuẩn GDPT 2018)',
      uploaderName: 'ThS. Nguyễn Văn Đức',
      uploadDate: '2026-08-08',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
      description: 'Video quay lại từng bước tiến hành thí nghiệm thực tế đo thời gian t của 20 dao động toàn phần để tính gia tốc g = 4π²l / T².',
      grade: 11,
      topic: 'Dao động điều hòa & Con lắc',
      steps: [
        'Bước 1: Điều chỉnh chiều dài dây l = 0.8m bằng thước kẹp.',
        'Bước 2: Kéo con lắc lệch góc nhỏ α0 < 10° để đảm bảo dao động điều hòa.',
        'Bước 3: Dùng đồng hồ hiện số bấm thời gian t của 20 chu kỳ.',
        'Bước 4: Ghi số liệu vào bảng và tính trung bình gia tốc g.'
      ],
      thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'exp_vid_2',
      title: 'Video Thực Hành: Thí Nghiệm Hiện Tượng Cảm Ứng Điện Từ Faraday & Định Luật Lenz',
      uploaderName: 'Cô Lê Thị Hoa',
      uploadDate: '2026-08-07',
      videoUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
      embedUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ?autoplay=1',
      description: 'Video trực quan chuyển động của nam châm qua cuộn dây solenoid gây ra dòng điện cảm ứng làm kim điện kế lệch.',
      grade: 12,
      topic: 'Từ trường & Cảm ứng điện từ',
      steps: [
        'Bước 1: Nối hai đầu cuộn dây solenoid với điện kế G nhạy.',
        'Bước 2: Đưa cực Bắc của thanh nam châm lại gần cuộn dây nhanh dần.',
        'Bước 3: Quan sát kim điện kế G bị lệch khỏi vị trí số 0.',
        'Bước 4: Rút thanh nam châm ra xa và xác định chiều dòng điện cảm ứng.'
      ],
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80'
    }
  ]);

  // Form State for Adding New Virtual Lab Link
  const [newLabTitle, setNewLabTitle] = useState<string>('');
  const [newLabSource, setNewLabSource] = useState<string>('LMS360.vn');
  const [newLabUrl, setNewLabUrl] = useState<string>('');
  const [newLabDesc, setNewLabDesc] = useState<string>('');
  const [newLabGrade, setNewLabGrade] = useState<10 | 11 | 12>(12);
  const [newLabTopic, setNewLabTopic] = useState<string>('Vật lý Nhiệt & Thuyết động học chất khí');

  // Form State for Uploading/Embedding Experiment Video
  const [newVidTitle, setNewVidTitle] = useState<string>('');
  const [newVidUrl, setNewVidUrl] = useState<string>('');
  const [newVidDesc, setNewVidDesc] = useState<string>('');
  const [newVidGrade, setNewVidGrade] = useState<10 | 11 | 12>(11);
  const [newVidTopic, setNewVidTopic] = useState<string>('Dao động điều hòa & Con lắc');
  const [newVidStep1, setNewVidStep1] = useState<string>('Bước 1: Chuẩn bị dụng cụ đo');
  const [newVidStep2, setNewVidStep2] = useState<string>('Bước 2: Tiến hành đo và ghi số liệu');

  // Reset Pendulum Canvas
  const resetPendulum = () => {
    angleRef.current = (initAngle * Math.PI) / 180;
    angularVelRef.current = 0;
  };

  useEffect(() => {
    resetPendulum();
  }, [initAngle, length, gravity]);

  // Main Canvas Render Loop
  useEffect(() => {
    if (labMode !== 'CANVAS_SIM') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activeSim === 'PENDULUM') {
        if (isPlaying) {
          const angularAccel = (-gravity / length) * Math.sin(angleRef.current) - damping * angularVelRef.current;
          angularVelRef.current += angularAccel * dt;
          angleRef.current += angularVelRef.current * dt;
        }

        const originX = canvas.width / 2;
        const originY = 80;
        const pixelScale = 120;
        const bobX = originX + length * pixelScale * Math.sin(angleRef.current);
        const bobY = originY + length * pixelScale * Math.cos(angleRef.current);

        ctx.strokeStyle = isDarkMode ? '#27272a' : '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(originX - 60, originY);
        ctx.lineTo(originX + 60, originY);
        ctx.stroke();

        ctx.strokeStyle = isDarkMode ? '#a1a1aa' : '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(bobX, bobY, 14 + mass * 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2;
        ctx.stroke();

      } else if (activeSim === 'SPRING') {
        const originX = canvas.width / 2;
        const originY = 180;
        const omega = Math.sqrt(springK / springMass);
        const t = (now / 1000) * (isPlaying ? 1 : 0);
        const x = amplitude * 120 * Math.cos(omega * t);

        ctx.fillStyle = isDarkMode ? '#27272a' : '#cbd5e1';
        ctx.fillRect(50, 80, 20, 200);

        ctx.strokeStyle = isDarkMode ? '#a1a1aa' : '#475569';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const startX = 70;
        const endX = originX + x;
        const coils = 16;
        const step = (endX - startX) / coils;

        ctx.moveTo(startX, originY);
        for (let i = 1; i <= coils; i++) {
          const coilY = originY + (i % 2 === 0 ? -15 : 15);
          ctx.lineTo(startX + step * i, i === coils ? originY : coilY);
        }
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.fillRect(endX - 25, originY - 25, 50, 50);

      } else if (activeSim === 'REFRACTION') {
        const originX = canvas.width / 2;
        const originY = canvas.height / 2;

        ctx.fillStyle = isDarkMode ? '#09090b' : '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, originY);

        ctx.fillStyle = isDarkMode ? '#18181b' : '#e0f2fe';
        ctx.fillRect(0, originY, canvas.width, canvas.height - originY);

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(canvas.width, originY);
        ctx.stroke();

        const iRad = (incidentAngle * Math.PI) / 180;
        const sinR = (n1 / n2) * Math.sin(iRad);
        const isTIR = sinR > 1.0;

        const rayLen = 180;
        const incX = originX - rayLen * Math.sin(iRad);
        const incY = originY - rayLen * Math.cos(iRad);

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(incX, incY);
        ctx.lineTo(originX, originY);
        ctx.stroke();

        if (isTIR) {
          const refX = originX + rayLen * Math.sin(iRad);
          const refY = originY - rayLen * Math.cos(iRad);
          ctx.strokeStyle = '#f43f5e';
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          ctx.lineTo(refX, refY);
          ctx.stroke();
        } else {
          const rRad = Math.asin(sinR);
          const refrX = originX + rayLen * Math.sin(rRad);
          const refrY = originY + rayLen * Math.cos(rRad);

          ctx.strokeStyle = '#10b981';
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          ctx.lineTo(refrX, refrY);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [labMode, activeSim, isPlaying, length, gravity, mass, damping, springK, springMass, amplitude, n1, n2, incidentAngle, isDarkMode]);

  // Submit Handler for New Virtual Lab Link
  const handleAddLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabTitle.trim() || !newLabUrl.trim()) return;

    const created: VirtualLabItem = {
      id: `vlab_${Date.now()}`,
      title: newLabTitle,
      sourceSite: newLabSource || 'LMS360.vn',
      webUrl: newLabUrl,
      embedUrl: newLabUrl,
      description: newLabDesc || 'Thí nghiệm ảo tương tác trực tiếp dành cho giáo viên và học sinh.',
      grade: newLabGrade,
      topic: newLabTopic,
      thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80'
    };

    setVirtualLabs(prev => [created, ...prev]);
    setShowAddLabModal(false);
    setNewLabTitle('');
    setNewLabUrl('');
    setNewLabDesc('');
  };

  // Submit Handler for New Experiment Video Upload/Embed
  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVidTitle.trim() || !newVidUrl.trim()) return;

    const parsed = parseVideoLink(newVidUrl);

    const created: ExperimentVideoItem = {
      id: `exp_vid_${Date.now()}`,
      title: newVidTitle,
      uploaderName: 'Giáo Viên Vật Lý',
      uploadDate: new Date().toISOString().split('T')[0],
      videoUrl: newVidUrl,
      embedUrl: parsed.embedUrl || newVidUrl,
      description: newVidDesc || 'Video clip quay thực tế quá trình tiến hành thí nghiệm thực hành Vật lý THPT.',
      grade: newVidGrade,
      topic: newVidTopic,
      steps: [newVidStep1, newVidStep2].filter(Boolean),
      thumbnailUrl: parsed.thumbnailUrl || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80'
    };

    setExpVideos(prev => [created, ...prev]);
    setShowAddVideoModal(false);
    setNewVidTitle('');
    setNewVidUrl('');
    setNewVidDesc('');
  };

  // Open Video Modal
  const handleOpenVideo = (v: ExperimentVideoItem) => {
    const parsed = parseVideoLink(v.embedUrl || v.videoUrl);
    setActiveExpVideo({ video: v, parsed });
  };

  return (
    <div className={`rounded-xl border p-6 shadow-xl transition-colors ${
      isDarkMode ? 'bg-[#121215] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      
      {/* Header & Main Lab Mode Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-[#27272a] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-wide">
                Phòng Thí Nghiệm Ảo & Video Thực Hành Vật Lý (GDPT 2018)
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Tương tác trực tiếp mô hình LMS360/PhET • Xem video thí nghiệm thực tế • Thử nghiệm Canvas 2D
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setLabMode('VIRTUAL_LABS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              labMode === 'VIRTUAL_LABS'
                ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-950/40'
                : 'bg-[#18181b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>🧪 Thí Nghiệm Ảo LMS360 / PhET ({virtualLabs.length})</span>
          </button>

          <button
            onClick={() => setLabMode('EXPERIMENT_VIDEOS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              labMode === 'EXPERIMENT_VIDEOS'
                ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-950/40'
                : 'bg-[#18181b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <Video className="w-4 h-4 text-rose-400" />
            <span>📹 Video Thí Nghiệm Thực Hành ({expVideos.length})</span>
          </button>

          <button
            onClick={() => setLabMode('CANVAS_SIM')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              labMode === 'CANVAS_SIM'
                ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-950/40'
                : 'bg-[#18181b] text-zinc-400 hover:text-white border border-[#27272a]'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>⚡ Mô Phỏng Canvas 2D</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: VIRTUAL LABS (LMS360 / PhET) */}
      {labMode === 'VIRTUAL_LABS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Tìm thí nghiệm LMS360, PhET..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-lg text-xs border border-[#27272a] bg-[#18181b] text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg text-xs border border-[#27272a] bg-[#18181b] text-zinc-200 font-mono focus:outline-none"
              >
                <option value="ALL">Khối Lớp: Tất Cả</option>
                <option value="10">Khối 10</option>
                <option value="11">Khối 11</option>
                <option value="12">Khối 12</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddLabModal(true)}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Link Thí Nghiệm LMS360 Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {virtualLabs.filter(lab => 
              (gradeFilter === 'ALL' || lab.grade === Number(gradeFilter)) &&
              (lab.title.toLowerCase().includes(searchQuery.toLowerCase()) || lab.topic.toLowerCase().includes(searchQuery.toLowerCase()))
            ).map(lab => (
              <div key={lab.id} className="group rounded-xl border border-[#27272a] bg-[#18181b] overflow-hidden hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video w-full bg-black overflow-hidden">
                    <img src={lab.thumbnailUrl} alt={lab.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                      <button
                        onClick={() => setActiveInteractiveLab(lab)}
                        className="px-4 py-2 rounded-full bg-emerald-600 text-white font-mono text-xs font-bold shadow-xl flex items-center gap-2 group-hover:scale-105 transition-transform cursor-pointer"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Mở Thí Nghiệm Tương Tác</span>
                      </button>
                    </div>

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-black/80 text-emerald-400 border border-emerald-500/40 font-bold backdrop-blur-sm">
                        Lớp {lab.grade}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-sm">
                        {lab.sourceSite}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                      {lab.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {lab.description}
                    </p>
                    <div className="p-2 rounded bg-[#09090b] border border-[#27272a] text-[11px] font-mono text-emerald-400">
                      Chuyên đề: {lab.topic}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-[#27272a] bg-[#09090b]/50 flex items-center justify-between font-mono text-xs">
                  <button
                    onClick={() => setActiveInteractiveLab(lab)}
                    className="px-3.5 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Mở Tương Tác Trực Tiếp</span>
                  </button>

                  <a
                    href={lab.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded bg-[#18181b] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-[#27272a]"
                    title="Mở tab mới trang gốc"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: EXPERIMENT VIDEOS (UPLOAD & EMBED) */}
      {labMode === 'EXPERIMENT_VIDEOS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
              Danh Mục Video Thực Hành & Thao Tác Thí Nghiệm Thực Tế
            </h3>

            <button
              onClick={() => setShowAddVideoModal(true)}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white shadow flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              <span>+ Tải Lên / Nhúng Video Thí Nghiệm Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expVideos.map(v => (
              <div key={v.id} className="group rounded-xl border border-[#27272a] bg-[#18181b] overflow-hidden hover:border-rose-500/50 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video w-full bg-black overflow-hidden">
                    <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                      <button
                        onClick={() => handleOpenVideo(v)}
                        className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </button>
                    </div>

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-black/80 text-rose-400 border border-rose-500/40 font-bold backdrop-blur-sm">
                        Lớp {v.grade}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/80 text-zinc-300 border border-zinc-700 backdrop-blur-sm">
                        Video Thực Hành
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors">
                      {v.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {v.description}
                    </p>

                    {v.steps && v.steps.length > 0 && (
                      <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] space-y-1.5 text-xs font-mono">
                        <span className="text-zinc-400 font-bold block text-[11px]">📋 Quy Trình Thí Nghiệm:</span>
                        {v.steps.map((st, idx) => (
                          <div key={idx} className="text-zinc-300 text-[11px] truncate flex items-center gap-1.5">
                            <span className="text-emerald-400">✓</span> {st}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-[#27272a] bg-[#09090b]/50 flex items-center justify-between font-mono text-xs">
                  <button
                    onClick={() => handleOpenVideo(v)}
                    className="px-3.5 py-1.5 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-rose-400" />
                    <span>Xem Video Thực Hành HD</span>
                  </button>

                  <span className="text-[11px] text-zinc-500">Đăng ngày: {v.uploadDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: CANVAS 2D SIMULATION */}
      {labMode === 'CANVAS_SIM' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272a] pb-3 font-mono text-xs">
            <span className="text-zinc-400 font-bold">Chọn Mô Mô Hình Vật Lý Canvas 2D:</span>
            <div className="flex rounded p-1 bg-[#09090b] border border-[#27272a]">
              <button
                onClick={() => setActiveSim('PENDULUM')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeSim === 'PENDULUM' ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Con Lắc Đơn
              </button>
              <button
                onClick={() => setActiveSim('SPRING')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeSim === 'SPRING' ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Con Lắc Lò Xo
              </button>
              <button
                onClick={() => setActiveSim('REFRACTION')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeSim === 'REFRACTION' ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Khúc Xạ Ánh Sáng
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] rounded-lg border border-[#27272a] bg-[#09090b] flex items-center justify-center overflow-hidden">
                <canvas ref={canvasRef} width={520} height={380} className="w-full h-full object-contain" />
                {activeSim !== 'REFRACTION' && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-[#18181b]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#27272a] text-white text-xs font-mono">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-1 hover:text-emerald-400 cursor-pointer">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button onClick={resetPendulum} className="p-1 hover:text-amber-400 cursor-pointer">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4 text-xs font-mono">
              {activeSim === 'PENDULUM' && (
                <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] space-y-3">
                  <div className="flex justify-between text-zinc-300 font-bold">
                    <span>Chiều dài dây (l):</span>
                    <span className="text-emerald-400">{length} m</span>
                  </div>
                  <input type="range" min="0.3" max="2.5" step="0.1" value={length} onChange={(e) => setLength(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                  <div className="flex justify-between text-zinc-300 font-bold">
                    <span>Gia tốc (g):</span>
                    <span className="text-emerald-400">{gravity} m/s²</span>
                  </div>
                  <input type="range" min="1.0" max="25.0" step="0.5" value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                </div>
              )}

              {activeSim === 'REFRACTION' && (
                <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] space-y-3">
                  <div className="flex justify-between text-zinc-300 font-bold">
                    <span>Chiết suất n1:</span>
                    <span className="text-emerald-400">{n1}</span>
                  </div>
                  <input type="range" min="1.0" max="2.5" step="0.05" value={n1} onChange={(e) => setN1(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                  <div className="flex justify-between text-zinc-300 font-bold">
                    <span>Chiết suất n2:</span>
                    <span className="text-emerald-400">{n2}</span>
                  </div>
                  <input type="range" min="1.0" max="2.5" step="0.05" value={n2} onChange={(e) => setN2(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW VIRTUAL LAB LINK (LMS360 / PhET) */}
      {showAddLabModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#27272a] bg-[#18181b] p-6 shadow-2xl space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                Thêm Link Thí Nghiệm Ảo LMS360 / PhET Mới
              </h3>
              <button onClick={() => setShowAddLabModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddLabSubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-300 mb-1">Tiêu Đề Thí Nghiệm Ảo:</label>
                <input type="text" required placeholder="VD: Thí Nghiệm Quang Học & Khúc Xạ LMS360" value={newLabTitle} onChange={(e) => setNewLabTitle(e.target.value)} className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-100" />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Đường Link Nhúng / Website Thí Nghiệm (LMS360/PhET):</label>
                <input type="url" required placeholder="https://lms360.vn/virtual-lab/optics" value={newLabUrl} onChange={(e) => setNewLabUrl(e.target.value)} className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-emerald-400" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Trang Nguồn (Source):</label>
                  <input type="text" placeholder="LMS360.vn" value={newLabSource} onChange={(e) => setNewLabSource(e.target.value)} className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-100" />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Khối Lớp:</label>
                  <select value={newLabGrade} onChange={(e) => setNewLabGrade(Number(e.target.value) as any)} className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-100">
                    <option value={10}>Lớp 10</option>
                    <option value={11}>Lớp 11</option>
                    <option value={12}>Lớp 12</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Mô Tả Nhanh Thí Nghiệm:</label>
                <textarea rows={3} placeholder="Mô tả các thao tác biến đổi thông số trong thí nghiệm..." value={newLabDesc} onChange={(e) => setNewLabDesc(e.target.value)} className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-100" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddLabModal(false)} className="px-4 py-2 rounded bg-zinc-800 text-zinc-300 font-bold">Hủy</button>
                <button type="submit" className="px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold">Lưu & Tương Tác</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE VIRTUAL LAB IFRAME VIEWER */}
      {activeInteractiveLab && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-6xl h-[90vh] bg-[#121215] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white line-clamp-1">
                  Phòng Thí Nghiệm Ảo Tương Tác Trực Tiếp ({activeInteractiveLab.sourceSite}): {activeInteractiveLab.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a href={activeInteractiveLab.webUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded bg-[#18181b] text-emerald-400 border border-[#27272a] text-xs font-mono flex items-center gap-1">
                  <span>Mở Tab Mới</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => setActiveInteractiveLab(null)} className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer">Đóng ✕</button>
              </div>
            </div>
            <div className="flex-1 bg-white relative">
              <iframe src={activeInteractiveLab.embedUrl} title={activeInteractiveLab.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EXPERIMENT VIDEO PLAYER MODAL */}
      {activeExpVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#121215] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-sm text-white line-clamp-1">
                  Video Thực Hành Thí Nghiệm: {activeExpVideo.video.title}
                </h3>
              </div>
              <button onClick={() => setActiveExpVideo(null)} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs font-mono cursor-pointer">Đóng ✕</button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe src={activeExpVideo.parsed.embedUrl} title={activeExpVideo.video.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
            <div className="p-4 bg-[#09090b] border-t border-[#27272a] text-xs font-mono space-y-2 overflow-y-auto max-h-48">
              <span className="text-emerald-400 font-bold block">Chuyên đề: {activeExpVideo.video.topic}</span>
              <p className="text-zinc-300 bg-[#18181b] p-3 rounded border border-[#27272a]">{activeExpVideo.video.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD EXPERIMENT VIDEO */}
      {showAddVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#27272a] bg-[#18181b] p-6 shadow-2xl space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-400" />
                Nhúng / Tải Video Thí Nghiệm Thực Hành Mới
              </h3>
              <button onClick={() => setShowAddVideoModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddVideoSubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-300 mb-1">Tiêu Đề Video Thí Nghiệm:</label>
                <input type="text" required placeholder="VD: Thí Nghiệm Khí Lý Tưởng & Áp Kế Khí" value={newVidTitle} onChange={(e) => setNewVidTitle(e.target.value)} className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-100" />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Đường Link Video (YouTube / MP4):</label>
                <input type="url" required placeholder="https://www.youtube.com/watch?v=..." value={newVidUrl} onChange={(e) => setNewVidUrl(e.target.value)} className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-rose-400" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Khối Lớp:</label>
                  <select value={newVidGrade} onChange={(e) => setNewVidGrade(Number(e.target.value) as any)} className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-100">
                    <option value={10}>Lớp 10</option>
                    <option value={11}>Lớp 11</option>
                    <option value={12}>Lớp 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Chuyên Đề:</label>
                  <select value={newVidTopic} onChange={(e) => setNewVidTopic(e.target.value)} className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-100">
                    <option value="Vật lý Nhiệt & Thuyết động học chất khí">Vật lý Nhiệt & Thuyết động học chất khí</option>
                    <option value="Dao động điều hòa & Con lắc">Dao động điều hòa & Con lắc</option>
                    <option value="Sóng cơ & Sóng âm">Sóng cơ & Sóng âm</option>
                    <option value="Từ trường & Cảm ứng điện từ">Từ trường & Cảm ứng điện từ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Mô Tả Nhanh Thí Nghiệm:</label>
                <textarea rows={2} placeholder="Mô tả các hiện tượng cần quan sát trong video..." value={newVidDesc} onChange={(e) => setNewVidDesc(e.target.value)} className="w-full p-2.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-100" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddVideoModal(false)} className="px-4 py-2 rounded bg-zinc-800 text-zinc-300 font-bold">Hủy</button>
                <button type="submit" className="px-5 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold">Lưu & Tải Lên</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
