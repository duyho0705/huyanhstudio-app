import "../../styles/Services.scss";
import { IoMdMicrophone } from "react-icons/io";
import { SiBytedance } from "react-icons/si";
import { RiMusicAiFill } from "react-icons/ri";
import { MdNavigateNext } from "react-icons/md";

const Services = () => {
  return (
    <>
      <div className="container">
        <div className="service">
          <div className="row">
            <div className="col-xl-12">
              <div className="cover">
                <h3 className="cover__title">Dịch vụ nổi bật</h3>
                <h5 className="cover__des">
                  Chọn gói dịch vụ phù hợp, chúng tôi lo phần còn lại.
                </h5>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="service-box">
                <IoMdMicrophone className="service-box__item" style={{color: "#0084D1"}}/>
                <p className="private private__recording">Recording</p>
                <p className="private__des">
                  Thu âm hát, giọng đọc chất lượng cao.
                </p>
                <p className="private__more">Tìm hiểu thêm <MdNavigateNext className="next"/></p>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="service-box">
                <SiBytedance className="service-box__item" style={{color: "#C800DE"}}/>
                <p className="private private__mixing">Mixing mastering</p>
                <p className="private__des">
                  Bản thu trong trẻo, chuyên nghiệp.
                </p>
                <p className="private__more">Tìm hiểu thêm <MdNavigateNext className="next"/></p>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="service-box">
                <RiMusicAiFill className="service-box__item" style={{color: "#EC6619"}}/>
                <p className="private private__beat">Phối beat</p>
                <p className="private__des">
                  Phối theo yêu cầu, nhiều thể loại nhạc.
                </p>
                <p className="private__more">Tìm hiểu thêm <MdNavigateNext className="next"/></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Services;
