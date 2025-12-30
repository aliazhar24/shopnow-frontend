import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex overflow-hidden mt-4 sm:mt-0">
      
      {/* SIDEBAR */}
      <aside className="w-25 sm:w-48 bg-gray-900 text-white py-6 min-h-[calc(100vh-64px)]">
        <h2 className="text-lg sm:text-2xl font-semibold mb-6 px-4">Admin</h2>

        <nav className="flex flex-col gap-4 px-4">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `text-md ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `text-md ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `text-md ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`
            }
          >
            Orders
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT (push right by sidebar width) */}
      <main className="flex-1 p-6 sm:p-14 min-h-[calc(100vh-64px)] bg-[#f5f5f4]">
        <Outlet />
      </main>
    </div>
  );
}

