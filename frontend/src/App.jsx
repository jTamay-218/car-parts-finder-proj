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

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Car Parts Finder</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search parts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "0.5rem", marginBottom: "1rem", width: "300px" }}
      />

      {/* Parts grid */}
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {filteredParts.map(part => (
          <div key={part.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>{part.name}</h3>
            <p>Price: {part.price}</p>
            <p>Condition: {part.condition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
