import { Modal, Form, Input, DatePicker, Select } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;
const { Option } = Select;

const BookingForm = ({
  open,
  onCancel,
  onSubmit,
  initialValues,

  services,
  studios,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (open && initialValues) {
      // Map services to IDs
      let sourceServices = [];
      if (Array.isArray(initialValues.services)) {
        sourceServices = initialValues.services;
      } else if (initialValues.services) {
        sourceServices = [initialValues.services];
      }

      const serviceIds = sourceServices
        .map((s) => {
          if (typeof s === "object" && s !== null) return s.id;
          return s;
        })
        .filter(Boolean)
        .map(id => (!isNaN(id) && id !== "") ? Number(id) : id); // Only cast if numeric string

      // Map studioRoomId
      const studioId = initialValues.studioRoomId || (initialValues.studioRoom?.id) || initialValues.studioRoom;
      const finalStudioId = (studioId && !isNaN(studioId) && studioId !== "") ? Number(studioId) : studioId;

      form.setFieldsValue({
        customerName: initialValues.customerName,
        phone: initialValues.phone,
        email: initialValues.email,
        recordDate: initialValues.recordDate ? dayjs(initialValues.recordDate) : null,
        studioRoomId: finalStudioId || null,
        serviceIds,
        note: initialValues.note || "",
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, initialValues, form, services, studios]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          recordDate: values.recordDate.format("YYYY-MM-DD"),
        };
        onSubmit(formattedValues);
        form.resetFields();
      })
      .catch(() => {
        // Validation handled by UI
      });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 py-1">
          <span className="text-[17px] sm:text-[20px] font-bold text-slate-800">
            {initialValues ? t('admin.bookings.form_update') : t('admin.bookings.form_add')}
          </span>
        </div>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
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
          {initialValues ? t('admin.bookings.form_submit_update') : t('admin.bookings.form_submit_add')}
        </button>
      ]}
      width={isMobile ? "95%" : 720}
      centered
      className="premium-modal !max-w-[95vw]"
      destroyOnHidden={true}
      styles={{ body: { padding: isMobile ? "12px 16px" : "16px 24px" } }}
    >
      <Form
        form={form}
        layout="vertical"
        className={isMobile ? "space-y-0" : "space-y-2"}
      >
        <Form.Item
          name="customerName"
          label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('admin.bookings.form_customer')}</span>}
          rules={[{ required: true, message: t('admin.bookings.errors.name_required') }]}
          className={isMobile ? "mb-3" : "mb-5"}
        >
          <Input 
            placeholder={t('admin.bookings.form_customer_placeholder')} 
            className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 font-medium`}
          />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Form.Item
            name="phone"
            label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('admin.bookings.form_phone')}</span>}
            rules={[
              { required: true, message: t('admin.bookings.errors.phone_required') },
              { pattern: /^[0-9]{10,11}$/, message: t('admin.bookings.errors.phone_invalid') },
            ]}
            className={isMobile ? "mb-3" : "mb-5"}
          >
            <Input 
              placeholder={t('admin.bookings.form_phone_placeholder')} 
              className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 font-medium`}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('admin.bookings.form_email')}</span>}
            rules={[
              { required: true, message: t('admin.bookings.errors.email_required') },
              { type: "email", message: t('admin.bookings.errors.email_invalid') },
            ]}
            className={isMobile ? "mb-3" : "mb-5"}
          >
            <Input 
              placeholder={t('admin.bookings.form_email_placeholder')} 
              className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 font-medium`}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Form.Item
            name="recordDate"
            label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('admin.bookings.form_date')}</span>}
            rules={[{ required: true, message: t('admin.bookings.errors.date_required') }]}
            className={isMobile ? "mb-3" : "mb-5"}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              placeholder={t('admin.bookings.form_date_placeholder')}
              className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 font-medium`}
              disabledDate={(current) => current && current <= dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="studioRoomId"
            label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('admin.bookings.form_studio')}</span>}
            rules={[{ required: true, message: t('admin.bookings.errors.studio_required') }]}
            className={isMobile ? "mb-3" : "mb-5"}
          >
            <Select 
              placeholder={t('admin.bookings.form_studio_placeholder')} 
              className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 font-medium w-full`}
              dropdownStyle={{ borderRadius: '12px' }}
            >
              {studios?.map((studio) => (
                <Option key={studio.id} value={studio.id}>
                  {studio.studioName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="serviceIds"
          label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('admin.bookings.form_services')}</span>}
          rules={[{ required: true, message: t('admin.bookings.errors.service_required') }]}
          className={isMobile ? "mb-3" : "mb-5"}
        >
          <Select 
            mode="multiple" 
            placeholder={t('admin.bookings.form_services_placeholder')} 
            className={`${isMobile ? "min-h-[36px]" : "min-h-[44px]"} rounded-xl border-slate-200 font-medium w-full`}
            dropdownStyle={{ borderRadius: '12px' }}
            maxTagCount="responsive"
          >
            {services?.map((service) => (
              <Option key={service.id} value={service.id}>
                {service.name || service.moreInfo}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="note"
          label={<span className="text-[13px] sm:text-[14px] font-medium text-slate-600">{t('common.note')}</span>}
          className="mb-0"
        >
          <TextArea
            placeholder={t('admin.bookings.form_note_placeholder')}
            rows={isMobile ? 2 : 3}
            className="rounded-xl border-slate-200 font-medium text-[13px] sm:text-[14px]"
            style={{ maxHeight: 120, minHeight: isMobile ? 60 : 70 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookingForm;
