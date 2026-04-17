import { Modal, Form, Input, InputNumber, Select } from "antd";
import { useEffect } from "react";

const { TextArea } = Input;
const { Option } = Select;

const StudioForm = ({ open, onCancel, onSubmit, initialValues }) => {
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
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title={initialValues ? "Cập nhật Studio" : "Thêm Studio mới"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={initialValues ? "Cập nhật" : "Tạo"}
      cancelText="Hủy"
      width={600}
      className="!max-w-[95vw]"
      centered
    >
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Form.Item
          name="studioName"
          label="Tên Studio"
          rules={[{ required: true, message: "Vui lòng nhập tên studio!" }]}
        >
          <Input placeholder="Nhập tên studio" size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <TextArea placeholder="Nhập mô tả studio" rows={3} size="large" />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="capacity"
            label="Sức chứa (người)"
            rules={[{ required: true, message: "Vui lòng nhập sức chứa!" }]}
          >
            <InputNumber
              placeholder="Nhập sức chứa"
              size="large"
              style={{ width: "100%" }}
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="hourlyRate"
            label="Giá/giờ (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <InputNumber
              placeholder="Nhập giá"
              size="large"
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="equipment"
          label="Thiết bị"
          rules={[{ required: true, message: "Vui lòng nhập thiết bị!" }]}
        >
          <TextArea
            placeholder="Nhập danh sách thiết bị (cách nhau bằng dấu phẩy)"
            rows={2}
            size="large"
          />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" initialValue="AVAILABLE">
          <Select size="large">
            <Option value="AVAILABLE">Sẵn sàng</Option>
            <Option value="UNAVAILABLE">Bảo trì</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudioForm;
