import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  /* ---------- WAIT FOR AUTH RESTORE ---------- */
  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  /* ---------- NOT LOGGED IN ---------- */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* ---------- ROLE CHECK ---------- */
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
