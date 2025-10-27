import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems = [], total = 0, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return alert("Your cart is empty!");

    try {
      const res = await fetch("http://localhost:3001/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          items: cartItems,
          total,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderId(data.orderId);
        setOrderSuccess(true);
        clearCart();
      } else {
        alert(`❌ Checkout failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong. Please try again.");
    }
  };

  // Show success screen
  if (orderSuccess) {
    return (
      <div style={{ 
        padding: "2rem", 
        maxWidth: "600px", 
        margin: "0 auto",
        textAlign: "center" 
      }}>
        <div style={{
          backgroundColor: "#f0fdf4",
          border: "2px solid #86efac",
          borderRadius: "1rem",
          padding: "3rem 2rem",
          marginBottom: "2rem"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
          <h1 style={{ 
            color: "#166534", 
            marginBottom: "1rem",
            fontSize: "2rem"
          }}>
            Order Placed Successfully!
          </h1>
          <p style={{ 
            color: "#15803d", 
            fontSize: "1.1rem",
            marginBottom: "1rem"
          }}>
            Thank you for your purchase!
          </p>
          {orderId && (
            <p style={{ 
              color: "#15803d", 
              fontSize: "0.9rem",
              marginBottom: "2rem"
            }}>
              Order ID: <strong>{orderId}</strong>
            </p>
          )}
          <div style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <button 
              onClick={() => navigate("/")}
              className="btn btn-primary"
              style={{ padding: "0.75rem 2rem" }}
            >
              🏠 Back to Home
            </button>
            <button 
              onClick={() => navigate("/cart")}
              className="btn"
              style={{ 
                padding: "0.75rem 2rem",
                backgroundColor: "white",
                color: "var(--primary-color)",
                border: "2px solid var(--primary-color)"
              }}
            >
              🛒 View Cart
            </button>
          </div>
        </div>
        
        <div style={{
          backgroundColor: "#fef9e7",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          textAlign: "left"
        }}>
          <h3 style={{ 
            color: "#92400e",
            marginBottom: "1rem",
            fontSize: "1.1rem"
          }}>
            📦 What's Next?
          </h3>
          <ul style={{ 
            color: "#b45309",
            lineHeight: "1.8",
            paddingLeft: "1.5rem"
          }}>
            <li>You will receive an order confirmation email shortly</li>
            <li>The seller will contact you to arrange pickup or delivery</li>
            <li>Check your email for tracking information</li>
          </ul>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>🛒 Your Cart is Empty</h2>
        <p>Please add items to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>💳 Checkout</h1>

      {/* Items List */}
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
                <p style={{ margin: 0, color: "var(--gray-600)" }}>
                  ${(typeof item.price === 'string' ? parseFloat(item.price) : item.price).toFixed(2)}
                </p>
              </div>
            </div>
            <div style={{ fontWeight: "600" }}>
              ${(typeof item.price === 'string' ? parseFloat(item.price) : item.price).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
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
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "1.25rem" }}>
          <span>Total:</span>
          <span>${(typeof total === 'string' ? parseFloat(total) : total).toFixed(2)}</span>
        </div>

        <button onClick={handlePlaceOrder} className="btn btn-primary" style={{ padding: "1rem", fontSize: "1rem" }}>
          ✅ Place Order
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
