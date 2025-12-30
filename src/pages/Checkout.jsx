import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const { token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      const res = await api.get("/address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data);
    };

    if (token) fetchAddresses();
  }, [token]);

const loadRazorpay = (src) =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const handlePayment = async () => {
  if (!selectedAddress) return alert("Please select an address");
  if (loading) return;

  setLoading(true);

  try {
    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    // 🟡 1. Create Razorpay Order
    const res = await api.post(
      "/payment/order",
      { amount: totalAmount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { order } = res.data;

    const loaded = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "ShopNow",
      description: "Order Payment",
      order_id: order.id,

      // 🟢 PAYMENT SUCCESS
      handler: async function (response) {
        try {
          await api.post("/payment/verify", response, {
            headers: { Authorization: `Bearer ${token}` },
          });

          await api.post(
            "/orders",
            { addressId: selectedAddress },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          fetchCart();
          navigate("/orders");
        } catch (err) {
          console.error("Verification failed", err);
          alert("❌ Payment verification failed");
        }
      },

      // ❌ PAYMENT FAILED
      modal: {
        ondismiss: function () {
          alert("Payment Popup Closed ❌");
        },
      },

      theme: {
        color: "#000000",
      },
    };

    const rzp = new window.Razorpay(options);

    // ❌ FAILURE EVENT HANDLER
    rzp.on("payment.failed", (response) => {
      console.error("PAYMENT FAILED ❌", response.error);
      alert(`Payment Failed ❌\nReason: ${response.error.description}`);
    });

    rzp.open();
  } catch (error) {
    console.error("Payment Error:", error);
    alert("Something went wrong while starting the payment");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
  <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center sm:text-left">
    Checkout
  </h1>

  {/* Delivery Address */}
  <h2 className="text-lg sm:text-xl font-semibold mb-4">
    Delivery Address
  </h2>

  {addresses.length === 0 ? (
    /* NO ADDRESS */
    <div className="border rounded-lg p-6 text-center">
      <p className="text-gray-600 mb-4 text-sm sm:text-base">
        You don’t have any saved addresses.
      </p>

      <button
        onClick={() => navigate("/addresses")}
        className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 text-sm sm:text-base"
      >
        Add Address
      </button>
    </div>
  ) : (
    /* ADDRESS LIST */
    <div className="space-y-4 mb-10">
      {addresses.map((addr) => (
        <label
          key={addr._id}
          className={`flex items-start gap-3 sm:gap-4 border rounded-lg p-3 sm:p-4 cursor-pointer transition
            ${
              selectedAddress === addr._id
                ? "border-black bg-gray-50"
                : "hover:border-gray-400"
            }`}
        >
          {/* Radio */}
          <input
            type="radio"
            name="address"
            value={addr._id}
            checked={selectedAddress === addr._id}
            onChange={() => setSelectedAddress(addr._id)}
            className="mt-1 accent-black w-4 h-4"
          />

          {/* Address Content */}
          <div className="text-sm sm:text-base">
            <p className="font-semibold">{addr.fullName}</p>
            <p className="text-gray-600">
              {addr.street}, {addr.city}
            </p>
            <p className="text-gray-600">
              {addr.state} - {addr.zip}
            </p>
            <p className="text-gray-600">
              Phone: {addr.phone}
            </p>
          </div>
        </label>
      ))}

      <button
        onClick={() => navigate("/addresses")}
        className="text-black underline text-sm mt-1"
      >
        + Add another address
      </button>
    </div>
  )}


  {/* Order Summary */}
  <h2 className="text-lg sm:text-xl font-semibold mb-4">
    Order Summary
  </h2>

  <div className="border rounded-lg p-4 sm:p-6 space-y-2 text-sm sm:text-base mb-6">
    {cart.items.map((item) => (
      <div
        key={item.product._id}
        className="flex justify-between items-center gap-4"
      >
        <span className="flex-1">
          {item.product.name} × {item.quantity}
        </span>
        <span className="font-medium">
          ₹{item.product.price * item.quantity}
        </span>
      </div>
    ))}
  </div>

  {/* ACTION BUTTON */}
  <button
    onClick={handlePayment}
    className="w-full bg-black text-white py-2.5 sm:py-3 rounded-lg 
               text-sm sm:text-base font-medium hover:bg-gray-800"
  >
    Place Order
  </button>
</div>

  );
};

export default Checkout;
