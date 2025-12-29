import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import { MachineProvider } from "./context/MachineContext";
import { MaterialProvider } from "./context/MaterialContext";
import { BatchProvider } from "./context/BatchContext";
import { ProductionLogProvider } from "./context/ProductionLogContext";
import { UserProvider } from "./context/UserContext";
import { SupplierProvider } from "./context/SupplierContext";
import { LoginLogProvider } from "./context/LoginLogContext"; // ✅ NEW

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ Users first */}
    <UserProvider>
      {/* ✅ Login logs before auth */}
      <LoginLogProvider>
        {/* ✅ Auth after users + logs */}
        <AuthProvider>
          <AlertProvider>
            <MachineProvider>
              {/* ✅ Supplier before material */}
              <SupplierProvider>
                <MaterialProvider>
                  <BatchProvider>
                    <ProductionLogProvider>
                      <App />
                    </ProductionLogProvider>
                  </BatchProvider>
                </MaterialProvider>
              </SupplierProvider>
            </MachineProvider>
          </AlertProvider>
        </AuthProvider>
      </LoginLogProvider>
    </UserProvider>
  </React.StrictMode>
);
