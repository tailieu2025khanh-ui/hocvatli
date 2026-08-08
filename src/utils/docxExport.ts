import { Question, ExamMatrix } from '../types';

/**
 * Utility to generate and download a professional Word document (.docx)
 * formatted according to Vietnam Ministry of Education GDPT 2018 standards.
 */
export function exportExamToWordDocx(examMatrix: ExamMatrix, questions: Question[]) {
  const title = examMatrix.title || 'ĐỀ THI THỬ TỐT NGHIỆP THPT MÔN VẬT LÝ GDPT 2018';
  
  let docContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.3; margin: 20px; }
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .header-table td { text-align: center; vertical-align: top; padding: 4px; }
        .exam-title { font-weight: bold; font-size: 15pt; text-transform: uppercase; margin-top: 15px; margin-bottom: 5px; text-align: center; }
        .section-header { font-weight: bold; font-size: 13pt; margin-top: 15px; margin-bottom: 8px; text-decoration: underline; }
        .question-box { margin-bottom: 12px; }
        .question-prompt { font-weight: bold; }
        .options-grid { margin-left: 20px; margin-top: 4px; }
        .answer-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11pt; }
        .answer-table th, .answer-table td { border: 1px solid black; text-align: center; padding: 6px; }
        .explanation-box { background-color: #f8fafc; border-left: 4px solid #10b981; padding: 8px; margin-top: 5px; font-size: 11pt; font-style: italic; }
      </style>
    </head>
    <body>
      <table class="header-table">
        <tr>
          <td style="width: 45%;">
            <strong>SỞ GIÁO DỤC VÀ ĐÀO TẠO</strong><br/>
            <strong>TRƯỜNG THPT CHUYÊN VẬT LÝ</strong><br/>
            --------------------
          </td>
          <td style="width: 55%;">
            <strong>KỲ THI TỐT NGHIỆP THPT NĂM 2026</strong><br/>
            <strong>Môn thi: VẬT LÝ - GDPT 2018</strong><br/>
            <em>Thời gian làm bài: ${examMatrix.durationMinutes || 50} phút (không kể thời gian phát đề)</em>
          </td>
        </tr>
      </table>

      <div class="exam-title">${title}</div>
      <p style="text-align: center; font-style: italic; margin-bottom: 20px;">
        (Đề thi gồm ${questions.length} câu hỏi chuẩn ma trận tư duy: Nhận biết, Thông hiểu, Vận dụng)
      </p>

      <hr style="border: 1px double black;" />

      <div class="section-header">PHẦN I. CÂU HỎI TRẮC NGHIỆM PHẦN TỰ LỰA CHỌN</div>
  `;

  questions.forEach((q, idx) => {
    docContent += `
      <div class="question-box">
        <span class="question-prompt">Câu ${idx + 1} (${q.cognitiveLevel || 'NHAN_BIET'} - ${q.topic}):</span> ${q.prompt}
    `;

    if (q.type === 'MCQ_4' && q.options) {
      docContent += `<div class="options-grid">`;
      q.options.forEach((opt, oIdx) => {
        const letter = String.fromCharCode(65 + oIdx);
        docContent += `<div><strong>${letter}.</strong> ${opt}</div>`;
      });
      docContent += `</div>`;
    } else if (q.type === 'TRUE_FALSE_4' && q.trueFalseItems) {
      docContent += `<div class="options-grid">`;
      q.trueFalseItems.forEach((tf, tfIdx) => {
        const subLetter = String.fromCharCode(97 + tfIdx);
        docContent += `<div><strong>${subLetter})</strong> ${tf.statement}</div>`;
      });
      docContent += `</div>`;
    } else if (q.type === 'SHORT_ANSWER') {
      docContent += `<div style="margin-left: 20px; font-style: italic; color: #475569;">[Điền kết quả vào phiếu trả lời ngắn (${q.shortAnswerUnit || 'đơn vị'})]</div>`;
    }

    docContent += `</div>`;
  });

  // Page Break for Answer Key
  docContent += `
    <br fill="page" style="page-break-before: always;" />

    <div class="exam-title">BẢNG ĐÁP ÁN VÀ LỜI GIẢI CHI TIẾT</div>
    
    <table class="answer-table">
      <thead>
        <tr style="background-color: #e2e8f0;">
          <th>Câu</th>
          <th>Dạng</th>
          <th>Đáp Án Chuẩn</th>
          <th>Mức Độ</th>
        </tr>
      </thead>
      <tbody>
  `;

  questions.forEach((q, idx) => {
    let keyStr = '';
    if (q.type === 'MCQ_4' && q.correctOptionIndex !== undefined) {
      keyStr = String.fromCharCode(65 + q.correctOptionIndex);
    } else if (q.type === 'TRUE_FALSE_4' && q.trueFalseItems) {
      keyStr = q.trueFalseItems.map(item => item.isCorrect ? 'Đ' : 'S').join('-');
    } else if (q.type === 'SHORT_ANSWER') {
      keyStr = `${q.shortAnswerKey} ${q.shortAnswerUnit || ''}`;
    }

    docContent += `
      <tr>
        <td><strong>${idx + 1}</strong></td>
        <td>${q.type}</td>
        <td style="color: #059669; font-weight: bold;">${keyStr}</td>
        <td>${q.cognitiveLevel}</td>
      </tr>
    `;
  });

  docContent += `
      </tbody>
    </table>

    <div class="section-header" style="margin-top: 25px;">HƯỚNG DẪN GIẢI CHI TIẾT TỪNG CÂU</div>
  `;

  questions.forEach((q, idx) => {
    docContent += `
      <div style="margin-top: 10px;">
        <strong>Câu ${idx + 1}:</strong> ${q.prompt}<br/>
        <div class="explanation-box">
          <strong>Lời giải:</strong> ${q.explanation || 'Áp dụng định luật cơ bản của Vật lý GDPT 2018.'}
        </div>
      </div>
    `;
  });

  docContent += `
    </body>
    </html>
  `;

  // Create Blob & Trigger Download
  const blob = new Blob(['\ufeff', docContent], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `DeThi_VatLy_${examMatrix.grade || 12}_${Date.now()}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
