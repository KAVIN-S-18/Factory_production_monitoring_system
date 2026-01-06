import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /* =====================================================
     HANDLE LOGIN (ASYNC FIX)
     ===================================================== */
  const handleLogin = async () => {
    if (!username || !password) {
      alert("All fields required");
      return;
    }

    const success = await login(username, password);

    if (!success) {
      alert("Invalid username or password");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ---------- LEFT PANEL ---------- */}
        <div style={styles.leftPanel}>
          <h2 style={styles.welcomeTitle}>Welcome Back</h2>
          <p style={styles.welcomeSub}>
            Sign in to monitor production, machines, and operations
          </p>

          <div style={styles.circleLg} />
          <div style={styles.circleSm} />
        </div>

        {/* ---------- RIGHT PANEL ---------- */}
        <div style={styles.rightPanel}>
          <p style={styles.greeting}>Hello 👋</p>
          <h3 style={styles.loginTitle}>Login Your Account</h3>

          {/* USERNAME */}
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* PASSWORD */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* BUTTON */}
          <button onClick={handleLogin} style={styles.loginBtn}>
            SIGN IN
          </button>

          <p style={styles.footer}>
            Authorized factory personnel only
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
  },

  card: {
    width: "900px",
    height: "520px",
    background: "#ffffff",
    borderRadius: "18px",
    display: "flex",
    overflow: "hidden",
    boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
  },

  /* ---------- LEFT ---------- */
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    color: "#ffffff",
    padding: "48px",
    position: "relative",
  },
  welcomeTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  welcomeSub: {
    fontSize: "15px",
    lineHeight: "1.6",
    maxWidth: "260px",
    opacity: 0.9,
  },
  circleLg: {
    position: "absolute",
    bottom: "-60px",
    left: "-40px",
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
  },
  circleSm: {
    position: "absolute",
    top: "40px",
    right: "40px",
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.18)",
  },

  /* ---------- RIGHT ---------- */
  rightPanel: {
    flex: 1,
    padding: "48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  greeting: {
    color: "#8b5cf6",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "4px",
  },
  loginTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "24px",
  },
  field: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderBottom: "2px solid #c7d2fe",
    fontSize: "14px",
    outline: "none",
  },
  loginBtn: {
    marginTop: "20px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "1px",
  },
  footer: {
    marginTop: "18px",
    fontSize: "12px",
    color: "#94a3b8",
  },
};

export default Login;
