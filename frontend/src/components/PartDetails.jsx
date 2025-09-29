function PartDetails({ part, onClose }) {
  if (!part) return null; // making sure to not render if part is not selected

  // placeholder for buying
  const handleBuy = () => {
    alert(`You clicked Buy for: ${part.name}`);
    // calling backend API here
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose} // clicking outside closes modal
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()} // preventing closing when clicking inside
      >
        <h2>{part.name}</h2>
        <p>Price: {part.price}</p>
        <p>Condition: {part.condition}</p>
        <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

        <button 
          onClick={handleBuy} 
          style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          Buy
        </button>

        <button 
          onClick={onClose} 
          style={{ marginTop: "1rem", marginLeft: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PartDetails;
