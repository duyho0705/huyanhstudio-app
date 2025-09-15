import "../../styles/Services.scss";
import Modal from "./Modal";
import { useState } from "react";
import { FaMicrophone, FaHeadphones, FaMusic } from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";
const Services = () => {
  const [openModal, setOpenModal] = useState(null);

  const serviceDetails = {
    recording: {
      title: "Recording",
      content:
        "Recording là quá trình thu âm giọng hát hoặc giọng đọc với chất lượng cao, sử dụng thiết bị chuyên nghiệp để đảm bảo âm thanh trong trẻo, rõ ràng.",
    },
    mixing: {
      title: "Mixing & Mastering",
      content:
        "Mixing & Mastering giúp cân bằng, xử lý và tối ưu âm thanh, mang lại bản nhạc trong trẻo, chuyên nghiệp và phù hợp với nhiều nền tảng phát hành.",
    },
    beat: {
      title: "Phối beat",
      content:
        "Phối beat theo yêu cầu giúp bạn có bản nhạc độc đáo, phù hợp phong cách cá nhân, từ ballad nhẹ nhàng đến rap/hiphop sôi động.",
    },
  };
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="services__cover">
          <h3 className="services__title">Dịch vụ nổi bật</h3>
        </div>
        <div className="services-grid">
          {/* Recording */}
          <div className="service-card recording">
            <div className="icon blue">
              <FaMicrophone />
            </div>
            <h3>Recording</h3>
            <p>Thu âm hát, giọng đọc chất lượng cao.</p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setOpenModal("recording");
              }}
            >
              Tìm hiểu thêm
              <GoArrowRight className="icon--direction" />
            </a>
          </div>

          {/* Mixing */}
          <div className="service-card mixing">
            <div className="icon purple">
              <FaHeadphones />
            </div>
            <h3>Mixing & Mastering</h3>
            <p>Bản thu trong trẻo, chuyên nghiệp.</p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setOpenModal("mixing");
              }}
            >
              Tìm hiểu thêm
              <GoArrowRight className="icon--direction" />
            </a>
          </div>

          {/* Beat */}
          <div className="service-card beat">
            <div className="icon orange">
              <FaMusic />
            </div>
            <h3>Phối beat</h3>
            <p>Phối theo yêu cầu, nhiều thể loại nhạc.</p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setOpenModal("beat");
              }}
            >
              Tìm hiểu thêm
              <GoArrowRight className="icon--direction" />
            </a>
          </div>

          {openModal && (
            <Modal
              isOpen={openModal !== null}
              onClose={() => setOpenModal(null)}
              title={serviceDetails[openModal].title}
              content={serviceDetails[openModal].content}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
