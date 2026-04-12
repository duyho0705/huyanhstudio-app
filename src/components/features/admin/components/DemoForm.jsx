import { Modal, Form, Input, Switch } from "antd";
import { useEffect } from "react";

const DemoForm = ({ open, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
        // Default to active if desired, or let user choose
        form.setFieldsValue({ isActive: false });
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const getVideoId = (url) => {
    if (!url) return null;

    const fullUrl = url.startsWith("http") ? url : `https://${url}`;

    const vMatch = fullUrl.match(/[?&]v=([^&]+)/);
    if (vMatch) return vMatch[1];

    if (fullUrl.includes("youtu.be/"))
      return fullUrl.split("youtu.be/")[1]?.split("?")[0];

    if (fullUrl.includes("youtube.com/embed/"))
      return fullUrl.split("youtube.com/embed/")[1]?.split("?")[0];

    return null;
  };

  return (
    <Modal
      title={initialValues ? "Cập nhật video demo" : "Thêm video demo mới"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={initialValues ? "Cập nhật" : "Tạo"}
      cancelText="Hủy"
      width={600}
      okButtonProps={{
        style: {
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          border: "none",
        },
      }}
      centered
      styles={{
        body: { paddingTop: 24 },
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder="Nhập tiêu đề video" size="large" />
        </Form.Item>

        <Form.Item
          name="videoUrl"
          label="Youtube Video URL"
          tooltip="Hỗ trợ link: youtube.com/watch?v=..., youtu.be/..., hoặc youtube.com/embed/..."
          rules={[
            { required: true, message: "Vui lòng nhập đường dẫn video!" },
            {
              pattern:
                /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/).+$/,
              message:
                "Đường dẫn không hợp lệ! Vui lòng nhập link YouTube đúng định dạng.",
            },
          ]}
        >
          <Input
            placeholder="Ví dụ: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Trạng thái hiển thị"
          valuePropName="checked"
          tooltip="Chỉ có 1 video được phép hiển thị trên trang chủ tại một thời điểm."
        >
          <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
        </Form.Item>

        <Form.Item
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.videoUrl !== currentValues.videoUrl
          }
        >
          {({ getFieldValue }) => {
            const url = getFieldValue("videoUrl");
            const videoId = getVideoId(url);

            return videoId ? (
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  background: "#f8f9fc",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    paddingTop: "56.25%",
                    borderRadius: 8,
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt="Preview"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            ) : null;
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DemoForm;
