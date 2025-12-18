import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API_BASE_URL from '../config/api';

function AdminListingsPage() {
  const { user, isAdmin } = useAuth();
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, available, sold

  const getAuthToken = () => {
    return localStorage.getItem('token') || (user && user.token);
  };

  useEffect(() => {
    if (!isAdmin()) {
      return;
    }

    const fetchAllListings = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        
        const response = await fetch(`${API_BASE_URL}/api/admin/listings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAllListings(data.data);
          }
        } else {
          // Fallback: fetch from regular products endpoint
          const fallbackResponse = await fetch(`${API_BASE_URL}/api/products`);
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.success) {
              setAllListings(fallbackData.data);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllListings();
  }, [isAdmin]);

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/listings/${listingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh listings
        const updatedListings = allListings.map(listing =>
          listing.id === listingId ? { ...listing, status: newStatus } : listing
        );
        setAllListings(updatedListings);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update listing status');
    }
  };

  const handleDelete = async (listingId) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setAllListings(allListings.filter(listing => listing.id !== listingId));
        alert('Listing deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  if (!isAdmin()) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You must be an administrator to access this page.</p>
      </div>
    );
  }

  const filteredListings = filter === 'all' 
    ? allListings 
    : allListings.filter(listing => listing.status === filter.toUpperCase());

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 style={{ margin: 0 }}>👑 Admin - Manage Listings</h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('all')}
              >
                All ({allListings.length})
              </button>
              <button
                className={`btn ${filter === 'available' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('available')}
              >
                Available ({allListings.filter(l => l.status === 'AVAILABLE').length})
              </button>
              <button
                className={`btn ${filter === 'sold' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('sold')}
              >
                Sold ({allListings.filter(l => l.status === 'SOLD').length})
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading listings...
            </div>
          ) : filteredListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>
              No listings found.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Product</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Price</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Seller</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '600' }}>{listing.name}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                          {listing.brand_name} {listing.model_name}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>${parseFloat(listing.price).toFixed(2)}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.875rem',
                          backgroundColor: listing.status === 'AVAILABLE' ? '#dcfce7' : '#fee2e2',
                          color: listing.status === 'AVAILABLE' ? '#166534' : '#dc2626'
                        }}>
                          {listing.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {listing.seller?.username || 'Unknown'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <select
                            value={listing.status}
                            onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              border: '1px solid var(--gray-300)',
                              fontSize: '0.875rem'
                            }}
                          >
                            <option value="AVAILABLE">Available</option>
                            <option value="SOLD">Sold</option>
                            <option value="REMOVED">Removed</option>
                          </select>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(listing.id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminListingsPage;

