import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex overflow-hidden mt-4 sm:mt-0 relative">
      
      {/* Mobile Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden fixed top-4 left-4 z-50 bg-black text-white p-2 rounded"
      >
        ☰
      </button>

      {/* Overlay (Mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed sm:static z-50 top-0 left-0 min-h-full w-60 sm:w-48 bg-gray-900 text-white py-6 transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
      >
        <div className="flex justify-between items-center px-4 mb-6">
          <h2 className="text-lg sm:text-2xl font-semibold">Admin</h2>
          <button
            onClick={() => setOpen(false)}
            className="sm:hidden text-white text-xl"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-4 px-4">
          <NavLink
            to="/admin"
            end
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-md ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-md ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-md ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`
            }
          >
            Orders
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-14 min-h-[calc(100vh-64px)] bg-[#f5f5f4]">
        <Outlet />
      </main>
    </div>
  );
}

