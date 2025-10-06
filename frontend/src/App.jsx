import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import SellPage from "./pages/SellPage";
import ListingsPage from "./pages/ListingsPage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import CartPage from './pages/CartPage';
import Footer from "./components/Footer";
import { CartProvider } from "./contexts/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <NavBar />
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/cart" element={<CartPage />} /> 
            
            {/* Seller-only pages */}
            <Route 
              path="/sell" 
              element={
                <ProtectedRoute requireAuth={true} requireSeller={true}>
                  <SellPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/listings" 
              element={
                <ProtectedRoute requireAuth={true} requireSeller={true}>
                  <ListingsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* User pages (require login but not seller) */}
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>💬 Messages</h2>
                    <p>Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>👤 Profile</h2>
                    <p>Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Footer/>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;