import { useLoginLogs } from "../context/LoginLogContext";

function LoginLogs() {
  const { loginLogs } = useLoginLogs();

  return (
    <div>
      <h2>User Login Logs</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Login Time</th>
            <th>Logout Time</th>
          </tr>
        </thead>
        <tbody>
          {loginLogs.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No login logs found
              </td>
            </tr>
          )}

          {loginLogs.map((l) => (
            <tr key={l.id}>
              <td>{l.username}</td>
              <td>{l.role}</td>
              <td>{l.loginTime}</td>
              <td>{l.logoutTime || "Active"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LoginLogs;
