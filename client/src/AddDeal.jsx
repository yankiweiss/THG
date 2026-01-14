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
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };


   const handleForm = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());

    const payload = {
      ...dataObject,
      syndicator : syndicator
    }

    console.log(payload)

    const response = await fetch('https://thg-seven.vercel.app/api/')
    console.log(response)

  }


  return (
    <div className="outside-wrap">
      <h2 className="main-header pt-5">Add New Deal</h2>

      <div className="from-content w-75">
        <form onSubmit={handleForm}>
          <h4 className="header-text text-start">Property Details</h4>

          <hr></hr>

          <div className="row g-3 d-flex justify-content-center">
            <div className="col-md-3">
              <label className="form-label">Property Name:</label>
              <input autoFocus className="form-control" name="property-name" />
            </div>
            <div className="col-md-2">
              <label className="form-label">Purchase Price:</label>
              <input
                type="number"
                className="form-control"
                name="purchase-price"
              />
            </div>

            <div className="col-md-3">
              <label class="form-label" for="upload-documents">
                Upload Documents:
              </label>
              <input
                type="file"
                class="form-control"
                id="upload-documents"
                name="property-documents"
              />
            </div>
             <div className="col-md-3">
              <label class="form-label" for="upload-documents">
                Upload Pictures:
              </label>
              <input
                type="file"
                class="form-control"
                id="upload-documents"
                name="property-documents"
              />
            </div>
             <hr></hr>
          </div>

          {/* adding syndicator info: */}

          <h4 className="header-text text-start">Investor Details</h4>

          <div className="text-start">
             <hr></hr>
            <h5
              className="add-investor"
              style={{ cursor: "pointer"}}
              onClick={addSyndicator}
            >
              <FaPlus />
              Add Investor
             
            </h5>
             <hr></hr>
          </div>

          {syndicator.map((syndicator, index) => (
            <SyndicatorDetails
              key={index}
              index={index}
              data={syndicator}
              onChange={updateSyndicator}
            />
          ))}

          <div className="text-center mt-5">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDeal;
