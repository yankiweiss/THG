import "bootstrap/dist/css/bootstrap.min.css";
import SyndicatorDetails from "./SyndicatorDetails";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./index.css";

// function to submit the form to backend

function AddDeal() {
  const [syndicator, setSyndicator] = useState([
    { investor_name: "", investorAmount: "", investorPercent: "" },
  ]);

  const addSyndicator = () => {
    setSyndicator((prev) => [
      ...prev,
      {
        investor_name: "",
        investorAmount: "",
        investorPercent: "",
      },
    ]);
  };

  const updateSyndicator = (index, field, value) => {
    setSyndicator((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());

    const payload = {
      ...dataObject,
      syndicator: syndicator,
    };

    console.log(payload);

   await fetch("https://thg-seven.vercel.app/api/properties/addDeal" , {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });
  }

  return (
    <>
    <form onSubmit={handleForm}>
  <div className="container my-5">

    {/* ---------------- Property Details ---------------- */}
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-light fw-bold">Property Details</div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Property Name</label>
            <input className="form-control" name="property_name" />
          </div>

          <div className="col-md-3">
            <label className="form-label">Purchase Price</label>
            <input className="form-control" name="purchase_price" />
          </div>

          <div className="col-md-3">
            <label className="form-label">Upload Documents</label>
            <input type="file" className="form-control" multiple />
          </div>

          <div className="col-md-3">
            <label className="form-label">Upload Pictures</label>
            <input type="file" className="form-control" multiple />
          </div>
        </div>
      </div>
    </div>

    {/* ---------------- Investors Section ---------------- */}
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-light fw-bold d-flex justify-content-between align-items-center">
        <span>Investor Details</span>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={addSyndicator}
        >
          <FaPlus /> Add Investor
        </button>
      </div>

      <div className="card-body">
        {syndicator.map((inv, index) => (
          <div
            key={index}
            className="border rounded p-3 mb-3 bg-light"
          >
            <h6 className="fw-bold">Investor {index + 1}</h6>

            <SyndicatorDetails
              index={index}
              data={inv}
              onChange={updateSyndicator}
            />

            <button
              type="button"
              className="btn btn-outline-danger btn-sm mt-2"
              onClick={() =>
                setSyndicator((prev) =>
                  prev.filter((_, i) => i !== index)
                )
              }
            >
              Remove Investor
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* ---------------- Save Button ---------------- */}
    <div className="text-center mb-5">
      <button type="submit" className="btn btn-primary btn-lg">
        Save Deal
      </button>
    </div>
  </div>
</form>
    </>
  );
}

export default AddDeal;
