import { Modal, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { User } from "lucide-react";

const { Option } = Select;

const UserForm = ({ open, onCancel, onSubmit, initialValues, roles }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        const cleanValues = Object.entries(initialValues).reduce(
          (acc, [key, value]) => {
            if (value !== null && value !== undefined) {
              acc[key] = value;
            }
            return acc;
          },
          {}
        );
        form.setFieldsValue(cleanValues);
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        await onSubmit(values);
      })
      .catch(() => {});
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <User size={20} />
            </div>
            <div>
                <h3 className="text-[18px] font-semibold text-slate-900 leading-tight">
                    {initialValues ? "Cập nhật người dùng" : "Thêm người dùng mới"}
                </h3>
                <p className="text-[13px] font-medium text-slate-500 mt-0.5">Quản lý hồ sơ, phân quyền và dữ liệu liên hệ</p>
            </div>
        </div>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={initialValues ? "Cập nhật" : "Tạo tài khoản"}
      cancelText="Hủy"
      width={600}
      centered
      okButtonProps={{
        className: "h-10 px-6 rounded-xl bg-slate-900 border-none font-semibold text-[14px] text-white hover:bg-slate-800 transition-all shadow-sm"
      }}
      cancelButtonProps={{
        className: "h-10 px-6 rounded-xl font-medium text-[14px] text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
      }}
    >
      <Form form={form} layout="vertical" className="pt-6 space-y-4">
        <Form.Item
          name="customerName"
          label={<span className="text-[13px] font-semibold text-slate-700">Họ tên</span>}
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ tên" className="h-10 px-4 bg-white border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-[14px]" />
        </Form.Item>

        {!initialValues && (
          <Form.Item
            name="username"
            label={<span className="text-[13px] font-semibold text-slate-700">Tên đăng nhập</span>}
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng!" },
              { min: 3, message: "Tên người dùng phải có ít nhất 3 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" className="h-10 px-4 bg-white border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-[14px]" />
          </Form.Item>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="email"
            label={<span className="text-[13px] font-semibold text-slate-700">Email</span>}
            rules={[{ type: "email", message: "Email không hợp lệ!" }]}
          >
            <Input placeholder="Nhập email liên hệ" className="h-10 px-4 bg-white border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-[14px]" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<span className="text-[13px] font-semibold text-slate-700">Số điện thoại</span>}
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" className="h-10 px-4 bg-white border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-[14px]" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="role"
            label={<span className="text-[13px] font-semibold text-slate-700">Vai trò / Cấp bậc</span>}
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select placeholder="Chọn vai trò hệ thống" className="h-10 text-[14px] font-medium" variant="filled">
              {roles?.map((role) => (
                <Option key={role.value} value={role.value}>
                  <span className="text-[14px]">{role.label}</span>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="active"
            label={<span className="text-[13px] font-semibold text-slate-700">Trạng thái</span>}
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Trạng thái tài khoản" className="h-10 text-[14px] font-medium" variant="filled">
              <Option value={true}><span className="text-[14px] text-green-600">Khôi phục / Hoạt động</span></Option>
              <Option value={false}><span className="text-[14px] text-red-600">Vô hiệu hóa</span></Option>
            </Select>
          </Form.Item>
        </div>

        {!initialValues && (
          <Form.Item
            name="password"
            label={<span className="text-[13px] font-semibold text-slate-700">Mật khẩu khởi tạo</span>}
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password placeholder="Tạo mật khẩu cho người dùng" className="h-10 px-4 bg-white border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UserForm;
