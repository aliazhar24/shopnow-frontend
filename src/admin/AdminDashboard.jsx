import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  if (!token) return <Navigate to="/login" replace />;
  if (!user?.isAdmin) return <Navigate to="/" replace />;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get("/orders", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/products"),
        ]);

        const totalRevenue = ordersRes.data.reduce(
          (sum, order) => sum + Number(order.total || 0),
          0
        );

        setStats({
          orders: ordersRes.data.length,
          products: productsRes.data.length,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) return <p className="p-10 text-center">Loading dashboard...</p>;

  return (
    <div className="w-full">
      {/* Title */}
      <h1 className="text-xl sm:text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
        📊 Admin Dashboard
      </h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm text-center sm:text-left">
          <p className="text-gray-500 text-sm sm:text-base">Total Orders</p>
          <h2 className="text-xl sm:text-xl font-bold">{stats.orders}</h2>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm text-center sm:text-left">
          <p className="text-gray-500 text-sm sm:text-base">Total Products</p>
          <h2 className="text-xl sm:text-xl font-bold">{stats.products}</h2>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm text-center sm:text-left">
          <p className="text-gray-500 text-sm sm:text-base">Revenue</p>
          <h2 className="text-xl sm:text-xl font-bold">
            ₹{stats.revenue.toLocaleString("en-IN")}
          </h2>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

