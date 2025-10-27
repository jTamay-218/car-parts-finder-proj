import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function CartPage() {
  const { cartItems = [], removeFromCart, clearCart, total = 0 } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isLoggedIn()) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>🛒 Your Cart is Empty</h2>
        <p>
          <Link to="/">Browse Parts</Link> to add items to your cart.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>🛒 Your Cart ({cartItems.length} items)</h2>

      <div style={{ display: "grid", gap: "1rem" }}>
        {cartItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              border: "1px solid var(--gray-200)",
              borderRadius: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                }}
              >
                {item.image ? (
                  <img
                    src={item.image.startsWith('http') ? item.image : `http://localhost:3001/${item.image}`}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    🔧
                  </div>
                )}
              </div>
              <div>
                <h4 style={{ margin: 0 }}>{item.name}</h4>
                <p style={{ margin: 0, color: "var(--gray-600)" }}>${(typeof item.price === 'string' ? parseFloat(item.price) : item.price).toFixed(2)}</p>
              </div>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="btn btn-outline btn-sm">
              ❌ Remove
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          border: "1px solid var(--gray-200)",
          borderRadius: "0.75rem",
          backgroundColor: "#f9fafb",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
          <span>Subtotal ({cartItems.length} items):</span>
          <span>${(typeof total === 'string' ? parseFloat(total) : total).toFixed(2)}</span>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={clearCart} className="btn btn-secondary" style={{ flex: 1 }}>
            🗑️ Clear Cart
          </button>
          <button onClick={handleCheckout} className="btn btn-primary" style={{ flex: 1 }}>
            💳 Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
