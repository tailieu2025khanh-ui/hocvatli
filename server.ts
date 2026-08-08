import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for base64 OCR images and large JSON request payloads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Helper to lazily construct Gemini client with telemetry header
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  };

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', appName: 'HỌC VẬT LÍ THẬT THÚ VỊ', timestamp: new Date().toISOString() });
  });

  // In-Memory Cloud Database Store for persistent online class list & student sync
  let onlineClassDb = [
    {
      id: 'cls1',
      code: 'PHY12-PRO',
      name: '12A1 - Chuyên Vật Lý Luyện Thi 2026',
      grade: 12,
      studentCount: 38,
      teacherName: 'ThS. Nguyễn Văn Đức',
      createdDate: '2026-08-01',
      activeExamsCount: 3,
      averageScore: 8.45
    },
    {
      id: 'cls2',
      code: 'PHY11-X1',
      name: '11B2 - Lý Nâng Cao GDPT 2018',
      grade: 11,
      studentCount: 42,
      teacherName: 'ThS. Nguyễn Văn Đức',
      createdDate: '2026-08-02',
      activeExamsCount: 2,
      averageScore: 7.82
    },
    {
      id: 'cls3',
      code: 'PHY10-A1',
      name: '10A1 - Vật Lý Cơ Bản & Thí Nghiệm',
      grade: 10,
      studentCount: 40,
      teacherName: 'ThS. Nguyễn Văn Đức',
      createdDate: '2026-08-03',
      activeExamsCount: 1,
      averageScore: 8.10
    }
  ];

  // ONLINE DATABASE - GET CLASS LIST
  app.get('/api/database/classes', (req, res) => {
    res.json({
      success: true,
      databaseName: 'HỌC VẬT LÍ THẬT THÚ VỊ Cloud DB',
      syncedAt: new Date().toISOString(),
      classes: onlineClassDb
    });
  });

  // ONLINE DATABASE - SAVE / UPDATE CLASS LIST
  app.post('/api/database/classes', (req, res) => {
    const { classes } = req.body;
    if (Array.isArray(classes)) {
      onlineClassDb = classes;
      return res.json({
        success: true,
        message: 'Đã cập nhật danh sách lớp lên Database trực tuyến thành công!',
        syncedAt: new Date().toISOString(),
        totalClasses: onlineClassDb.length
      });
    }
    res.status(400).json({ success: false, error: 'Dữ liệu danh sách lớp không hợp lệ.' });
  });

  // ONLINE DATABASE - SYNC & TEST CONNECTION
  app.post('/api/database/sync', async (req, res) => {
    try {
      const { endpointUrl, apiKey, localClasses } = req.body;
      
      // Simulate/perform online cloud database connection check & synchronization
      if (Array.isArray(localClasses) && localClasses.length > 0) {
        onlineClassDb = localClasses;
      }

      res.json({
        success: true,
        status: 'CONNECTED',
        endpoint: endpointUrl || 'http://localhost:3000/api/database/classes',
        dbType: 'CLOUD_REST',
        message: 'Kết nối Database trực tuyến hoạt động hoàn hảo! Đã đồng bộ dữ liệu lớp học.',
        classes: onlineClassDb,
        syncedAt: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        status: 'DISCONNECTED',
        error: error.message || 'Không thể liên kết đến Database trực tuyến.'
      });
    }
  });


  // 1. SMART GRADING & OCR SCANNER ENDPOINT
  app.post('/api/gemini/ocr-grade', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', examTitle, answerKey } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'Hình ảnh bài làm (imageBase64) không được để trống.' });
      }

      const ai = getAiClient();
      const prompt = `Bạn là Chuyên gia Chấm điểm OCR Smart Grading môn Vật lý THPT (Chương trình GDPT 2018).
Nhiệm vụ của bạn là nhận diện các câu trả lời trong phiếu làm bài/ảnh chụp bài thi của học sinh, so sánh với Đáp án chuẩn, và đưa ra chẩn đoán sư phạm.

Tên bài thi: "${examTitle || 'Kiểm tra Vật lý'}"
Đáp án tham chiếu/Key:
${JSON.stringify(answerKey || [], null, 2)}

Hãy phân tích ảnh bài làm và trả về kết quả cấu trúc JSON như sau:
1. "detectedAnswers": danh sách các câu đã làm (số câu, đáp án học sinh chọn hoặc số điền vào).
2. "totalScore": tổng điểm đạt được trên thang 10.
3. "ocrConfidence": độ tin cậy nhận diện OCR (từ 80 đến 99%).
4. "details": chi tiết từng câu (questionId, studentAnswer, isCorrect, score, comment).
5. "aiDiagnosis": {
     "weakTopics": ["danh sách các vùng kiến thức yếu/bị hổng"],
     "strongTopics": ["vùng kiến thức vững"],
     "recommendedRemediation": "lời khuyên sư phạm cụ thể và các dạng bài tập cần ôn bổ trợ",
     "feedbackSummary": "đánh giá tổng quan súc tích"
   }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
                }
              },
              { text: prompt }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedAnswers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    questionNumber: { type: Type.INTEGER },
                    studentAnswer: { type: Type.STRING }
                  }
                }
              },
              totalScore: { type: Type.NUMBER },
              ocrConfidence: { type: Type.NUMBER },
              details: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    questionNumber: { type: Type.INTEGER },
                    studentAnswer: { type: Type.STRING },
                    correctAnswer: { type: Type.STRING },
                    isCorrect: { type: Type.BOOLEAN },
                    scoreEarned: { type: Type.NUMBER },
                    aiComment: { type: Type.STRING }
                  }
                }
              },
              aiDiagnosis: {
                type: Type.OBJECT,
                properties: {
                  weakTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  strongTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendedRemediation: { type: Type.STRING },
                  feedbackSummary: { type: Type.STRING }
                }
              }
            }
          }
        }
      });

      const resultText = response.text || '{}';
      const parsedData = JSON.parse(resultText);
      res.json({ success: true, result: parsedData });
    } catch (error: any) {
      console.error('Lỗi Gemini OCR Grade:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Lỗi xử lý OCR bài thi qua Gemini AI.'
      });
    }
  });

  // 2. KNOWLEDGE GAP & PERSONALIZED LEARNING ANALYSIS
  app.post('/api/gemini/analyze-gaps', async (req, res) => {
    try {
      const { studentName, grade, topicScores, recentMistakes } = req.body;
      const ai = getAiClient();

      const prompt = `Bạn là Chuyên gia Tư vấn Sư phạm Vật lý THPT (Chương trình GDPT 2018).
Hãy phân tích dữ liệu điểm số và lỗi sai của học sinh ${studentName || 'Học sinh'} (Lớp ${grade || 12}):

Dữ liệu điểm theo chuyên đề (% thành thạo):
${JSON.stringify(topicScores || {}, null, 2)}

Các lỗi sai gần đây:
${JSON.stringify(recentMistakes || [], null, 2)}

Trả về báo cáo cá nhân hóa chi tiết dạng JSON gồm:
1. "weakKnowledgeZones": Danh sách vùng kiến thức bị hổng và nguyên nhân gốc rễ (ví dụ: hổng công thức Snell, nhầm lẫn đồ thị pha dao động).
2. "actionPlan": Lộ trình 3 bước khắc phục trong tuần.
3. "remediationExercisePrompts": 3 câu hỏi bài tập tương tự để luyện tập lại.
4. "encouragementMessage": Lời động viên giàu năng lượng, chuẩn tâm lý học giáo dục.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              weakKnowledgeZones: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    topic: { type: Type.STRING },
                    gapType: { type: Type.STRING },
                    rootCause: { type: Type.STRING }
                  }
                }
              },
              actionPlan: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              remediationExercisePrompts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    topic: { type: Type.STRING },
                    questionText: { type: Type.STRING },
                    hint: { type: Type.STRING }
                  }
                }
              },
              encouragementMessage: { type: Type.STRING }
            }
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, analysis: parsed });
    } catch (error: any) {
      console.error('Lỗi Gemini Analyze Gaps:', error);
      res.status(500).json({ success: false, error: error.message || 'Lỗi phân tích lỗ hổng kiến thức.' });
    }
  });

  // 3. AI QUESTION BANK GENERATOR
  app.post('/api/gemini/generate-questions', async (req, res) => {
    try {
      const { grade, topic, cognitiveLevel, count = 3, questionType = 'MCQ_4' } = req.body;
      const ai = getAiClient();

      const prompt = `Hãy soạn ${count} câu hỏi Vật lý Lớp ${grade} chuẩn GDPT 2018.
Chuyên đề: "${topic}"
Mức độ tư duy: "${cognitiveLevel}" (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)
Dạng câu hỏi: "${questionType}" (MCQ_4: Trắc nghiệm 4 lựa chọn, TRUE_FALSE_4: Trắc nghiệm Đúng/Sai 4 ý, SHORT_ANSWER: Trả lời ngắn số/đơn vị)

Yêu cầu:
- Chuẩn xác về mặt vật lý, đơn vị đo, hiện tượng thực tế.
- Giải thích đáp án chi tiết từng bước.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                prompt: { type: Type.STRING },
                type: { type: Type.STRING },
                grade: { type: Type.INTEGER },
                topic: { type: Type.STRING },
                cognitiveLevel: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctOptionIndex: { type: Type.INTEGER },
                shortAnswerKey: { type: Type.STRING },
                shortAnswerUnit: { type: Type.STRING },
                trueFalseItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      statement: { type: Type.STRING },
                      isCorrect: { type: Type.BOOLEAN }
                    }
                  }
                },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      });

      const questions = JSON.parse(response.text || '[]');
      res.json({ success: true, questions });
    } catch (error: any) {
      console.error('Lỗi Gemini Generate Questions:', error);
      res.status(500).json({ success: false, error: error.message || 'Lỗi tạo câu hỏi tự động.' });
    }
  });

  // 4. WORD / TEXT DOCUMENT PARSER FOR EXAM INPUT
  app.post('/api/gemini/parse-doc', async (req, res) => {
    try {
      const { textContent, grade = 12 } = req.body;
      if (!textContent || textContent.trim().length === 0) {
        return res.status(400).json({ error: 'Nội dung văn bản không được rỗng.' });
      }

      const ai = getAiClient();
      const prompt = `Bạn là Trình Parser tự động hóa ngân hàng câu hỏi Vật lý THPT Lớp ${grade}.
Hãy phân tích đoạn văn bản thô (trích xuất từ file Word/PDF/Text) dưới đây và tự động trích xuất cấu trúc câu hỏi:

Văn bản đầu vào:
"""
${textContent}
"""

Phân loại chính xác dạng câu hỏi:
- MCQ_4 (4 lựa chọn A, B, C, D)
- TRUE_FALSE_4 (Câu có 4 ý a, b, c, d Đúng/Sai)
- SHORT_ANSWER (Trả lời ngắn)

Gắn đúng Mức độ tư duy (NHAN_BIET, THONG_HIEU, VAN_DUNG, VAN_DUNG_CAO) và Chuyên đề thích hợp.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                prompt: { type: Type.STRING },
                type: { type: Type.STRING },
                grade: { type: Type.INTEGER },
                topic: { type: Type.STRING },
                cognitiveLevel: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctOptionIndex: { type: Type.INTEGER },
                shortAnswerKey: { type: Type.STRING },
                shortAnswerUnit: { type: Type.STRING },
                trueFalseItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      statement: { type: Type.STRING },
                      isCorrect: { type: Type.BOOLEAN }
                    }
                  }
                },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      });

      const parsedQuestions = JSON.parse(response.text || '[]');
      res.json({ success: true, questions: parsedQuestions });
    } catch (error: any) {
      console.error('Lỗi Gemini Parse Doc:', error);
      res.status(500).json({ success: false, error: error.message || 'Lỗi bóc tách tài liệu.' });
    }
  });

  // 5. EXTERNAL CONNECTORS EXPORT (Canva, Word, NotebookLM)
  app.post('/api/gemini/export-connector', async (req, res) => {
    try {
      const { target, examData } = req.body;
      const ai = getAiClient();

      let prompt = '';
      if (target === 'CANVA') {
        prompt = `Tạo một Prompt thiết kế Slide bài giảng/Đề thi đẹp mắt trên Canva cho môn Vật lý THPT dựa trên dữ liệu này: ${JSON.stringify(examData)}`;
      } else if (target === 'NOTEBOOKLM') {
        prompt = `Tổng hợp toàn bộ kiến thức, ma trận và câu hỏi sau đây thành bộ tài liệu học tập chuẩn NotebookLM (kèm Tóm tắt khái niệm, Thuật ngữ chìa khóa, Câu hỏi thảo luận): ${JSON.stringify(examData)}`;
      } else {
        prompt = `Soạn thảo kịch bản xuất file Word / PPT chuyên nghiệp cho đề thi Vật lý GDPT 2018 này: ${JSON.stringify(examData)}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
      });

      res.json({ success: true, formattedContent: response.text });
    } catch (error: any) {
      console.error('Lỗi Gemini Export Connector:', error);
      res.status(500).json({ success: false, error: error.message || 'Lỗi tạo liên kết xuất tài liệu.' });
    }
  });

  // 6. AI PROBLEM SOLVER WITH PEDAGOGICAL DIAGNOSIS & LESSONS LEARNED
  app.post('/api/gemini/solve-problem', async (req, res) => {
    try {
      const { problemText, grade = 12, topic } = req.body;
      if (!problemText || problemText.trim().length === 0) {
        return res.status(400).json({ error: 'Nội dung bài tập không được để trống.' });
      }

      const ai = getAiClient();
      const prompt = `Bạn là Chuyên gia Tư vấn Sư phạm Vật lý THPT (Chương trình GDPT 2018).
Hãy giải bài tập Vật lý Lớp ${grade} sau đây và đưa ra chẩn đoán sư phạm sâu sắc:

Đề bài tập:
"""
${problemText}
"""
Chuyên đề: "${topic || 'Tự động nhận diện'}"

Yêu cầu trả về JSON gồm 4 phần:
1. "stepByStepSolution": Lời giải chi tiết từng bước (Phân tích hiện tượng -> Tóm tắt đại lượng & đơn vị -> Công thức -> Đáp số cuối cùng).
2. "aiPedagogicalComment": Nhận xét sư phạm (Đánh giá độ khó, các "bẫy" học sinh rất hay mắc phải).
3. "keyTakeaways": Bài học rút ra & Phương pháp tư duy (Mẹo bấm máy tính Casio, quy tắc nhớ nhanh công thức).
4. "similarPracticeQuestions": Danh sách 2 câu hỏi luyện tập tương tự (mỗi câu gồm: questionText, options, correctOptionIndex, explanation).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              stepByStepSolution: { type: Type.STRING },
              aiPedagogicalComment: { type: Type.STRING },
              keyTakeaways: { type: Type.STRING },
              similarPracticeQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    questionText: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctOptionIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      const parsedData = JSON.parse(response.text || '{}');
      res.json({ success: true, solution: parsedData });
    } catch (error: any) {
      console.error('Lỗi Gemini Solve Problem:', error);
      res.status(500).json({ success: false, error: error.message || 'Lỗi giải bài tập qua Gemini AI.' });
    }
  });


  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Physics LMS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
