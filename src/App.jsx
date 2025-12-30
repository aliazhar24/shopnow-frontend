import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Navbar from './components/Navbar.jsx';
import Category from './pages/Category.jsx';
import Address from './pages/Address.jsx';
import Checkout from "./pages/Checkout";
import Orders from "./pages/Order.jsx";



// Admin imports
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";



export default function App() {
return (
<BrowserRouter>
<Navbar />
<Routes>
<Route path='/' element={<Home />} />
<Route path='/product/:id' element={<Product />} />
<Route path='/cart' element={<Cart />} />
<Route path='/wishlist' element={<Wishlist />} />
<Route path='/login' element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path='/addresses' element={<Address />}/>
<Route path="/category/:category" element={<Category />} />
<Route path="/checkout" element={<Checkout />} />
<Route path="/orders" element={<Orders />} />



 {/* 🔐 ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

</Routes>
</BrowserRouter>
);
}
