function SortControls({ sortOption, setSortOption }) {
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "condition-new", label: "Condition: New First" },
    { value: "condition-used", label: "Condition: Used First" }
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <label style={{
        fontSize: "0.875rem",
        fontWeight: "600",
        color: "var(--gray-700)",
        whiteSpace: "nowrap"
      }}>
        Sort by:
      </label>
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="form-select"
        style={{
          minWidth: "180px",
          fontSize: "0.875rem"
        }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortControls;