import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Homepage with parts + search */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;