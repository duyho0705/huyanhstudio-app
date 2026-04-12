import { Modal, Form, Input, Select } from "antd";
import { useEffect } from "react";

const { Option } = Select;

const UserForm = ({ open, onCancel, onSubmit, initialValues, roles }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        // Filter out null/undefined values to prevent form issues
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
      .catch(() => {
        // Validation failed, silent catch or handle specific logic if needed
      });
  };

  return (
    <Modal
      title={<span className="text-xl font-bold text-slate-900">{initialValues ? "Cập nhật người dùng" : "Thêm người dùng mới"}</span>}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={initialValues ? "Cập nhật" : "Tạo"}
      cancelText="Hủy"
      width={600}
      centered
      className="custom-admin-modal"
      okButtonProps={{
        className: "bg-blue-600 hover:bg-blue-700 font-bold px-8 h-10 rounded-xl border-none shadow-lg shadow-blue-100 transition-all",
      }}
      cancelButtonProps={{
        className: "bg-slate-100 hover:bg-slate-200 text-slate-700 border-none font-bold h-10 px-8 rounded-xl transition-all",
      }}
    >
      <Form form={form} layout="vertical" className="mt-8 space-y-4">
        <Form.Item
          name="customerName"
          label={<span className="text-sm font-bold text-slate-700">Họ tên</span>}
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ tên" className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all px-4" />
        </Form.Item>

        {!initialValues && (
          <Form.Item
            name="username"
            label={<span className="text-sm font-bold text-slate-700">Tên người dùng</span>}
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng!" },
              { min: 3, message: "Tên người dùng phải có ít nhất 3 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên người dùng" className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all px-4" />
          </Form.Item>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="email"
            label={<span className="text-sm font-bold text-slate-700">Email</span>}
            rules={[{ type: "email", message: "Email không hợp lệ!" }]}
          >
            <Input placeholder="Nhập email" className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all px-4" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<span className="text-sm font-bold text-slate-700">Số điện thoại</span>}
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all px-4" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="role"
            label={<span className="text-sm font-bold text-slate-700">Vai trò</span>}
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select placeholder="Chọn vai trò" className="h-11" variant="filled" dropdownStyle={{ borderRadius: '12px' }}>
              {roles?.map((role) => (
                <Option key={role.value} value={role.value}>
                  {role.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="active"
            label={<span className="text-sm font-bold text-slate-700">Trạng thái</span>}
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái" className="h-11" variant="filled" dropdownStyle={{ borderRadius: '12px' }}>
              <Option value={true}>Hoạt động</Option>
              <Option value={false}>Vô hiệu hóa</Option>
            </Select>
          </Form.Item>
        </div>

        {!initialValues && (
          <Form.Item
            name="password"
            label={<span className="text-sm font-bold text-slate-700">Mật khẩu</span>}
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all px-4" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UserForm;
