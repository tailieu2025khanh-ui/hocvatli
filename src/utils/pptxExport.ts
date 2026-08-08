import { TeachingMaterial } from '../types';

/**
 * Utility to generate and download a PowerPoint presentation (.pptx / .html slides)
 * for Physics teaching materials.
 */
export function exportMaterialToPowerPoint(mat: TeachingMaterial) {
  const title = mat.title || 'Bài Giảng Vật Lý THPT';

  const htmlSlides = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 40px; }
        .slide { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 2px solid #334155; border-radius: 16px; padding: 40px; margin-bottom: 40px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); min-height: 480px; display: flex; flex-direction: column; justify-between; }
        .slide-title { font-size: 28pt; font-weight: 800; color: #38bdf8; margin-bottom: 20px; border-bottom: 3px solid #0284c7; padding-bottom: 10px; }
        .slide-subtitle { font-size: 16pt; color: #94a3b8; margin-bottom: 30px; }
        .content-box { font-size: 18pt; line-height: 1.6; color: #e2e8f0; background: rgba(15, 23, 42, 0.6); padding: 25px; border-radius: 12px; border-left: 6px solid #10b981; }
        .footer { font-size: 12pt; color: #64748b; font-family: monospace; display: flex; justify-between; margin-top: auto; pt-4; }
        .badge { background: #0284c7; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12pt; font-weight: bold; }
      </style>
    </head>
    <body>

      <!-- SLIDE 1: TITLE SLIDE -->
      <div class="slide">
        <div>
          <span class="badge">VẬT LÝ GDPT 2018 - LỚP ${mat.grade}</span>
          <h1 class="slide-title" style="font-size: 34pt; margin-top: 30px;">${mat.title}</h1>
          <div class="slide-subtitle">Chuyên đề: ${mat.topic}</div>
        </div>
        <div class="content-box">
          <strong>Giáo viên soạn giảng:</strong> ${mat.uploadedByTeacherName}<br/>
          <strong>Hệ thống:</strong> HỌC VẬT LÍ THẬT THÚ VỊ<br/>
          <strong>Ngày phát hành:</strong> ${mat.uploadedDate}
        </div>
        <div class="footer">
          <span>HỌC VẬT LÍ THẬT THÚ VỊ • PowerPoint Presentation</span>
          <span>Slide 1 / 4</span>
        </div>
      </div>

      <!-- SLIDE 2: OVERVIEW & OBJECTIVES -->
      <div class="slide">
        <h2 class="slide-title">1. MỤC TIÊU BÀI HỌC & TÓM TẮT KHÁI NIỆM</h2>
        <div class="content-box">
          <p>${mat.description}</p>
          <ul>
            <li>Nắm vững bản chất hiện tượng Vật lý thực tế.</li>
            <li>Vận dụng công thức toán học giải nhanh bài tập trắc nghiệm.</li>
            <li>Liên hệ ứng dụng công nghệ & kỹ thuật hiện đại.</li>
          </ul>
        </div>
        <div class="footer">
          <span>Khối ${mat.grade} • Chuyên đề ${mat.topic}</span>
          <span>Slide 2 / 4</span>
        </div>
      </div>

      <!-- SLIDE 3: FORMULAS & KEY KNOWLEDGE -->
      <div class="slide">
        <h2 class="slide-title">2. KIẾN THỨC TRỌNG TÂM & CÔNG THỨC VẬT LÝ</h2>
        <div class="content-box">
          <div style="color: #4ade80; font-weight: bold; margin-bottom: 10px;">★ Công Thức Cốt Lõi:</div>
          <p style="font-family: 'Courier New', monospace; font-size: 22pt; text-align: center; background: #09090b; padding: 15px; border-radius: 8px; color: #f59e0b;">
            T = 2π√(l / g) &nbsp;&nbsp;|&nbsp;&nbsp; p₁V₁ = p₂V₂ &nbsp;&nbsp;|&nbsp;&nbsp; n₁ sin i = n₂ sin r
          </p>
          <p style="font-size: 16pt;">• Chú ý đơn vị đo chuẩn SI: Chiều dài (m), Khối lượng (kg), Áp suất (Pa), Nhiệt độ (K).</p>
        </div>
        <div class="footer">
          <span>HỌC VẬT LÍ THẬT THÚ VỊ</span>
          <span>Slide 3 / 4</span>
        </div>
      </div>

      <!-- SLIDE 4: CONCLUSION & EXERCISES -->
      <div class="slide">
        <h2 class="slide-title">3. BÀI TẬP VẬN DỤNG & VẬN DỤNG CAO</h2>
        <div class="content-box">
          <p>• Hoàn thành các câu trắc nghiệm Đúng/Sai & Trả lời ngắn trên hệ thống LMS <strong>HỌC VẬT LÍ THẬT THÚ VỊ</strong>.</p>
          <p>• Làm lại các câu bị AI chẩn đoán hổng kiến thức trong mục Lộ Trình Cá Nhân.</p>
        </div>
        <div class="footer">
          <span>Chúc các em học tốt môn Vật Lý!</span>
          <span>Slide 4 / 4</span>
        </div>
      </div>

    </body>
    </html>
  `;

  // Create Blob & Trigger HTML/PowerPoint Download
  const blob = new Blob(['\ufeff', htmlSlides], {
    type: 'application/vnd.ms-powerpoint'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BaiGiang_Slide_VatLy_${mat.grade}_${Date.now()}.ppt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
