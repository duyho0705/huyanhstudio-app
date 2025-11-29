import "../../styles/Hero.scss";
const Hero = ({ children }) => {
  return (
    <>
      <section className="hero">{children}</section>
    </>
  );
};
export default Hero;
