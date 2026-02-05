import "bootstrap/dist/css/bootstrap.min.css";
import SyndicatorDetails from "./SyndicatorDetails";

import { FaPlus } from "react-icons/fa";
import "./index.css";

// function to submit the form to backend

function AddDealLP() {
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
        <form onSubmit={handleForm}>
          <div className="container my-5" style={{ maxWidth: "1100px" }}>
            <div className="mt-5 text-center">
              <h2 className="fw-bold mt-5">Create New Property,</h2>
              <p className="text-muted mb-5">
                Set up your property details to start tracking investors and
                returns
              </p>
            </div>

            <div className="text-center mb-4">
              <span className="badge rounded-pill bg-warning text-dark px-5 py-2 fs-6">
                Limited Partner Deal
              </span>
            </div>

            <div className="card shadow-sm my-4 mt-5">
              <div className="card-body m-5">
               <div className="border-bottom pb-2 mb-4">
  <h5 className="fw-semibold mb-0">Property Information</h5>
  <small className="text-muted">Basic details about the asset</small>
</div>
                {/* ---------------- Property Details ---------------- */}
                <div className="row g-4 mt-3">
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

                <h5 className="fw-semibold m-3">Documents & Media</h5>

                <div className="row g-4 mt-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Property Documents
                    </label>
                    <input type="file" className="form-control" multiple />
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

                <div className="d-flex justify-content-center"></div>

                {/* ---------------- Investors Section ---------------- */}

                <h5 className="fw-semibold m-3">Ownership Details:</h5>
                <div className="row g-4 mt-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Ownership Name
                    </label>
                    <input
                      className="form-control form-control"
                      name="property_name"
                      required
                    />
                    <small className="text-muted">
                      Internal name or legal entity
                    </small>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Amount Invested
                    </label>
                    <input
                      className="form-control"
                      name="purchase_price"
                      placeholder="1,000,000"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Preferred Return
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="perf_return"
                    />
                  </div>
                </div>

                {/* ---------------- Save Button ---------------- */}
                <div className="text-center mb-5">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Save Deal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      }
    </>
  );
}

export default AddDealLP;
