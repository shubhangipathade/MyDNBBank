import { useEffect, useState } from "react";

import MultiplePaymentRow
  from "./MultiplePaymentRow";

import BatchSummary
  from "./BatchSummary";

import BatchSuccess
  from "./BatchSuccess";

function MultiplePaymentForm() {

  const [accounts, setAccounts] =
    useState([]);

  const [accountId, setAccountId] =
    useState("");

  const [payments, setPayments] =
    useState([
      {
        beneficiary: "",
        amount: "",
        remarks: ""
      }
    ]);

  const [step, setStep] =
    useState("form");

  useEffect(() => {

    fetch("http://localhost:8080/api/accounts")
      .then((response) =>
        response.json()
      )
      .then((data) =>
        setAccounts(data)
      )
      .catch((error) =>
        console.error(error)
      );

  }, []);

  const addPayment = () => {

    setPayments([
      ...payments,
      {
        beneficiary: "",
        amount: "",
        remarks: ""
      }
    ]);
  };

  const removePayment = (index) => {

    if (payments.length === 1) {
      return;
    }

    setPayments(
      payments.filter(
        (_, i) => i !== index
      )
    );
  };

  const handleChange = (
    index,
    field,
    value
  ) => {

    const updated = [...payments];

    updated[index][field] = value;

    setPayments(updated);
  };

  const handleReview = (e) => {

    e.preventDefault();

    setStep("summary");
  };

  const handleConfirm = () => {

    // Multiple payment backend
    // can be connected next.

    setStep("success");
  };

  if (step === "summary") {

    return (
      <BatchSummary
        payments={payments}
        onBack={() =>
          setStep("form")
        }
        onConfirm={handleConfirm}
      />
    );
  }

  if (step === "success") {

    return (
      <BatchSuccess
        payments={payments}
        onNewBatch={() => {

          setPayments([
            {
              beneficiary: "",
              amount: "",
              remarks: ""
            }
          ]);

          setStep("form");
        }}
      />
    );
  }

  return (
    <div className="payment-form">

      <div className="section-title">

        <h2>
          Multiple Payment
        </h2>

        <p>
          Make payments to multiple
          beneficiaries
        </p>

      </div>

      <form onSubmit={handleReview}>

        <div className="form-group">

          <label>
            From Account
          </label>

          <select
            value={accountId}
            onChange={(e) =>
              setAccountId(
                e.target.value
              )
            }
            required
          >

            <option value="">
              Select account
            </option>

            {accounts.map((account) => (

              <option
                key={account.accountId}
                value={account.accountId}
              >
                {account.accountType}
                {" - "}
                {account.accountNumber}
              </option>

            ))}

          </select>

        </div>

        {payments.map(
          (payment, index) => (

            <MultiplePaymentRow
              key={index}
              payment={payment}
              index={index}
              onChange={handleChange}
              onRemove={removePayment}
            />

          )
        )}

        <button
          type="button"
          className="secondary-button"
          onClick={addPayment}
        >
          + Add Payment
        </button>

        <br />
        <br />

        <button
          type="submit"
          className="primary-button"
        >
          Review Payments
        </button>

      </form>

    </div>
  );
}

export default MultiplePaymentForm;