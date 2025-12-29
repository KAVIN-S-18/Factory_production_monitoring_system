import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    width: "100vw",
  },
  content: {
    flex: 1,
    marginLeft: "260px",
    padding: "24px",
    backgroundColor: "#f1f5f9",
    overflowY: "auto",
  },
};

export default Layout;
