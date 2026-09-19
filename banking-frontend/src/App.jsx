import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import TransferMoney from "./pages/TransferMoney";
import CreateAccount from "./pages/CreateAccount";

import "./App.css";

function App() {
  return (
    <div className="app">

      <Sidebar />

      <div className="main-area">

        <Header />

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

          </Routes>

        </main>

      </div>

    </div>
  );
}

export default App;