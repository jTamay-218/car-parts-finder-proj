function PartDetails({ part, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // overlay
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose} // will close when user clicks away
    >
      <div
        style={{
          backgroundColor: "#ffffff", 
          color: "#1f2937",           
          padding: "2rem",
          borderRadius: "12px",
          minWidth: "300px",
          maxWidth: "600px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", 
          transition: "transform 0.2s",
        }}
        onClick={(e) => e.stopPropagation()} // will prevent closing when clicking inside
      >
        <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>{part.name}</h2>
        <p><strong>Price:</strong> <span style={{ color: "#059669" }}>{part.price}</span></p>
        <p>
          <strong>Condition:</strong> 
          <span style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
            marginLeft: "0.5rem",
            backgroundColor: part.condition === "New" ? "#10b98120" : "#f59e0b20",
            color: part.condition === "New" ? "#10b981" : "#f59e0b"
          }}>
            {part.condition}
          </span>
        </p>
        <p><strong>Description:</strong> ... </p>

        <button
          onClick={onClose}
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PartDetails;
