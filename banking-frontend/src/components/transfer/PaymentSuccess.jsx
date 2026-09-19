function PaymentSuccess({
  payment,
  transactionId,
  onNewPayment
}) {

  return (
    <div className="success-card">

      <div className="success-icon">
        ✓
      </div>

      <h2>
        Payment Successful
      </h2>

      <p>
        Your payment has been processed
        successfully.
      </p>

      <div className="success-details">

        <div>
          <span>Transaction ID</span>
          <strong>
            {transactionId}
          </strong>
        </div>

        <div>
          <span>Amount</span>
          <strong>
            ₹{Number(
              payment.amount
            ).toLocaleString("en-IN")}
          </strong>
        </div>

        <div>
          <span>Status</span>
          <strong>
            SUCCESS
          </strong>
        </div>

        <div>
          <span>Remaining Balance</span>
          <strong>
            ₹{Number(
              payment.remainingBalance
            ).toLocaleString("en-IN")}
          </strong>
        </div>

      </div>

      <button
        className="primary-button"
        onClick={onNewPayment}
      >
        Make New Payment
      </button>

    </div>
  );
}

export default PaymentSuccess;