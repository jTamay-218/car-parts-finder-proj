function PartInfo({ part, onClick }) {
  const getConditionColor = (condition) => {
    switch (condition?.toUpperCase()) {
      case "NEW":
        return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
      case "USED":
        return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
      case "REFURBISHED":
        return { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" };
      default:
        return { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
    }
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const conditionColors = getConditionColor(part.condition);

  return (
    <div
      onClick={onClick}
      className="card"
      style={{
        cursor: "pointer",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Image Section */}
      <div style={{
        height: "200px",
        backgroundColor: "var(--gray-100)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {part.image ? (
          <img 
            src={`http://localhost:3001/${part.image}`}
            alt={part.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
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
          fontSize: "3rem"
        }}>
          🔧
        </div>
        
        {/* Condition Badge */}
        <div style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          backgroundColor: conditionColors.bg,
          color: conditionColors.color,
          border: `1px solid ${conditionColors.border}`,
          padding: "0.25rem 0.75rem",
          borderRadius: "1rem",
          fontSize: "0.75rem",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}>
          {part.condition}
        </div>
      </div>

      {/* Content Section */}
      <div style={{ padding: "1.5rem" }}>
        {/* Part Name */}
        <h3 style={{ 
          margin: "0 0 0.5rem 0", 
          color: "var(--gray-800)", 
          fontSize: "1.125rem",
          fontWeight: "600",
          lineHeight: "1.4"
        }}>
          {part.name}
        </h3>
        
        {/* Car Brand and Model */}
        {part.brand_name && part.model_name && (
          <div style={{ 
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem"
          }}>
            <span style={{ 
              fontSize: "0.875rem", 
              color: "var(--gray-600)",
              fontWeight: "500"
            }}>
              {part.brand_name} {part.model_name}
              {part.production_year && ` (${part.production_year})`}
            </span>
          </div>
        )}
        
        {/* Category */}
        {part.category_name && (
          <div style={{ 
            fontSize: "0.75rem", 
            color: "var(--gray-500)", 
            marginBottom: "1rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontWeight: "500"
          }}>
            {part.category_name}
          </div>
        )}

        {/* Price and Actions */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginTop: "1rem"
        }}>
          <div>
            <div style={{ 
              fontSize: "1.5rem", 
              fontWeight: "700", 
              color: "var(--secondary-color)",
              lineHeight: "1"
            }}>
              {formatPrice(part.price)}
            </div>
            <div style={{
              fontSize: "0.75rem",
              color: "var(--gray-500)",
              marginTop: "0.25rem"
            }}>
              Free shipping
            </div>
          </div>
          
          <button 
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(part);
            }}
            style={{
              fontSize: "0.75rem",
              padding: "0.5rem 1rem"
            }}
          >
            View Details
          </button>
        </div>

        {/* Additional Info */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--gray-200)",
          fontSize: "0.75rem",
          color: "var(--gray-500)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span>⭐</span>
            <span>Verified Seller</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span>🚚</span>
            <span>2-3 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartInfo;