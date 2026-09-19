import { useEffect, useState } from "react";

function Accounts() {
  // ==============================
  // Account State
  // ==============================

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // Close Account Modal State
  // ==============================

  const [showCloseModal, setShowCloseModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [destinationAccountId, setDestinationAccountId] = useState("");

  // ==============================
  // Processing State
  // ==============================

  const [processing, setProcessing] = useState(false);

  // ==============================
  // Fetch Accounts
  // ==============================

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/accounts"
      );

      if (!response.ok) {
        throw new Error("Failed to load accounts");
      }

      const data = await response.json();

      console.log("Accounts from backend:", data);

      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);

      setError(
        "Unable to load accounts. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Load Accounts on Page Load
  // ==============================

  useEffect(() => {
    fetchAccounts();
  }, []);

  // ==============================
  // Close Account Button Click
  // ==============================

  const handleCloseAccountClick = (account) => {
    console.log("Close account clicked:", account);

    // Already closed
    if (
      account.accountStatus &&
      account.accountStatus.toUpperCase() === "CLOSED"
    ) {
      alert("This account is already closed.");
      return;
    }

    const balance = Number(account.balance || 0);

    // If balance is zero
    if (balance === 0) {
      closeZeroBalanceAccount(account.accountId);
      return;
    }

    // If balance exists
    setSelectedAccount(account);
    setDestinationAccountId("");
    setShowCloseModal(true);
  };

  // ==============================
  // Close Zero Balance Account
  // ==============================

  const closeZeroBalanceAccount = async (accountId) => {
    const confirmed = window.confirm(
      "Are you sure you want to close this account?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessing(true);

      const response = await fetch(
        `http://localhost:8080/api/accounts/${accountId}/close`,
        {
          method: "PUT"
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
          data.message ||
            data.error ||
            "Unable to close account"
        );
      }

      alert("Account closed successfully.");

      await fetchAccounts();
    } catch (error) {
      console.error("Close account error:", error);

      alert(
        error.message ||
          "Unable to close account."
      );
    } finally {
      setProcessing(false);
    }
  };

  // ==============================
  // Transfer Balance and Close
  // ==============================

  const handleTransferAndClose = async () => {
    if (!selectedAccount) {
      return;
    }

    // Destination not selected
    if (!destinationAccountId) {
      alert(
        "Please select an account to transfer the balance."
      );
      return;
    }

    // Same account validation
    if (
      Number(destinationAccountId) ===
      Number(selectedAccount.accountId)
    ) {
      alert(
        "You cannot transfer the balance to the same account."
      );
      return;
    }

    const balance = Number(
      selectedAccount.balance || 0
    );

    // Find destination account
    const destinationAccount = accounts.find(
      (account) =>
        Number(account.accountId) ===
        Number(destinationAccountId)
    );

    // Destination should exist
    if (!destinationAccount) {
      alert("Destination account not found.");
      return;
    }

    // Destination should not be closed
    if (
      destinationAccount.accountStatus &&
      destinationAccount.accountStatus.toUpperCase() ===
        "CLOSED"
    ) {
      alert(
        "You cannot transfer money to a closed account."
      );
      return;
    }

    const confirmed = window.confirm(
      `₹${balance.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })} will be transferred from ` +
        `${selectedAccount.accountNumber} to ` +
        `${destinationAccount.accountNumber}.` +
        `\n\nAfter the transfer, ` +
        `${selectedAccount.accountNumber} will be closed.` +
        `\n\nDo you want to continue?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessing(true);

      const response = await fetch(
        `http://localhost:8080/api/accounts/` +
          `${selectedAccount.accountId}/` +
          `close-and-transfer/` +
          `${destinationAccountId}`,
        {
          method: "PUT"
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
          data.message ||
            data.error ||
            "Unable to transfer balance and close account"
        );
      }

      alert(
        "Balance transferred and account closed successfully."
      );

      // Close modal
      setShowCloseModal(false);

      // Clear selected account
      setSelectedAccount(null);

      // Clear destination
      setDestinationAccountId("");

      // Refresh accounts
      await fetchAccounts();
    } catch (error) {
      console.error(
        "Transfer and close error:",
        error
      );

      alert(
        error.message ||
          "Unable to transfer balance and close account."
      );
    } finally {
      setProcessing(false);
    }
  };

  // ==============================
  // REMOVE ACCOUNT
  // ==============================

  const handleRemoveAccount = async (account) => {
    console.log(
      "Remove account clicked:",
      account
    );

    // Check account status
    const status = account.accountStatus
      ? account.accountStatus.toUpperCase()
      : "";

    if (status !== "CLOSED") {
      alert(
        "Only closed accounts can be removed."
      );
      return;
    }

    // Check balance
    const balance = Number(
      account.balance || 0
    );

    if (balance !== 0) {
      alert(
        "Account balance must be zero before removing the account."
      );
      return;
    }

    // Confirmation
    const confirmed = window.confirm(
      `Are you sure you want to remove account ` +
        `${account.accountNumber}?` +
        `\n\nThis account is already closed.` +
        `\n\nThe account will be permanently deleted.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessing(true);

      console.log(
        "Deleting account ID:",
        account.accountId
      );

      const response = await fetch(
        `http://localhost:8080/api/accounts/${account.accountId}`,
        {
          method: "DELETE"
        }
      );

      console.log(
        "Delete response status:",
        response.status
      );

      const text = await response.text();

      console.log(
        "Delete response:",
        text
      );

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
          data.message ||
            data.error ||
            "Unable to remove account"
        );
      }

      alert(
        "Account removed successfully."
      );

      // Refresh account list
      await fetchAccounts();
    } catch (error) {
      console.error(
        "Remove account error:",
        error
      );

      alert(
        error.message ||
          "Unable to remove account."
      );
    } finally {
      setProcessing(false);
    }
  };

  // ==============================
  // Loading Screen
  // ==============================

  if (loading) {
    return (
      <div className="page-container">
        <h1>My Accounts</h1>

        <p>Loading accounts...</p>
      </div>
    );
  }

  // ==============================
  // Error Screen
  // ==============================

  if (error) {
    return (
      <div className="page-container">
        <h1>My Accounts</h1>

        <div className="error-message">
          {error}
        </div>

        <button
          className="primary-button"
          onClick={fetchAccounts}
        >
          Retry
        </button>
      </div>
    );
  }

  // ==============================
  // Main UI
  // ==============================

  return (
    <div className="page-container">

      {/* ==============================
          Page Header
      ============================== */}

      <div className="page-header">

        <div>
          <h1>My Accounts</h1>

          <p>
            View and manage your bank accounts
          </p>
        </div>

        <button
          className="primary-button"
          onClick={fetchAccounts}
          disabled={processing}
        >
          Refresh
        </button>

      </div>

      {/* ==============================
          No Accounts
      ============================== */}

      {accounts.length === 0 ? (
        <div className="empty-state">

          <h3>No accounts found</h3>

          <p>
            You currently don't have any bank
            accounts.
          </p>

        </div>
      ) : (

        /* ==============================
           Accounts Grid
        ============================== */

        <div className="accounts-grid">

          {accounts.map((account) => {

            const status = account.accountStatus
              ? account.accountStatus.toUpperCase()
              : "ACTIVE";

            const isClosed =
              status === "CLOSED";

            const balance = Number(
              account.balance || 0
            );

            return (

              <div
                className={
                  `account-card ${
                    isClosed
                      ? "closed-account"
                      : ""
                  }`
                }
                key={account.accountId}
              >

                {/* ==============================
                    Account Header
                ============================== */}

                <div className="account-card-header">

                  <div>

                    <h3>
                      {account.accountType}
                    </h3>

                    <p>
                      Account Number:{" "}
                      {account.accountNumber}
                    </p>

                  </div>

                  {/* Primary Badge */}

                  {account.primaryAccount &&
                    !isClosed && (
                      <span className="primary-badge">
                        Primary
                      </span>
                    )}

                </div>

                {/* ==============================
                    Balance
                ============================== */}

                <div className="account-balance">

                  <span>
                    Available Balance
                  </span>

                  <h2>
                    ₹
                    {balance.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }
                    )}
                  </h2>

                </div>

                {/* ==============================
                    Status
                ============================== */}

                <div className="account-status">

                  <span>
                    Status
                  </span>

                  <strong
                    className={
                      isClosed
                        ? "status-closed"
                        : "status-active"
                    }
                  >
                    {status}
                  </strong>

                </div>

                {/* ==============================
                    Account Actions
                ============================== */}

                <div className="account-actions">

                  {isClosed ? (

                    // CLOSED ACCOUNT
                    // Show Remove button

                    <button
                      className="remove-account-button"
                      onClick={() =>
                        handleRemoveAccount(account)
                      }
                      disabled={processing}
                    >
                      {processing
                        ? "Processing..."
                        : "Remove Account"}
                    </button>

                  ) : (

                    // ACTIVE ACCOUNT
                    // Show Close button

                    <button
                      className="close-account-button"
                      onClick={() =>
                        handleCloseAccountClick(
                          account
                        )
                      }
                      disabled={processing}
                    >
                      {processing
                        ? "Processing..."
                        : "Close Account"}
                    </button>

                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* =================================================
          CLOSE ACCOUNT MODAL
      ================================================= */}

      {showCloseModal &&
        selectedAccount && (

          <div className="modal-overlay">

            <div className="close-account-modal">

              <h2>
                Close Account
              </h2>

              <p className="modal-description">

                This account has a remaining
                balance. Please transfer the
                balance to another active account
                before closing.

              </p>

              {/* ==============================
                  Transfer Information
              ============================== */}

              <div className="transfer-info">

                <div>

                  <span>
                    Account
                  </span>

                  <strong>
                    {selectedAccount.accountNumber}
                  </strong>

                </div>

                <div>

                  <span>
                    Amount to Transfer
                  </span>

                  <strong className="transfer-amount">

                    ₹
                    {Number(
                      selectedAccount.balance ||
                        0
                    ).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }
                    )}

                  </strong>

                </div>

              </div>

              {/* ==============================
                  Destination Account
              ============================== */}

              <div className="form-group">

                <label>
                  Transfer Balance To
                </label>

                <select
                  value={
                    destinationAccountId
                  }
                  onChange={(e) =>
                    setDestinationAccountId(
                      e.target.value
                    )
                  }
                  disabled={processing}
                >

                  <option value="">
                    Select another account
                  </option>

                  {accounts
                    .filter(
                      (account) =>
                        Number(
                          account.accountId
                        ) !==
                          Number(
                            selectedAccount.accountId
                          ) &&
                        (
                          !account.accountStatus ||
                          account.accountStatus.toUpperCase() !==
                            "CLOSED"
                        )
                    )
                    .map((account) => (

                      <option
                        key={
                          account.accountId
                        }
                        value={
                          account.accountId
                        }
                      >

                        {account.accountNumber}
                        {" - "}
                        {account.accountType}
                        {" - ₹"}
                        {Number(
                          account.balance || 0
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </option>

                    ))}

                </select>

              </div>

              {/* ==============================
                  Warning
              ============================== */}

              <div className="close-warning">

                <strong>
                  Important
                </strong>

                <p>

                  The entire balance will be
                  transferred to the selected
                  account. After the transfer,
                  this account will be closed.

                </p>

              </div>

              {/* ==============================
                  Modal Buttons
              ============================== */}

              <div className="modal-actions">

                <button
                  className="secondary-button"
                  onClick={() => {

                    setShowCloseModal(
                      false
                    );

                    setSelectedAccount(
                      null
                    );

                    setDestinationAccountId(
                      ""
                    );

                  }}
                  disabled={processing}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  onClick={
                    handleTransferAndClose
                  }
                  disabled={
                    processing ||
                    !destinationAccountId
                  }
                >

                  {processing
                    ? "Processing..."
                    : "Transfer & Close"}

                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}

export default Accounts;