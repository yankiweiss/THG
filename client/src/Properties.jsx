import { AiOutlineSearch } from "react-icons/ai";
import "./css/index.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PropertyDetail from "./PropertyDetail";
import { format } from "date-fns";

function Properties() {
  const [propertyData, setPropertyData] = useState([]);

  const getAllProperties = async () => {
    await fetch("https://thg-seven.vercel.app/api/properties")
      .then((response) => response.json())
      .then((data) => setPropertyData(data));
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  return (
    <>
      <div className="page-wrapper">
        {/* now we need tooltips for each one of them */}

        <div className="right-side">
          <h4
            style={{
              color: "#6780B2",
              letterSpacing: "1px",
              paddingLeft: "50px",
              paddingTop: "55px",
              fontSize: "15px",
              margin: "0px",
            }}
          >
            PORTFOLIO
          </h4>

          <h1
            className="header"
            style={{
              color: "#000000",
              margin: "0px",
              paddingBottom: "25px",
              fontWeight: "bold",
            }}
          >
            PROPERTIES
          </h1>

          <div className="search">
            <AiOutlineSearch color="#AABFE2" fontSize={"25px"} />
            <input placeholder="Search Properties"></input>
          </div>

          <section>
            {propertyData.map((property) => (
              <div className="prop_section">
                <Link to={`propertyDetail/${property.id}`}>
                  {" "}
                  <div className="prop_wrapper">
                    <img
                      src={property?.secure_url}
                      style={{ width: "250px", height: "auto" }}
                    />

                    <div className="display-section">
                      <div className="property_flex ">
                        <h5
                          style={{
                            marginLeft: "25PX",
                            fontWeight: "bold",
                            color: "black",
                          }}
                          className="property_flex_item"
                        >
                          {property?.property_name}
                        </h5>

                        <div className="flex-right property_flex_item">
                          <div className="column-flex">
                            <h6 className="fin-text">PURCHASE PRICE</h6>

                            <h6 className="fin-amount">
                              ${property?.purchase_price}
                            </h6>
                          </div>

                          <div className="column-flex ">
                            <h6 className="fin-text">CLOSING DATE</h6>

                            <h6 className="fin-amount">
                              {format(property?.closing_date, "MM/dd/yyyy")}
                            </h6>
                          </div>
                        </div>
                      </div>

                      <div className="investor-section">
                        <h3
                          style={{
                            padding: "0px 25px",
                            color: "#2570C0",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                          }}
                        >
                          PROPERTY INVESTORS:
                        </h3>

                        <div className="investors_name_flex">
                          <h6 className="investor_name">Yankee Weiss</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}

export default Properties;
