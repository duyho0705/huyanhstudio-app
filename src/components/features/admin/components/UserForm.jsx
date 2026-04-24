import { Modal, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User, UserCircle, Mail, Phone, Users, Power, Lock, AtSign } from "lucide-react";
import { removeVietnameseTones } from "../../../../utils/removeVietnameseTones";

const { Option } = Select;

const UserForm = ({ open, onCancel, onSubmit, initialValues, roles }) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (open) {
      if (initialValues) {
        const cleanValues = Object.entries(initialValues).reduce(
          (acc, [key, value]) => {
            if (value !== null && value !== undefined) {
              if (key === "customerName" && i18n.language === 'en') {
                acc[key] = removeVietnameseTones(value);
              } else {
                acc[key] = value;
              }
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
  }, [open, initialValues, form, i18n.language]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        await onSubmit(values);
        form.resetFields();
      })
      .catch(() => { });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 py-1">
          <span className="text-[17px] sm:text-[20px] font-bold text-slate-800">
            {initialValues ? t('admin.users.form_update') : t('admin.users.form_add')}
          </span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={isMobile ? "95%" : 720}
      className="premium-modal !max-w-[95vw]"
      centered
      footer={[
        <button
          key="cancel"
          onClick={onCancel}
          className={`${isMobile ? "h-9 px-5 text-[13px]" : "h-11 px-8 text-[14px]"} rounded-xl font-medium text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 transition-all mr-2`}
        >
          {t('common.cancel')}
        </button>,
        <button
          key="submit"
          onClick={handleSubmit}
          className={`${isMobile ? "h-9 px-6 text-[13px]" : "h-11 px-10 text-[14px]"} rounded-xl bg-slate-900 border-none font-medium text-white hover:bg-slate-800 transition-all shadow-md shadow-slate-200`}
        >
          {initialValues ? t('common.update') : t('admin.users.add_btn')}
        </button>
      ]}
      styles={{ body: { padding: isMobile ? "12px 16px" : "16px 24px" } }}
      destroyOnClose
    >
      <Form 
        form={form} 
        layout="vertical" 
        className={isMobile ? "space-y-0" : "space-y-2"}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Form.Item
            name="customerName"
            label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('admin.users.form_name')}</span>}
            rules={[{ required: true, message: t('admin.users.errors.name_required') || 'Vui lòng nhập tên' }]}
            className={isMobile ? "mb-3" : "mb-5"}
          >
            <Input
              prefix={<User size={16} className="text-slate-400 mr-1.5" />}
              placeholder="Nhập tên"
              className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 font-medium`}
            />
          </Form.Item>

          <Form.Item
            name="username"
            label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('admin.users.form_username')}</span>}
            rules={[
              { required: !initialValues, message: 'Vui lòng nhập tên đăng nhập' },
              { min: 3, message: 'Tối thiểu 3 ký tự' },
            ]}
            className={isMobile ? "mb-3" : "mb-5"}
          >
            <Input
              prefix={<AtSign size={16} className="text-slate-400 mr-1.5" />}
              placeholder="Nhập tên đăng nhập"
              disabled={!!initialValues}
              className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 font-medium ${initialValues ? 'bg-slate-50' : ''}`}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Form.Item
            name="email"
            label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('admin.users.col_email')}</span>}
            rules={[{ type: "email", message: 'Email không hợp lệ' }]}
            className={isMobile ? "mb-3" : "mb-5"}
          >
            <Input
              prefix={<Mail size={16} className="text-slate-400 mr-1.5" />}
              placeholder="Nhập email"
              className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 font-medium`}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('admin.users.col_phone')}</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10,11}$/, message: 'SĐT không hợp lệ' },
            ]}
            className={isMobile ? "mb-3" : "mb-5"}
          >
            <Input
              prefix={<Phone size={16} className="text-slate-400 mr-1.5" />}
              placeholder="Nhập số điện thoại"
              className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 font-medium`}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="role"
            label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('admin.users.form_role')}</span>}
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            className={isMobile ? "mb-3" : "mb-5"}
          >
            <Select
              placeholder="Chọn vai trò"
              className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 font-medium w-full`}
              styles={{ popup: { root: { borderRadius: '12px' } } }}
              suffixIcon={<Users size={16} className="text-slate-400" />}
            >
              {roles?.map((role) => (
                <Option key={role.value} value={role.value}>
                  {role.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="active"
            label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('admin.users.form_status')}</span>}
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            className={isMobile ? "mb-3" : "mb-5"}
          >
            <Select
              placeholder="Chọn trạng thái"
              className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 font-medium w-full`}
              styles={{ popup: { root: { borderRadius: '12px' } } }}
              suffixIcon={<Power size={16} className="text-slate-400" />}
            >
              <Option value={true}>{t('common.active')}</Option>
              <Option value={false}>{t('admin.users.status_locked')}</Option>
            </Select>
          </Form.Item>
        </div>

        {!initialValues && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="password"
              label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('admin.users.form_password')}</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Tối thiểu 6 ký tự' },
              ]}
              className={isMobile ? "mb-3" : "mb-5"}
            >
              <Input.Password
                prefix={<Lock size={16} className="text-slate-400 mr-1.5" />}
                placeholder="Nhập mật khẩu"
                className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 font-medium`}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('user.password.confirm')}</span>}
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('user.password.errors.mismatch')));
                  },
                }),
              ]}
              className={isMobile ? "mb-3" : "mb-5"}
            >
              <Input.Password
                prefix={<Lock size={16} className="text-slate-400 mr-1.5" />}
                placeholder="Xác nhận mật khẩu"
                className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 font-medium`}
              />
            </Form.Item>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default UserForm;
