function SortControls({ sortOption, setSortOption }) {
  return (
    <select
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
      style={{ marginBottom: "1rem", padding: "0.5rem" }}
    >
      <option value="">Sort By</option>
      <option value="price-low">Price: Low → High</option>
      <option value="price-high">Price: High → Low</option>
      <option value="condition-new">Condition: New First</option>
      <option value="condition-used">Condition: Used First</option>
    </select>
  );
}

export default SortControls;
