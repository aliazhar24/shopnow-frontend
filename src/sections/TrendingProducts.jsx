import { useEffect, useState } from "react";
import api from "../api/api";
import TrendingProductCard from "../components/TrendingProductCard";

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      const res = await api.get("/products?isTrending=true&limit=8");
      setProducts(res.data);
    };
    fetchTrending();
  }, []);

  return (
    <section className="py-12 bg-[#f5f5f4]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">Trending Now</h2>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {products.map((p) => (
            <TrendingProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

