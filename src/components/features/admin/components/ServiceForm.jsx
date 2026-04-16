import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Button,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import { Plus, Trash2, Briefcase, FileText, DollarSign, Activity, ListChecks, AlertCircle, Info, Star, Music, Camera, Video, Zap, Heart, Mic, Tag, MousePointer2 } from "lucide-react";
import { Switch } from "antd";
const { TextArea } = Input;
const { Option } = Select;

const ServiceForm = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  confirmLoading,
}) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        benefitsList:
          initialValues.benefitsList ?? initialValues.benefits ?? [],
        icon: initialValues.icon, 
      });
      setIsChanged(false);
    }

    if (open && !initialValues) {
      form.setFieldsValue({
        active: true,
        icon: "Mic",
        unit: "/ gói",
        buttonText: "Đăng ký ngay",
        featured: false,
        benefitsList: []
      });
      setIsChanged(true);
    }
  }, [open, initialValues, form]);

  useEffect(() => {
    if (!initialValues || !values) {
      setIsChanged(true);
      return;
    }

    const normalize = (obj) => JSON.stringify(obj ?? null);

    const original = {
      ...initialValues,
      benefitsList: initialValues.benefitsList ?? initialValues.benefits ?? [],
      icon: initialValues.icon,
    };

    const fields = [
      "name",
      "price",
      "active",
      "description",
      "moreInfo",
      "benefitsList",
      "icon",
      "unit",
      "featured",
      "buttonText",
    ];

    const hasChanges = fields.some(
      (key) => normalize(values[key]) !== normalize(original[key])
    );

    setIsChanged(hasChanges);
  }, [values, initialValues]);

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      await onSubmit(formValues); 
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase size={20} />
            </div>
            <div>
                <h3 className="text-[18px] font-semibold text-slate-900 leading-tight">
                    {initialValues ? "Cập nhật dịch vụ" : "Tạo dịch vụ mới"}
                </h3>
                <p className="text-[13px] font-medium text-slate-500 mt-0.5">Quản lý cấu trúc & giá dịch vụ</p>
            </div>
        </div>
      }
      open={open}
      onCancel={onCancel}
      afterClose={() => form.resetFields()} 
      width={900}
      className="!max-w-[95vw]"
      centered
      footer={[
        <button
          key="cancel"
          onClick={onCancel}
          className="h-10 px-6 rounded-xl font-medium text-[14px] text-slate-600 border border-slate-200 bg-white mr-3"
        >
          Hủy
        </button>,
        <button
          key="submit"
          onClick={handleSubmit}
          disabled={confirmLoading || (initialValues && !isChanged)}
          className={`h-10 px-6 rounded-xl bg-slate-900 border-none font-semibold text-[14px] text-white ${(confirmLoading || (initialValues && !isChanged)) ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {confirmLoading ? "Đang xử lý..." : (initialValues ? "Cập nhật" : "Tạo dịch vụ")}
        </button>
      ]}
    >
      <Form form={form} layout="vertical" className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <Form.Item
                  name="name"
                  label={<span className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><Briefcase size={14} className="text-blue-500" /> Tên dịch vụ</span>}
                  rules={[
                    { required: true, message: "Vui lòng nhập tên dịch vụ!" },
                  ]}
                  className="!mb-0"
                >
                  <Input 
                    className="h-10 px-4 bg-white border border-slate-200 rounded-xl focus:border-blue-500 hover:border-slate-200 font-medium text-[14px]" 
                    placeholder="Ví dụ: Quay phim phóng sự cưới" 
                  />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="price"
                    label={<span className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><DollarSign size={14} className="text-blue-500" /> Giá trị</span>}
                    rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                    className="!mb-0"
                  >
                    <InputNumber
                      className="w-full h-10 flex items-center px-1 bg-white border border-slate-200 !rounded-xl focus:border-blue-500 hover:border-slate-200 font-semibold text-[14px]"
                      min={0}
                      formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(v) => v.replace(/,/g, "")}
                      placeholder="Giá tiền"
                    />
                  </Form.Item>

                  <Form.Item 
                    name="unit" 
                    label={<span className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><Tag size={14} className="text-blue-500" /> Đơn vị</span>}
                    initialValue="/ gói"
                    className="!mb-0"
                  >
                    <Select className="h-10 select-custom-xl rounded-xl" variant="filled">
                      <Option value="/ gói">/ gói</Option>
                      <Option value="/ bài">/ bài</Option>
                      <Option value="/ giờ">/ giờ</Option>
                      <Option value="/ người">/ người</Option>
                      <Option value="">Không có</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Form.Item 
                    name="icon" 
                    label={<span className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2 font-sans italic text-slate-400">Biểu tượng hiển thị</span>}
                    className="!mb-0"
                  >
                    <Select className="h-10 select-custom-xl rounded-xl" variant="filled" placeholder="Chọn icon">
                      <Option value="Mic"><div className="flex items-center gap-2 font-medium"><Mic size={14} /> Micro</div></Option>
                      <Option value="Music"><div className="flex items-center gap-2 font-medium"><Music size={14} /> Nốt nhạc</div></Option>
                      <Option value="Star"><div className="flex items-center gap-2 font-medium"><Star size={14} /> Ngôi sao</div></Option>
                      <Option value="Camera"><div className="flex items-center gap-2 font-medium"><Camera size={14} /> Camera</div></Option>
                      <Option value="Video"><div className="flex items-center gap-2 font-medium"><Video size={14} /> Video</div></Option>
                      <Option value="Zap"><div className="flex items-center gap-2 font-medium"><Zap size={14} /> Tia sét</div></Option>
                      <Option value="Heart"><div className="flex items-center gap-2 font-medium"><Heart size={14} /> Trái tim</div></Option>
                    </Select>
                  </Form.Item>

                  <Form.Item 
                    label={<span className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2">Gói nổi bật</span>}
                    className="!mb-0"
                  >
                      <div className="h-10 px-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
                        <span className="text-[13px] font-bold text-blue-600 uppercase tracking-wider text-blue-600">Gợi ý chọn</span>
                        <Form.Item name="featured" valuePropName="checked" noStyle>
                            <Switch size="small" />
                        </Form.Item>
                      </div>
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 pt-2">
                   <Form.Item 
                    name="buttonText" 
                    label={<span className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><MousePointer2 size={14} className="text-blue-500" /> Chữ trên nút</span>}
                    className="!mb-0"
                  >
                    <Input 
                      className="h-10 px-4 bg-white border border-slate-200 rounded-xl focus:border-blue-500 hover:border-slate-200 font-medium text-[14px]" 
                      placeholder="VD: Đăng ký ngay, Bắt đầu..." 
                    />
                  </Form.Item>
                </div>
            </div>

            <div className="grid grid-cols-1">
              <Form.Item 
                name="active" 
                label={<span className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2 text-slate-400">Trạng thái mở bán</span>} 
                initialValue={true}
              >
                <Select className="h-10 select-custom-xl rounded-xl" variant="filled">
                  <Option value={true}><span className="text-[14px] font-medium">Đang kinh doanh</span></Option>
                  <Option value={false}><span className="text-[14px] font-medium">Tạm khóa/Bảo trì</span></Option>
                </Select>
              </Form.Item>
            </div>

          </div>

          <div className="space-y-6">
            <Form.Item
              name="description"
              label={<span className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><FileText size={14} className="text-blue-500" /> Mô tả chi tiết</span>}
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <TextArea
                className="p-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 hover:border-slate-200 font-medium min-h-[120px] text-[14px]"
                rows={4}
                placeholder="Mô tả tóm tắt về dịch vụ để khách hàng dễ hiểu"
              />
            </Form.Item>

            <Form.List name="benefitsList">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1 mb-2">
                    <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-2">
                        <ListChecks size={14} className="text-blue-500" />
                        Danh sách đặc quyền
                    </label>
                    <button
                      type="button"
                      onClick={() => add()}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[12px] font-semibold flex items-center gap-1.5"
                    >
                      <Plus size={14} />
                      Thêm
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                    {fields.map(({ key, name, ...rest }) => (
                      <div key={key} className="flex gap-2 group animate-in slide-in-from-right-4 duration-300">
                        <Form.Item
                          {...rest}
                          name={name}
                          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                          className="flex-1 !mb-0"
                        >
                          <Input 
                            placeholder="VD: Miễn phí flycam" 
                            className="h-10 px-4 bg-white border border-slate-200 rounded-xl focus:border-blue-500 hover:border-slate-200 font-medium text-[14px]" 
                          />
                        </Form.Item>
                        <button
                          type="button"
                          onClick={() => remove(name)}
                          className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    {fields.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                        <AlertCircle size={24} className="mb-2 opacity-50" />
                        <span className="text-[12px] font-medium">Chưa cấu hình đặc quyền</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Form.List>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ServiceForm;
