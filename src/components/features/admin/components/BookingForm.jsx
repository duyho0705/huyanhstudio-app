import { Modal, Form, Input, DatePicker, Select } from "antd";
import { useEffect } from "react";
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

  useEffect(() => {
    if (open) {
      if (initialValues) {
        // Map services
        let sourceServices = [];
        if (Array.isArray(initialValues.services)) {
          sourceServices = initialValues.services;
        } else if (typeof initialValues.services === "string") {
          sourceServices = initialValues.services.includes(",")
            ? initialValues.services.split(",")
            : [initialValues.services];
        } else if (initialValues.services) {
          sourceServices = [initialValues.services];
        }

        const serviceIds = sourceServices
          .map((s) => {
            // If it's an object with id, use id
            if (typeof s === "object" && s !== null && s.id) return s.id;
            // If it's just a number (id), use it
            if (typeof s === "number") return s;

            // Extract name from object or use string directly
            const serviceName =
              typeof s === "object" && s !== null ? s.name : s;

            // Match by name or moreInfo
            const matched = services?.find((srv) => {
              const srvName = srv.name || srv.moreInfo;
              return (
                srvName === serviceName ||
                String(srvName).trim().toLowerCase() ===
                String(serviceName).trim().toLowerCase()
              );
            });
            return matched ? matched.id : null;
          })
          .filter(Boolean);

        form.setFieldsValue({
          customerName: initialValues.customerName,
          phone: initialValues.phone,
          email: initialValues.email,
          recordDate: initialValues.recordDate
            ? dayjs(initialValues.recordDate)
            : null,
          studioRoomId: initialValues.studioRoomId || (initialValues.studioRoom?.id) || null,
          serviceIds,
          note: initialValues.note,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form, services]);

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
      width={700}
      destroyOnHidden={true}
      okButtonProps={{
        style: {
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          border: "none",
          boxShadow: "0 4px 12px rgba(30, 41, 59, 0.3)",
        },
      }}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Form.Item
          name="customerName"
          label="Họ tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ tên" size="large" />
        </Form.Item>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" size="large" />
          </Form.Item>
        </div>

        <Form.Item
          name="recordDate"
          label="Ngày thu"
          rules={[{ required: true, message: "Vui lòng chọn ngày thu!" }]}
        >
          <DatePicker
            placeholder="Chọn ngày thu"
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            size="large"
            disabledDate={(current) => current && current <= dayjs().startOf('day')}
          />
        </Form.Item>

        <Form.Item
          name="studioRoomId"
          label="Studio Room"
          rules={[{ required: true, message: "Vui lòng chọn phòng studio!" }]}
        >
          <Select placeholder="Chọn phòng studio" size="large">
            {studios?.map((studio) => (
              <Option key={studio.id} value={studio.id}>
                {studio.studioName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="serviceIds"
          label="Dịch vụ"
          rules={[
            { required: true, message: "Vui lòng chọn ít nhất một dịch vụ!" },
          ]}
        >
          <Select mode="multiple" placeholder="Chọn dịch vụ" size="large">
            {services?.map((service) => (
              <Option key={service.id} value={service.id}>
                {service.name || service.moreInfo}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="note" label="Ghi chú">
          <TextArea
            placeholder="Yêu cầu thêm..."
            rows={4}
            size="large"
            style={{ maxHeight: 145, minHeight: 70 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookingForm;
