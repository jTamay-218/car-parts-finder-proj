import { useState } from "react";
import SearchBar from "../components/SearchBar";
import PartsDisplay from "../components/PartsDisplay";
import SortControls from "../components/SortControls";
import PartDetails from "../components/PartDetails";

function HomePage() {
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

  const [parts] = useState(tempParts);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedPart, setSelectedPart] = useState(null);

  // filtering parts
  let filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sortOption === "price-low") {
    filteredParts = filteredParts.sort((a, b) => parseInt(a.price.slice(1)) - parseInt(b.price.slice(1)));
  } 
  else if (sortOption === "price-high") {
    filteredParts = filteredParts.sort((a, b) => parseInt(b.price.slice(1)) - parseInt(a.price.slice(1)));
  } 
  else if (sortOption === "condition-new") {
    filteredParts = filteredParts.sort((a, b) => a.condition.localeCompare(b.condition));
  } 
  else if (sortOption === "condition-used") {
    filteredParts = filteredParts.sort((a, b) => b.condition.localeCompare(a.condition));
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#1f2937" }}>
            🔧 Car Parts Finder
        </h1>
        
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
        }}>
            <SearchBar search={search} setSearch={setSearch} />
            <SortControls sortOption={sortOption} setSortOption={setSortOption} />
      </div>

        {/* Parts display info */}
        <PartsDisplay 
        parts={filteredParts}
        onPartClick={setSelectedPart} 
        />
        
        {selectedPart && (
            <PartDetails 
            part={selectedPart} 
            onClose={() => setSelectedPart(null)} 
            />
        )}
    </div>
  );
}

export default HomePage;
