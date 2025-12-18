import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout, isSeller, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!user) return <div style={{ padding: "2rem" }}>You must be logged in to view your profile.</div>;

  const fullName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.username || user.email?.split('@')[0] || 'User';

  const userType = user.role 
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : 'Buyer';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ 
      padding: "2rem", 
      maxWidth: "600px", 
      margin: "0 auto",
      minHeight: '100vh',
      backgroundColor: 'var(--gray-50)'
    }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            margin: '0 auto 1rem',
            fontWeight: '600'
          }}>
            {user.firstName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <h2 style={{ margin: '0.5rem 0', color: 'var(--gray-800)' }}>Profile</h2>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <strong style={{ color: 'var(--gray-700)', display: 'block', marginBottom: '0.25rem' }}>
              Name:
            </strong>
            <span style={{ color: 'var(--gray-800)' }}>{fullName}</span>
          </div>

          <div>
            <strong style={{ color: 'var(--gray-700)', display: 'block', marginBottom: '0.25rem' }}>
              Email:
            </strong>
            <span style={{ color: 'var(--gray-800)' }}>{user.email}</span>
          </div>

          <div>
            <strong style={{ color: 'var(--gray-700)', display: 'block', marginBottom: '0.25rem' }}>
              Username:
            </strong>
            <span style={{ color: 'var(--gray-800)' }}>@{user.username || 'N/A'}</span>
          </div>

          <div>
            <strong style={{ color: 'var(--gray-700)', display: 'block', marginBottom: '0.25rem' }}>
              User Type:
            </strong>
            <span style={{ 
              color: 'var(--gray-800)',
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              backgroundColor: isAdmin() ? '#dc2626' : isSeller() ? '#059669' : '#2563eb',
              color: 'white',
              borderRadius: '1rem',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {isAdmin() ? '👑 Admin' : isSeller() ? '💰 Seller' : '🛒 Buyer'}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-danger"
          style={{
            width: '100%',
            marginTop: '1rem'
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
