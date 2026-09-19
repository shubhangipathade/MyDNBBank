import { useEffect, useState } from "react";

function Dashboard() {

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("http://localhost:8080/api/accounts")
      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to load accounts");
        }

        return response.json();
      })
      .then((data) => {

        setAccounts(data);
        setLoading(false);
      })
      .catch((error) => {

        console.error(error);
        setLoading(false);
      });

  }, []);

  const totalBalance = accounts.reduce(
    (total, account) =>
      total + Number(account.balance || 0),
    0
  );

  const primaryAccount = accounts.find(
    (account) => account.primaryAccount
  );

  if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  return (
    <div>

      <h1>Dashboard</h1>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <span>Total Balance</span>

          <h2>
            ₹{totalBalance.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="dashboard-card">
          <span>Total Accounts</span>

          <h2>{accounts.length}</h2>
        </div>

        <div className="dashboard-card">
          <span>Primary Account</span>

          <h2>
            {primaryAccount
              ? primaryAccount.accountNumber
              : "Not Set"}
          </h2>
        </div>

      </div>

      <div className="section">

        <h2>My Accounts</h2>

        {accounts.map((account) => (

          <div
            className="account-card"
            key={account.accountId}
          >

            <div>
              <strong>
                {account.accountType}
              </strong>

              <p>
                {account.accountNumber}
              </p>
            </div>

            <strong>
              ₹{Number(account.balance)
                .toLocaleString("en-IN")}
            </strong>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Dashboard;