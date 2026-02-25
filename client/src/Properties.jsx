import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";


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

  return (
    <>
      <style>{`
      :root{ --primary-gradient: linear-gradient(135deg, #0240dbe5 0%, #a2b9dd 100%);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
           .view-details-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .view-details-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .view-details-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

      .view-details-btn {
          width: 100%;
          background: var(--primary-gradient);
          border: none;
          color: white;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          transition: var(--transition);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .property-card {
          transition: all 0.3s ease;
          border: 1px solid #e0e0e0;
          overflow: hidden;
        }
        .property-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15) !important;
          border-color: #0d6efd;
        }
        .property-card img {
          transition: transform 0.3s ease;
        }
        .property-card:hover img {
          transform: scale(1.05);
        }
        .search-container {
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          font-size: 1.2rem;
        }
        .search-input {
          padding-left: 3rem;
          border-radius: 50px;
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        }
        .search-input:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13,110,253,.15);
        }
        .view-toggle {
          display: inline-flex;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #dee2e6;
        }
        .view-toggle button {
          border: none;
          background: white;
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: all 0.2s;
          border-right: 1px solid #dee2e6;
        }
        .view-toggle button:last-child {
          border-right: none;
        }
        .view-toggle button.active {
          background: #0d6efd;
          color: white;
        }
        .view-toggle button:hover:not(.active) {
          background: #f8f9fa;
        }
        .stats-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.95);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .delete-btn {
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .property-card:hover .delete-btn {
          opacity: 1;
        }
        .list-view-card {
          transition: all 0.2s ease;
        }
        .list-view-card:hover {
          background-color: #f8f9fa;
          border-left: 4px solid #0d6efd;
        }
        .skeleton {
          animation: skeleton-loading 1s linear infinite alternate;
        }
        @keyframes skeleton-loading {
          0% { background-color: hsl(200, 20%, 80%); }
          100% { background-color: hsl(200, 20%, 95%); }
        }
        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
        }
        .empty-state-icon {
          font-size: 4rem;
          opacity: 0.3;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="min-vh-100 bg-light">
        {/* Header Section */}
        <div className="bg-white border-bottom shadow-sm">
          <div className="container py-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h2 className="mb-1 fw-bold">Property Portfolio</h2>
                <p className="text-muted mb-0">
                  {loading ? (
                    "Loading..."
                  ) : (
                    <>
                      {data.length}{" "}
                      {data.length === 1 ? "property" : "properties"} total
                      {search && ` • ${searchData.length} matching`}
                    </>
                  )}
                </p>
              </div>
              <div className="col-md-6 text-md-end mt-3 mt-md-0">
                <div className="d-inline-flex gap-3 align-items-center">
                  <div className="view-toggle">
                    <button
                      className={viewMode === "grid" ? "active" : ""}
                      onClick={() => setViewMode("grid")}
                      title="Grid View"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z" />
                      </svg>
                    </button>
                    <button
                      className={viewMode === "list" ? "active" : ""}
                      onClick={() => setViewMode("list")}
                      title="List View"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="row justify-content-center mt-4">
              <div className="col-md-8 col-lg-6">
                <div className="search-container">
                  <span className="search-icon">🔍</span>
                  <input
                    className="form-control form-control-lg search-input"
                    placeholder="Search properties by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                      onClick={() => setSearch("")}
                      style={{ textDecoration: "none" }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="container py-4">
          {loading ? (
            // Loading Skeleton
            <div className={viewMode === "grid" ? "row g-4" : ""}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={viewMode === "grid" ? "col-md-6 col-lg-4" : "mb-3"}
                >
                  <div className="card border-0 shadow-sm">
                    <div
                      className="skeleton"
                      style={{
                        height: viewMode === "grid" ? "200px" : "120px",
                      }}
                    ></div>
                    <div className="card-body">
                      <div
                        className="skeleton rounded mb-2"
                        style={{ height: "20px", width: "70%" }}
                      ></div>
                      <div
                        className="skeleton rounded"
                        style={{ height: "16px", width: "40%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchData.length > 0 ? (
            viewMode === "grid" ? (
              // Grid View
              <div className="row g-4">
                {searchData.map((row) => (
                  <div key={row.id} className="col-md-6 col-lg-4">
                    <div
                      className="card property-card h-100 border-0 shadow-sm"
                      style={{ cursor: "pointer" }}
                      onClick={() => goToPropertyDetail(row.id)}
                    >
                      {/* Property Image */}
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        <img
                          src={row.secure_url}
                          alt={row.property_name}
                          className="card-img-top"
                          style={{ objectFit: "cover", height: "220px" }}
                        />
                      </div>

                      <div className="card-body d-flex flex-column">
                        {/* Property Name */}
                        <h5 className="card-title fw-bold mb-3">
                          {row.property_name}
                        </h5>

                        {/* Property Info */}
                        {row.purchase_price && (
                          <div className="mb-3">
                            <small className="text-muted">Purchase Price</small>
                            <div>
                              <NumericFormat
                                className="fw-bold text-success"
                                style={{ border: "none" }}
                                value={row.purchase_price}
                                thousandSeparator={true}
                                prefix={"$"}
                                 decimalScale={2} 
                     fixedDecimalScale={true}
                              />
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-auto d-flex gap-2">
                          <button
                            className="view-details-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              goToPropertyDetail(row.id);
                            }}
                          >
                            View Full Details →
                          </button>
                          <button
                            className="btn btn-outline-danger delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProperty(row.id);
                            }}
                            title="Delete property"
                          >
                            <svg
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                              <path
                                fillRule="evenodd"
                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="row">
                <div className="col-12">
                  {searchData.map((row) => (
                    <div
                      key={row.id}
                      className="card list-view-card mb-3 border-0 shadow-sm"
                      style={{ cursor: "pointer" }}
                      onClick={() => goToPropertyDetail(row.id)}
                    >
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-md-2">
                            <img
                              src={row.secure_url}
                              alt={row.property_name}
                              className="rounded"
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100px",
                              }}
                            />
                          </div>
                          <div className="col-md-6">
                            <h5 className="fw-bold mb-2">
                              {row.property_name}
                            </h5>
                            {row.purchase_price && (
                              <div>
                                <small className="text-muted">
                                  Purchase Price:{" "}
                                </small>
                                <span className="fw-semibold text-success">
                                  ${Number(row.purchase_price).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="col-md-4 text-md-end mt-3 mt-md-0">
                            <div className="d-flex gap-2 justify-content-md-end view-details-btn">
                              <button
                                className="view-details-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  goToPropertyDetail(row.id);
                                }}
                              >
                                View Full Details →
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteProperty(row.id);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            // Empty State
            <div className="empty-state">
              <div className="empty-state-icon">🏘️</div>
              <h4 className="fw-bold mb-2">
                {search
                  ? "No properties match your search"
                  : "No properties found"}
              </h4>
              <p className="text-muted">
                {search ? (
                  <>
                    Try adjusting your search terms or{" "}
                    <button
                      className="btn btn-link p-0"
                      onClick={() => setSearch("")}
                    >
                      clear filters
                    </button>
                  </>
                ) : (
                  "Get started by adding your first property"
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Properties;
