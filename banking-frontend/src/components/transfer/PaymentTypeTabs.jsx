function PaymentTypeTabs({
  paymentType,
  setPaymentType
}) {

  return (
    <div className="payment-tabs">

      <button
        className={
          paymentType === "single"
            ? "active"
            : ""
        }
        onClick={() =>
          setPaymentType("single")
        }
      >
        Single Payment
      </button>

      <button
        className={
          paymentType === "multiple"
            ? "active"
            : ""
        }
        onClick={() =>
          setPaymentType("multiple")
        }
      >
        Multiple Payment
      </button>

    </div>
  );
}

export default PaymentTypeTabs;