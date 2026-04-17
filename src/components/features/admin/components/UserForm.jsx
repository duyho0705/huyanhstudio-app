import { Modal, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { User, UserCircle, Mail, Phone, Users, Power, Lock } from "lucide-react";

const { Option } = Select;

const PrefixSelect = ({ icon: Icon, children, ...props }) => (
  <div className="relative w-full">
    <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
    <Select {...props} className={`${props.className} w-full [&_.ant-select-selector]:!pl-10`}>
      {children}
    </Select>
  </div>
);

const UserForm = ({ open, onCancel, onSubmit, initialValues, roles }) => {
  const [form] = Form.useForm();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;

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
      .catch(() => { });
  };

  return (
    <Modal
      title={
        <div className={isMobile ? "py-1" : "py-2"}>
          <h3 className={`${isMobile ? "text-[16px]" : "text-[18px]"} font-semibold text-slate-900 leading-tight`}>
            {initialValues ? "Cập nhật người dùng" : "Thêm người dùng mới"}
          </h3>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={isMobile ? "94%" : 600}
      className="!max-w-[95vw]"
      centered
      footer={[
        <button
          key="cancel"
          onClick={onCancel}
          className={`${isMobile ? "h-9 px-4 text-[13px]" : "h-10 px-6 text-[14px]"} rounded-xl font-medium text-slate-600 border border-slate-200 bg-white mr-2 sm:mr-3`}
        >
          Hủy
        </button>,
        <button
          key="submit"
          onClick={handleSubmit}
          className={`${isMobile ? "h-9 px-4 text-[13px]" : "h-10 px-6 text-[14px]"} rounded-xl bg-slate-900 border-none font-semibold text-white`}
        >
          {initialValues ? "Cập nhật" : "Tạo tài khoản"}
        </button>
      ]}
      bodyStyle={{ padding: isMobile ? "0 12px 16px 12px" : "0 24px 24px 24px" }}
    >
      <Form form={form} layout="vertical" className={isMobile ? "pt-3" : "pt-6"}>
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isMobile ? "gap-x-4 gap-y-0.5" : "gap-x-6 gap-y-1"}`}>
          <Form.Item
            name="customerName"
            label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Họ tên</span>}
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            className={(!initialValues ? "md:col-span-1" : "md:col-span-1") + (isMobile ? " mb-2.5" : " mb-4")}
          >
            <Input
              prefix={<User size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
              placeholder="Nhập họ tên"
              className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} px-3 bg-white border-slate-200 rounded-xl font-medium shadow-sm focus:border-blue-500`}
            />
          </Form.Item>

          {!initialValues ? (
            <Form.Item
              name="username"
              label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Tên đăng nhập</span>}
              rules={[
                { required: true, message: "Vui lòng nhập tên người dùng!" },
                { min: 3, message: "Tên người dùng có ít nhất 3 ký tự!" },
              ]}
              className={isMobile ? "mb-2.5" : "mb-4"}
            >
              <Input
                prefix={<UserCircle size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
                placeholder="Nhập tên đăng nhập"
                className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} px-3 bg-white border-slate-200 rounded-xl font-medium shadow-sm focus:border-blue-500`}
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="email"
              label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Email</span>}
              rules={[{ type: "email", message: "Email không hợp lệ!" }]}
              className={isMobile ? "mb-2.5" : "mb-4"}
            >
              <Input
                prefix={<Mail size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
                placeholder="Nhập email liên hệ"
                className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} px-3 bg-white border-slate-200 rounded-xl font-medium shadow-sm focus:border-blue-500`}
              />
            </Form.Item>
          )}

          {!initialValues && (
            <Form.Item
              name="email"
              label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Email</span>}
              rules={[{ type: "email", message: "Email không hợp lệ!" }]}
              className={isMobile ? "mb-2.5" : "mb-4"}
            >
              <Input
                prefix={<Mail size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
                placeholder="Nhập email liên hệ"
                className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} px-3 bg-white border-slate-200 rounded-xl font-medium shadow-sm focus:border-blue-500`}
              />
            </Form.Item>
          )}

          <Form.Item
            name="phone"
            label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Số điện thoại</span>}
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
            className={isMobile ? "mb-2.5" : "mb-4"}
          >
            <Input
              prefix={<Phone size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
              placeholder="Nhập số điện thoại"
              className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} px-3 bg-white border-slate-200 rounded-xl font-medium shadow-sm focus:border-blue-500`}
            />
          </Form.Item>

          <div className={`grid ${isMobile ? "grid-cols-2 gap-2.5" : "grid-cols-1"}`}>
            <Form.Item
              name="role"
              label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Vai trò</span>}
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
              className={isMobile ? "mb-2.5" : "mb-4"}
            >
              <PrefixSelect
                icon={Users}
                placeholder="Chọn vai trò"
                className={`${isMobile ? "h-9 text-[12px]" : "h-10 text-[14px]"} font-medium rounded-xl border-slate-200`}
              >
                {roles?.map((role) => (
                  <Option key={role.value} value={role.value}>
                    <span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-medium`}>{role.label}</span>
                  </Option>
                ))}
              </PrefixSelect>
            </Form.Item>

            <Form.Item
              name="active"
              label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Trạng thái</span>}
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
              className={isMobile ? "mb-2.5" : "mb-4"}
            >
              <PrefixSelect
                icon={Power}
                placeholder="Trạng thái"
                className={`${isMobile ? "h-9 text-[12px]" : "h-10 text-[14px]"} font-medium rounded-xl border-slate-200`}
              >
                <Option value={true}><span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-medium text-slate-700`}>Bật</span></Option>
                <Option value={false}><span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-medium text-slate-700`}>Tắt</span></Option>
              </PrefixSelect>
            </Form.Item>
          </div>

          {!initialValues && (
            <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 md:col-span-2 md:grid-cols-2 gap-x-6"}`}>
              <Form.Item
                name="password"
                label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Mật khẩu</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu ít nhất 6 ký tự!" },
                ]}
                className={isMobile ? "mb-2.5" : "mb-4"}
              >
                <Input.Password
                  prefix={<Lock size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
                  placeholder="Nhập mật khẩu"
                  className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} px-3 bg-white border-slate-200 rounded-xl font-medium shadow-sm focus:border-blue-500`}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Xác nhận</span>}
                dependencies={['password']}
                rules={[
                  { required: true, message: "Vui lòng xác minh!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu không khớp!'));
                    },
                  }),
                ]}
                className={isMobile ? "mb-2.5" : "mb-4"}
              >
                <Input.Password
                  prefix={<Lock size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
                  placeholder="Nhập lại mật khẩu"
                  className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} px-3 bg-white border-slate-200 rounded-xl font-medium shadow-sm focus:border-blue-500`}
                />
              </Form.Item>
            </div>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default UserForm;
