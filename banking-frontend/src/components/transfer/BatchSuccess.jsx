function BatchSuccess({
  payments,
  onNewBatch
}) {

  const total = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  return (
    <div className="success-card">

      <div className="success-icon">
        ✓
      </div>

      <h2>
        Payments Successful
      </h2>

      <p>
        All payments were processed
        successfully.
      </p>

      <div className="success-details">

        <div>
          <span>Number of Payments</span>

          <strong>
            {payments.length}
          </strong>
        </div>

        <div>
          <span>Total Amount</span>

          <strong>
            ₹{total.toLocaleString("en-IN")}
          </strong>
        </div>

        <div>
          <span>Status</span>

          <strong>
            SUCCESS
          </strong>
        </div>

      </div>

      <button
        className="primary-button"
        onClick={onNewBatch}
      >
        Make New Payments
      </button>

    </div>
  );
}

export default BatchSuccess;