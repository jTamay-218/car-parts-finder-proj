function SearchBar({ search, setSearch }) {
    return (
    <input
        type="text"
        placeholder="Search parts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "0.5rem", marginBottom: "1rem", width: "300px" }}
    />
  );
}

export default SearchBar;
