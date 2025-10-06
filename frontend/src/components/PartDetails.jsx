import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

function PartDetails({ part, onClose }) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const getConditionColor = (condition) => {
    switch (condition?.toUpperCase()) {
      case "NEW":
        return { bg: "#dcfce7", color: "#166534" };
      case "USED":
        return { bg: "#fef3c7", color: "#92400e" };
      case "REFURBISHED":
        return { bg: "#dbeafe", color: "#1e40af" };
      default:
        return { bg: "#f3f4f6", color: "#374151" };
    }
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const conditionColors = getConditionColor(part.condition);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: "900px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            color: "var(--gray-600)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            zIndex: 10
          }}
        >
          ✕
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Left Column - Image */}
          <div>
            <div style={{
              height: "400px",
              backgroundColor: "var(--gray-100)",
              borderRadius: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              marginBottom: "1rem"
            }}>
              {part.image ? (
                <img 
                  src={`http://localhost:3001/${part.image}`} 
                  alt={part.name}
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover"
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div style={{
                display: part.image ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: "100%",
                height: "100%",
                backgroundColor: "var(--gray-100)",
                color: "var(--gray-400)",
                fontSize: "4rem"
              }}>
                🔧
              </div>
            </div>

            {/* Thumbnail Images (placeholder for multiple images) */}
            <div style={{
              display: "flex",
              gap: "0.5rem"
            }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "var(--gray-200)",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--gray-400)",
                  fontSize: "1.5rem"
                }}>
                  🔧
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ 
                margin: "0 0 0.5rem 0", 
                color: "var(--gray-800)",
                fontSize: "1.875rem",
                fontWeight: "700"
              }}>
                {part.name}
              </h2>
              
              {/* Car Details */}
              {part.brand_name && part.model_name && (
                <div style={{ 
                  fontSize: "1.125rem", 
                  color: "var(--gray-600)", 
                  marginBottom: "1rem",
                  fontWeight: "500"
                }}>
                  {part.brand_name} {part.model_name} {part.production_year && `(${part.production_year})`}
                </div>
              )}

              {/* Condition Badge */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: conditionColors.bg,
                color: conditionColors.color,
                padding: "0.5rem 1rem",
                borderRadius: "2rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "1.5rem"
              }}>
                <span style={{ marginRight: "0.5rem" }}>✓</span>
                {part.condition}
              </div>
            </div>

            {/* Price Section */}
            <div style={{
              backgroundColor: "var(--gray-50)",
              padding: "1.5rem",
              borderRadius: "1rem",
              marginBottom: "1.5rem"
            }}>
              <div style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "var(--secondary-color)",
                marginBottom: "0.5rem"
              }}>
                {formatPrice(part.price)}
              </div>
              <div style={{
                display: "flex",
                gap: "1rem",
                fontSize: "0.875rem",
                color: "var(--gray-600)"
              }}>
                <span>🚚 Free shipping</span>
                <span>💳 Secure payment</span>
                <span>🔄 30-day returns</span>
              </div>
            </div>

            {/* Key Features */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ 
                margin: "0 0 1rem 0", 
                color: "var(--gray-800)",
                fontSize: "1.125rem",
                fontWeight: "600"
              }}>
                Key Features
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
                fontSize: "0.875rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>✓</span>
                  <span>OEM Quality</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>✓</span>
                  <span>Warranty Included</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>✓</span>
                  <span>Fast Shipping</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>✓</span>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>

            {/* Category */}
            {part.category_name && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ 
                  margin: "0 0 0.5rem 0", 
                  color: "var(--gray-800)",
                  fontSize: "1rem",
                  fontWeight: "600"
                }}>
                  Category
                </h4>
                <div style={{
                  display: "inline-block",
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "1rem",
                  fontSize: "0.875rem",
                  fontWeight: "500"
                }}>
                  {part.category_name}
                </div>
              </div>
            )}

            {/* Description */}
            {part.description && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ 
                  margin: "0 0 0.5rem 0", 
                  color: "var(--gray-800)",
                  fontSize: "1rem",
                  fontWeight: "600"
                }}>
                  Description
                </h4>
                <p style={{ 
                  color: "var(--gray-600)", 
                  lineHeight: "1.6",
                  margin: 0
                }}>
                  {part.description}
                </p>
              </div>
            )}

            {/* Seller Info */}
            <div style={{
              backgroundColor: "var(--gray-50)",
              padding: "1rem",
              borderRadius: "0.75rem",
              marginBottom: "1.5rem"
            }}>
              <h4 style={{ 
                margin: "0 0 0.5rem 0", 
                color: "var(--gray-800)",
                fontSize: "0.875rem",
                fontWeight: "600"
              }}>
                Seller Information
              </h4>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "var(--primary-color)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "600"
                }}>
                  JS
                </div>
                <div>
                  <div style={{ fontWeight: "600", color: "var(--gray-800)" }}>
                    John's Auto Parts
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
                    ⭐ 4.9 (127 reviews) • Verified Seller
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => {
                  alert('Contact seller functionality would open here!');
                }}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                💬 Contact Seller
              </button>
              <button
                onClick={() => {
                  addToCart(part);
                  alert(`${part.name} added to cart!`);
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartDetails;