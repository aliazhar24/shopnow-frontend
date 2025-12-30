import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, loading, updateQuantity, removeItem, changeSize } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (loading) return <p className="p-10">Loading cart...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-28">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ================== CART ITEMS ================== */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="flex gap-4 p-4 border-b pb-6 last:border-none"
              >
                {/* Image */}
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-24 h-28 object-cover rounded-lg"
                />

                {/* Product Details */}
                <div className="flex-1 relative">
                  <button
                    onClick={() => removeItem(item.product._id, item.size)}
                    className="absolute top-0 right-0 text-gray-500 text-xl"
                  >
                    ×
                  </button>

                  <h2 className="text-sm sm:text-base font-semibold mt-1 pr-6">
                    {item.product.name}
                  </h2>

                  <p className="text-base font-semibold mt-1">
                    ₹{item.product.price}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">Size:</span>
                      <select
                        value={item.size}
                        onChange={(e) =>
                          changeSize(
                            item.product._id,
                            item.size,
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {["S", "M", "L", "XL"].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">Qty:</span>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.product._id,
                            Number(e.target.value)
                          )
                        }
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {[1, 2, 3, 4, 5].map((q) => (
                          <option key={q}>{q}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 🌟 MOBILE ORDER SUMMARY (BOTTOM OF PAGE) */}
            <div className="lg:hidden mt-10 border rounded-xl p-6 bg-white shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Order Summary</h2>

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="border-t my-3"></div>

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* 💻 DESKTOP SUMMARY (RIGHT SIDE) */}
          <div className="hidden lg:block border rounded-xl p-6 h-fit sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="border-t my-4"></div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 bg-black text-white py-3 rounded-lg"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      )}

      {/* 📌 STICKY MOBILE PLACE ORDER BUTTON */}
      {cart.items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 shadow-lg z-50">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold"
          >
            PLACE ORDER · ₹{subtotal.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;


