import { Modal, Form, Input, DatePicker, Select } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

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
  const [form] = Form.useForm();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;

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
        <div className={isMobile ? "py-1" : "py-2"}>
          <h3 className={`${isMobile ? "text-[16px]" : "text-[18px]"} font-semibold text-slate-900 leading-tight`}>
            {initialValues ? "Cập nhật đặt lịch" : "Tạo đặt lịch mới"}
          </h3>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={isMobile ? "94%" : 650}
      centered
      className="!max-w-[95vw]"
      footer={[
        <button
          key="cancel"
          onClick={onCancel}
          className={`${isMobile ? "h-9 px-4 text-[13px]" : "h-10 px-6 text-[14px]"} rounded-xl font-medium text-slate-600 border border-slate-200 bg-white mr-2 sm:mr-3 hover:bg-slate-50 transition-colors`}
        >
          Hủy
        </button>,
        <button
          key="submit"
          onClick={handleSubmit}
          className={`${isMobile ? "h-9 px-4 text-[13px]" : "h-10 px-6 text-[14px]"} rounded-xl bg-slate-900 border-none font-semibold text-white hover:bg-slate-800 transition-colors`}
        >
          {initialValues ? "Cập nhật" : "Tạo đơn"}
        </button>
      ]}
      bodyStyle={{ padding: isMobile ? "0 16px 16px 16px" : "0 24px 24px 24px" }}
    >
      <Form
        form={form}
        layout="vertical"
        className={isMobile ? "pt-3" : "pt-6"}
      >
        <Form.Item
          name="customerName"
          label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Họ tên</span>}
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          className={isMobile ? "mb-2" : "mb-4"}
        >
          <Input 
            placeholder="Nhập họ tên" 
            className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} rounded-xl border-slate-200 px-3`}
          />
        </Form.Item>

        <div className={`grid grid-cols-1 ${isMobile ? "gap-0" : "sm:grid-cols-2 gap-4"}`}>
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
            className={isMobile ? "mb-2" : "mb-4"}
          >
            <Input 
              placeholder="Nhập số điện thoại" 
              className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} rounded-xl border-slate-200 px-3`}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Email</span>}
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
            className={isMobile ? "mb-2" : "mb-4"}
          >
            <Input 
              placeholder="Nhập email" 
              className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} rounded-xl border-slate-200 px-3`}
            />
          </Form.Item>
        </div>

        <div className={`grid ${isMobile ? "grid-cols-2 gap-3" : "grid-cols-2 gap-4"}`}>
          <Form.Item
            name="recordDate"
            label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Ngày thu</span>}
            rules={[{ required: true, message: "Vui lòng chọn ngày thu!" }]}
            className={isMobile ? "mb-2" : "mb-4"}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} rounded-xl border-slate-200 px-3`}
              disabledDate={(current) => current && current <= dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="studioRoomId"
            label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Phòng Studio</span>}
            rules={[{ required: true, message: "Vui lòng chọn phòng!" }]}
            className={isMobile ? "mb-2" : "mb-4"}
          >
            <Select 
              placeholder="Chọn phòng" 
              className={`${isMobile ? "h-9 text-[13px]" : "h-10 text-[14px]"} rounded-xl border-slate-200`}
              dropdownStyle={{ borderRadius: '12px' }}
            >
              {studios?.map((studio) => (
                <Option key={studio.id} value={studio.id}>
                  <span className="text-[13px] font-medium">{studio.studioName}</span>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="serviceIds"
          label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Dịch vụ</span>}
          rules={[
            { required: true, message: "Vui lòng chọn ít nhất một dịch vụ!" },
          ]}
          className={isMobile ? "mb-2" : "mb-4"}
        >
          <Select 
            mode="multiple" 
            placeholder="Chọn dịch vụ" 
            className={`${isMobile ? "min-h-[36px] text-[13px]" : "min-h-[40px] text-[14px]"} rounded-xl border-slate-200`}
            dropdownStyle={{ borderRadius: '12px' }}
          >
            {services?.map((service) => (
              <Option key={service.id} value={service.id}>
                <span className="text-[13px] font-medium">{service.name || service.moreInfo}</span>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="note"
          label={<span className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-semibold text-slate-700`}>Ghi chú</span>}
          className="mb-0"
        >
          <TextArea
            placeholder="Yêu cầu thêm..."
            rows={isMobile ? 2 : 3}
            className={`${isMobile ? "text-[13px]" : "text-[14px]"} rounded-xl border-slate-200 px-3 py-2`}
            style={{ maxHeight: 120, minHeight: isMobile ? 50 : 60 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookingForm;
