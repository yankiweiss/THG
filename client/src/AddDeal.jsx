import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import SyndicatorDetails from "./SyndicatorDetails";

function AddDeal() {
  const [syndicator, setSyndicator] = useState([
    { name: "", amount: "", percent: "" },
  ]);

  const addSyndicator = () => {
    setSyndicator((prev) => [
      ...prev,
      {
        name: "",
        amount: "",
        percent: "",
      },
    ]);
  };

  const updateSyndicator = (index, field, value) => {
    setSyndicator((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };
  return (
    <>
      <div className=" mx-auto w-75  mt-5 p-5 border border-dark rounded">
        <form>
          <div className="text-center">
            <h1 className="mt-4 badge text-bg-light fs-5">Property Details</h1>
          </div>
          <div className="row g-3 mt-1 d-flex justify-content-center">
            <div className="col-md-4">
              <label className="form-label">Property Address:</label>
              <input autoFocus className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Purchase Price:</label>
              <input className="form-control" />
            </div>
          </div>

          <div className="text-center">
            <h1
              className="mt-5 badge text-bg-light fs-5"
              style={{ cursor: "pointer" }}
              onClick={addSyndicator}
            >
              Add Syndicator 
            </h1>
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
    </>
  );
}

export default AddDeal;