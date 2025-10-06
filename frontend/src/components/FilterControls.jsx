function FilterControls({ parts, onFilterChange, filters }) {
  // Extract unique brands and categories from parts
  const brands = [...new Set(parts.map(part => part.brand_name).filter(Boolean))];
  const categories = [...new Set(parts.map(part => part.category_name).filter(Boolean))];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      alignItems: "end"
    }}>
      {/* Brand Filter */}
      {brands.length > 0 && (
        <div>
          <label style={{ 
            display: "block", 
            fontSize: "14px", 
            fontWeight: "600", 
            color: "#374151",
            marginBottom: "0.25rem"
          }}>
            Brand:
          </label>
          <select
            value={filters.brand || ""}
            onChange={(e) => onFilterChange('brand', e.target.value)}
            className="form-select"
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div>
          <label style={{ 
            display: "block", 
            fontSize: "14px", 
            fontWeight: "600", 
            color: "#374151",
            marginBottom: "0.25rem"
          }}>
            Category:
          </label>
          <select
            value={filters.category || ""}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="form-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      )}

      {/* Condition Filter */}
      <div>
        <label style={{ 
          display: "block", 
          fontSize: "14px", 
          fontWeight: "600", 
          color: "#374151",
          marginBottom: "0.25rem"
        }}>
          Condition:
        </label>
        <select
          value={filters.condition || ""}
          onChange={(e) => onFilterChange('condition', e.target.value)}
          className="form-select"
        >
          <option value="">All Conditions</option>
          <option value="NEW">New</option>
          <option value="USED">Used</option>
        </select>
      </div>

      {/* Clear Filters */}
      {(filters.brand || filters.category || filters.condition) && (
        <div>
          <button
            onClick={() => {
              onFilterChange('brand', '');
              onFilterChange('category', '');
              onFilterChange('condition', '');
            }}
            className="btn btn-danger btn-sm"
            style={{ width: '100%' }}
          >
            🗑️ Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterControls;
