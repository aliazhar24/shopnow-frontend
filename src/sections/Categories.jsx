import { useNavigate } from "react-router-dom";
import menImg from "../assets/men.jpg";
import womenImg from "../assets/women.jpg";
import kidsImg from "../assets/kids.jpg";

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Men",
      image: menImg,
      path: "/category/men",
    },
    {
      name: "Women",
      image: womenImg,
      path: "/category/women",
    },
    {
      name: "Kids",
      image: kidsImg,
      path: "/category/kids",
    },
  ];

  return (
    <section className="py-14 bg-[#f5f5f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <h2 className="text-xl sm:text-3xl font-semibold mb-8 text-center sm:text-left">
          Shop by Category
        </h2>

        {/* Responsive Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(cat.path)}
              className="relative text-xl sm:text-2xl rounded-xl overflow-hidden cursor-pointer group"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-48 sm:h-64 md:h-80 object-contain group-hover:scale-105 transition-transform duration-300"
              />

              {/* Overlay Text */}
              <div className="absolute inset-0 bg-black/30 flex items-end p-4 sm:p-6">
                <div>
                  <h3 className="text-white text-xl sm:text-2xl font-semibold">
                    {cat.name}
                  </h3>
                  <p className="text-neutral-200 text-xs sm:text-sm">
                    Explore collection
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Categories;

