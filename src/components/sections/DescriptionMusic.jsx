const DescriptionMusic = () => {
  return (
    <div className="py-10 bg-gradient-to-r from-gray-50 to-white">
      <div className="container-app">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {["Đam Mê", "Tâm Huyết", "Sáng Tạo", "Chất Lượng", "Chuyên Nghiệp"].map(
            (text, i) => (
              <p
                key={i}
                className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400 uppercase tracking-widest select-none"
              >
                {text}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};
export default DescriptionMusic;
