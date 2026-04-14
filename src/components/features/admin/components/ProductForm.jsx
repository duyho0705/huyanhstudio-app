import { Modal, Form, Input, Radio, Upload, Progress, message } from "antd";
import { useEffect, useState } from "react";
import { Video, Youtube, CheckCircle, AlertCircle, Upload as UploadIcon, FileVideo, X } from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../api/firebase";

const ProductForm = ({ open, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [sourceType, setSourceType] = useState("youtube");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
        const type = initialValues.sourceType || (initialValues.videoUrl?.includes("youtube.com") || initialValues.videoUrl?.includes("youtu.be") ? "youtube" : "upload");
        setSourceType(type);
      } else {
        form.resetFields();
        setSourceType("youtube");
        setUploadProgress(0);
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit({ ...values, sourceType });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleFileUpload = async ({ file, onSuccess, onError, onProgress }) => {
    const storageRef = ref(storage, `products/videos/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setIsUploading(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
        onProgress({ percent: progress });
      },
      (error) => {
        setIsUploading(false);
        message.error("Tải lên thất bại: " + error.message);
        onError(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        form.setFieldsValue({ videoUrl: downloadURL });
        setIsUploading(false);
        message.success("Tải lên video thành công!");
        onSuccess("ok");
      }
    );
  };

  const getVideoId = (url) => {
    if (!url) return null;
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    const vMatch = fullUrl.match(/[?&]v=([^&]+)/);
    if (vMatch) return vMatch[1];
    if (fullUrl.includes("youtu.be/"))
      return fullUrl.split("youtu.be/")[1]?.split("?")[0];
    if (fullUrl.includes("youtube.com/embed/"))
      return fullUrl.split("youtube.com/embed/")[1]?.split("?")[0];
    return null;
  };

  return (
    <Modal
      title={
        <div className="py-2">
          <h3 className="text-[20px] font-bold text-slate-900 leading-tight">
            {initialValues ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
          </h3>
          <p className="text-[12px] text-slate-500 mt-1">Cung cấp thông tin và nội dung video cho kho sản phẩm</p>
        </div>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={isUploading}
      okText={initialValues ? "Lưu thay đổi" : "Đăng sản phẩm"}
      cancelText="Hủy"
      width={640}
      okButtonProps={{
        className: "h-11 px-8 rounded-xl bg-slate-900 border-none font-bold text-[14px] text-white hover:bg-slate-800 transition-all shadow-lg",
        disabled: isUploading
      }}
      cancelButtonProps={{
        className: "h-11 px-8 rounded-xl font-bold text-[14px] text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
      }}
      centered
    >
      <Form form={form} layout="vertical" className="pt-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <Form.Item
                name="title"
                label={<span className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Tiêu đề sản phẩm</span>}
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                className="mb-0"
            >
                <Input
                    placeholder="Tên bài hát, tên dự án..."
                    className="h-12 px-4 bg-white border-slate-200 rounded-xl hover:border-slate-400 focus:border-blue-500 transition-all font-medium"
                />
            </Form.Item>

            <Form.Item
                name="author"
                label={<span className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Tác giả / Nghệ sĩ</span>}
                rules={[{ required: true, message: "Vui lòng nhập tên nghệ sĩ!" }]}
                className="mb-0"
            >
                <Input
                    placeholder="Ca sĩ, Producer..."
                    className="h-12 px-4 bg-white border-slate-200 rounded-xl hover:border-slate-400 focus:border-blue-500 transition-all font-medium"
                />
            </Form.Item>
        </div>

        <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 space-y-6">
            <div>
                <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-4">
                    <Video size={18} className="text-blue-500" /> Chọn hình thức đăng Video
                </label>
                
                <Radio.Group 
                    value={sourceType} 
                    onChange={(e) => setSourceType(e.target.value)}
                    className="w-full flex gap-3"
                >
                    <Radio.Button 
                        value="youtube" 
                        className={`flex-1 h-14 rounded-xl flex items-center justify-center border-2 border-slate-200 hover:border-red-400 transition-all ${sourceType === 'youtube' ? 'bg-red-50 border-red-500 !text-red-600' : 'bg-white'}`}
                    >
                        <div className="flex flex-col items-center justify-center leading-none">
                            <Youtube size={20} className="mb-1" />
                            <span className="text-[11px] font-black uppercase">Dùng Link YouTube</span>
                        </div>
                    </Radio.Button>
                    <Radio.Button 
                        value="upload" 
                        className={`flex-1 h-14 rounded-xl flex items-center justify-center border-2 border-slate-200 hover:border-blue-400 transition-all ${sourceType === 'upload' ? 'bg-blue-50 border-blue-500 !text-blue-600' : 'bg-white'}`}
                    >
                        <div className="flex flex-col items-center justify-center leading-none">
                            <UploadIcon size={20} className="mb-1" />
                            <span className="text-[11px] font-black uppercase">Tải từ máy tính</span>
                        </div>
                    </Radio.Button>
                </Radio.Group>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                {sourceType === "youtube" ? (
                    <Form.Item
                        name="videoUrl"
                        label={<span className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Đường dẫn Video YouTube</span>}
                        rules={[{ required: sourceType === "youtube", message: "Vui lòng nhập link Youtube" }]}
                        className="mb-0"
                    >
                        <Input
                            prefix={<Youtube size={16} className="text-red-500 mr-2" />}
                            placeholder="Dán link (ví dụ: https://www.youtube.com/watch?v=...)"
                            className="h-11 px-4 bg-slate-50 border-none rounded-xl font-medium focus:bg-white"
                        />
                    </Form.Item>
                ) : (
                    <div className="space-y-4">
                        <Form.Item
                            name="videoUrl"
                            rules={[{ required: sourceType === "upload", message: "Vui lòng tải video lên" }]}
                            className="mb-0"
                        >
                            <Upload.Dragger
                                customRequest={handleFileUpload}
                                maxCount={1}
                                showUploadList={false}
                                accept="video/*"
                                disabled={isUploading}
                                className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-blue-400 transition-all group"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <UploadIcon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-700">Kéo thả tệp video của bạn vào đây</p>
                                        <p className="text-[11px] text-slate-500 mt-1">Định dạng MP4, MOV được khuyến nghị</p>
                                    </div>
                                </div>
                            </Upload.Dragger>
                        </Form.Item>

                        {isUploading && (
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <span className="text-[11px] font-bold text-blue-700">Tiến trình upload...</span>
                                    <span className="text-[11px] font-black text-blue-800">{uploadProgress}%</span>
                                </div>
                                <Progress percent={uploadProgress} showInfo={false} strokeColor="#3B82F6" strokeWidth={6} strokeLinecap="round" />
                            </div>
                        )}

                        {form.getFieldValue("videoUrl") && !isUploading && (
                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                                        <FileVideo size={16} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[12px] font-bold text-emerald-900 leading-tight">Video đã tải lên thành công</p>
                                        <p className="text-[10px] text-emerald-600 truncate max-w-[300px]">{form.getFieldValue("videoUrl")}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => form.setFieldsValue({ videoUrl: "" })}
                                    className="p-2 hover:bg-emerald-100 rounded-full text-emerald-600 transition-all"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Thumbnail Preview (Chỉ dành cho Youtube) */}
        {sourceType === "youtube" && (
            <Form.Item
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.videoUrl !== currentValues.videoUrl
              }
              className="mb-0"
            >
              {({ getFieldValue }) => {
                const url = getFieldValue("videoUrl") || "";
                const videoId = getVideoId(url);
    
                return videoId ? (
                  <div className="p-4 bg-slate-50 rounded-[24px] border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 mb-3 px-1 uppercase tracking-wider">
                      <CheckCircle size={14} />
                      Dự kiến kết quả hiển thị
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-xl bg-black group/preview">
                        <img
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                            alt="Preview"
                            className="w-full h-full object-cover opacity-90 group-hover/preview:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl">
                                <Youtube size={24} fill="white" />
                            </div>
                        </div>
                    </div>
                  </div>
                ) : url ? (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 text-red-600 animate-in fade-in duration-300">
                    <AlertCircle size={16} />
                    <span className="text-[12px] font-bold">Link Youtube bạn vừa nhập không hợp lệ</span>
                  </div>
                ) : null;
              }}
            </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ProductForm;
