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
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={900}
      className="!max-w-[95vw]"
      centered
      footer={[
        <button
          key="cancel"
          onClick={onCancel}
          className="h-11 px-8 rounded-xl font-bold text-[14px] text-slate-600 border border-slate-200 bg-white mr-3 hover:bg-slate-50 transition-colors"
        >
          Hủy
        </button>,
        <button
          key="submit"
          onClick={handleSubmit}
          disabled={isUploading}
          className={`h-11 px-8 rounded-xl bg-slate-900 border-none font-bold text-[14px] text-white transition-all active:scale-95 ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:shadow-slate-200"}`}
        >
          {initialValues ? "Lưu thay đổi" : "Đăng sản phẩm"}
        </button>
      ]}
    >
      <Form form={form} layout="vertical" className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item
                name="title"
                label={<span className="text-[14px] font-bold text-slate-600">Tiêu đề sản phẩm</span>}
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                className="mb-0"
              >
                <Input
                  placeholder="Nhập tên sản phẩm"
                  className="h-11 px-4 bg-white border-slate-200 rounded-xl hover:border-slate-200 focus:border-blue-500 font-medium"
                />
              </Form.Item>

              <Form.Item
                name="author"
                label={<span className="text-[14px] font-bold text-slate-600">Tác giả</span>}
                rules={[{ required: true, message: "Vui lòng nhập tên tác giả!" }]}
                className="mb-0"
              >
                <Input
                  placeholder="Nhập tên tác giả"
                  className="h-11 px-4 bg-white border-slate-200 rounded-xl hover:border-slate-200 focus:border-blue-500 font-medium"
                />
              </Form.Item>
            </div>

            <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 space-y-6">
              <div>
                <label className="text-[14px] font-bold text-slate-600 flex items-center gap-2 mb-4">
                  <Video size={18} className="text-blue-500" /> Chọn hình thức đăng Video
                </label>

                <div className="w-full h-[60px] flex gap-2 relative bg-slate-200/50 p-1 rounded-2xl border border-slate-200/50">
                  <div 
                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-md transition-all duration-300 ease-out z-0"
                    style={{ left: sourceType === "youtube" ? "4px" : "calc(50%)" }}
                  />

                  <div
                    onClick={() => setSourceType("youtube")}
                    className={`flex-1 h-full rounded-xl flex items-center justify-center cursor-pointer relative z-10 transition-colors duration-300 ${sourceType === 'youtube' ? 'text-red-600' : 'text-slate-500'}`}
                  >
                    <div className="flex flex-col items-center justify-center leading-none">
                      <Youtube size={16} className="mb-0.5" />
                      <span className="text-[12px] font-black uppercase tracking-tighter">Dùng Link YouTube</span>
                    </div>
                  </div>
                  <div
                    onClick={() => setSourceType("upload")}
                    className={`flex-1 h-full rounded-xl flex items-center justify-center cursor-pointer relative z-10 transition-colors duration-300 ${sourceType === 'upload' ? 'text-blue-600' : 'text-slate-500'}`}
                  >
                    <div className="flex flex-col items-center justify-center leading-none">
                      <UploadIcon size={16} className="mb-0.5" />
                      <span className="text-[12px] font-black uppercase tracking-tighter">Tải từ máy tính</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm min-h-[120px] flex flex-col justify-center">
                {sourceType === "youtube" ? (
                  <Form.Item
                    name="videoUrl"
                    label={<span className="text-[13px] font-bold text-slate-500 tracking-tighter">Đường dẫn Video YouTube</span>}
                    rules={[{ required: sourceType === "youtube", message: "Vui lòng nhập link Youtube" }]}
                    className="mb-0"
                  >
                    <Input
                      prefix={<Youtube size={16} className="text-red-500 mr-2" />}
                      placeholder="Dán link (ví dụ: https://www.youtube.com/watch?v=...)"
                      className="h-11 px-4 bg-slate-50 border-none rounded-xl font-medium focus:bg-white hover:bg-slate-50"
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
                        style={{ padding: 0, backgroundColor: 'transparent' }}
                        className="overflow-hidden border-2 border-dashed border-slate-200 rounded-2xl group hover:border-blue-400 transition-all bg-slate-50/50"
                      >
                        <div className="py-6 flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <UploadIcon size={18} />
                          </div>
                          <div className="text-center">
                            <p className="text-[12px] font-bold text-slate-700 m-0">Kéo thả tệp video</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">MP4, MOV</p>
                          </div>
                        </div>
                      </Upload.Dragger>
                    </Form.Item>

                    {isUploading && (
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between mb-2 px-1">
                          <span className="text-[11px] font-bold text-blue-700">Đang tải lên...</span>
                          <span className="text-[11px] font-black text-blue-800">{uploadProgress}%</span>
                        </div>
                        <Progress percent={uploadProgress} showInfo={false} strokeColor="#3B82F6" strokeWidth={6} strokeLinecap="round" />
                      </div>
                    )}

                    {form.getFieldValue("videoUrl") && !isUploading && (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center animate-pulse">
                            <FileVideo size={16} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[12px] font-bold text-emerald-900">Thành công</p>
                          </div>
                        </div>
                        <button
                          onClick={() => form.setFieldsValue({ videoUrl: "" })}
                          className="p-2 rounded-full text-emerald-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-5 h-full">
            <div className="h-full bg-slate-50/50 rounded-[32px] border border-slate-100 p-6 flex flex-col items-center justify-center sticky top-0 min-h-[400px]">
              <Form.Item
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.videoUrl !== currentValues.videoUrl || prevValues.sourceType !== currentValues.sourceType
                }
                className="mb-0 w-full"
              >
                {({ getFieldValue }) => {
                  const url = getFieldValue("videoUrl") || "";
                  const videoId = sourceType === "youtube" ? getVideoId(url) : null;
                  const isUploaded = sourceType === "upload" && url;

                  return (
                    <div className="w-full space-y-4">
                      <div className="flex items-center gap-2 text-[14px] font-bold text-slate-600 px-1">
                        <CheckCircle size={14} className="text-emerald-500" />
                        Kết quả
                      </div>
                      
                      {videoId ? (
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-black animate-in fade-in zoom-in-95 duration-500">
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                            alt="Preview"
                            className="w-full h-full object-cover opacity-90 shadow-inner"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl animate-pulse">
                              <Youtube size={28} fill="white" />
                            </div>
                          </div>
                        </div>
                      ) : isUploaded ? (
                        <div className="aspect-video rounded-2xl bg-slate-900 flex flex-col items-center justify-center gap-4 text-white border border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-500 overflow-hidden relative group">
                           <video 
                             src={url} 
                             className="absolute inset-0 w-full h-full object-cover opacity-60"
                           />
                           <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-2 shadow-lg">
                              <FileVideo size={32} />
                            </div>
                            <span className="text-[14px] font-bold">Video đã sẵn sàng</span>
                           </div>
                        </div>
                      ) : (
                        <div className="aspect-video rounded-2xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-3">
                           <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                              <Video size={32} className="opacity-20" />
                           </div>
                           <span className="text-[13px] font-medium italic">Vui lòng nhập nguồn video...</span>
                        </div>
                      )}

                      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
                        <h4 className="text-[15px] font-bold text-slate-900 truncate">
                          {getFieldValue("title") || "Tiêu đề sản phẩm"}
                        </h4>
                        <p className="text-[12px] font-medium text-slate-500 mt-1">
                          Tác giả: {getFieldValue("author") || "---"}
                        </p>
                      </div>
                    </div>
                  );
                }}
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ProductForm;
