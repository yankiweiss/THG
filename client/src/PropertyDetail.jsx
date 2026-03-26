import "./css/index.css";
import { useParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";

function PropertyDetail() {
  const [propertyData, setPropertyData] = useState([]);

  let { id } = useParams();

  const fetchProperty = async () => {
    await fetch(`https://thg-seven.vercel.app/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => setPropertyData(data));
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  console.log(typeof propertyData.closing_date);

  return (
    <>
      <div className="right-side">
        <div className="main-flex">
          <div className="property-content">
            <h3 className="fw600">{propertyData.property_name}</h3>

            <div className="propertyDetail_flex">
              <img
                src={propertyData.secure_url}
                max-width={"500px"}
                max-height={"200px"}
                width={"500px"}
                height={"200px"}
                style={{
                  borderRadius: "8px",
                  boxShadow: "4px 4px 5px 1px  #1B3C77BF",
                }}
                alt="property_picture"
              />

              <div className="propertyDetail_fin_flex">
                <div>
                  <h6 className="PropertyDetail-fin-text">Total Investors</h6>
                  <h6 className="PropertyDetail-fin-value">4</h6>
                </div>
                <div>
                  <h6 className="PropertyDetail-fin-text">Purchase Price</h6>
                  <h6 className="PropertyDetail-fin-value">
                    {propertyData.purchase_price}
                  </h6>
                </div>
                <div>
                  <h6 className="PropertyDetail-fin-text">Closing Date</h6>
                  <h6 className="PropertyDetail-fin-value">
                    {propertyData?.closing_date
                      ? format(
                          new Date(propertyData.closing_date),
                          "MM/dd/yyyy",
                        )
                      : "Loading..."}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <div className="PD-in-sec">
            <h4 style={{ fontWeight: "600", marginBottom: "15px" }}>
              QUICK INVESTORS OVERVIEW
            </h4>

            <div className="PD-in-sec-dt">
              {propertyData?.investors?.map((inv) => (
                <div className="investors_section">
                  <h3 className="fw600 item">{inv.name}</h3>

                  <Link to={`/investorDetail/${propertyData.id}/${inv.id}`}>
                    <div className="investor_details">
                      <h6
                        style={{
                          textAlign: "center",
                          color: "#2570C0",
                          fontWeight: "600",
                        }}
                        className="item k"
                      >
                        Investor<br></br> Portfolio<br></br> Details
                      </h6>

                      <div className="flex-column item k">
                        <h6 className="fw600">INVESTED</h6>
                        <h6 style={{ color: "#2570C0" }} className="fw600">
                          {inv.invested_amount}
                        </h6>
                      </div>

                      <div className="flex-column item k">
                        <h6 className="fw600">PERF RETURN</h6>
                        <h6 style={{ color: "#2570C0" }} className="fw600">
                          %{inv.perf_return}
                        </h6>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="add-investor-section">
          <button className="add-investor">
            <FiPlus style={{ fontSize: "26px" }} />
            Add Investor
          </button>
        </div>
      </div>
    </>
  );
}

export default PropertyDetail;
