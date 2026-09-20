import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!username.trim()) {
      setError("Please enter username.");
      return;
    }

    if (!password) {
      setError("Please enter password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: username.trim(),
            password: password
          })
        }
      );

      const text = await response.text();

      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to login."
        );
      }

      if (!data.success) {
        setError(
          data.message ||
            "Invalid username or password."
        );
        return;
      }

      // Store logged-in user
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          userId: data.userId,
          username: data.username,
          fullName: data.fullName
        })
      );

      // Notify App.jsx
      if (onLogin) {
        onLogin({
          userId: data.userId,
          username: data.username,
          fullName: data.fullName
        });
      }

      // Go to dashboard
      navigate("/");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* Logo / Title */}

        <div className="login-header">

          <h1>MyBank</h1>

          <p>
            Welcome back! Please login to continue.
          </p>

        </div>

        {/* Login Form */}

        <form onSubmit={handleLogin}>

          {/* Username */}

          <div className="login-form-group">

            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              disabled={loading}
              autoComplete="username"
            />

          </div>

          {/* Password */}

          <div className="login-form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={loading}
              autoComplete="current-password"
            />

          </div>

          {/* Error */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Login Button */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;