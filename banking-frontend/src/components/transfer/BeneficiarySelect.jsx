import { useEffect, useState } from "react";

function BeneficiarySelect({
  beneficiary,
  setBeneficiary
}) {

  const [beneficiaries, setBeneficiaries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetch(
      "http://localhost:8080/api/beneficiaries"
    )
      .then((response) => {

        if (!response.ok) {
          throw new Error(
            "Failed to fetch beneficiaries"
          );
        }

        return response.json();
      })
      .then((data) => {

        setBeneficiaries(data);
        setLoading(false);
      })
      .catch((error) => {

        console.error(error);
        setLoading(false);
      });

  }, []);

  return (
    <div className="form-group">

      <label>Beneficiary</label>

      <select
        value={beneficiary}
        onChange={(e) =>
          setBeneficiary(e.target.value)
        }
        disabled={loading}
        required
      >

        <option value="">
          {loading
            ? "Loading beneficiaries..."
            : "Select beneficiary"}
        </option>

        {beneficiaries
          .filter(
            (beneficiary) =>
              beneficiary.active
          )
          .map((beneficiary) => (

            <option
              key={beneficiary.beneficiaryId}
              value={beneficiary.beneficiaryId}
            >
              {beneficiary.name}
              {" - "}
              {beneficiary.accountNumber}
            </option>

          ))}

      </select>

    </div>
  );
}

export default BeneficiarySelect;