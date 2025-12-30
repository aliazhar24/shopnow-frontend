import { useState, useEffect } from "react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";


export default function KidsHighlights() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products?category=kids&limit=4")
      .then(res => setProducts(res.data));
  }, []);

  return (
    <section className="py-12 bg-[#f5f5f4]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">For Kid's</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
