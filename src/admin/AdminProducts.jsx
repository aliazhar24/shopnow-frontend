import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const AdminProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "men",
    stock: "",
    imageUrl: "",
    isTrending: false,
  });

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      category: "men",
      stock: "",
      imageUrl: "",
      isTrending: false,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/products", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      alert("❌ Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({ ...p });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await api.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchProducts();
  };

  return (
    <div className="w-full">

      <h1 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">📦 Manage Products</h1>

      {/* ==================== FORM ==================== */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-4 mb-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <input
            placeholder="Price"
            inputMode="numeric"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>

          <input
            placeholder="Stock"
            inputMode="numeric"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="border p-2 rounded sm:col-span-2"
          />

          <label className="flex items-center gap-2 sm:col-span-2 text-sm">
            <input
              type="checkbox"
              checked={form.isTrending}
              onChange={(e) => setForm({ ...form, isTrending: e.target.checked })}
            />
            Mark as Trending
          </label>
        </div>

        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="preview"
            className="mt-2 h-32 object-contain border rounded"
          />
        )}

        <button
          disabled={loading}
          className="w-full sm:w-auto bg-black text-white py-2 px-6 rounded mt-4"
        >
          {editingId ? "💾 Update Product" : "➕ Add Product"}
        </button>
      </form>

      {/* ==================== TABLE ==================== */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow text-sm sm:text-base">
          <thead className="bg-gray-100 text-left">
  <tr>
    <th className="p-2 sm:p-3">Name</th>
    <th className="p-2 sm:p-3">Price</th>
    <th className="p-2 sm:p-3 hidden sm:table-cell">Category</th>
    <th className="p-2 sm:p-3 hidden sm:table-cell">Stock</th>
    <th className="p-2 sm:p-3 hidden sm:table-cell">Trending</th>
    <th className="p-2 sm:p-3 text-center">Actions</th>
  </tr>
</thead>


        <tbody>
  {products.map((p) => (
    <tr key={p._id} className="border-t hover:bg-gray-50">
      <td className="p-2 sm:p-3">{p.name}</td>
      <td className="p-2 sm:p-3">₹{p.price}</td>

      <td className="p-2 sm:p-3 hidden sm:table-cell capitalize">
        {p.category}
      </td>

      <td className="p-2 sm:p-3 hidden sm:table-cell">
        {p.stock}
      </td>

      <td className="p-2 sm:p-3 hidden sm:table-cell text-center">
        {p.isTrending ? "🔥" : "—"}
      </td>

      <td className="p-2 sm:p-3 flex flex-col sm:flex-row justify-center gap-2">
        <button
          onClick={() => handleEdit(p)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(p._id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

    </div>
  );
};

export default AdminProducts;