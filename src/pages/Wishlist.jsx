import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { XCircleIcon } from "@heroicons/react/24/outline";
import api from "../api/api";
import { useState } from "react";

const Wishlist = () => {
  const { wishlist, fetchWishlist } = useWishlist();
  const { fetchCart } = useCart();
  const { token } = useAuth();

  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleAddToCartClick = (e, product) => {
    e.stopPropagation();
    if (!token) return alert("Please login first");

    setSelectedProduct(product);
    setShowSizeModal(true);
  };

  const confirmAddToCart = async () => {
    if (!selectedSize) return alert("Please select a size");

    try {
      // Add to cart
      await api.post(
        "/cart",
        {
          productId: selectedProduct._id,
          quantity: 1,
          size: selectedSize,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove from wishlist
      await api.delete(`/wishlist/${selectedProduct._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchCart();
      fetchWishlist();
      setShowSizeModal(false);
      setSelectedSize(null);
      setSelectedProduct(null);
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
  };

  const handleRemove = async (id) => {
    await api.delete(`/wishlist/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchWishlist();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-5">
      <h1 className="text-xl sm:text-3xl font-bold mb-8 flex items-center justify-center">My Wishlist</h1>

      {wishlist.items.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty ❤️</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
          {wishlist.items.map((product) => (
            <div
              key={product._id}
              className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              {/* Remove */}
              <button
                onClick={() => handleRemove(product._id)}
                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow hover:scale-110 transition"
              >
              <XCircleIcon className="w-5 h-5 text-gray-500 hover:text-red-600" />  
              </button>

              {/* Image */}
              <div className="w-full aspect-[3/4] bg-gray-100 rounded-t-xl overflow-hidden flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-3 space-y-1">
                <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                <h2 className="text-sm sm:text-base font-medium line-clamp-2">{product.name}</h2>
                <p className="text-sm sm:text-base font-semibold">₹{product.price}</p>

                <button
                  onClick={(e) => handleAddToCartClick(e, product)}
                  className="mt-2 w-full bg-gray-200 text-black py-2 rounded-md text-xs sm:text-sm hover:bg-gray-300 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
                  className={`border px-3 py-1 rounded ${selectedSize === size ? "bg-black text-white" : ""}`}
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

export default Wishlist;


