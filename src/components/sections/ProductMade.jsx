import "../../styles/ProductMade.scss";

const products = [
  { id: 1, title: "Video Dự án A", video: "https://www.youtube.com/embed/KfjeMr3nJ4o" },
  { id: 2, title: "Video Dự án B", video: "https://www.youtube.com/embed/tgbNymZ7vqY" },
  { id: 3, title: "Video Dự án C", video: "https://www.youtube.com/embed/tgbNymZ7vqY" },
];

const ProductMade = () => {
  return (
    <div className="container">
      <section className="product">
        <div className="row">
          <div className="col-xl-12">
            <div className="product__header">
              <h3 className="product__title">Sản phẩm đã thực hiện</h3>
              <p className="product__desc">Những dự án đã làm.</p>
              <button className="product__btn">Xem tất cả</button>
            </div>
          </div>
        </div>

        <div className="row">
          {products.map(({ id, title, video }) => (
            <div className="col-xl-4" key={id}>
              <div className="video-card">
                <div className="video-wrapper">
                  <iframe
                    src={video}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="video-title">{title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductMade;
