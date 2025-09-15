import "../../styles/Pricing.scss";
import { FaCheck } from "react-icons/fa";

const plans = [
  {
    name: "Recording",
    price: "299k/giờ",
    features: ["Phòng thu tiêu chuẩn", "Kỹ sư hỗ trợ", "Giao file raw"],
    value: "recording",
  },
  {
    name: "Mixing",
    price: "499k/giờ",
    features: ["Thiết bị cao cấp", "Mix cơ bản", "Không giới hạn take"],
    value: "mixing",
  },
  {
    name: "Beat",
    price: "799k/bài",
    features: ["Master sáng rõ", "Chuẩn streaming", "2 lần revise"],
    value: "beat",
  },
];

const Pricing = ({ onSelectService }) => {
  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <h3 className="pricing__first-title">Bảng giá minh bạch</h3>
        <div className="row">
          {plans.map((plan, index) => (
            <div className="col-xl-4" key={index}>
              <div className="pricing__table">
                <p className="pricing__title">{plan.name}</p>
                <p className="pricing__price">{plan.price}</p>
                <ul className="pricing__features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <FaCheck className="pricing__icon" /> {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#booking"
                  className="pricing__btn"
                  onClick={() => onSelectService(plan.value)}
                >
                  Chọn gói
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
