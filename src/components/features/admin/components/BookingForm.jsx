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
      title={initialValues ? "Cập nhật đặt lịch" : "Tạo đặt lịch mới"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={initialValues ? "Cập nhật" : "Tạo"}
      cancelText="Hủy"
      width={isMobile ? "95%" : 700}
      centered={isMobile}
      className="!max-w-[95vw]"
      destroyOnHidden={true}
      okButtonProps={{
        style: {
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          border: "none",
          boxShadow: "0 4px 12px rgba(30, 41, 59, 0.3)",
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: isMobile ? 12 : 24 }}
        className={isMobile ? "compact-form-mobile" : ""}
      >
        <Form.Item
          name="customerName"
          label={<span className={isMobile ? "text-[13px] font-medium" : ""}>Họ tên</span>}
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          className={isMobile ? "mb-3" : "mb-6"}
        >
          <Input placeholder="Nhập họ tên" size={isMobile ? "middle" : "large"} />
        </Form.Item>

        <div className={`grid grid-cols-1 ${isMobile ? "gap-0" : "sm:grid-cols-2 gap-4"}`}>
          <Form.Item
            name="phone"
            label={<span className={isMobile ? "text-[13px] font-medium" : ""}>Số điện thoại</span>}
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
            className={isMobile ? "mb-3" : "mb-6"}
          >
            <Input placeholder="Nhập số điện thoại" size={isMobile ? "middle" : "large"} />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className={isMobile ? "text-[13px] font-medium" : ""}>Email</span>}
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
            className={isMobile ? "mb-3" : "mb-6"}
          >
            <Input placeholder="Nhập email" size={isMobile ? "middle" : "large"} />
          </Form.Item>
        </div>

        <Form.Item
          name="recordDate"
          label={<span className={isMobile ? "text-[13px] font-medium" : ""}>Ngày thu</span>}
          rules={[{ required: true, message: "Vui lòng chọn ngày thu!" }]}
          className={isMobile ? "mb-3" : "mb-6"}
        >
          <DatePicker
            placeholder="Chọn ngày thu"
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            size={isMobile ? "middle" : "large"}
            disabledDate={(current) => current && current <= dayjs().startOf('day')}
          />
        </Form.Item>

        <Form.Item
          name="studioRoomId"
          label={<span className={isMobile ? "text-[13px] font-medium" : ""}>Studio Room</span>}
          rules={[{ required: true, message: "Vui lòng chọn phòng studio!" }]}
          className={isMobile ? "mb-3" : "mb-6"}
        >
          <Select placeholder="Chọn phòng studio" size={isMobile ? "middle" : "large"}>
            {studios?.map((studio) => (
              <Option key={studio.id} value={studio.id}>
                {studio.studioName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="serviceIds"
          label={<span className={isMobile ? "text-[13px] font-medium" : ""}>Dịch vụ</span>}
          rules={[
            { required: true, message: "Vui lòng chọn ít nhất một dịch vụ!" },
          ]}
          className={isMobile ? "mb-3" : "mb-6"}
        >
          <Select mode="multiple" placeholder="Chọn dịch vụ" size={isMobile ? "middle" : "large"}>
            {services?.map((service) => (
              <Option key={service.id} value={service.id}>
                {service.name || service.moreInfo}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="note"
          label={<span className={isMobile ? "text-[13px] font-medium" : ""}>Ghi chú</span>}
          className="mb-0"
        >
          <TextArea
            placeholder="Yêu cầu thêm..."
            rows={isMobile ? 3 : 4}
            size={isMobile ? "middle" : "large"}
            style={{ maxHeight: 145, minHeight: isMobile ? 60 : 70 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookingForm;
