import { Modal, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User, UserCircle, Mail, Phone, Users, Power, Lock } from "lucide-react";
import { removeVietnameseTones } from "../../../../utils/removeVietnameseTones";

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
  const { t, i18n } = useTranslation();
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
      })
      .catch(() => { });
  };

  return (
    <Modal
      title={
        <div className={isMobile ? "py-1" : "py-2"}>
          <h3 className={`${isMobile ? "text-[16px]" : "text-[18px]"} font-semibold text-slate-900 leading-tight`}>
            {initialValues ? t('admin.users.form_update') : t('admin.users.form_add')}
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
          {t('common.cancel')}
        </button>,
        <button
          key="submit"
          onClick={handleSubmit}
          className={`${isMobile ? "h-9 px-4 text-[13px]" : "h-10 px-6 text-[14px]"} rounded-xl bg-slate-900 border-none font-semibold text-white`}
        >
          {initialValues ? t('common.update') : t('admin.users.add_btn')}
        </button>
      ]}
      bodyStyle={{ padding: isMobile ? "0 12px 16px 12px" : "0 24px 24px 24px" }}
    >
      <Form form={form} layout="vertical" className={isMobile ? "pt-3" : "pt-6"}>
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isMobile ? "gap-x-4 gap-y-0.5" : "gap-x-6 gap-y-1"}`}>
          <Form.Item
            name="customerName"
            label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>{t('admin.users.form_name')}</span>}
            rules={[{ required: true, message: t('common.error') }]}
            className={(!initialValues ? "md:col-span-1" : "md:col-span-1") + (isMobile ? " mb-2.5" : " mb-4")}
          >
            <Input
              prefix={<User size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
              placeholder={t('admin.users.form_name')}
              className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} px-3 bg-white border-slate-200 rounded-xl font-medium shadow-sm focus:border-blue-500`}
            />
          </Form.Item>

          {!initialValues ? (
            <Form.Item
              name="username"
              label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>{t('admin.users.form_username')}</span>}
              rules={[
                { required: true, message: t('common.error') },
                { min: 3, message: t('common.error') },
              ]}
              className={isMobile ? "mb-2.5" : "mb-4"}
            >
              <Input
                prefix={<UserCircle size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
                placeholder={t('admin.users.form_username')}
                className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} px-3 bg-white border-slate-200 rounded-xl font-medium shadow-sm focus:border-blue-500`}
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="email"
              label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>{t('admin.users.col_email')}</span>}
              rules={[{ type: "email", message: t('common.error') }]}
              className={isMobile ? "mb-2.5" : "mb-4"}
            >
              <Input
                prefix={<Mail size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
                placeholder="Email"
                className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} px-3 bg-white border-slate-200 rounded-xl font-medium shadow-sm focus:border-blue-500`}
              />
            </Form.Item>
          )}

          {!initialValues && (
            <Form.Item
              name="email"
              label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>{t('admin.users.col_email')}</span>}
              rules={[{ type: "email", message: t('common.error') }]}
              className={isMobile ? "mb-2.5" : "mb-4"}
            >
              <Input
                prefix={<Mail size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
                placeholder="Email"
                className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} px-3 bg-white border-slate-200 rounded-xl font-medium shadow-sm focus:border-blue-500`}
              />
            </Form.Item>
          )}

          <Form.Item
            name="phone"
            label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>{t('admin.users.col_phone')}</span>}
            rules={[
              { required: true, message: t('common.error') },
              {
                pattern: /^[0-9]{10,11}$/,
                message: t('common.error'),
              },
            ]}
            className={isMobile ? "mb-2.5" : "mb-4"}
          >
            <Input
              prefix={<Phone size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
              placeholder={t('admin.users.col_phone')}
              className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} px-3 bg-white border-slate-200 rounded-xl font-medium shadow-sm focus:border-blue-500`}
            />
          </Form.Item>

          <div className={`grid ${isMobile ? "grid-cols-2 gap-2.5" : "grid-cols-1"}`}>
            <Form.Item
              name="role"
              label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>{t('admin.users.form_role')}</span>}
              rules={[{ required: true, message: t('common.error') }]}
              className={isMobile ? "mb-2.5" : "mb-4"}
            >
              <PrefixSelect
                icon={Users}
                placeholder={t('admin.users.form_role')}
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
              label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>{t('admin.users.form_status')}</span>}
              rules={[{ required: true, message: t('common.error') }]}
              className={isMobile ? "mb-2.5" : "mb-4"}
            >
              <PrefixSelect
                icon={Power}
                placeholder={t('admin.users.form_status')}
                className={`${isMobile ? "h-9 text-[12px]" : "h-10 text-[14px]"} font-medium rounded-xl border-slate-200`}
              >
                <Option value={true}><span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-medium text-slate-700`}>{t('common.active')}</span></Option>
                <Option value={false}><span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-medium text-slate-700`}>{t('admin.users.status_locked')}</span></Option>
              </PrefixSelect>
            </Form.Item>
          </div>

          {!initialValues && (
            <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 md:col-span-2 md:grid-cols-2 gap-x-6"}`}>
              <Form.Item
                name="password"
                label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>{t('admin.users.form_password')}</span>}
                rules={[
                  { required: true, message: t('common.error') },
                  { min: 6, message: t('common.error') },
                ]}
                className={isMobile ? "mb-2.5" : "mb-4"}
              >
                <Input.Password
                  prefix={<Lock size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
                  placeholder={t('admin.users.form_password')}
                  className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} px-3 bg-white border-slate-200 rounded-xl font-medium shadow-sm focus:border-blue-500`}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>{t('user.password.confirm')}</span>}
                dependencies={['password']}
                rules={[
                  { required: true, message: t('common.error') },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t('user.password.errors.mismatch')));
                    },
                  }),
                ]}
                className={isMobile ? "mb-2.5" : "mb-4"}
              >
                <Input.Password
                  prefix={<Lock size={isMobile ? 15 : 18} className="text-slate-400 mr-2" />}
                  placeholder={t('user.password.confirm')}
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
