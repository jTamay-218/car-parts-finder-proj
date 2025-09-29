function PartInfo({ part, onClick }) {
  const getConditionColor = (condition) => {
    switch (condition) {
      case "New":
        return "#10b981"; // green
      case "Used":
        return "#f59e0b"; // amber
      default:
        return "#6b7280"; // gray
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #e5e7eb",
        padding: "1.5rem",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
      }}
    >
      <h3 style={{ margin: "0 0 1rem 0", color: "#1f2937", fontSize: "18px" }}>
        {part.name}
      </h3>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#059669" }}>
          {part.price}
        </p>
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: getConditionColor(part.condition) + "20",
            color: getConditionColor(part.condition),
          }}
        >
          {part.condition}
        </span>
      </div>
    </div>
  );
}

export default PartInfo;