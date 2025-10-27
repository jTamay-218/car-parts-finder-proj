import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function OrderPage() {
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Shipping information state
  const [shipping, setShipping] = useState({
    nameF: "",
    nameL: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  // Payment method state
  const [payment, setPayment] = useState({
    method: "card",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return alert("Your cart is empty");
    if (!shipping.nameF || !shipping.nameL || !shipping.address1 || !shipping.city || !shipping.zip || !shipping.phone) {
      return alert("Please fill all shipping information");
    }

    try {
      const res = await fetch("http://localhost:3001/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          shipping,
          payment,
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
        alert(`Checkout failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
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

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>🛒 Your Cart is Empty</h2>
        <p>
          <a href="/" style={{ color: "var(--primary-color)" }}>Browse Parts</a> to add items to your cart.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>💳 Checkout</h1>

      {/* Shipping Section */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem", color: "var(--gray-700)" }}>Shipping Information</h2>
        <div style={{ display: "grid", gap: "1rem" }}>
          <input 
            type="text" 
            placeholder="First Name" 
            value={shipping.nameF} 
            onChange={e => setShipping({ ...shipping, nameF: e.target.value })}
            className="form-input"
          />
          <input 
            type="text" 
            placeholder="Last Name" 
            value={shipping.nameL} 
            onChange={e => setShipping({ ...shipping, nameL: e.target.value })}
            className="form-input"
          />
          <input 
            type="text" 
            placeholder="Address Line 1" 
            value={shipping.address1} 
            onChange={e => setShipping({ ...shipping, address1: e.target.value })}
            className="form-input"
          />
          <input 
            type="text" 
            placeholder="Address Line 2" 
            value={shipping.address2} 
            onChange={e => setShipping({ ...shipping, address2: e.target.value })}
            className="form-input"
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <input 
              type="text" 
              placeholder="City" 
              value={shipping.city} 
              onChange={e => setShipping({ ...shipping, city: e.target.value })}
              className="form-input"
            />
            <input 
              type="text" 
              placeholder="State" 
              value={shipping.state} 
              onChange={e => setShipping({ ...shipping, state: e.target.value })}
              className="form-input"
            />
            <input 
              type="text" 
              placeholder="ZIP" 
              value={shipping.zip} 
              onChange={e => setShipping({ ...shipping, zip: e.target.value })}
              className="form-input"
            />
          </div>
          <input 
            type="text" 
            placeholder="Phone Number" 
            value={shipping.phone} 
            onChange={e => setShipping({ ...shipping, phone: e.target.value })}
            className="form-input"
          />
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem", color: "var(--gray-700)" }}>Order Summary</h2>
        <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1rem" }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{item.name} x1</span>
              <span>${(typeof item.price === 'string' ? parseFloat(item.price) : item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "1rem" }}>
          <span>Total</span>
          <span>${(typeof total === 'string' ? parseFloat(total) : total).toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Section */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem", color: "var(--gray-700)" }}>Payment Method</h2>
        <select 
          value={payment.method} 
          onChange={e => setPayment({ ...payment, method: e.target.value })}
          className="form-input"
          style={{ marginBottom: "1rem" }}
        >
          <option value="card">Credit/Debit Card</option>
          <option value="paypal">PayPal</option>
        </select>
        {payment.method === "card" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <input 
              type="text" 
              placeholder="Card Number" 
              value={payment.cardNumber} 
              onChange={e => setPayment({ ...payment, cardNumber: e.target.value })}
              className="form-input"
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input 
                type="text" 
                placeholder="Expiry (MM/YY)" 
                value={payment.expiry} 
                onChange={e => setPayment({ ...payment, expiry: e.target.value })}
                className="form-input"
              />
              <input 
                type="text" 
                placeholder="CVV" 
                value={payment.cvv} 
                onChange={e => setPayment({ ...payment, cvv: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={handlePlaceOrder} 
        className="btn btn-primary"
        style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
      >
        ✅ Place Order
      </button>
    </div>
  );
}

export default OrderPage;
