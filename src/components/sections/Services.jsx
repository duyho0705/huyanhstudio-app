import { useState } from "react";
import { FaMicrophone, FaHeadphones, FaMusic } from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";
import Modal from "../layout/Modal";
import "../../styles/Services.scss";

// Service data constants
const SERVICE_DATA = [
  {
    id: "recording",
    title: "Recording",
    icon: FaMicrophone,
    iconColor: "blue",
    description: "Thu âm hát, giọng đọc chất lượng cao.",
    details:
      "Recording là quá trình thu âm giọng hát hoặc giọng đọc với chất lượng cao, sử dụng thiết bị chuyên nghiệp để đảm bảo âm thanh trong trẻo, rõ ràng.",
    className: "recording",
  },
  {
    id: "mixing",
    title: "Mixing & Mastering",
    icon: FaHeadphones,
    iconColor: "purple",
    description: "Bản thu trong trẻo, chuyên nghiệp.",
    details:
      "Mixing & Mastering giúp cân bằng, xử lý và tối ưu âm thanh, mang lại bản nhạc trong trẻo, chuyên nghiệp và phù hợp với nhiều nền tảng phát hành.",
    className: "mixing",
  },
  {
    id: "beat",
    title: "Phối beat",
    icon: FaMusic,
    iconColor: "orange",
    description: "Phối theo yêu cầu, nhiều thể loại nhạc.",
    details:
      "Phối beat theo yêu cầu giúp bạn có bản nhạc độc đáo, phù hợp phong cách cá nhân, từ ballad nhẹ nhàng đến rap/hiphop sôi động.",
    className: "beat",
  },
];

// Service Card Component
const ServiceCard = ({ service, onLearnMore }) => {
  const Icon = service.icon;

  return (
    <div className={`service-card ${service.className}`}>
      <div className={`icon ${service.iconColor}`}>
        <Icon />
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onLearnMore(service.id);
        }}
      >
        Tìm hiểu thêm
        <GoArrowRight className="icon--direction" />
      </a>
    </div>
  );
};

// Main Services Component
const Services = () => {
  const [openModal, setOpenModal] = useState(null);

  const handleLearnMore = (serviceId) => {
    setOpenModal(serviceId);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  const selectedService = SERVICE_DATA.find((s) => s.id === openModal);

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="services__cover">
          <h3 className="services__title">Dịch vụ nổi bật</h3>
        </div>

        <div className="services-grid">
          {SERVICE_DATA.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onLearnMore={handleLearnMore}
            />
          ))}
        </div>

        {openModal && selectedService && (
          <Modal
            isOpen={true}
            onClose={handleCloseModal}
            title={selectedService.title}
            content={selectedService.details}
          />
        )}
      </div>
    </section>
  );
};

export default Services;
