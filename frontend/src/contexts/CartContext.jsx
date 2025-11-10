import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage if available
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  // loading cart from the backend when user is logged in
  /*useEffect(() => {
    const fetchCart = async () => {
      if (isLoggedIn) {
        const res = await fetch("/api/cart", { headers: { Authorization: `Bearer ${user.token}` } });
        const data = await res.json();
        setCartItems(data.items || []);
      } else {
        setCartItems([]);
      }
    };
    fetchCart();
  }, [isLoggedIn]); */

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // syncing cart with backend when items are updated
  /*useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ items: cartItems }),
      });
    } else {
      localStorage.setItem("cartItems", JSON.stringify(cartItems)); // optional fallback for guests
    }
  }, [cartItems, isLoggedIn]);*/

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};
