import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";



import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, // <-- add this
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // <-- add this
  PointElement, // <-- add this
  Tooltip,
  Legend,
);

function PropertyDetail() {
  const [property, setProperty] = useState([]);
  const [activeInvestor, setActiveInvestor] = useState(null);
  
 const goToInvestorDetail = (id) => {
    navigate(`/investorDetail/${id}`);
  };

  const { id } = useParams();

  useEffect(() => {
    fetch(`https://thg-seven.vercel.app/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => setProperty(data))
      .catch((err) => console.error(err));
  }, [id]);

  const years = useMemo(() => {
    if (!property.events?.length) return [];

    return [
      ...new Set(
        property.events.map((e) => new Date(e.event_date).getFullYear()),
      ),
    ].sort((a, b) => a - b);
  }, [property.events]);

  const [activeYear, setActiveYear] = useState(null);

  // ✅ Safe: runs AFTER render
  useEffect(() => {
    if (years.length && !activeYear) setActiveYear(years[0]);
    if (property.investors?.length && !activeInvestor)
      setActiveInvestor(property.investors[0].id);
  }, [years, property.investors]);

  

  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("en-US");
  };

  //  function getQuarter(dateString) {
  //    const month = new Date(dateString).getMonth(); // 0–11
  //    return Math.floor(month / 3); // 0–3
  //  }

  

  function formatDate(dateComingIn) {
    const date = new Date(dateComingIn);

    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .stat-card {
          transition: all 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .investor-card {
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }
        .investor-card:hover {
          border-left-color: #0d6efd;
          transform: translateX(4px);
        }
        .event-item {
          transition: background-color 0.2s ease;
        }
        .event-item:hover {
          background-color: #f8f9fa;
        }
        .section-header {
          position: relative;
          padding-bottom: 1rem;
          margin-bottom: 2rem;
        }
        .section-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200px;
          height: 3px;
          background: linear-gradient(to right, #0d6efd, transparent);
        }
        .badge-event {
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.75rem;
        }
        .btn-icon {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>

      {console.log(property)}
      <div className="container-fluid px-3 py-5 bg-light ">
        {/* HEADER SECTION */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h2 className="mb-1 fw-bold section-header text-dark">
                Property Overview
              </h2>
              <p className="text-muted mb-0">
                Manage property details and investor activity
              </p>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-md-3 mb-3 mb-md-0">
                <img
                  src={property.secure_url}
                  alt="Property"
                  className="rounded shadow-sm w-100"
                  style={{ objectFit: "cover", height: "220px" }}
                />
              </div>
              <div className="col-md-9">
                <div className="d-flex align-items-center">
                  <label className="form-label w-25">Property Name:</label>
                  <input
                    value={property.property_name}
                    className="form-control fs-3 fw-bold mb-4 border-0 bg-transparent px-0"
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        property_name: e.target.value,
                      })
                    }
                    placeholder="Property Name"
                  />
                </div>

                <div className="row g-3">
                  <div className="col-6 col-lg-3">
                    <div className="stat-card border rounded-3 p-3 text-center bg-white h-100">
                      <div className="text-muted small mb-2">
                        Purchase Price
                      </div>
                      <div className="fw-bold fs-5 text-primary">
                        ${formatNumber(property.purchase_price)}
                      </div>
                    </div>
                  </div>

                  <div className="col-6 col-lg-3">
                    <div className="stat-card border rounded-3 p-3 text-center bg-white h-100">
                      <div className="text-muted small mb-2">Closing Date</div>
                      <div className="fw-bold fs-6">
                        {formatDate(property.closing_date)}
                      </div>
                    </div>
                  </div>

                  <div className="col-6 col-lg-3">
                    <div className="stat-card border rounded-3 p-3 text-center bg-white h-100">
                      <div className="text-muted small mb-2">
                        Total Investors
                      </div>
                      <div className="fw-bold fs-5 text-success">
                        {property.investors?.length || 0}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h1>Investors:</h1>
                    <div className="d-flex ">

                      {property.investors?.map((i) => (
                        <div className="stat-card border rounded-3 p-3 text-center bg-white h-100 m-3">
                        <p>{i.investor_name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <h2 className="mb-1 fw-bold section-header text-dark">
              Investor Portfolio
            </h2>
            <h6 className="text-muted mb-3">
              A summary of all investors and their key details.
            </h6>
            <div className="row">
              {property.investors?.map((i) => (
                <div key={i.id} className="mb-3">
                  <div className="card investor-card h-100 border ">
                    <div className="card-body p-3">
                      <h6 className="fw-bold mb-3 text-truncate">
                        <span className="text-muted">Investor Name:</span>
                        <br /> {i.investor_name}
                      </h6>
                      <div className="d-flex gap-3 align-items-center justify-content-center">
                        <div className="d-flex gap-3 align-items-center justify-content-center mb-2">
                          <div>
                            <span className="text-muted small">Invested</span>
                            <div>
                              <strong className="text-success">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(i.invested_amount)}
                              </strong>
                            </div>
                          </div>

                          <div>
                            <hr
                              className="border-start border border-dark "
                              style={{ height: "40px" }}
                            />
                          </div>
                        </div>

                        <div className="d-flex gap-3 align-items-center justify-content-center mb-2">
                          <div>
                            <span className="text-muted small">
                              Pref Return
                            </span>
                            <div>
                              <span className="badge bg-primary">
                                {i.pref_return}%
                              </span>
                            </div>
                          </div>

                          <div></div>
                          <hr
                            className="border-start border border-dark "
                            style={{ height: "40px" }}
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn btn-primary"
                          onClick={() => goToInvestorDetail(i.id)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                //Need to see what other details to include here.
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PropertyDetail;
