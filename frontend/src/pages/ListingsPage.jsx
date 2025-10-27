import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import EditListingModal from "../components/EditListingModal";

function ListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingListing, setEditingListing] = useState(null);

  // Fetch real data from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // For now, use a default user ID. In production, this would come from auth
        const response = await fetch('http://localhost:3001/api/my-listings');
        const data = await response.json();
        
        if (data.success) {
          setListings(data.data);
        } else {
          console.error('Failed to fetch listings:', data.message);
          // Fallback to mock data if API fails
          setListings([]);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        // Fallback to empty array
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
  }, []);

  const filteredListings = listings.filter(listing => {
    // Normalize status for filtering (backend converts to lowercase)
    const status = listing.status?.toLowerCase();
    
    if (filter === 'all') {
      // In 'all' view, show AVAILABLE/active listings
      return status === 'available' || status === 'active';
    }
    // Map frontend filter to actual status values
    return status === filter;
  });

  const handleEdit = (listing) => {
    setEditingListing(listing);
  };

  const handleCloseEdit = () => {
    setEditingListing(null);
  };

  const handleUpdateListing = async () => {
    // Refresh listings after update
    try {
      const response = await fetch('http://localhost:3001/api/my-listings');
      const data = await response.json();
      
      if (data.success) {
        setListings(data.data);
      }
    } catch (error) {
      console.error('Error refreshing listings:', error);
    }
  };

  const handleDeactivate = async (listingId) => {
    if (!window.confirm('Are you sure you want to deactivate this listing?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/my-listings/${listingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'SOLD' })
      });

      const data = await response.json();

      if (data.success) {
        // Update the local state - set status to SOLD (which backend returns)
        setListings(listings.map(listing => 
          listing.id === listingId 
            ? { ...listing, status: 'SOLD' }
            : listing
        ));
        alert('Listing deactivated successfully');
      } else {
        alert('Failed to deactivate listing: ' + data.message);
      }
    } catch (error) {
      console.error('Error deactivating listing:', error);
      alert('Error deactivating listing');
    }
  };

  const getStatusColor = (status) => {
    // Handle both lowercase and uppercase statuses
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'active':
      case 'available': 
        return { bg: '#dcfce7', color: '#166534', text: 'Active' };
      case 'sold': 
        return { bg: '#dbeafe', color: '#1e40af', text: 'Sold' };
      case 'pending': 
        return { bg: '#fef3c7', color: '#92400e', text: 'Pending' };
      case 'inactive':
        return { bg: '#fee2e2', color: '#991b1b', text: 'Inactive' };
      default: 
        return { bg: '#f3f4f6', color: '#374151', text: status?.toUpperCase() || 'Unknown' };
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'NEW': return { bg: '#dcfce7', color: '#166534' };
      case 'USED': return { bg: '#fef3c7', color: '#92400e' };
      case 'REFURBISHED': return { bg: '#dbeafe', color: '#1e40af' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div>
                <h1 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700', 
                  color: 'var(--gray-800)',
                  margin: 0
                }}>
                  📋 My Listings
                </h1>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  <span>{user?.avatar}</span>
                  <span style={{ color: 'var(--gray-600)' }}>{user?.name}</span>
                  <span style={{
                    backgroundColor: 'var(--secondary-color)',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    SELLER
                  </span>
                </div>
                <p style={{ 
                  fontSize: '1.125rem', 
                  color: 'var(--gray-600)',
                  margin: '0.5rem 0 0 0'
                }}>
                  Manage your car parts listings and track their performance
                </p>
              </div>
            </div>
            <button className="btn btn-primary btn-lg">
              💰 List New Part
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div className="card text-center">
              <div style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                <h3 style={{ color: 'var(--gray-800)', marginBottom: '0.25rem' }}>
                  {listings.length}
                </h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', margin: 0 }}>
                  Total Listings
                </p>
              </div>
            </div>
            
            <div className="card text-center">
              <div style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👁️</div>
                <h3 style={{ color: 'var(--gray-800)', marginBottom: '0.25rem' }}>
                  {listings.reduce((sum, listing) => sum + listing.views, 0)}
                </h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', margin: 0 }}>
                  Total Views
                </p>
              </div>
            </div>
            
            <div className="card text-center">
              <div style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                <h3 style={{ color: 'var(--gray-800)', marginBottom: '0.25rem' }}>
                  {listings.reduce((sum, listing) => sum + listing.inquiries, 0)}
                </h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', margin: 0 }}>
                  Total Inquiries
                </p>
              </div>
            </div>
            
            <div className="card text-center">
              <div style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                <h3 style={{ color: 'var(--gray-800)', marginBottom: '0.25rem' }}>
                  ${listings.filter(l => l.status === 'sold').reduce((sum, listing) => {
                    const price = typeof listing.price === 'string' ? parseFloat(listing.price) : listing.price;
                    return sum + price;
                  }, 0).toFixed(2)}
                </h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', margin: 0 }}>
                  Total Sales
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: 'var(--gray-700)'
              }}>
                Filter by status:
              </span>
              {['all', 'active', 'sold', 'pending'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-outline'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="card text-center" style={{ padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
            <h3 style={{ color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
              Loading your listings...
            </h3>
          </div>
        )}

        {/* Listings */}
        {!loading && (
          <div style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
          }}>
            {filteredListings.map(listing => {
              const statusColors = getStatusColor(listing.status);
              const conditionColors = getConditionColor(listing.condition);
              
              return (
                <div key={listing.id} className="card">
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          margin: '0 0 0.5rem 0', 
                          color: 'var(--gray-800)',
                          fontSize: '1.125rem',
                          fontWeight: '600'
                        }}>
                          {listing.name}
                        </h3>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary-color)' }}>
                          ${(typeof listing.price === 'string' ? parseFloat(listing.price) : listing.price).toFixed(2)}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{
                          backgroundColor: statusColors.bg,
                          color: statusColors.color,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {statusColors.text}
                        </div>
                        
                        <div style={{
                          backgroundColor: conditionColors.bg,
                          color: conditionColors.color,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {listing.condition}
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '1rem',
                      marginBottom: '1rem',
                      padding: '1rem',
                      backgroundColor: 'var(--gray-50)',
                      borderRadius: '0.75rem'
                    }}>
                      <div className="text-center">
                        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--gray-800)' }}>
                          {listing.views}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                          Views
                        </div>
                      </div>
                      <div className="text-center">
                        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--gray-800)' }}>
                          {listing.inquiries}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                          Inquiries
                        </div>
                      </div>
                      <div className="text-center">
                        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--gray-800)' }}>
                          {Math.round((listing.inquiries / listing.views) * 100)}%
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                          Interest
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(listing)}>
                        ✏️ Edit
                      </button>
                      <button className="btn btn-outline btn-sm">
                        📊 Analytics
                      </button>
                      <button className="btn btn-outline btn-sm">
                        💬 Messages
                      </button>
                      {(listing.status === 'active' || listing.status === 'AVAILABLE' || listing.status === 'Available') && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeactivate(listing.id)}>
                          🛑 Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredListings.length === 0 && (
          <div className="card text-center" style={{ padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
              No listings found
            </h3>
            <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
              {filter === 'all' 
                ? "You haven't listed any parts yet. Start selling today!" 
                : `No ${filter} listings found.`
              }
            </p>
            <button className="btn btn-primary">
              💰 List Your First Part
            </button>
          </div>
        )}

        {/* Edit Modal */}
        {editingListing && (
          <EditListingModal
            listing={editingListing}
            onClose={handleCloseEdit}
            onUpdate={handleUpdateListing}
          />
        )}
      </div>
    </div>
  );
}

export default ListingsPage;
