import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PropertyDetail() {
  const [property, setProperty] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    fetch(`https://thg-seven.vercel.app/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => setProperty(data))
      .catch((err) => console.error(err));
  }, [id]); // ✅ dependency array

  return (
    <>
    {console.log(property)}
      <div className="container my-5">
        {/* ================= Patient Info ================= */}

        <h4 className="m-5">{property.property_name}</h4>
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light fw-bold">Property Details</div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-2">
                <label className="form-label">Property Name</label>
                <input
                  className="form-control"
                  value={property.property_name}
                ></input>
              </div>

              <div className="col-md-2">
                <label className="form-label">Purchase Price</label>
                <input
                  className="form-control"
                  value={property.purchase_price}
                ></input>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light fw-bold">Investor Details</div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-2">
                <label className="form-label">Investor Name</label>
                <input
                  className="form-control"
                 
                ></input>
              </div>

              <div className="col-md-2">
                <label className="form-label">Amount Invested</label>
                <input
                  className="form-control"
                
                ></input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PropertyDetail;
