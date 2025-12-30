import { useNavigate } from "react-router-dom";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import { useState } from "react";
import Login from "../pages/Login";


const TrendingProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { wishlist, fetchWishlist } = useWishlist();
  const { fetchCart } = useCart();
  const { token } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (!token) return alert("Please login first");
    setShowSizeModal(true); // 👉 open size selection
  };

  const confirmAddToCart = async () => {
    if (!selectedSize) return alert("Please select a size");

    await api.post(
      "/cart",
      { productId: product._id, quantity: 1, size: selectedSize },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchCart();
    setShowSizeModal(false);
    setSelectedSize(null);
  };



  const isWishlisted = wishlist?.items?.some(
    (item) => item._id === product._id
  );

  const handleWishlist = async (e) => {
    e.stopPropagation();

    if (!token) {
      setShowLogin(true);
      return;
    }

    await api.post(
      "/wishlist",
      { productId: product._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchWishlist();
  };


  return (
  <div
  className="group relative w-[180px] sm:w-[200px] md:w-[220px] bg-white rounded-xl 
             shadow-sm hover:shadow-md transition cursor-pointer mx-auto flex-shrink-0"
>

  {/* Wishlist */}
  <button
    onClick={handleWishlist}
    className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow z-10"
  >
    {isWishlisted ? (
      <HeartSolid className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
    ) : (
      <HeartOutline className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
    )}
  </button>

  {/* Image */}
  <div className="w-full aspect-[3/4] bg-gray-50 rounded-t-xl overflow-hidden flex items-center justify-center">
  <img
    onClick={() => navigate(`/product/${product._id}`)}
    src={product.imageUrl}
    alt={product.name}
    className="
      h--auto w-auto 
      object-contain
      transition-transform duration-300 group-hover:scale-105
    "
  />
</div>


  {/* Content */}
  <div className="p-2 space-y-1">
    <p className="text-xs text-gray-500 capitalize">{product.category}</p>

    <h3 className="text-sm font-medium leading-tight line-clamp-2 min-h-[20px]">
      {product.name}
    </h3>

    <p className="text-sm sm:text-base font-semibold">₹{product.price}</p>

    <button
      onClick={handleAddToCartClick}
      className="mt-2 w-full bg-gray-200 text-black py-2 rounded-md text-xs sm:text-sm hover:bg-gray-300"
    >
      Add to Cart
    </button>
  </div>

  {showLogin && <Login isModal onClose={() => setShowLogin(false)} />}

  {/* SIZE MODAL */}
  {showSizeModal && (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setShowSizeModal(false)}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-64"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-3 text-center">Select Size</h3>

        <div className="flex gap-2 mb-4 justify-center">
          {["S", "M", "L", "XL"].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`border px-3 py-1 rounded ${
                selectedSize === size ? "bg-black text-white" : ""
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <button
          onClick={confirmAddToCart}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  )}
</div>

  );
};

export default TrendingProductCard;
