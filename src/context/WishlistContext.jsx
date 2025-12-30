import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState({ items: [] });

  const fetchWishlist = async () => {
    if (!token) {
      setWishlist({ items: [] });
      return;
    }

    try {
      const res = await api.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlist(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
