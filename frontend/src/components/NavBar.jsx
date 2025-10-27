import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from '../contexts/CartContext';

function NavBar() {
  const location = useLocation();
  const { user, logout, isSeller, isLoggedIn } = useAuth();
  const { cartItems } = useCart();
  
  // Base navigation items for all users
  const baseNavItems = [
    { label: 'Browse Parts', path: '/', icon: '🔍' }
  ];

  // Seller-specific navigation items
  const sellerNavItems = [
    { label: 'Sell Parts', path: '/sell', icon: '💰' },
    { label: 'My Listings', path: '/listings', icon: '📋' }
  ];

  // User-specific navigation items
  const userNavItems = [
    { label: 'Messages', path: '/messages', icon: '💬' },
    { label: 'Profile', path: '/profile', icon: '👤' }
  ];

  // Combine navigation items based on user role
  const navItems = [
    ...baseNavItems,
    ...(isSeller() ? sellerNavItems : []),
    ...(isLoggedIn() ? userNavItems : [])
  ];

  return (
    <nav style={{
      backgroundColor: 'white',
      padding: '1rem 0',
      marginBottom: '2rem',
      boxShadow: 'var(--shadow-md)',
      borderBottom: '1px solid var(--gray-200)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link to="/" style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--primary-color)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              🔧
            </div>
            <div>
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.5rem', 
                fontWeight: '700',
                color: 'var(--gray-800)'
              }}>
                CarParts Pro
              </h2>
              <p style={{ 
                margin: 0, 
                fontSize: '0.75rem', 
                color: 'var(--gray-500)',
                fontWeight: '500'
              }}>
                Find • Sell • Connect
              </p>
            </div>
          </Link>

          {/* Navigation Items */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`btn ${location.pathname === item.path ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  minWidth: 'auto',
                  textDecoration: 'none'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            {/* Cart */}
                <Link to="/cart" className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>
                  🛒 {cartItems.length} items
                </Link>
            {isLoggedIn() && user ? (
              <>
                <button className="btn btn-secondary btn-sm">
                  🔔 Notifications
                </button>

                {/* User Dropdown */}
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <button 
                    className="btn btn-outline btn-sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>{user?.avatar}</span>
                    <span>{user?.name}</span>
                    <span>▼</span>
                  </button>
                  
                  {/* Simple dropdown menu */}
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '0.5rem',
                    backgroundColor: 'white',
                    border: '1px solid var(--gray-200)',
                    borderRadius: '0.5rem',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '200px',
                    zIndex: 1000
                  }}>
                    <div style={{ padding: '0.5rem' }}>
                      <div style={{ 
                        padding: '0.5rem', 
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--gray-800)',
                        borderBottom: '1px solid var(--gray-200)',
                        marginBottom: '0.5rem'
                      }}>
                        {user?.name}
                      </div>
                      <div style={{ 
                        padding: '0.5rem', 
                        fontSize: '0.75rem',
                        color: 'var(--gray-500)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {user?.type}
                      </div>
                      <button
                        onClick={logout}
                        className="btn btn-danger btn-sm"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>
                  🔑 Sign In
                </Link>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => alert('Registration coming soon!')}
                >
                  📝 Sign Up
                </button>
              </>
            )}
            
            {/* Only show "List Your Part" for sellers */}
            {isSeller() && (
              <Link to="/sell" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                🚀 List Your Part
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;