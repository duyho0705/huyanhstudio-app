const Highlight = () => {
  return (
    <div className="container-app pb-20">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl px-8 py-16 text-center shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]"></div>
        <h3 className="relative text-2xl md:text-3xl font-bold text-white mb-4">
          Sẵn sàng toả sáng cùng HA Studio?
        </h3>
        <p className="relative text-base text-blue-100 mb-8 max-w-md mx-auto">
          Đặt lịch ngay hôm nay để nhận ưu đãi 10% cho lần thu đầu tiên.
        </p>
        <div className="relative flex justify-center gap-4 flex-wrap">
          <a
            href="#booking"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all no-underline shadow-lg"
          >
            Đặt lịch
          </a>
          <a
            href="https://www.facebook.com/HUYANHPR"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-3 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all no-underline"
          >
            Liên hệ
          </a>
        </div>
      </div>
    </div>
  );
};

export default Highlight;
