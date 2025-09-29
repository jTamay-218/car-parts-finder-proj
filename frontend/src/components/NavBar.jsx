import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav
      style={{
        padding: "1rem",
        background: "#f4f4f4",
        marginBottom: "1rem",
      }}
    >
      <Link to="/" style={{ marginRight: "1rem" }}>
        Home
      </Link>
      <Link to="/login" style={{ marginRight: "1rem" }}>
        Login
      </Link>
    </nav>
  );
}

export default NavBar;
