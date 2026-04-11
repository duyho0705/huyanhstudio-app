import { FaCheck } from "react-icons/fa";

const plans = [
  { name: "Recording", price: "299k/giờ", features: ["Phòng thu tiêu chuẩn", "Kỹ sư hỗ trợ", "Giao file raw"], value: "recording" },
  { name: "Mixing Mastering", price: "499k/giờ", features: ["Thiết bị cao cấp", "Mix cơ bản", "Không giới hạn take"], value: "mixing", popular: true },
  { name: "Phối Beat", price: "799k/bài", features: ["Master sáng rõ", "Chuẩn streaming", "2 lần revise"], value: "beat" },
];

const Pricing = ({ onSelectService }) => {
  return (
    <section className="py-16 bg-gray-50" id="pricing">
      <div className="container-app">
        <h3 className="text-2xl font-bold text-gray-900 mb-10 text-center">Bảng giá minh bạch</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-center border ${
                plan.popular ? "border-blue-200 ring-2 ring-blue-100" : "border-gray-50"
              }`}
            >
              {plan.popular && (
                <span className="inline-block px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-full mb-4">
                  Phổ biến nhất
                </span>
              )}
              <p className="text-lg font-bold text-gray-900 mb-2">{plan.name}</p>
              <p className="text-3xl font-extrabold text-blue-600 mb-6">{plan.price}</p>
              <ul className="flex flex-col gap-3 mb-8 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <FaCheck className="text-xs text-green-500 flex-shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#booking"
                className={`block w-full py-3 rounded-xl text-sm font-semibold no-underline transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-md shadow-blue-200 hover:opacity-90"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => onSelectService(plan.value)}
              >
                Chọn gói
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
