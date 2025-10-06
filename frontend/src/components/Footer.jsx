// src/components/Footer.jsx
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--gray-50)',
      padding: '2rem',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/contact" style={{ margin: '0 1rem', color: 'var(--primary-color)', textDecoration: 'none' }}>
          Contact
        </Link>
        <Link to="/about" style={{ margin: '0 1rem', color: 'var(--primary-color)', textDecoration: 'none' }}>
          About
        </Link>
      </div>
      <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
        &copy; {new Date().getFullYear()} CarPartsPro. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
