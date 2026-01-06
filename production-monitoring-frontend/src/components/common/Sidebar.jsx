import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.sidebar}>
      {/* -------- BRAND -------- */}
      <div style={styles.brand}>
        <h2 style={styles.brandTitle}>Factory Monitor</h2>
        <p style={styles.brandSub}>Production Control</p>
      </div>

      {/* -------- PROFILE -------- */}
      <div style={styles.profile}>
        <div style={styles.avatar}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={styles.username}>{user.username}</div>
          <div style={styles.role}>{user.role}</div>
        </div>
      </div>

      {/* -------- MENU -------- */}
      <nav style={styles.menu}>
        <Link style={linkStyle(isActive("/"))} to="/">
          Dashboard
        </Link>

        {user.role === "OPERATOR" && (
          <Link
            style={linkStyle(isActive("/assigned-batches"))}
            to="/assigned-batches"
          >
            Assigned Batches
          </Link>
        )}

        {(user.role === "ADMIN" || user.role === "SUPERVISOR") && (
          <Link style={linkStyle(isActive("/machines"))} to="/machines">
            Machines
          </Link>
        )}

        {(user.role === "ADMIN" || user.role === "SUPERVISOR") && (
          <Link style={linkStyle(isActive("/batches"))} to="/batches">
            Batches
          </Link>
        )}

        {(user.role === "ADMIN" || user.role === "SUPERVISOR") && (
          <Link style={linkStyle(isActive("/materials"))} to="/materials">
            Materials
          </Link>
        )}

        {(user.role === "ADMIN" || user.role === "SUPERVISOR") && (
          <Link style={linkStyle(isActive("/reports"))} to="/reports">
            Reports
          </Link>
        )}

        {user.role === "ADMIN" && (
          <Link style={linkStyle(isActive("/suppliers"))} to="/suppliers">
            Suppliers
          </Link>
        )}

        {user.role === "ADMIN" && (
          <Link style={linkStyle(isActive("/users"))} to="/users">
            Users
          </Link>
        )}

        {user.role === "ADMIN" && (
          <Link style={linkStyle(isActive("/alerts"))} to="/alerts">
            Alerts
          </Link>
        )}
      </nav>

      {/* -------- LOGOUT -------- */}
      <div style={styles.logout}>
        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  sidebar: {
    width: "260px",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    background: "linear-gradient(180deg, #020617, #0f172a)",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxSizing: "border-box",
    boxShadow: "4px 0 20px rgba(0,0,0,0.25)",
    overflow: "hidden", // ✅ prevents outer scrollbar
  },

  /* BRAND */
  brand: {
    marginBottom: "24px",
  },
  brandTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  brandSub: {
    marginTop: "4px",
    fontSize: "12px",
    color: "#94a3b8",
  },

  /* PROFILE */
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    background: "#1e293b",
    borderRadius: "10px",
    marginBottom: "24px",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "18px",
  },
  username: {
    fontWeight: "600",
    fontSize: "14px",
  },
  role: {
    fontSize: "12px",
    color: "#c7d2fe",
  },

  /* MENU */
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
    overflowY: "auto",

    /* ✅ HIDE SCROLLBAR (but keep scroll) */
    scrollbarWidth: "none",       // Firefox
    msOverflowStyle: "none",      // IE/Edge
  },

  /* LOGOUT */
  logout: {
    borderTop: "1px solid #1e293b",
    paddingTop: "16px",
  },
  logoutBtn: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
};

/* ✅ Hide scrollbar for Chrome / Safari */
const linkStyle = (active) => ({
  padding: "10px 14px",
  borderRadius: "8px",
  color: "#e5e7eb",
  textDecoration: "none",
  fontSize: "14px",
  background: active
    ? "linear-gradient(135deg, #2563eb, #4f46e5)"
    : "transparent",
  fontWeight: active ? "600" : "500",
});

export default Sidebar;
