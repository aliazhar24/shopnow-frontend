import heroImg from "../assets/image copy.png"

const Hero = () => {
  return (
    <section className="min-h-screen md:h-[80vh] bg-neutral-900 text-white flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-0 grid gap-12 md:grid-cols-2 items-center">

        {/* Text Content */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold leading-tight">
            Everyday Style,
            <br /> Thoughtfully Designed
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-300 max-w-md mx-auto md:mx-0">
            Comfortable, modern clothing for men, women, and kids —
            made for real life.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <a
              href="/category/men"
              className="bg-white text-black px-6 py-3 rounded-lg text-center"
            >
              Shop Men
            </a>
            <a
              href="/category/women"
              className="border border-white px-6 py-3 rounded-lg text-center"
            >
              Shop Women
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center md:block">
          <img
            src={heroImg}
            alt="Hero"
            className="w-full max-w-xs sm:max-w-sm md:max-w-full object-cover rounded-xl"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;

