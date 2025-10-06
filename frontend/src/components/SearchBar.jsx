function SearchBar({ search, setSearch }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        placeholder="Search parts by name, brand, or model..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-input"
        style={{
          paddingLeft: "3rem",
          fontSize: "1rem",
          height: "3rem",
          borderRadius: "2rem",
          border: "2px solid var(--gray-200)",
          backgroundColor: "white",
          boxShadow: "var(--shadow-sm)"
        }}
      />
      <div style={{
        position: "absolute",
        left: "1rem",
        top: "50%",
        transform: "translateY(-50%)",
        color: "var(--gray-400)",
        fontSize: "1.25rem"
      }}>
        🔍
      </div>
      {search && (
        <button
          onClick={() => setSearch("")}
          style={{
            position: "absolute",
            right: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "var(--gray-400)",
            cursor: "pointer",
            fontSize: "1.25rem"
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;