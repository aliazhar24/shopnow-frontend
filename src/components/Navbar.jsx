import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { UserIcon as UserOutline } from "@heroicons/react/24/outline";
import { ShoppingCartIcon as CartOutline } from "@heroicons/react/24/outline";




const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { wishlist } = useWishlist();

  const wishlistCount = wishlist.items.length;


  // TEMP COUNTS (replace with context/backend later)
  const { cart } = useCart();

  // total quantity (not just items length)
  const cartCount = cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );


  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
  <nav className="sticky top-0 z-50 bg-white shadow-sm h-16">

  {/* TOP ROW - ALWAYS VISIBLE */}
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

    {/* LOGO */}
    <Link to="/" className="text-2xl font-bold tracking-wide text-gray-900">
      ShopNow
    </Link>

    {/* CENTER NAV - DESKTOP ONLY */}
    <div className="hidden md:flex gap-8 font-medium text-base">
      <Link to="/category/men" className="hover:text-gray-700 font-semibold">Men</Link>
      <Link to="/category/women" className="hover:text-gray-700 font-semibold">Women</Link>
      <Link to="/category/kids" className="hover:text-gray-700 font-semibold">Kids</Link>
    </div>

    {/* ICONS */}
    <div className="flex items-center gap-5">
      <Link to="/wishlist" className="relative">
        <HeartOutline className="w-6 h-6" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-black text-white text-xs px-1 rounded-full">{wishlistCount}</span>
        )}
      </Link>
      <Link to="/cart" className="relative">
        <CartOutline className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-black text-white text-xs px-1 rounded-full">{cartCount}</span>
        )}
      </Link>

      <div ref={dropdownRef} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        {!isAuthenticated ? (
          <Link to="/login" className="px-3 py-1 bg-black text-white rounded text-sm">Login</Link>
        ) : (
          <>
            <UserOutline className="w-6 h-6 cursor-pointer" />
            {open && (
              <div className="absolute right-0 w-40 bg-white border shadow rounded text-sm">
                <p className="px-4 py-2 font-medium">Hello {user.username}</p>
                {user?.isAdmin && <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin</Link>}
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                <Link to="/addresses" className="block px-4 py-2 hover:bg-gray-100">Addresses</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>

  {/* SECOND ROW - MOBILE ONLY / WILL HIDE ON SCROLL */}
  <div id="mobile-links"
       className="md:hidden flex justify-center gap-6 text-sm font-semibold border-t bg-white py-2 transition-all duration-300">
    <Link to="/category/men" className="hover:text-pink-600">Men</Link>
    <Link to="/category/women" className="hover:text-pink-600">Women</Link>
    <Link to="/category/kids" className="hover:text-pink-600">Kids</Link>
  </div>
  
</nav>

  );
};

export default Navbar;
