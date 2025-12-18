import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, requireAuth = true, requireSeller = false }) {
  const { isLoggedIn, isSeller, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--gray-50)'
      }}>
        <div className="card text-center" style={{ padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
          <p style={{ color: 'var(--gray-600)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  // Check seller requirement
  if (requireSeller && !isSeller()) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--gray-50)'
      }}>
        <div className="card text-center" style={{ padding: '3rem', maxWidth: '500px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
          <h2 style={{ color: 'var(--gray-800)', marginBottom: '1rem' }}>
            Access Denied
          </h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
            This page is only accessible to sellers. You need to be logged in as a seller to access this feature.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/login'}
            >
              🔑 Sign In as Seller
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => window.location.href = '/'}
            >
              🏠 Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;



