function SearchBar({ search, setSearch, resultCount }) {
  return (
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
          Showing {resultCount} result{resultCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

export default SearchBar;
