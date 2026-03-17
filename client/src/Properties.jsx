import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { GoPlus } from "react-icons/go";
import { AiOutlineSearch } from "react-icons/ai";
import "./css/index.css";

function Properties() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  const goToPropertyDetail = (id) => {
    navigate(`/property/${id}`);
  };

  const deleteProperty = async (propertyId) => {
    if (!propertyId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this property? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `https://thg-seven.vercel.app/api/properties/${propertyId}`,
        {
          method: "DELETE",
        },
      );
      const result = await res.json();

      if (!res.ok) {
        alert(`Failed to delete: ${result.error || "Unknown error"}`);
        return;
      }

      // Remove deleted property from state for smoother UX
      setData((prev) => prev.filter((p) => p.id !== propertyId));
      alert("Property deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting property");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://thg-seven.vercel.app/api/properties");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const searchData = data.filter((row) =>
    row.property_name?.toLowerCase().includes(search.toLowerCase()),
  );

  console.log(data);
  return (
    <>
      <div className="page-wrapper">
        {/* now we need tooltips for each one of them */}

        <div className="properties">
          <h4
            style={{
              color: "grey",
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
            style={{ color: "#1E293B", margin: "0px", paddingBottom: "25px" }}
          >
            PROPERTIES
          </h1>

          <div className="search">
            <AiOutlineSearch />
            <input placeholder="Search Properties"></input>
          </div>

          <div className="prop_section">
            <div className="prop_wrapper">
              <img
                src={data[0]?.secure_url}
                style={{
                  width: "350px",
                  height: "100%",
                  borderTopLeftRadius: "8px",
                  borderBottomLeftRadius: "8px",
                }}
              />

              <div className="display-section">
                <div className="property_flex ">
                  <div>
                    <h5 style={{marginLeft: '25PX'}}>{data[0]?.property_name}</h5>
                  </div>

                  <div className="financial-flex">

                  <div className="column-flex ">
                    <div>
                      <h6 className="fin-text">PURCHASE PRICE</h6>
                    </div>
                    <div>
                      <h6 className="fin-amount">${data[0]?.purchase_price}</h6>
                    </div>
                  </div>

                  <div className="column-flex">
                    <div>
                      <h6 className="fin-text">CLOSING DATE</h6>
                    </div>
                    <div>
                      <h6 className="fin-amount">${data[0]?.purchase_price}</h6>
                    </div>
                  </div>
                </div>
                </div>

                <div className="investor-section">
                  
<div className="investors-flex">

                  <h3 style={{padding: '0px 25px'}}>Property Investors</h3>

                  
<div className="investors_name_flex">
                  <div>
                    <h6 className="investor_name">Yankee Weiss</h6>
                  </div>

                   <div>
                    <h6>Yankee Weiss</h6>
                  </div>
                  </div>

                  </div>

                  

                  

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Properties;
