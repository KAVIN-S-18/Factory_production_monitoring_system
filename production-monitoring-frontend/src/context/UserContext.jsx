import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     FETCH ALL USERS (ADMIN)
     ===================================================== */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     CREATE USER (ADMIN)
     ===================================================== */
  const addUser = async (user) => {
    try {
      const res = await api.post("/users", user);
      setUsers((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to add user", err);
    }
  };

  /* =====================================================
     DELETE USER (ADMIN)
     ===================================================== */
  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  /* =====================================================
     UPDATE USER PASSWORD (ADMIN)  ✅ NEW
     ===================================================== */
  const updatePassword = async (id, password) => {
    try {
      await api.put(`/users/${id}/password`, { password });
      // No need to update users state (password not shown)
    } catch (err) {
      console.error("Failed to update password", err);
      throw err;
    }
  };

  /* =====================================================
     AUTO LOAD USERS
     ===================================================== */
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        fetchUsers,
        addUser,
        deleteUser,
        updatePassword, // ✅ EXPOSED
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUsers = () => useContext(UserContext);
