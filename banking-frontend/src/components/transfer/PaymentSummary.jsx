function PaymentSummary({
  payment,
  onBack,
  onConfirm
}) {

  return (
    <div className="summary-card">

      <h2>
        Review Payment
      </h2>

      <div className="summary-row">

        <span>From Account</span>

        <strong>
          {payment.accountType}
          {" - "}
          {payment.accountNumber}
        </strong>

      </div>

      <div className="summary-row">

        <span>Beneficiary ID</span>

        <strong>
          {payment.beneficiaryId}
        </strong>

      </div>

      <div className="summary-row">

        <span>Amount</span>

        <strong>
          ₹{Number(
            payment.amount
          ).toLocaleString("en-IN")}
        </strong>

      </div>

      <div className="summary-row">

        <span>Remarks</span>

        <strong>
          {payment.remarks || "-"}
        </strong>

      </div>

      <div className="summary-actions">

        <button
          className="secondary-button"
          onClick={onBack}
        >
          Back
        </button>

        <button
          className="primary-button"
          onClick={onConfirm}
        >
          Confirm Payment
        </button>

      </div>

    </div>
  );
}

export default PaymentSummary;