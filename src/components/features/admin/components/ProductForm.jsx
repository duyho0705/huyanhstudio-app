import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import { Video, Youtube, CheckCircle, AlertCircle } from "lucide-react";

const ProductForm = ({ open, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
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
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={initialValues ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      width={600}
      okButtonProps={{
        className: "h-10 px-6 rounded-xl bg-slate-900 border-none font-semibold text-[14px] text-white hover:bg-slate-800 transition-all shadow-sm"
      }}
      cancelButtonProps={{
        className: "h-10 px-6 rounded-xl font-medium text-[14px] text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
      }}
      centered
    >
      <Form form={form} layout="vertical" className="pt-6 space-y-4">
        <Form.Item
          name="title"
          label={<span className="text-[13px] font-semibold text-slate-700">Tiêu đề sản phẩm</span>}
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input
            placeholder="Nhập tiêu đề"
            className="h-10 px-4 bg-white border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-[14px]"
          />
        </Form.Item>

        <Form.Item
          name="author"
          label={<span className="text-[13px] font-semibold text-slate-700">Tên tác giả</span>}
          rules={[{ required: true, message: "Vui lòng nhập tên tác giả!" }]}
        >
          <Input
            placeholder="Nhập tên tác giả"
            className="h-10 px-4 bg-white border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-[14px]"
          />
        </Form.Item>

        <Form.Item
          name="videoUrl"
          label={<span className="text-[14px] font-bold text-slate-800">Đường dẫn Youtube</span>}
          rules={[
            { required: true, message: "Vui lòng nhập đường dẫn video!" },
          ]}
        >
          <Input
            prefix={<Youtube size={18} className="text-red-500 mr-2" />}
            placeholder="Nhập đường dẫn"
            className="h-12 px-4 bg-white border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[15px]"
          />
        </Form.Item>

        <Form.Item
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.videoUrl !== currentValues.videoUrl
          }
        >
          {({ getFieldValue }) => {
            const url = getFieldValue("videoUrl") || "";
            const videoId = getVideoId(url);

            return videoId ? (
              <div className="mt-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-emerald-600">
                    <CheckCircle size={16} />
                    Link hợp lệ
                  </div>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-black">
                    <img
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt="Preview"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                        <Youtube size={28} fill="currentColor" />
                        </div>
                    </div>
                </div>
              </div>
            ) : url ? (
              <div className="mt-2 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 text-red-600 animate-in fade-in duration-300">
                <AlertCircle size={16} />
                <span className="text-[13px] font-medium">Đường dẫn không hợp lệ hoặc không được hỗ trợ</span>
              </div>
            ) : null;
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;
