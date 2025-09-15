import "../../styles/Highlight.scss";
const Highlight = () => {
  return (
    <>
      <div className="container" style={{paddingBottom: "83px"}}>
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
                <a href="#booking" className="button highlight__booking">Đặt lịch</a>
                <a href="#pricing" className="button highlight__pricing-table">
                  Xem bảng giá
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Highlight;
