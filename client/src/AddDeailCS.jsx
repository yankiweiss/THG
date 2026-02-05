import "bootstrap/dist/css/bootstrap.min.css";
import SyndicatorDetails from "./SyndicatorDetails";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./index.css";

// function to submit the form to backend



function AddDealCS() {

  
  const [syndicator, setSyndicator] = useState([
    { investor_name: "", invested_amount: "", pref_return: "" },
  ]);

  const addSyndicator = () => {
    setSyndicator((prev) => [
      ...prev,
      {
        investor_name: "",
        invested_amount: "",
        pref_return: "",
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

    const picFile = form.querySelector('[name="pictures"]').files[0];

    const uploadToCloudinary = async (file) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "thehamiltongroup");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dhwtnj8eb/image/upload`,
        {
          method: "POST",
          body: fd,
        },
      );

      const data = await res.json();

      return data.secure_url;
    };

    let uploadedPicUrl = "";
    if (picFile) {
      uploadedPicUrl = await uploadToCloudinary(picFile);
    }

    if (!uploadedPicUrl) {
      alert("Image upload failed");
      return;
    }

    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());

    const payload = {
      ...dataObject,
      pictures: uploadedPicUrl,
      syndicator: syndicator,
    };

    console.log(payload);

    await fetch("https://thg-seven.vercel.app/api/properties/addDeal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  return (
    <>

   {
      <form onSubmit={handleForm} >
          <div className="container my-5" style={{ maxWidth: "1100px" }}>

             <div className="mb-4 text-center">
                
      <h2 className="fw-bold">Create New Property,</h2>
      <p className="text-muted">
        Set up your property details to start tracking investors and returns
      </p>
    </div>

    <div className="d-flex justify-content-center">
        <h2 className="bg-info bg-gradient p-3 border rounded mb-5">Co-Sponsors</h2>
    </div>

    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="fw-semibold mb-3">Property Information</h5>
          {/* ---------------- Property Details ---------------- */}
            <div className="row g-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Property Name
            </label>
            <input
              className="form-control form-control"
              name="property_name"
              placeholder="18 Pulaski St LLC"
              required
            />
            <small className="text-muted">
              Internal name or legal entity
            </small>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">
              Purchase Price
            </label>
            <input
              className="form-control"
              name="purchase_price"
              placeholder="1,000,000"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">
              Closing Date
            </label>
            <input
              type="date"
              className="form-control"
              name="closing_date"
            />
          </div>
        </div>
      </div>
    </div>
 <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="fw-semibold mb-3">Documents & Media</h5>

        <div className="row g-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Property Documents
            </label>
            <input
              type="file"
              className="form-control"
              multiple
            />
            <small className="text-muted">
              Operating agreement, PPM, contracts
            </small>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Property Images
            </label>
            <input
              type="file"
              className="form-control"
              name="pictures"
              multiple
            />
            <small className="text-muted">
              Used for overview and investor visibility
            </small>
          </div>
        </div>
      </div>
    </div>

          <div className="d-flex justify-content-center">
          
         
          </div>
          

          {/* ---------------- Investors Section ---------------- */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light fw-bold d-flex justify-content-between align-items-center">
              <span>Investor Details:</span>
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
                <div key={index} className="border rounded p-3 mb-3 bg-light">
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
                        prev.filter((_, i) => i !== index),
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
}
    </>
  );
}

export default AddDealCS;
