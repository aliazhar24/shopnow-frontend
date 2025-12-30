import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // Fetch cart
  const fetchCart = async () => {
    if (!token) {
      setCart({ items: [] });
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(res.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  // Update quantity (+ / −)
const updateQuantity = async (productId, quantity) => {
  if (quantity < 1) return;

  setCart((prev) => ({
    ...prev,
    items: prev.items.map((item) =>
      item.product._id === productId
        ? { ...item, quantity }
        : item
    ),
  }));

  try {
    await api.put(
      "/cart",
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Failed to update quantity", error);
    fetchCart();
  }
};


  // Remove item from cart
  const removeItem = async (productId, size) => {
  setCart((prev) => ({
    ...prev,
    items: prev.items.filter(
      (item) => item.product._id !== productId
    ),
  }));

  try {
    await api.delete(`/cart/${productId}/${size}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Failed to remove item", error);
    fetchCart(); // fallback
  }
};

const changeSize = async (productId, oldSize, newSize) => {
  try {
    await api.put(
      "/cart/size",
      { productId, oldSize, newSize },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchCart(); // refresh
  } catch (err) {
    console.error(err);
  }
};



  // Load cart on login / refresh
  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        updateQuantity,
        removeItem,
        changeSize
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

