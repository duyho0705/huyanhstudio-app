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
import { Plus, Trash2, Briefcase, FileText, DollarSign, Activity, ListChecks, AlertCircle, Info } from "lucide-react";
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
      form.resetFields();
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
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    {initialValues ? "Cập nhật dịch vụ" : "Tạo dịch vụ mới"}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Quản lý cấu trúc & giá dịch vụ</p>
            </div>
        </div>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      afterClose={() => form.resetFields()} 
      okText={initialValues ? "Cập nhật ngay" : "Tạo dịch vụ"}
      cancelText="Hủy bỏ"
      width={900}
      centered
      confirmLoading={confirmLoading}
      okButtonProps={{
        disabled: initialValues && !isChanged,
        className: `h-12 px-8 rounded-xl bg-slate-900 border-none font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all ${initialValues && !isChanged ? "opacity-50" : "opacity-100"}`
      }}
      cancelButtonProps={{
        className: "h-12 px-8 rounded-xl font-black uppercase tracking-widest text-xs"
      }}
      className="custom-admin-modal"
    >
      <Form form={form} layout="vertical" className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-6">
                <Form.Item
                  name="name"
                  label={<span className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Briefcase size={12} className="text-blue-500" /> Tên dịch vụ</span>}
                  rules={[
                    { required: true, message: "Vui lòng nhập tên dịch vụ!" },
                  ]}
                  className="!mb-0"
                >
                  <Input 
                    className="h-12 px-5 bg-white border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium" 
                    placeholder="Ví dụ: Quay phim phóng sự cưới" 
                  />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="price"
                    label={<span className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><DollarSign size={12} className="text-blue-500" /> Giá (VNĐ)</span>}
                    rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                    className="!mb-0"
                  >
                    <InputNumber
                      className="w-full h-12 flex items-center px-2 bg-white border-slate-200 !rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-bold"
                      min={0}
                      formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(v) => v.replace(/,/g, "")}
                    />
                  </Form.Item>

                  <Form.Item 
                    name="active" 
                    label={<span className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Activity size={12} className="text-blue-500" /> Trạng thái</span>} 
                    initialValue={true}
                    className="!mb-0"
                  >
                    <Select className="h-12 select-custom-xl rounded-xl" variant="filled">
                      <Option value={true}>Hoạt động</Option>
                      <Option value={false}>Tạm ngưng</Option>
                    </Select>
                  </Form.Item>
                </div>
            </div>

            <Form.Item 
                name="moreInfo" 
                label={<span className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Info size={12} className="text-blue-500" /> Thông tin bổ sung</span>}
            >
              <TextArea
                className="p-5 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium min-h-[120px]"
                rows={4}
                placeholder="Các ghi chú hoặc điều kiện áp dụng thêm..."
              />
            </Form.Item>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <Form.Item
              name="description"
              label={<span className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><FileText size={12} className="text-blue-500" /> Mô tả chi tiết</span>}
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <TextArea
                className="p-5 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium min-h-[120px]"
                rows={4}
                placeholder="Mô tả tóm tắt về dịch vụ để khách hàng dễ hiểu"
              />
            </Form.Item>

            <Form.List name="benefitsList">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <ListChecks size={12} className="text-blue-500" />
                        Danh sách lợi ích & Đặc quyền
                    </label>
                    <button
                      type="button"
                      onClick={() => add()}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-md shadow-blue-100"
                    >
                      <Plus size={12} />
                      Thêm lợi ích
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {fields.map(({ key, name, ...rest }) => (
                      <div key={key} className="flex gap-2 group animate-in slide-in-from-right-4 duration-300">
                        <Form.Item
                          {...rest}
                          name={name}
                          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                          className="flex-1 !mb-0"
                        >
                          <Input 
                            placeholder="Nhập lợi ích... (VD: Miễn phí flycam)" 
                            className="h-11 px-4 bg-slate-50 border-slate-100 rounded-xl focus:bg-white transition-all font-medium text-sm group-hover:border-blue-200" 
                          />
                        </Form.Item>
                        <button
                          type="button"
                          onClick={() => remove(name)}
                          className="w-11 h-11 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    {fields.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 text-slate-300">
                        <AlertCircle size={32} className="mb-2 opacity-20" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Chưa có đặc quyền nào</span>
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
