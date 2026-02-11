import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";




function PropertyDetail() {
  const [property, setProperty] = useState([]);
  const [activeInvestor, setActiveInvestor] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
 const goToInvestorDetail = (propertyId, investorId) => {
  navigate(`/investorDetail/${propertyId}/${investorId}`);
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
    if (!value) return "0";
    return Number(value).toLocaleString("en-US");
  };

   const calculateTotalInvestment = () => {
    if (!property.investors) return 0;
    return property.investors.reduce(
      (sum, inv) => sum + (inv.invested_amount || 0),
      0
    );
  };

  //  function getQuarter(dateString) {
  //    const month = new Date(dateString).getMonth(); // 0–11
  //    return Math.floor(month / 3); // 0–3
  //  }

   const formatCurrency = (value) => {
    if (!value) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateComingIn) => {
    if (!dateComingIn) return "N/A";
    const date = new Date(dateComingIn);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateAverageReturn = () => {
    if (!property.investors || property.investors.length === 0) return 0;
    const total = property.investors.reduce(
      (sum, inv) => sum + (parseFloat(inv.perf_return) || 0),
      0
    );
    return (total / property.investors.length).toFixed(2);
  };
  const navigate = useNavigate();

  return (
    <>
       <style>{`
        :root {
          --primary-gradient: linear-gradient(135deg, #667eea 0%, #a594b4 100%);
          --success-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          --info-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          --border-radius: 16px;
          --shadow-sm: 0 2px 4px rgba(0,0,0,0.08);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
          --shadow-lg: 0 12px 24px rgba(0,0,0,0.15);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
          background: #f8f9fa;
        }

        .property-hero {
          background: var(--primary-gradient);
          border-radius: var(--border-radius);
          padding: 0;
          margin-bottom: 2rem;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          position: relative;
        }

        .property-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          color: white;
          padding: 3rem 2.5rem;
        }

        .property-image-wrapper {
          position: relative;
          height: 100%;
          min-height: 400px;
        }

        .property-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .property-name-input {
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          transition: var(--transition);
          backdrop-filter: blur(10px);
          width: 100%;
        }

        .property-name-input:focus {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.6);
          outline: none;
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
        }

        .property-name-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .property-name-display {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .edit-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.4);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          transition: var(--transition);
          cursor: pointer;
          backdrop-filter: blur(10px);
        }

        .edit-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.6);
          transform: translateY(-2px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .stat-card-modern {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          border: 1px solid #e5e7eb;
          position: relative;
          overflow: hidden;
        }

        .stat-card-modern::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--primary-gradient);
          transform: scaleY(0);
          transition: var(--transition);
        }

        .stat-card-modern:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .stat-card-modern:hover::before {
          transform: scaleY(1);
        }

        .stat-label {
          font-size: 0.8125rem;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-value {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }

        .section-card {
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .section-header {
          padding: 2rem 2.5rem 1.5rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-subtitle {
          color: #6b7280;
          font-size: 0.9375rem;
          margin: 0;
        }

        .investor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          padding: 2rem 2.5rem;
        }

        .investor-card-modern {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.75rem;
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }

        .investor-card-modern::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--primary-gradient);
          transform: scaleX(0);
          transition: var(--transition);
        }

        .investor-card-modern:hover {
          border-color: #a78bfa;
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .investor-card-modern:hover::before {
          transform: scaleX(1);
        }

        .investor-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .investor-initial {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.125rem;
        }

        .investor-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .investor-stat-item {
          text-align: center;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .investor-stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .investor-stat-value {
          font-size: 1.125rem;
          font-weight: 700;
          color: #059669;
        }

        .investor-stat-badge {
          display: inline-block;
          padding: 0.375rem 0.875rem;
          background: var(--primary-gradient);
          color: white;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9375rem;
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

        .quick-investors {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }

        .quick-investor-chip {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 50px;
          padding: 0.625rem 1.25rem;
          font-weight: 600;
          color: #374151;
          transition: var(--transition);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quick-investor-chip:hover {
          border-color: #a78bfa;
          background: #f9fafb;
          transform: translateY(-2px);
        }

        .chip-initial {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.75rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #9ca3af;
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .property-hero {
            margin-bottom: 1.5rem;
          }

          .hero-content {
            padding: 2rem 1.5rem;
          }

          .property-name-input,
          .property-name-display {
            font-size: 1.75rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .investor-grid {
            grid-template-columns: 1fr;
            padding: 1.5rem;
          }

          .section-header {
            padding: 1.5rem;
          }
        }
      `}</style>


      {console.log(property)}
      <div className="container-fluid px-3 px-md-4 py-4">
        {/* HERO SECTION */}
        <div className="property-hero">
          <div className="row g-0">
            <div className="col-md-5">
              <div className="property-image-wrapper">
                <img
                  src={
                    property.secure_url ||
                    "https://via.placeholder.com/800x600?text=Property+Image"
                  }
                  alt="Property"
                  className="property-image"
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="hero-content">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  {isEditing ? (
                    <input
                      value={property.property_name}
                      className="property-name-input"
                      onChange={(e) =>
                        setProperty({
                          ...property,
                          property_name: e.target.value,
                        })
                      }
                      placeholder="Property Name"
                      autoFocus
                    />
                  ) : (
                    <h1 className="property-name-display">
                      {property.property_name}
                    </h1>
                  )}
                  <button
                    className="edit-btn ms-3"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Save" : "Edit"}
                  </button>
                </div>

                <div className="stats-grid">
                  <div className="stat-card-modern">
                    <div
                      className="stat-icon"
                      style={{
                        background: "rgba(59, 130, 246, 0.1)",
                        color: "#3b82f6",
                      }}
                    >
                      💰
                    </div>
                    <div className="stat-label">Purchase Price</div>
                    <div className="stat-value">
                      {formatCurrency(property.purchase_price)}
                    </div>
                  </div>

                  <div className="stat-card-modern">
                    <div
                      className="stat-icon"
                      style={{
                        background: "rgba(16, 185, 129, 0.1)",
                        color: "#10b981",
                      }}
                    >
                      📊
                    </div>
                    <div className="stat-label">Total Investment</div>
                    <div className="stat-value">
                      {formatCurrency(calculateTotalInvestment())}
                    </div>
                  </div>

                  <div className="stat-card-modern">
                    <div
                      className="stat-icon"
                      style={{
                        background: "rgba(139, 92, 246, 0.1)",
                        color: "#8b5cf6",
                      }}
                    >
                      📅
                    </div>
                    <div className="stat-label">Closing Date</div>
                    <div className="stat-value" style={{ fontSize: "1.5rem" }}>
                      {formatDate(property.closing_date)}
                    </div>
                  </div>

                  <div className="stat-card-modern">
                    <div
                      className="stat-icon"
                      style={{
                        background: "rgba(245, 158, 11, 0.1)",
                        color: "#f59e0b",
                      }}
                    >
                      👥
                    </div>
                    <div className="stat-label">Total Investors</div>
                    <div className="stat-value">
                      {property.investors?.length || 0}
                    </div>
                  </div>

                  <div className="stat-card-modern">
                    <div
                      className="stat-icon"
                      style={{
                        background: "rgba(236, 72, 153, 0.1)",
                        color: "#ec4899",
                      }}
                    >
                      📈
                    </div>
                    <div className="stat-label">Avg Return</div>
                    <div className="stat-value" style={{ fontSize: "1.5rem" }}>
                      {calculateAverageReturn()}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK INVESTORS OVERVIEW */}
        {property.investors && property.investors.length > 0 && (
          <div className="section-card">
            <div className="section-header">
              <h2 className="section-title">
                <span style={{ fontSize: "1.5rem" }}>👥</span>
                Quick Investor Overview
              </h2>
              <p className="section-subtitle">
                {property.investors.length} investor
                {property.investors.length !== 1 ? "s" : ""} in this property
              </p>
              <div className="quick-investors">
                {property.investors.map((investor) => (
                  <div
                    key={investor.id}
                    className="quick-investor-chip"
                    onClick={() => goToInvestorDetail(property.id, investor.id)}
                  >
                    <div className="chip-initial">
                      {investor.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span>{investor.name}</span>
                    <span style={{ color: "#059669", fontWeight: "700" }}>
                      {formatCurrency(investor.invested_amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DETAILED INVESTOR PORTFOLIO */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">
              <span style={{ fontSize: "1.5rem" }}>📋</span>
              Investor Portfolio Details
            </h2>
            <p className="section-subtitle">
              Comprehensive breakdown of investor contributions and returns
            </p>
          </div>

          {property.investors && property.investors.length > 0 ? (
            <div className="investor-grid">
              {property.investors.map((investor) => (
                <div key={investor.id} className="investor-card-modern">
                  <div className="investor-name">
                    <div className="investor-initial">
                      {investor.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span>{investor.name}</span>
                  </div>

                  <div className="investor-stats">
                    <div className="investor-stat-item">
                      <div className="investor-stat-label">Invested</div>
                      <div className="investor-stat-value">
                        {formatCurrency(investor.invested_amount)}
                      </div>
                    </div>

                    <div className="investor-stat-item">
                      <div className="investor-stat-label">Pref Return</div>
                      <div>
                        <span className="investor-stat-badge">
                          {investor.perf_return || 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="view-details-btn"
                    onClick={() => goToInvestorDetail(property.id, investor.id)}
                  >
                    View Full Details →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h3>No Investors Yet</h3>
              <p>Add investors to track their portfolio details</p>
            </div>
          )}
        </div>
      </div>
          
      
    </>
  );
}

export default PropertyDetail;
