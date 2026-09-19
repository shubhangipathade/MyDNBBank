import { useEffect, useState } from "react";

import BeneficiarySelect from "./BeneficiarySelect";
import PaymentSummary from "./PaymentSummary";
import PaymentSuccess from "./PaymentSuccess";

function SinglePaymentForm() {

  const [accounts, setAccounts] =
    useState([]);

  const [loadingAccounts, setLoadingAccounts] =
    useState(true);

  const [fromAccount, setFromAccount] =
    useState("");

  const [beneficiary, setBeneficiary] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  const [step, setStep] =
    useState("form");

  const [payment, setPayment] =
    useState(null);

  const [transactionId, setTransactionId] =
    useState("");

  useEffect(() => {

    fetch("http://localhost:8080/api/accounts")
      .then((response) => {

        if (!response.ok) {
          throw new Error(
            "Failed to fetch accounts"
          );
        }

        return response.json();
      })
      .then((data) => {

        setAccounts(data);
        setLoadingAccounts(false);
      })
      .catch((error) => {

        console.error(error);
        setLoadingAccounts(false);
      });

  }, []);

  const handleReview = (e) => {

    e.preventDefault();

    const selectedAccount =
      accounts.find(
        (account) =>
          account.accountId ===
          Number(fromAccount)
      );

    const paymentData = {

      accountId: Number(fromAccount),

      beneficiaryId:
        Number(beneficiary),

      amount: Number(amount),

      remarks,

      accountNumber:
        selectedAccount?.accountNumber || "",

      accountType:
        selectedAccount?.accountType || "",

      availableBalance:
        selectedAccount?.balance || 0
    };

    setPayment(paymentData);

    setStep("summary");
  };

  const handleConfirm = async () => {

    try {

      const transactionData = {

        accountId:
          payment.accountId,

        beneficiaryId:
          payment.beneficiaryId,

        amount:
          Number(payment.amount),

        remarks:
          payment.remarks
      };

      console.log(
        "Sending transaction:",
        transactionData
      );

      const response = await fetch(
        "http://localhost:8080/api/transfers",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            transactionData
          )
        }
      );

      const responseData =
        await response.json();

      if (!response.ok) {

        throw new Error(
          responseData.error ||
          "Transaction failed"
        );
      }

      console.log(
        "Transfer successful:",
        responseData
      );

      setTransactionId(
        responseData.transactionReference
      );

      setPayment({
        ...payment,
        remainingBalance:
          responseData.remainingBalance
      });

      setStep("success");

    } catch (error) {

      console.error(
        "Transfer error:",
        error
      );

      alert(error.message);
    }
  };

  const handleNewPayment = () => {

    setFromAccount("");
    setBeneficiary("");
    setAmount("");
    setRemarks("");

    setPayment(null);
    setTransactionId("");

    setStep("form");
  };

  if (step === "summary") {

    return (
      <PaymentSummary
        payment={payment}
        onBack={() =>
          setStep("form")
        }
        onConfirm={handleConfirm}
      />
    );
  }

  if (step === "success") {

    return (
      <PaymentSuccess
        payment={payment}
        transactionId={transactionId}
        onNewPayment={
          handleNewPayment
        }
      />
    );
  }

  return (
    <div className="payment-container">

      <div className="payment-form">

        <div className="section-title">

          <h2>Single Payment</h2>

          <p>
            Transfer money to a beneficiary
          </p>

        </div>

        <form onSubmit={handleReview}>

          <div className="form-group">

            <label>
              From Account
            </label>

            <select
              value={fromAccount}
              onChange={(e) =>
                setFromAccount(
                  e.target.value
                )
              }
              required
              disabled={loadingAccounts}
            >

              <option value="">
                {loadingAccounts
                  ? "Loading accounts..."
                  : "Select account"}
              </option>

              {accounts.map((account) => (

                <option
                  key={account.accountId}
                  value={account.accountId}
                >

                  {account.accountType}
                  {" - "}
                  {account.accountNumber}
                  {" - ₹"}
                  {Number(
                    account.balance
                  ).toLocaleString("en-IN")}

                </option>

              ))}

            </select>

          </div>

          <BeneficiarySelect
            beneficiary={beneficiary}
            setBeneficiary={
              setBeneficiary
            }
          />

          <div className="form-group">

            <label>Amount</label>

            <div className="amount-input">

              <span>₹</span>

              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                min="1"
                required
              />

            </div>

          </div>

          <div className="form-group">

            <label>Remarks</label>

            <textarea
              placeholder="Enter payment remarks (optional)"
              value={remarks}
              onChange={(e) =>
                setRemarks(
                  e.target.value
                )
              }
              rows="3"
            />

          </div>

          <button
            type="submit"
            className="primary-button"
          >
            Review Payment
          </button>

        </form>

      </div>

      <div className="payment-info">

        <h3>
          Payment Information
        </h3>

        <div className="info-item">
          <span>Payment Type</span>
          <strong>
            Single Payment
          </strong>
        </div>

        <div className="info-item">
          <span>Processing</span>
          <strong>
            Instant
          </strong>
        </div>

        <div className="info-item">
          <span>Security</span>
          <strong>
            Secure Transfer
          </strong>
        </div>

      </div>

    </div>
  );
}

export default SinglePaymentForm;