import { useState } from "react";
import { useUsers } from "../context/UserContext";
import { useLoginLogs } from "../context/LoginLogContext";

const PAGE_SIZE = 5;

function Users() {
  const { users, addUser, deleteUser, updatePassword } = useUsers();
  const { loginLogs } = useLoginLogs();

  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  /* ---------- USER PAGINATION ---------- */
  const [userPage, setUserPage] = useState(0);

  /* ---------- LOGIN LOG PAGINATION ---------- */
  const [logPage, setLogPage] = useState(0);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("OPERATOR");

  /* ---------- USERS PAGINATION LOGIC ---------- */
  const userStart = userPage * PAGE_SIZE;
  const pagedUsers = users.slice(userStart, userStart + PAGE_SIZE);
  const userHasNext = userStart + PAGE_SIZE < users.length;
  const userHasPrev = userPage > 0;

  /* ---------- LOGIN LOGS PAGINATION LOGIC ---------- */
  const logStart = logPage * PAGE_SIZE;
  const pagedLogs = loginLogs.slice(logStart, logStart + PAGE_SIZE);
  const logHasNext = logStart + PAGE_SIZE < loginLogs.length;
  const logHasPrev = logPage > 0;

  const openAddUser = () => {
    setUsername("");
    setPassword("");
    setRole("OPERATOR");
    setShowForm(true);
  };

  /* =====================================================
     ADD USER
     ===================================================== */
  const handleAddUser = async () => {
    if (!username || !password) {
      alert("All fields required");
      return;
    }

    await addUser({
      username,
      password,
      role,
      active: true,
    });

    setShowForm(false);
    setUserPage(0);
  };

  /* =====================================================
     UPDATE PASSWORD
     ===================================================== */
  const handleUpdatePassword = async () => {
    if (!newPassword) {
      alert("Password required");
      return;
    }

    await updatePassword(editUser.id, newPassword);
    setEditUser(null);
    setNewPassword("");
    alert("Password updated successfully");
  };

  return (
    <div>
      <h2>User Management</h2>

      <button
        type="button"
        style={styles.primaryBtn}
        onClick={openAddUser}
      >
        + Add User
      </button>

      {/* ================= USERS TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {pagedUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td style={{ textAlign: "center" }}>
                <button
                  type="button"
                  style={styles.secondaryBtn}
                  onClick={() => {
                    setEditUser(u);
                    setNewPassword("");
                  }}
                >
                  Edit Password
                </button>{" "}
                <button
                  type="button"
                  style={styles.deleteBtn}
                  onClick={async () => {
                    await deleteUser(u.id);
                    setUserPage(0);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {pagedUsers.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No users
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ---------- USERS PAGINATION ---------- */}
      <div style={styles.pagination}>
        <button
          type="button"
          style={styles.pageBtn}
          disabled={!userHasPrev}
          onClick={() => setUserPage((p) => p - 1)}
        >
          ← Prev
        </button>

        <span>
          Page {userPage + 1} /{" "}
          {Math.ceil(users.length / PAGE_SIZE) || 1}
        </span>

        <button
          type="button"
          style={styles.pageBtn}
          disabled={!userHasNext}
          onClick={() => setUserPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>

      {/* ================= LOGIN LOGS ================= */}
      <h3 style={{ marginTop: "40px" }}>User Login Logs</h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Login Time</th>
            <th>Logout Time</th>
          </tr>
        </thead>

        <tbody>
          {pagedLogs.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No login activity
              </td>
            </tr>
          ) : (
            pagedLogs.map((l) => (
              <tr key={l.id}>
                <td>{l.username}</td>
                <td>{l.role}</td>
                <td>{l.loginTime}</td>
                <td>{l.logoutTime || "Active"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ---------- LOGIN LOG PAGINATION ---------- */}
      <div style={styles.pagination}>
        <button
          type="button"
          style={styles.pageBtn}
          disabled={!logHasPrev}
          onClick={() => setLogPage((p) => p - 1)}
        >
          ← Prev
        </button>

        <span>
          Page {logPage + 1} /{" "}
          {Math.ceil(loginLogs.length / PAGE_SIZE) || 1}
        </span>

        <button
          type="button"
          style={styles.pageBtn}
          disabled={!logHasNext}
          onClick={() => setLogPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>

      {/* ================= ADD USER MODAL ================= */}
      {showForm && (
        <div style={styles.modalOverlay}>
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Add User</h3>

            <div style={styles.field}>
              <label>Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERVISOR">SUPERVISOR</option>
                <option value="OPERATOR">OPERATOR</option>
              </select>
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.secondaryBtn}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={styles.primaryBtn}
                onClick={handleAddUser}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT PASSWORD MODAL ================= */}
      {editUser && (
        <div style={styles.modalOverlay}>
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Change Password – {editUser.username}</h3>

            <div style={styles.field}>
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.secondaryBtn}
                onClick={() => setEditUser(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={styles.primaryBtn}
                onClick={handleUpdatePassword}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    border: "2px solid #334155",
  },
  primaryBtn: {
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "12px",
    fontWeight: "600",
  },
  secondaryBtn: {
    padding: "6px 12px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    marginRight: "6px",
  },
  deleteBtn: {
    padding: "6px 14px",
    borderRadius: "6px",
    border: "1px solid #991b1b",
    background: "#fee2e2",
    color: "#991b1b",
    cursor: "pointer",
  },
  pagination: {
    marginTop: "12px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
  },
  pageBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #94a3b8",
    background: "#f8fafc",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    pointerEvents: "none",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    width: "420px",
    pointerEvents: "auto",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "12px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
};

/* ---------- FORCE TABLE GRID ---------- */
const style = document.createElement("style");
style.innerHTML = `
  table th {
    background: #f1f5f9;
    border: 2px solid #334155;
    padding: 12px;
    text-align: left;
  }
  table td {
    border: 2px solid #334155;
    padding: 12px;
  }
  table tbody tr:hover {
    background: #f8fafc;
  }
`;
document.head.appendChild(style);

export default Users;
