import { useState, useEffect } from "react";

function App() {
  // display temporary parts info for now
  const tempParts = [
    { id: 1, name: "Honda Civic Brake Pads", price: "$40", condition: "Used" },
    { id: 2, name: "Toyota Corolla Alternator", price: "$90", condition: "New" },
    { id: 3, name: "Ford F-150 Headlight", price: "$60", condition: "Used" },
    { id: 4, name: "Chevrolet Malibu Radiator", price: "$120", condition: "New" },
    { id: 5, name: "Nissan Altima Spark Plugs", price: "$35", condition: "New" },
    { id: 6, name: "Honda Accord Battery", price: "$80", condition: "Used" },
    { id: 7, name: "Toyota Camry Windshield", price: "$150", condition: "New" },
    { id: 8, name: "Ford Mustang Brake Rotors", price: "$70", condition: "Used" },
    { id: 9, name: "Chevrolet Silverado Tail Light", price: "$55", condition: "Used" },
    { id: 10, name: "BMW 3 Series Side Mirror", price: "$90", condition: "New" },
  ];

  const [parts, setParts] = useState(tempParts);
  const [search, setSearch] = useState("");

  // filtering parts by search term
  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(search.toLowerCase())
  );

  // Get condition color for better visual distinction
  const getConditionColor = (condition) => {
    switch (condition) {
      case "New": return "#10b981"; // green
      case "Used": return "#f59e0b"; // amber
      default: return "#6b7280"; // gray
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#1f2937" }}>
        🔧 Car Parts Finder
      </h1>

      {/* Search bar */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Search parts by name, brand, or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            padding: "0.75rem 1rem", 
            width: "400px", 
            borderRadius: "8px", 
            border: "2px solid #e5e7eb",
            fontSize: "16px",
            outline: "none",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
          onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
        />
        {search && (
          <p style={{ marginTop: "0.5rem", color: "#6b7280", fontSize: "14px" }}>
            Showing {filteredParts.length} result{filteredParts.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Parts grid */}
      <div style={{ 
        display: "grid", 
        gap: "1.5rem", 
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" 
      }}>
        {filteredParts.map(part => (
          <div 
            key={part.id} 
            style={{ 
              border: "1px solid #e5e7eb", 
              padding: "1.5rem", 
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer"
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
              <p style={{ margin: "0", fontSize: "20px", fontWeight: "bold", color: "#059669" }}>
                {part.price}
              </p>
              <span 
                style={{ 
                  padding: "0.25rem 0.75rem", 
                  borderRadius: "20px", 
                  fontSize: "12px", 
                  fontWeight: "600",
                  backgroundColor: getConditionColor(part.condition) + "20",
                  color: getConditionColor(part.condition)
                }}
              >
                {part.condition}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredParts.length === 0 && search && (
        <div style={{ textAlign: "center", marginTop: "3rem", color: "#6b7280" }}>
          <p>No parts found matching "{search}"</p>
          <p style={{ fontSize: "14px" }}>Try searching for a different term</p>
        </div>
      )}
    </div>
  );
}

export default App;
