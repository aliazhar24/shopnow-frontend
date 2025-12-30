import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await api.get("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    await api.put(
      `/orders/${orderId}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrders();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-4 rounded shadow"
          >
            <div className="flex justify-between mb-2">
              <p className="font-semibold">
                Order #{order._id.slice(-6)}
              </p>
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="border p-1 rounded"
              >
                <option>Pending</option>
                <option>Paid</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>

            <p className="text-sm text-gray-600">
              Customer: {order.user?.email}
            </p>

            <p className="text-sm">
              Address: {order.address?.street}, {order.address?.city}
            </p>

            <ul className="mt-3 text-sm">
              {order.items.map((item) => (
                <li key={item._id}>
                  {item.product?.name} × {item.quantity}
                </li>
              ))}
            </ul>

            <p className="font-bold mt-2">
              Total: ₹{order.total}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
