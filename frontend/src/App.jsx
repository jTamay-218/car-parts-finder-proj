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

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          
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
      </Router>
    </AuthProvider>
  );
}

export default App;