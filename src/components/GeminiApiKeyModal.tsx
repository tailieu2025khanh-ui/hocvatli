import React, { useState, useEffect } from 'react';
import { 
  GEMINI_MODELS, 
  getStoredApiKey, 
  setStoredApiKey, 
  getStoredModel, 
  setStoredModel 
} from '../utils/geminiClient';
import { KeyRound, ExternalLink, Check, ShieldCheck, Sparkles, AlertCircle, Cpu, Lock } from 'lucide-react';

interface GeminiApiKeyModalProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  isMandatory?: boolean;
}

export const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({
  isDarkMode,
  isOpen,
  onClose,
  isMandatory = false
}) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [selectedModelId, setSelectedModelId] = useState<string>('gemini-3-flash-preview');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(getStoredApiKey());
      setSelectedModelId(getStoredModel());
      setSaveMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setSaveMessage('🔴 Vui lòng nhập API Key để sử dụng app.');
      return;
    }

    setStoredApiKey(apiKeyInput);
    setStoredModel(selectedModelId);
    setSaveMessage('🟢 Đã lưu cấu hình API Key & Model thành công!');

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl rounded-xl border p-6 shadow-2xl transition-all flex flex-col ${
        isDarkMode ? 'bg-[#121215] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#27272a] mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <KeyRound className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Thiết Lập Model & Gemini API Key
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Cấu hình API Key cá nhân để sử dụng toàn bộ tính năng AI trên HỌC VẬT LÍ THẬT THÚ VỊ
              </p>
            </div>
          </div>

          {!isMandatory && (
            <button onClick={onClose} className="text-xs font-mono text-zinc-400 hover:text-white cursor-pointer">Đóng ✕</button>
          )}
        </div>

        {/* Link banner to get free API key */}
        <div className="p-4 mb-5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="space-y-1">
            <span className="font-bold text-rose-400 block text-sm flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Lấy API Key Để Sử Dụng App (Miễn Phí Từ Google):
            </span>
            <p className="text-zinc-300">
              Truy cập Google AI Studio để khởi tạo API Key riêng cho tài khoản của bạn.
            </p>
          </div>

          <a
            href="https://aistudio.google.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all shrink-0"
          >
            <span>Lấy API Key Ngay</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-5 font-mono text-xs">
          
          {/* API Key Input */}
          <div>
            <label className="block text-zinc-300 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
              1. Nhập Google Gemini API Key (*):
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-3 rounded-lg bg-[#09090b] border border-[#27272a] text-emerald-400 font-mono text-xs focus:outline-none focus:border-rose-500 tracking-widest"
              />
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 block">
              🔒 Key của bạn được bảo mật tuyệt đối và lưu trữ an toàn trong localStorage của trình duyệt cá nhân.
            </span>
          </div>

          {/* Model Selection Cards */}
          <div>
            <label className="block text-zinc-300 font-bold mb-2 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              2. Chọn Model AI Mặc Định (Model Selector Cards):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {GEMINI_MODELS.map((model) => {
                const isSelected = selectedModelId === model.id;

                return (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModelId(model.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500 text-white shadow-lg ring-1 ring-rose-500/50'
                        : 'bg-[#09090b] border-[#27272a] text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-white block">{model.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold block w-max ${
                        model.isDefault ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {model.badge}
                      </span>
                    </div>

                    <p className="text-[10px] leading-relaxed text-zinc-400 mt-3 border-t border-[#18181b] pt-2">
                      {model.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fallback Mechanic Info */}
          <div className="p-3 rounded bg-[#09090b] border border-[#27272a] text-[11px] text-zinc-400 leading-relaxed space-y-1">
            <span className="font-bold text-amber-400 block">⚡ Cơ Chế Mạng Dự Phòng Tự Động (Fallback):</span>
            <p>
              Nếu Model được chọn gặp sự cố quá tải quota (Error 429), hệ thống sẽ tự động thử lại theo thứ tự: <strong className="text-emerald-400">gemini-3-flash-preview</strong> $\rightarrow$ <strong className="text-cyan-400">gemini-3-pro-preview</strong> $\rightarrow$ <strong className="text-purple-400">gemini-2.5-flash</strong>.
            </p>
          </div>

          {/* Save Status Message */}
          {saveMessage && (
            <div className={`p-3 rounded font-bold text-xs ${
              saveMessage.startsWith('🔴') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {saveMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            {!isMandatory && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg bg-[#09090b] hover:bg-zinc-800 text-zinc-400 border border-[#27272a] cursor-pointer"
              >
                Đóng
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Cấu Hình API Key</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
