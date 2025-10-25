import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

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
      const res = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          shipping,
          payment,
          items: cartItems,
          total,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Order placed successfully!");
        clearCart();
        navigate("/"); // Redirect to homepage or order confirmation
      } else {
        alert(`Checkout failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

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
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "1rem" }}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
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

export default CheckoutPage;
