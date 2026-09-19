import BeneficiarySelect from "./BeneficiarySelect";

function MultiplePaymentRow({
  payment,
  index,
  onChange,
  onRemove
}) {

  return (
    <div className="multiple-payment-row">

      <div>
        <label>
          Payment {index + 1}
        </label>

        <BeneficiarySelect
          beneficiary={
            payment.beneficiary
          }
          setBeneficiary={(value) =>
            onChange(
              index,
              "beneficiary",
              value
            )
          }
        />
      </div>

      <div className="form-group">

        <label>Amount</label>

        <input
          type="number"
          min="1"
          value={payment.amount}
          onChange={(e) =>
            onChange(
              index,
              "amount",
              e.target.value
            )
          }
        />

      </div>

      <div className="form-group">

        <label>Remarks</label>

        <input
          type="text"
          value={payment.remarks}
          onChange={(e) =>
            onChange(
              index,
              "remarks",
              e.target.value
            )
          }
        />

      </div>

      <button
        type="button"
        className="remove-button"
        onClick={() =>
          onRemove(index)
        }
      >
        Remove
      </button>

    </div>
  );
}

export default MultiplePaymentRow;