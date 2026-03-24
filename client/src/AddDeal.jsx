import { useRef, useState } from "react";
import "./index.css";
import { MdOutlineUploadFile } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";

import { FaPlus } from "react-icons/fa";
function AddDeal() {
  const [CoSponsors, setCoSponsors] = useState(false);
  const [Investor, setInvestor] = useState([
    { investor_name: "", amount_invested: 0, preferred_return: 0 },
  ]);
   const formRef = useRef(null)


  const handleAddBtn = () => {
    setInvestor([
      ...Investor,
      { investor_name: "", amount_invested: 0, preferred_return: 0 },
    ]);
  };

  const handleDelete = (i) => {
    if (i === 0) {
      return;
    }
    const deleteVal = [...Investor];
    deleteVal.splice(i, 1);
    setInvestor(deleteVal);
  };

  const handleChange = (e, i) => {
    const { name, value } = e.target;
    setInvestor((AllInvestors) =>
      AllInvestors.map((item, index) =>
        index === i ? { ...item, [name]: value } : item,
      ),
    );
  };

 
 

  //
  //  const handleImagePreview = (e) => {
  //    const file = e.target.files[0];
  //    if (file) {
  //      const reader = new FileReader();
  //      reader.onloadend = () => {
  //        setPreviewImage(reader.result);
  //      };
  //      reader.readAsDataURL(file);
  //    }
  //  };

  //  const handleForm = async (e) => {
  //    e.preventDefault();
  //    setIsSubmitting(true);
  //
  //    try {
  //      const form = e.target;
  //      const picFile = form.querySelector('[name="pictures"]').files[0];
  //
  //      const uploadToCloudinary = async (file) => {
  //        const fd = new FormData();
  //        fd.append("file", file);
  //        fd.append("upload_preset", "thehamiltongroup");
  //
  //        setUploadProgress(30);
  //        const res = await fetch(
  //          `https://api.cloudinary.com/v1_1/dhwtnj8eb/image/upload`,
  //          {
  //            method: "POST",
  //            body: fd,
  //          },
  //        );
  //
  //        setUploadProgress(70);
  //        const data = await res.json();
  //        setUploadProgress(100);
  //        return data.secure_url;
  //      };
  //
  //      let uploadedPicUrl = "";
  //      if (picFile) {
  //        uploadedPicUrl = await uploadToCloudinary(picFile);
  //      }
  //
  //      if (!uploadedPicUrl) {
  //        alert("Image upload failed");
  //        setIsSubmitting(false);
  //        return;
  //      }
  //
  //      const formData = new FormData(form);
  //      const dataObject = Object.fromEntries(formData.entries());
  //
  //      const payload = {
  //        ...dataObject,
  //        pictures: uploadedPicUrl,
  //        investors: [investors],
  //      };
  //
  //      console.log(payload);
  //
  //      await fetch("https://thg-seven.vercel.app/api/properties/addDeal", {
  //        method: "POST",
  //        headers: {
  //          "Content-Type": "application/json",
  //        },
  //        body: JSON.stringify(payload),
  //      });
  //    } catch (err) {
  //      console.error(err);
  //      alert("Something went wrong. Check console.");
  //    } finally {
  //      setIsSubmitting(false);
  //    }
  //
  //    navigate("/properties");
  //
  //    // You can add success notification or redirect here
  //  };

  const submitData = async (e) => {
    e.preventDefault();
    let formData = new FormData(formRef.current);
    let allFormData = Object.fromEntries(formData);

    const payload = {
      allFormData, investor: [...Investor]
    }
try {
   await fetch('https://thg-seven.vercel.app/api/AddDeal', {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(payload)
    })
  
} catch (error) {
  console.log(error)
}
   

    

    setInvestor([
      { investor_name: "", amount_invested: "", preferred_return: "" },
    ]);

    formRef.current.reset();
  };

  return (
    <>
      <div className="right-side">
        <div className="top-content">
          <div className="column-flex AD-item">
            <h3 className="fw600">CREATE NEW PROPERTY</h3>
            <p style={{ color: "#7F9DC9" }}>
              Set up your property details to start tracking investors <br></br>
              and returns with comprehensive portfolio management
            </p>
          </div>

          <button
            style={{ height: "2rem" }}
            className="deal-btn AD-item"
            onClick={() => setCoSponsors(false)}
          >
            Limited Partner Deal
          </button>

          <button
            style={{ height: "2rem" }}
            className="deal-btn AD-item"
            onClick={() => setCoSponsors(true)}
          >
            Co-Sponsors
          </button>
        </div>

        <form ref={formRef}>
          <div className="prop-info-image">
            <div
              className="column-flex"
              style={{ alignItems: "start", width: "55%" }}
            >
              <h3 className="fw600">Property Information</h3>
              <p style={{ color: "#7F9DC9" }}>
                Essential details about the property asset
              </p>

              <label
                htmlFor="property_name"
                className="fw600 "
                style={{ marginBottom: "10px" }}
              >
                Property Name
              </label>
              <input
                type="text"
                name="property_name"
                id="property_name"
                className="deal-input"
                autoFocus
              ></input>

              <label
                htmlFor="property_name"
                className="fw600"
                style={{ marginBottom: "10px" }}
              >
                Purchase Price{" "}
              </label>
              <input
                type="text"
                name="purchase_price"
                id="purchase_price"
                className="deal-input"
              ></input>

              <label
                htmlFor="closing_date"
                className="fw600"
                style={{ marginBottom: "10px" }}
              >
                Closing Date
              </label>
              <input
                type="text"
                name="closing_date"
                id="closing_date"
                className="deal-input"
              ></input>
            </div>

            <div
              className="column-flex"
              style={{ alignItems: "start", width: "55%" }}
            >
              <h3 className="fw600">Documents & Media</h3>
              <p style={{ color: "#7F9DC9" }}>
                Upload property images and related documents
              </p>

              <button className="upload_field">
                <MdOutlineUploadFile fontSize={"50px"} color="#2569C0" />
                <div className="column-flex">
                  <h5 className="fw600">Click to upload documents</h5>
                  <h6 style={{ color: "#7F9DC9" }}>
                    Operating agreement, PPM, contracts
                  </h6>
                </div>
              </button>

              <button className="upload_field">
                <MdOutlineUploadFile fontSize={"50px"} color="#2569C0" />
                <div className="column-flex">
                  <h5 className="fw600">Click to upload images</h5>
                  <h6 style={{ color: "#7F9DC9" }}>
                    Used for property overview
                  </h6>
                </div>
              </button>
            </div>
          </div>
          </form>

          <div className="AD_investor_section">
            <div className="investor_heading">
              <div className="investor_heading-wording">
                <h3 className="fw600">Investor Details</h3>
                <h6>Add investor and contribution details</h6>
              </div>
              {CoSponsors && (
                <button
                  className="add-investor-btn"
                  type="button"
                  onClick={handleAddBtn}
                >
                  {" "}
                  <FaPlus /> Add Investor
                </button>
                
              )}
            </div>

            {Investor.map((value, i) => (
              <>
                <div className="investor_form" key={i}>
                  <div className="column-flex" style={{ alignItems: "start" }}>
                    <label
                      htmlFor="investor_name"
                      className="fw600"
                      style={{ marginBottom: "10px" }}
                    >
                      Investor Name{" "}
                    </label>
                    <input
                      type="text"
                      name="investor_name"
                      id="investor_name"
                      value={value.investor_name}
                      className="deal-input"
                      onChange={(e) => handleChange(e, i)}
                    ></input>
                  </div>
                  <div className="column-flex" style={{ alignItems: "start" }}>
                    <label
                      htmlFor="amount_invested"
                      className="fw600"
                      style={{ marginBottom: "10px" }}
                    >
                      Amount Invested{" "}
                    </label>
                    <input
                      type="text"
                      name="amount_invested"
                      id="amount_invested"
                      value={value.amount_invested}
                      className="deal-input"
                      onChange={(e) => handleChange(e, i)}
                    ></input>
                  </div>

                  <div className="column-flex" style={{ alignItems: "start" }}>
                    <label
                      htmlFor="preferred_return"
                      className="fw600"
                      style={{ marginBottom: "10px" }}
                    >
                      Preferred Return{" "}
                    </label>
                    <input
                      type="text"
                      name="preferred_return"
                      id="preferred_return"
                      className="deal-input"
                      value={value.preferred_return}
                      onChange={(e) => handleChange(e, i)}
                    ></input>
                  </div>
                  {CoSponsors && (
                    <button
                      type="button"
                      style={{ border: "none", backgroundColor: "transparent" }}
                      onClick={() => handleDelete(i)}
                    >
                      <RiDeleteBin5Line fontSize={"25px"} color="red" />
                    </button>
                  )}
                  <hr></hr>
                </div>
              </>
            ))}
          </div>

          <button type="submit" className="submitBtn" onClick={submitData}>
            Create New Property
          </button>
    
      </div>
    </>
  );
}

export default AddDeal;
