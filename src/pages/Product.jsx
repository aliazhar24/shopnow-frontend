import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../api/api";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const { fetchCart } = useCart();
  const { token } = useAuth();

const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!token) return alert("Please login first");
      if (!selectedSize) return alert("Please select a size");

    await api.post(
      "/cart",
      { productId: product._id, quantity: 1, size: selectedSize },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchCart();
    setSelectedSize(null);
  };


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

    {/* ---------- LEFT: PRODUCT IMAGE ---------- */}
    <div className="max-w-[450px] bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center ml-0 sm:ml-18">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full max-h-[560px] object-cover md:object-cover"
      />
    </div>

    {/* ---------- RIGHT: PRODUCT DETAILS ---------- */}
    <div className="flex flex-col gap-6">

      {/* Category */}
      <span className="uppercase text-gray-500 text-sm md:text-base">
        {product.category}
      </span>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold">
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex items-center gap-3">
        <p className="text-2xl font-bold">₹{product.price}</p>
        {product.originalPrice && (
          <p className="line-through text-gray-400 text-lg">₹{product.originalPrice}</p>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
        {product.description}
      </p>

      {/* ---------- SIZE SELECT ---------- */}
      <div>
        <p className="font-semibold mb-2 text-sm md:text-base">Select Size</p>

        <div className="grid grid-cols-4 gap-2">
          {["S", "M", "L", "XL", ].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`border py-2 rounded-lg text-center text-sm md:text-base 
                ${selectedSize === size ? "border-black bg-black text-white" : "hover:border-black"}`}
            >
              {size}
            </button>
          ))}
        </div>

        <button
          onClick={() => alert("Size guide feature coming soon")}
          className="text-xs underline mt-2 block text-right"
        >
          Size Guide
        </button>
      </div>

      {/* ---------- ADD TO CART ---------- */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-black text-white py-3 rounded-lg text-sm md:text-base font-medium hover:bg-gray-900"
      >
        ADD TO BAG
      </button>

      {/* Delivery / Stock */}
      <p className="text-sm text-gray-500">
        {product.stock > 0 ? "✓ In Stock — Ready to ship" : "✖ Out of Stock"}
      </p>

      {/* Offer Section */}
      <div className="border rounded-xl p-4 text-sm text-gray-700">
        <span className="block">■ Offer ends in 00d 08h 52m</span>
      </div>

    </div>
  </div>
</div>


  );
}
