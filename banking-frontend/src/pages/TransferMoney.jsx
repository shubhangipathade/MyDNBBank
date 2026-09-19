import { useState } from "react";

import PaymentTypeTabs from "../components/transfer/PaymentTypeTabs";
import SinglePaymentForm from "../components/transfer/SinglePaymentForm";
import MultiplePaymentForm from "../components/transfer/MultiplePaymentForm";

function TransferMoney() {

  const [paymentType, setPaymentType] =
    useState("single");

  return (
    <div>

      <h1>Transfer Money</h1>

      <PaymentTypeTabs
        paymentType={paymentType}
        setPaymentType={setPaymentType}
      />

      {paymentType === "single" && (
        <SinglePaymentForm />
      )}

      {paymentType === "multiple" && (
        <MultiplePaymentForm />
      )}

    </div>
  );
}

export default TransferMoney;