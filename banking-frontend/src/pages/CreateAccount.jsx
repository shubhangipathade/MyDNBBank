import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateAccount() {

  const navigate = useNavigate();

  const [accountType, setAccountType] =
    useState("SAVINGS");

  const [accountNumber, setAccountNumber] =
    useState("");

  const [balance, setBalance] =
    useState("");

  const [primaryAccount, setPrimaryAccount] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const accountData = {
        accountType,
        accountNumber,
        balance: Number(balance),
        primaryAccount
      };

      console.log(
        "Creating account:",
        accountData
      );

      const response = await fetch(
        "http://localhost:8080/api/accounts",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(accountData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Unable to create account"
        );
      }

      console.log(
        "Account created:",
        data
      );

      alert(
        "Account created successfully!"
      );

      navigate("/accounts");

    } catch (error) {

      console.error(
        "Create account error:",
        error
      );

      alert(error.message);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="create-account-page">

      <div className="create-account-card">

        <div className="section-title">

          <h2>
            Create New Account
          </h2>

          <p>
            Open a new bank account
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Account Type
            </label>

            <select
              value={accountType}
              onChange={(e) =>
                setAccountType(
                  e.target.value
                )
              }
              required
            >

              <option value="SAVINGS">
                Savings Account
              </option>

              <option value="CURRENT">
                Current Account
              </option>

            </select>

          </div>

          <div className="form-group">

            <label>
              Account Number
            </label>

            <input
              type="text"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(
                  e.target.value
                )
              }
              required
            />

          </div>

          <div className="form-group">

            <label>
              Initial Balance
            </label>

            <div className="amount-input">

              <span>₹</span>

              <input
                type="number"
                min="0"
                placeholder="Enter initial balance"
                value={balance}
                onChange={(e) =>
                  setBalance(
                    e.target.value
                  )
                }
                required
              />

            </div>

          </div>

          <div className="primary-checkbox">

            <input
              type="checkbox"
              checked={primaryAccount}
              onChange={(e) =>
                setPrimaryAccount(
                  e.target.checked
                )
              }
            />

            <label>
              Set as primary account
            </label>

          </div>

          <div className="create-account-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate("/accounts")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Account"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateAccount;