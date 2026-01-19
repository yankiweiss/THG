import "bootstrap/dist/css/bootstrap.min.css";
import SyndicatorDetails from "./SyndicatorDetails";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./index.css";

// function to submit the form to backend

function AddDeal() {
  const [syndicator, setSyndicator] = useState([
    { investorName: "", investorAmount: "", investorPercent: "" },
  ]);

  const addSyndicator = () => {
    setSyndicator((prev) => [
      ...prev,
      {
        investorName: "",
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

  const handleForm = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());

    const payload = {
      ...dataObject,
      syndicator: syndicator,
    };

    console.log(payload);

    const response = fetch("https://thg-seven.vercel.app/api/properties/addDeal");
    response
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        console.log(res.message);
      });
  };

  return (
    <>
    <form onSubmit={handleForm}>
      <div className="container my-5">
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light fw-bold">Property Details:</div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                
                <label className="form-label">Property Name:</label>
                <input className="form-control"
                name="property_name" />
              </div>

              <div className="col-md-3">
                <label className="form-label">Purchase Price</label>
                <input className="form-control" 
                name="purchase_price"/>
              </div>

              <div className="col-md-3">
                <label className="form-label">Upload Documents</label>
                <input className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Upload Pictures</label>
                <input className="form-control" />
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light fw-bold">Investor Details</div>

          <div className="card-body">
            <button type="button"
              class="btn btn-outline-primary"
              onClick={addSyndicator}
            >
              {" "}
              <FaPlus /> Add Investor{" "}
            </button>

            {syndicator.map((syndicator, index) => (
              <SyndicatorDetails
                key={index}
                index={index}
                data={syndicator}
                onChange={updateSyndicator}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
      </form>
      
    </>
  );
}

export default AddDeal;
