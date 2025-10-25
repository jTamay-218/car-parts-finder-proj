import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems = [], total = 0, clearCart } = useCart();

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return alert("Your cart is empty!");

    try {
      const res = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          items: cartItems,
          total,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Order placed successfully!");
        clearCart();
      } else {
        alert(`❌ Checkout failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong. Please try again.");
    }
  };

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
                    src={`http://localhost:3001/${item.image}`}
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
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
            <div style={{ fontWeight: "600" }}>
              ${item.price.toFixed(2)}
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
          <span>${total.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "1.25rem" }}>
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button onClick={handlePlaceOrder} className="btn btn-primary" style={{ padding: "1rem", fontSize: "1rem" }}>
          ✅ Place Order
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
