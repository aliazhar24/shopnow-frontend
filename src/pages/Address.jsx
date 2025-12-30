import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const Address = () => {
  const { token } = useAuth();

  const emptyForm = {
    fullName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  };

  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);


  const fetchAddresses = async () => {
    try {
       const res = await api.get("/address", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAddresses(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
      console.log("❌ Unauthorized: Token missing or expired");
    }
    }
  
  };

 useEffect(() => {
  if (!token) return;
    fetchAddresses();
}, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        // ✏️ UPDATE
        await api.put(`/address/${editing}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // ➕ ADD
        await api.post("/address", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm(emptyForm);
      setEditing(null);
      fetchAddresses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (addr) => {
    setEditing(addr._id);
    setForm(addr);
  };

  const handleDelete = async (id) => {
    await api.delete(`/address/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAddresses();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-center items-center">
      <h1 className="text-xl sm:text-3xl font-bold mb-6 ">My Addresses</h1></div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-2 gap-4"
      >
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Street"
          value={form.street}
          onChange={(e) => setForm({ ...form, street: e.target.value })}
          className="border p-2 rounded "
        />

        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Zip Code"
          value={form.zip}
          onChange={(e) => setForm({ ...form, zip: e.target.value })}
          className="border p-2 rounded"
        />

        <button className="col-span-2 bg-black text-white py-2 rounded-lg">
          {editing ? "Update Address" : "+ Add Address"}
        </button>
      </form>

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="border rounded-xl p-4 shadow-sm"
          >
            <p className="font-semibold">{addr.fullName}</p>
            <p>{addr.street}</p>
            <p>
              {addr.city}, {addr.state} {addr.zip}
            </p>
            <p>{addr.phone}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleEdit(addr)}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(addr._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Address;



