function BatchSummary({
  payments,
  onBack,
  onConfirm
}) {

  const total = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  return (
    <div className="summary-card">

      <h2>
        Review Multiple Payments
      </h2>

      {payments.map(
        (payment, index) => (

          <div
            className="summary-row"
            key={index}
          >

            <span>
              Payment {index + 1}
            </span>

            <strong>
              Beneficiary:
              {" "}
              {payment.beneficiary}
              {" | ₹"}
              {Number(
                payment.amount
              ).toLocaleString("en-IN")}
            </strong>

          </div>

        )
      )}

      <div className="total-row">

        <span>Total Amount</span>

        <strong>
          ₹{total.toLocaleString("en-IN")}
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
          Confirm All Payments
        </button>

      </div>

    </div>
  );
}

export default BatchSummary;