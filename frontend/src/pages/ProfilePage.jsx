import { useAuth } from "../contexts/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return <div style={{ padding: "2rem" }}>You must be logged in to view your profile.</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>User Type:</strong> {user.type}</p>
      <div style={{ fontSize: "3rem", margin: "1rem 0" }}>{user.avatar}</div>

      <button
        onClick={() => {
          logout();
          window.location.href = "/login";
        }}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#f56565",
          color: "white",
          border: "none",
          borderRadius: "0.25rem",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
}
