import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!token) return;

    try {
      const res = await api.get("/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const cancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await api.put(`/orders/cancel/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh orders
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };


  if (!token) return <p className="p-10">Please login</p>;
  if (loading) return <p className="p-10">Loading orders...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-xl sm:text-3xl font-bold mb-8 text-center sm:text-left flex justify-center items-center">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-center sm:text-left text-sm sm:text-base">
          You have no orders yet.
        </p>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 sm:p-6">

              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                <div>
                  <p className="font-semibold text-sm sm:text-base">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    {new Date(order.createdAt).toDateString()}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-semibold text-sm sm:text-base">
                    ₹{order.total.toFixed(2)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 capitalize">
                    Status: {order.status}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-xs sm:text-sm">
                    <span className="flex-1 pr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-right font-medium">
                      ₹{item.priceAtPurchase * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Info */}

              <p className="mt-4 text-xs sm:text-sm text-gray-500">
                {order.status === "Delivered" || order.status === "Cancelled" ? (
                  <>Status: <span className="font-medium">{order.status}</span></>
                ) : (
                  <>
                    Estimated Delivery:{" "}
                    <span className="font-medium">
                      {new Date(order.estimatedDelivery).toDateString()}
                    </span>
                  </>
                )}
              </p>




              {/* Cancel Button */}
              {order.status !== "Delivered" && order.status !== "Cancelled" && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="mt-4 bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-red-600 transition"
                >
                  Cancel Order
                </button>
              )}

            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default Orders;
