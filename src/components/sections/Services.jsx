import { useState } from "react";
import { FaMicrophone, FaHeadphones, FaMusic } from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";
import Modal from "../layout/Modal";

const SERVICE_DATA = [
  { id: "recording", title: "Recording", icon: FaMicrophone, iconBg: "bg-blue-100", iconColor: "text-blue-600", description: "Thu âm hát, giọng đọc chất lượng cao.", details: "Recording là quá trình thu âm giọng hát hoặc giọng đọc với chất lượng cao, sử dụng thiết bị chuyên nghiệp để đảm bảo âm thanh trong trẻo, rõ ràng." },
  { id: "mixing", title: "Mixing & Mastering", icon: FaHeadphones, iconBg: "bg-purple-100", iconColor: "text-purple-600", description: "Bản thu trong trẻo, chuyên nghiệp.", details: "Mixing & Mastering giúp cân bằng, xử lý và tối ưu âm thanh, mang lại bản nhạc trong trẻo, chuyên nghiệp và phù hợp với nhiều nền tảng phát hành." },
  { id: "beat", title: "Phối beat", icon: FaMusic, iconBg: "bg-orange-100", iconColor: "text-orange-600", description: "Phối theo yêu cầu, nhiều thể loại nhạc.", details: "Phối beat theo yêu cầu giúp bạn có bản nhạc độc đáo, phù hợp phong cách cá nhân, từ ballad nhẹ nhàng đến rap/hiphop sôi động." },
];

const ServiceCard = ({ service, onLearnMore }) => {
  const Icon = service.icon;
  return (
    <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-50 group">
      <div className={`w-14 h-14 rounded-xl ${service.iconBg} flex items-center justify-center mb-5`}>
        <Icon className={`text-2xl ${service.iconColor}`} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
      <p className="text-sm text-gray-500 mb-5 leading-relaxed">{service.description}</p>
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); onLearnMore(service.id); }}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors no-underline group-hover:gap-2.5"
      >
        Tìm hiểu thêm
        <GoArrowRight className="text-base transition-all" />
      </a>
    </div>
  );
};

const Services = () => {
  const [openModal, setOpenModal] = useState(null);
  const selectedService = SERVICE_DATA.find((s) => s.id === openModal);

  return (
    <section className="py-16" id="services">
      <div className="container-app">
        <h3 className="text-2xl font-bold text-gray-900 mb-10 text-center">Dịch vụ nổi bật</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICE_DATA.map((service) => (
            <ServiceCard key={service.id} service={service} onLearnMore={setOpenModal} />
          ))}
        </div>
        {openModal && selectedService && (
          <Modal isOpen={true} onClose={() => setOpenModal(null)} title={selectedService.title} content={selectedService.details} />
        )}
      </div>
    </section>
  );
};

export default Services;
