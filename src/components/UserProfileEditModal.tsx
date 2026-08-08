import React, { useState } from 'react';
import { UserRole, StudentProfile, ColleagueTeacher } from '../types';
import { User, Camera, Upload, Save, Mail, Phone, School, MapPin, Award, BookOpen, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface UserProfileEditModalProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  currentTeacher: ColleagueTeacher;
  currentStudent: StudentProfile;
  onSaveTeacherProfile: (updated: ColleagueTeacher) => void;
  onSaveStudentProfile: (updated: StudentProfile) => void;
}

export const UserProfileEditModal: React.FC<UserProfileEditModalProps> = ({
  isDarkMode,
  isOpen,
  onClose,
  role,
  currentTeacher,
  currentStudent,
  onSaveTeacherProfile,
  onSaveStudentProfile
}) => {
  // Preset Avatars
  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
  ];

  // Teacher Form State
  const [teacherForm, setTeacherForm] = useState<ColleagueTeacher>({ ...currentTeacher });

  // Student Form State
  const [studentForm, setStudentForm] = useState<StudentProfile>({ ...currentStudent });

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Image Upload Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        if (role === 'TEACHER') {
          setTeacherForm(prev => ({ ...prev, avatar: dataUrl }));
        } else {
          setStudentForm(prev => ({ ...prev, avatar: dataUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Form Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'TEACHER') {
      onSaveTeacherProfile(teacherForm);
    } else {
      onSaveStudentProfile(studentForm);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const currentAvatar = role === 'TEACHER' ? teacherForm.avatar : studentForm.avatar;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl rounded-xl border p-6 shadow-2xl transition-all overflow-hidden flex flex-col max-h-[90vh] ${
        isDarkMode ? 'bg-[#121215] border-[#27272a] text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#27272a] mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Chỉnh Sửa Hồ Sơ Cá Nhân & Ảnh Đại Diện ({role === 'TEACHER' ? 'Giáo Viên' : 'Học Sinh'})
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Cập nhật ảnh đại diện, thông tin liên hệ và châm ngôn học tập trên HỌC VẬT LÍ THẬT THÚ VỊ
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-xs font-mono text-zinc-400 hover:text-white cursor-pointer">Đóng ✕</button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-6 font-mono text-xs pr-1">
          
          {/* Avatar Upload Section */}
          <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-4">
            <span className="font-bold text-emerald-400 block text-xs flex items-center gap-2">
              <Camera className="w-4 h-4" />
              1. Ảnh Đại Diện Tài Khoản (Avatar Image):
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar Preview */}
              <div className="relative w-24 h-24 rounded-full border-2 border-emerald-500/60 overflow-hidden shrink-0 shadow-xl bg-black">
                <img src={currentAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                <label className="absolute inset-0 bg-black/50 hover:bg-black/70 flex flex-col items-center justify-center text-white text-[10px] cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                  <Upload className="w-4 h-4 mb-0.5" />
                  <span>Đổi ảnh</span>
                  <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                </label>
              </div>

              {/* Upload or Preset Options */}
              <div className="space-y-3 flex-1 w-full">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Dán URL Ảnh đại diện trực tiếp:</label>
                  <input
                    type="text"
                    value={role === 'TEACHER' ? teacherForm.avatar : studentForm.avatar}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (role === 'TEACHER') setTeacherForm(prev => ({ ...prev, avatar: val }));
                      else setStudentForm(prev => ({ ...prev, avatar: val }));
                    }}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Preset Avatars Selection */}
                <div>
                  <span className="text-[10px] text-zinc-400 block mb-1.5">Hoặc chọn avatar mẫu sẵn có:</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {presetAvatars.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (role === 'TEACHER') setTeacherForm(prev => ({ ...prev, avatar: url }));
                          else setStudentForm(prev => ({ ...prev, avatar: url }));
                        }}
                        className={`w-9 h-9 rounded-full border overflow-hidden shrink-0 transition-transform cursor-pointer ${
                          currentAvatar === url ? 'border-emerald-500 scale-110 ring-2 ring-emerald-500/40' : 'border-[#27272a] hover:scale-105'
                        }`}
                      >
                        <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TEACHER PROFILE FORM */}
          {role === 'TEACHER' && (
            <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-4">
              <span className="font-bold text-cyan-400 block text-xs flex items-center gap-2">
                <School className="w-4 h-4" />
                2. Thông Tin Cá Nhân & Liên Hệ Giáo Viên:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Họ và tên Giáo viên:</label>
                  <input
                    type="text"
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Học hàm / Học vị / Danh hiệu:</label>
                  <input
                    type="text"
                    value={teacherForm.degreeTitle || 'ThS. Vật Lý THPT'}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, degreeTitle: e.target.value }))}
                    placeholder="VD: ThS. Vật Lý, TS. Sư Phạm, NGƯT"
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Email liên hệ công việc:</label>
                  <input
                    type="email"
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Số điện thoại liên hệ / Zalo:</label>
                  <input
                    type="text"
                    value={teacherForm.phone || '0988.123.456'}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="09xx.xxx.xxx"
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Trường / Đơn vị công tác:</label>
                  <input
                    type="text"
                    value={teacherForm.schoolName || 'Trường THPT Chuyên Vật Lý'}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, schoolName: e.target.value }))}
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Đường link Trang cá nhân (FB/Zalo):</label>
                  <input
                    type="text"
                    value={teacherForm.socialLink || 'facebook.com/thayduc.vatly'}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, socialLink: e.target.value }))}
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Châm ngôn giảng dạy / Giới thiệu bản thân:</label>
                <textarea
                  rows={2}
                  value={teacherForm.bio || 'Truyền cảm hứng tư duy bản chất hiện tượng Vật lý THPT GDPT 2018.'}
                  onChange={(e) => setTeacherForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                />
              </div>
            </div>
          )}

          {/* STUDENT PROFILE FORM */}
          {role === 'STUDENT' && (
            <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-4">
              <span className="font-bold text-amber-400 block text-xs flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                2. Thông Tin Cá Nhân & Liên Hệ Học Sinh:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Họ và tên Học sinh:</label>
                  <input
                    type="text"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Mã Lớp Học Phụ Trách:</label>
                  <input
                    type="text"
                    readOnly
                    value={studentForm.classCode}
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Email cá nhân học sinh:</label>
                  <input
                    type="email"
                    value={studentForm.email || `${studentForm.username}@hocvatlithatthuvi.edu.vn`}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Số điện thoại học sinh:</label>
                  <input
                    type="text"
                    value={studentForm.phone || '0977.888.999'}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="09xx.xxx.xxx"
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Họ tên Phụ huynh:</label>
                  <input
                    type="text"
                    value={studentForm.parentName || 'Nguyễn Văn Hùng (Phụ huynh)'}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, parentName: e.target.value }))}
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Số điện thoại Phụ huynh:</label>
                  <input
                    type="text"
                    value={studentForm.parentPhone || '0912.345.678'}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, parentPhone: e.target.value }))}
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Mục tiêu điểm số thi THPT:</label>
                  <input
                    type="text"
                    value={studentForm.targetExamScore || '9.5+ Điểm Tốt Nghiệp THPT Môn Vật Lý'}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, targetExamScore: e.target.value }))}
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Ngày sinh (Định dạng YYYY-MM-DD):</label>
                  <input
                    type="text"
                    value={studentForm.dob || '2008-05-15'}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, dob: e.target.value }))}
                    className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-[#18181b] hover:bg-zinc-800 text-zinc-300 font-bold cursor-pointer"
            >
              Hủy Bỏ
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Đã Cập Nhật Thành Công!' : 'Lưu Hồ Sơ & Ảnh Đại Diện'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
