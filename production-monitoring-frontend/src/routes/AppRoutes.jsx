import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Machines from "../pages/Machines";
import Batches from "../pages/Batches";
import Alerts from "../pages/Alerts";
import Materials from "../pages/Materials";
import Reports from "../pages/Reports";
import Users from "../pages/Users";
import Suppliers from "../pages/Suppliers";
import OperatorDashboard from "../pages/OperatorDashboard";

import ProtectedRoute from "../components/common/ProtectedRoute";
import Layout from "../components/common/Layout";

function AppRoutes() {
  return (
    <Routes>
      {/* ---------- PUBLIC ---------- */}
      <Route path="/login" element={<Login />} />

      {/* ---------- PROTECTED ---------- */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN", "SUPERVISOR", "OPERATOR"]}
          >
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* ---------- COMMON DASHBOARD ---------- */}
        <Route path="/" element={<Dashboard />} />

        {/* ---------- OPERATOR ---------- */}
        <Route
          path="/assigned-batches"
          element={
            <ProtectedRoute allowedRoles={["OPERATOR"]}>
              <OperatorDashboard />
            </ProtectedRoute>
          }
        />

        {/* ---------- ADMIN + SUPERVISOR ---------- */}
        <Route
          path="/machines"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <Machines />
            </ProtectedRoute>
          }
        />

        <Route
          path="/batches"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <Batches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/materials"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <Materials />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* ---------- ADMIN ONLY ---------- */}
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Suppliers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Alerts />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
