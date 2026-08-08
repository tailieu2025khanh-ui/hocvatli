import { GoogleGenAI } from '@google/genai';

export const GEMINI_MODELS = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash Preview',
    badge: 'Khuyên dùng / Mặc định',
    description: 'Tốc độ phản hồi cực nhanh, tối ưu hóa cho bài tập và trắc nghiệm Vật lý THPT.',
    isDefault: true
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro Preview',
    badge: 'Chuyên sâu / Nâng cao',
    description: 'Khả năng suy luận toán học & chẩn đoán sư phạm bẫy câu hỏi vận dụng cao.',
    isDefault: false
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    badge: 'Dự phòng / Tốc độ',
    description: 'Model dự phòng ổn định cao khi hệ thống quá tải.',
    isDefault: false
  }
];

export const FALLBACK_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash'
];

export function getStoredApiKey(): string {
  return localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem('GEMINI_API_KEY', key.trim());
}

export function getStoredModel(): string {
  return localStorage.getItem('GEMINI_SELECTED_MODEL') || 'gemini-3-flash-preview';
}

export function setStoredModel(modelId: string): void {
  localStorage.setItem('GEMINI_SELECTED_MODEL', modelId);
}

/**
 * Execute Gemini AI prompt with automatic model fallback chain and custom user API Key
 */
export async function callGeminiWithFallback(prompt: string, jsonSchema?: any): Promise<string> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error('CHƯA_NHẬP_API_KEY');
  }

  const selectedModel = getStoredModel();
  
  // Construct model execution queue: selected model first, followed by remaining fallbacks
  const modelQueue = [
    selectedModel,
    ...FALLBACK_MODELS.filter(m => m !== selectedModel)
  ];

  let lastError = '';

  for (const modelId of modelQueue) {
    try {
      console.log(`🤖 Thử khởi chạy Gemini Model: ${modelId}`);
      const ai = new GoogleGenAI({ apiKey });

      const config: any = {};
      if (jsonSchema) {
        config.responseMimeType = 'application/json';
        config.responseSchema = jsonSchema;
      }

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: Object.keys(config).length > 0 ? config : undefined
      });

      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`🔴 Lỗi model ${modelId}:`, err);
      lastError = err.message || String(err);
      // Continue to next fallback model in queue
    }
  }

  // If all models in the fallback queue failed
  throw new Error(`Đã thử tất cả model nhưng thất bại. Lỗi chi tiết từ Google API: ${lastError}`);
}
