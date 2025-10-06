import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import PartsDisplay from "../components/PartsDisplay";
import SortControls from "../components/SortControls";
import FilterControls from "../components/FilterControls";
import PartDetails from "../components/PartDetails";

function HomePage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedPart, setSelectedPart] = useState(null);
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
    condition: ''
  });

  // Fetch parts from API
  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/products');
        const data = await response.json();
        
        if (data.success) {
          setParts(data.data);
        } else {
          setError(data.message || 'Failed to fetch parts');
        }
      } catch (err) {
        setError('Failed to connect to server');
        console.error('Error fetching parts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // filtering parts
  const filteredParts = parts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = !filters.brand || part.brand_name === filters.brand;
    const matchesCategory = !filters.category || part.category_name === filters.category;
    const matchesCondition = !filters.condition || part.condition === filters.condition;
    
    return matchesSearch && matchesBrand && matchesCategory && matchesCondition;
  });

  const sortedParts = (() => {
    if (sortOption === "price-low") {
      return [...filteredParts].sort((a, b) => a.price - b.price);
    } 
    if (sortOption === "price-high") {
      return [...filteredParts].sort((a, b) => b.price - a.price);
    } 
    if (sortOption === "condition-new") {
      return [...filteredParts].sort((a, b) => a.condition.localeCompare(b.condition));
    } 
    if (sortOption === "condition-used") {
      return [...filteredParts].sort((a, b) => b.condition.localeCompare(a.condition));
    }
    return filteredParts;
  })();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
        color: 'white',
        padding: '4rem 0',
        marginBottom: '3rem'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ 
              fontSize: '3.5rem', 
              fontWeight: '800', 
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Find Your Perfect Car Parts
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              marginBottom: '2rem', 
              opacity: 0.9,
              lineHeight: 1.6
            }}>
              Browse thousands of quality car parts from trusted sellers. 
              New, used, and refurbished parts for every make and model.
            </p>
            
            {/* Search Bar in Hero */}
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <SearchBar search={search} setSearch={setSearch} />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div className="card text-center">
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔧</div>
              <h3 style={{ color: 'var(--gray-800)', marginBottom: '0.5rem' }}>
                {parts.length}+ Parts
              </h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                Available Now
              </p>
            </div>
          </div>
          
          <div className="card text-center">
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚗</div>
              <h3 style={{ color: 'var(--gray-800)', marginBottom: '0.5rem' }}>
                50+ Brands
              </h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                All Major Makes
              </p>
            </div>
          </div>
          
          <div className="card text-center">
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
              <h3 style={{ color: 'var(--gray-800)', marginBottom: '0.5rem' }}>
                Trusted
              </h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                Verified Sellers
              </p>
            </div>
          </div>
          
          <div className="card text-center">
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
              <h3 style={{ color: 'var(--gray-800)', marginBottom: '0.5rem' }}>
                Best Prices
              </h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                Guaranteed
              </p>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="card mb-6">
          <div style={{ padding: '2rem' }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap"
            }}>
              <h3 style={{ margin: 0, color: 'var(--gray-800)' }}>
                Browse Parts
              </h3>
              <SortControls sortOption={sortOption} setSortOption={setSortOption} />
            </div>

            {/* Filter Controls */}
            {!loading && !error && parts.length > 0 && (
              <FilterControls 
                parts={parts} 
                onFilterChange={handleFilterChange} 
                filters={filters}
              />
            )}
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="card text-center" style={{ padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
            <h3 style={{ color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
              Loading Parts...
            </h3>
            <p style={{ color: 'var(--gray-500)' }}>
              Fetching the latest inventory for you
            </p>
          </div>
        )}

        {error && (
          <div className="card" style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Connection Error</h3>
            <p style={{ marginBottom: '1.5rem' }}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-danger"
            >
              🔄 Retry Connection
            </button>
          </div>
        )}

        {/* Parts Display */}
        {!loading && !error && (
          <>
            <div style={{ 
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, color: 'var(--gray-800)' }}>
                {sortedParts.length} Part{sortedParts.length !== 1 ? 's' : ''} Found
              </h3>
              {sortedParts.length > 0 && (
                <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                  Showing {sortedParts.length} of {parts.length} total parts
                </p>
              )}
            </div>
            
            <PartsDisplay 
              parts={sortedParts}
              onPartClick={setSelectedPart} 
            />
            
            {sortedParts.length === 0 && !loading && (
              <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3 style={{ color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                  No Parts Found
                </h3>
                <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
                  Try adjusting your search criteria or filters
                </p>
                <button 
                  onClick={() => {
                    setSearch('');
                    setFilters({ brand: '', category: '', condition: '' });
                  }}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
        
        {selectedPart && (
          <PartDetails 
            part={selectedPart} 
            onClose={() => setSelectedPart(null)} 
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;