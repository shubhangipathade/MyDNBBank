import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import TransferMoney from "./pages/TransferMoney";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";

import "./App.css";

function App() {

  // ==============================
  // Get Logged-in User
  // ==============================

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem("loggedInUser");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }

    return null;
  });

  // ==============================
  // Login
  // ==============================

  const handleLogin = (loggedInUser) => {

    setUser(loggedInUser);

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(loggedInUser)
    );
  };

  // ==============================
  // Logout
  // ==============================

  const handleLogout = () => {

    localStorage.removeItem(
      "loggedInUser"
    );

    setUser(null);
  };

  // ==============================
  // If User Is NOT Logged In
  // ==============================

  if (!user) {

    return (
      <Routes>

        <Route
          path="/login"
          element={
            <Login
              onLogin={handleLogin}
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    );
  }

  // ==============================
  // Logged-in Application
  // ==============================

  return (
    <div className="app">

      <Sidebar />

      <div className="main-area">

        <Header
          user={user}
          onLogout={handleLogout}
        />

        <main className="content">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/accounts"
              element={<Accounts />}
            />

            <Route
              path="/accounts/create"
              element={<CreateAccount />}
            />

            <Route
              path="/transfer"
              element={<TransferMoney />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}

export default App;