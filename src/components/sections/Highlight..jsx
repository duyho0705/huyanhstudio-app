import "../../styles/Highlight.scss";

const Highlight = () => {
  return (
    <>
      <div className="container" style={{ paddingBottom: "83px" }}>
        <div className="highlight">
          <div className="row">
            <div className="col-xl-12">
              <div className="highlight__table">
                <h3 className="highlight__title text">
                  Sẵn sàng toả sáng cùng HA Studio?
                </h3>
                <p className="highlight__desc text">
                  Đặt lịch ngay hôm nay để nhận ưu đãi 10% cho lần thu đầu tiên.
                </p>

                {/* WRAPPER FOR BUTTONS */}
                <div className="btn-wrapper">
                  <a href="#booking" className="button highlight__booking">
                    Đặt lịch
                  </a>
                  <a
                    href="https://www.facebook.com/HUYANHPR"
                    target="_blank"
                    rel="noreferrer"
                    className="button highlight__pricing-table"
                  >
                    Liên hệ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Highlight;
