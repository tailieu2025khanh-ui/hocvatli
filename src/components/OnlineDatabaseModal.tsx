import React, { useState } from 'react';
import { ClassRoom, StudentProfile, OnlineDatabaseConfig } from '../types';
import { Database, RefreshCw, CheckCircle2, AlertTriangle, Link2, Server, Cloud, ShieldCheck, DownloadCloud, UploadCloud, Globe, Check, Radio } from 'lucide-react';

interface OnlineDatabaseModalProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  classList: ClassRoom[];
  students: StudentProfile[];
  onUpdateClassList: (classes: ClassRoom[]) => void;
  onUpdateStudents?: (students: StudentProfile[]) => void;
  dbConfig: OnlineDatabaseConfig;
  onUpdateDbConfig: (config: OnlineDatabaseConfig) => void;
}

export const OnlineDatabaseModal: React.FC<OnlineDatabaseModalProps> = ({
  isDarkMode,
  isOpen,
  onClose,
  classList,
  students,
  onUpdateClassList,
  onUpdateStudents,
  dbConfig,
  onUpdateDbConfig,
}) => {
  const [endpointUrl, setEndpointUrl] = useState<string>(dbConfig.endpointUrl || '/api/database/classes');
  const [apiKey, setApiKey] = useState<string>(dbConfig.apiKey || 'hvltv_sec_key_2026_prod');
  const [dbType, setDbType] = useState<OnlineDatabaseConfig['dbType']>(dbConfig.dbType || 'CLOUD_REST');
  const [autoSync, setAutoSync] = useState<boolean>(dbConfig.autoSync ?? true);
  
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setSyncLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 15)]);
  };

  // Test Database Connection
  const handleTestConnection = async () => {
    setIsTesting(true);
    setStatusMessage(null);
    addLog(`Đang gửi tín hiệu PING tới Database trực tuyến (${endpointUrl})...`);

    try {
      const response = await fetch('/api/database/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpointUrl,
          apiKey,
          localClasses: classList
        })
      });

      const data = await response.json();
      if (data.success) {
        onUpdateDbConfig({
          ...dbConfig,
          endpointUrl,
          apiKey,
          dbType,
          status: 'CONNECTED',
          lastSyncedAt: new Date().toLocaleTimeString('vi-VN'),
          autoSync
        });
        setStatusMessage({
          type: 'success',
          text: `Kết nối thành công! Database trực tuyến phản hồi 200 OK (${data.syncedAt || 'Bây giờ'})`
        });
        addLog(`🟢 Kết nối thành công! Phản hồi từ Cloud Database: ${data.message}`);
      } else {
        throw new Error(data.error || 'Kết nối thất bại');
      }
    } catch (err: any) {
      onUpdateDbConfig({
        ...dbConfig,
        status: 'DISCONNECTED'
      });
      setStatusMessage({
        type: 'error',
        text: `Lỗi kết nối Database: ${err.message || 'Không thể liên lạc server DB'}`
      });
      addLog(`🔴 Lỗi kết nối: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  // Pull Latest Class Data from Online Database
  const handlePullFromCloud = async () => {
    setIsSyncing(true);
    setStatusMessage(null);
    addLog('Đang tải danh sách Lớp & Học sinh mới nhất từ Database trực tuyến...');

    try {
      const res = await fetch('/api/database/classes');
      const data = await res.json();

      if (data.success && Array.isArray(data.classes)) {
        onUpdateClassList(data.classes);
        onUpdateDbConfig({
          ...dbConfig,
          status: 'CONNECTED',
          lastSyncedAt: new Date().toLocaleTimeString('vi-VN')
        });
        setStatusMessage({
          type: 'success',
          text: `Đã đồng bộ thành công ${data.classes.length} lớp học từ Database Cloud!`
        });
        addLog(`📥 Đã nhận ${data.classes.length} phòng học từ Cloud DB.`);
      } else {
        throw new Error('Dữ liệu từ Database không hợp lệ');
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Tải dữ liệu thất bại: ${err.message}`
      });
      addLog(`🔴 Lỗi pull dữ liệu: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Push Local Class Data to Online Database
  const handlePushToCloud = async () => {
    setIsSyncing(true);
    setStatusMessage(null);
    addLog(`Đang đẩy ${classList.length} lớp và ${students.length} tài khoản học sinh lên Database trực tuyến...`);

    try {
      const res = await fetch('/api/database/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classes: classList })
      });
      const data = await res.json();

      if (data.success) {
        onUpdateDbConfig({
          ...dbConfig,
          status: 'CONNECTED',
          lastSyncedAt: new Date().toLocaleTimeString('vi-VN')
        });
        setStatusMessage({
          type: 'success',
          text: 'Đã xuất và lưu dữ liệu Lớp & Học sinh lên Database trực tuyến!'
        });
        addLog(`📤 Đẩy dữ liệu thành công! Cloud DB đã cập nhật (${data.syncedAt}).`);
      } else {
        throw new Error(data.error || 'Lưu lên Database thất bại');
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Lưu thất bại: ${err.message}`
      });
      addLog(`🔴 Lỗi push dữ liệu: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`w-full max-w-3xl rounded-xl border shadow-2xl transition-all overflow-hidden flex flex-col max-h-[90vh] ${
        isDarkMode ? 'bg-[#121215] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[#27272a] bg-[#09090b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-wide">
                  Liên Kết Database Trực Tuyến Danh Sách Lớp
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                  dbConfig.status === 'CONNECTED' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  <Radio className="w-3 h-3 animate-ping" />
                  {dbConfig.status === 'CONNECTED' ? 'Đã Kết Nối Cloud' : 'Chưa Kết Nối'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Ứng Dụng: <strong className="text-emerald-400">HỌC VẬT LÍ THẬT THÚ VỊ</strong> • Đồng bộ lớp học & học sinh thời gian thực
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors font-mono text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs font-mono">
          
          {/* Status Alert Banner */}
          {statusMessage && (
            <div className={`p-3.5 rounded-lg border flex items-center gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span className="font-semibold text-xs">{statusMessage.text}</span>
            </div>
          )}

          {/* Database Server Configuration Form */}
          <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#18181b]">
              <span className="font-bold text-zinc-200 text-xs flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                Cấu Hình Máy Chủ Database Trực Tuyến:
              </span>
              <span className="text-[11px] text-zinc-500">Lần đồng bộ cuối: {dbConfig.lastSyncedAt || 'Chưa đồng bộ'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 mb-1">Loại Cơ Sở Dữ Liệu Cloud:</label>
                <select
                  value={dbType}
                  onChange={(e) => setDbType(e.target.value as any)}
                  className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="CLOUD_REST">🌐 Cloud REST API (Built-in Express Database)</option>
                  <option value="SUPABASE">⚡ Supabase Database (PostgreSQL Cloud)</option>
                  <option value="GOOGLE_SHEETS">📊 Google Sheets Live JSON API</option>
                  <option value="FIREBASE">🔥 Firebase Realtime Database</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Endpoint URL Database Trực Tuyến:</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="text"
                    value={endpointUrl}
                    onChange={(e) => setEndpointUrl(e.target.value)}
                    placeholder="https://api.hocvatlithatthuvi.vn/v1/database/classes"
                    className="w-full pl-9 pr-3 py-2.5 rounded bg-[#18181b] border border-[#27272a] text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 mb-1">Khóa Bảo Mật / Secret API Key:</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-500 bg-[#18181b] border-[#27272a]"
                  />
                  <span>Tự động đồng bộ (Auto-Sync) khi thay đổi học sinh</span>
                </label>
              </div>
            </div>

            {/* Test Connection Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 transition-all shadow cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Đang kiểm tra...' : 'Kiểm Tra Kết Nối Database'}</span>
              </button>
            </div>
          </div>

          {/* Direct Actions: Push & Pull */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pull Action */}
            <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 flex items-center gap-2">
                  <DownloadCloud className="w-4 h-4" />
                  Tải Dữ Liệu Từ Database Trực Tuyến
                </span>
                <span className="text-[10px] text-zinc-500">Cloud → App</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Tải danh sách các Lớp học & Học sinh mới nhất đã được lưu trên máy chủ Database trực tuyến về máy local.
              </p>
              <button
                onClick={handlePullFromCloud}
                disabled={isSyncing}
                className="w-full py-2.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <DownloadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>{isSyncing ? 'Đang tải...' : 'Tải Danh Sách Lớp Từ Database'}</span>
              </button>
            </div>

            {/* Push Action */}
            <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" />
                  Lưu & Xuất Lên Database Trực Tuyến
                </span>
                <span className="text-[10px] text-zinc-500">App → Cloud</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Đẩy toàn bộ danh sách {classList.length} lớp học và {students.length} học sinh hiện tại lên Database trực tuyến.
              </p>
              <button
                onClick={handlePushToCloud}
                disabled={isSyncing}
                className="w-full py-2.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>{isSyncing ? 'Đang lưu...' : 'Lưu Danh Sách Lớp Lên Cloud DB'}</span>
              </button>
            </div>

          </div>

          {/* Active Class Preview List */}
          <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] space-y-3">
            <span className="font-bold text-zinc-200 text-xs block">
              📊 Danh Sách Lớp Đang Được Liên Kết ({classList.length} phòng học):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {classList.map(cls => (
                <div key={cls.id} className="p-2.5 rounded bg-[#18181b] border border-[#27272a] space-y-1">
                  <div className="flex justify-between font-bold text-emerald-400">
                    <span>{cls.code}</span>
                    <span className="text-zinc-400 font-mono text-[10px]">Khối {cls.grade}</span>
                  </div>
                  <div className="text-zinc-200 text-[11px] truncate">{cls.name}</div>
                  <div className="flex justify-between text-zinc-500 text-[10px]">
                    <span>👥 {cls.studentCount} HS</span>
                    <span>⭐ {cls.averageScore}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sync Console Logs */}
          {syncLogs.length > 0 && (
            <div className="p-3.5 rounded-lg bg-black border border-[#27272a] font-mono text-[11px] text-zinc-400 space-y-1 max-h-32 overflow-y-auto">
              <span className="text-zinc-500 uppercase tracking-widest text-[10px] block mb-1">Log Nhật Ký Kết Nối Database:</span>
              {syncLogs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap">{log}</div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-[#27272a] bg-[#09090b] flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            Hệ Thống <strong>HỌC VẬT LÍ THẬT THÚ VỊ</strong> • Database Status: <span className="text-emerald-400 font-bold">{dbConfig.status}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold cursor-pointer"
          >
            Hoàn Tất & Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
