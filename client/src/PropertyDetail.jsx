import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

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
  const [newEvent, setNewEvent] = useState({
    event_date: "",
    event_type: "",
    event_amount: "",
    notes: "",
  });
  const [investorMode, setInvestorMode] = useState("view");
  const [addActiveInvestor, setAddActiveInvestor] = useState(null);

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

  const handleInvestor = async (e) => {
    e.preventDefault();
    const propertyID = id;
    const form = e.target;
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());
    const payload = { ...dataObject, property_id: propertyID };
    const res = await fetch("https://thg-seven.vercel.app/api/properties/postInvestor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const { investor } = await res.json();

    setProperty((prev) => ({
      ...prev,
      investors: [...(prev.investors || []), investor],
    }));

    setInvestorMode('view')
  };

  const handleEvent = async (investorId) => {
    const payload = { ...newEvent, investor_id: investorId };

    const res = await fetch("https://thg-seven.vercel.app/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const { event } = await res.json();

    setProperty((prev) => ({
      ...prev,
      events: [...(prev.events || []), event],
    }));

    setNewEvent({
      event_date: "",
      event_type: "",
      event_amount: "",
      notes: "",
    });
  };

  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("en-US");
  };

  //  function getQuarter(dateString) {
  //    const month = new Date(dateString).getMonth(); // 0–11
  //    return Math.floor(month / 3); // 0–3
  //  }

  function daysBetween(start, end) {
    const msPerDay = 1000 * 60 * 60 * 24;

    return Math.max(0, Math.floor((end - start) / msPerDay));
  }

  function getReturnsToDate(investorEvents, investorId, property) {
    const closingDate = new Date(property.closing_date);
    const today = new Date();

    // ---- ACTUAL RETURNS TO DATE ----
    const actual = (investorEvents || [])
      .filter(
        (e) =>
          e.investor_id === investorId &&
          e.event_type === "Return" &&
          new Date(e.event_date) >= closingDate &&
          new Date(e.event_date) <= today,
      )
      .reduce((sum, e) => sum + Number(e.event_amount || 0), 0);

    // ---- EXPECTED RETURNS TO DATE ----
    const investor = property.investors?.find((i) => i.id === investorId);
    let expected = 0;

    if (investor) {
      const invested = Number(investor.invested_amount || 0);
      const annualPrefRate = Number(investor.pref_return || 0) / 100;

      const daysElapsed = daysBetween(closingDate, today);

      // annual pref → daily pref → elapsed days
      expected = invested * annualPrefRate * (daysElapsed / 365);
    }

    return {
      actual: Number(actual.toFixed(2)),
      expected: Number(expected.toFixed(2)),
    };
  }

  function buildChartData(events, year, investor) {
    const quarterlyActuals = [0, 0, 0, 0];
    const quarterlyExpected = [0, 0, 0, 0];

    const investorEvents = events.filter(
      (e) =>
        e.investor_id === investor &&
        new Date(e.event_date).getFullYear() === year,
    );

    // Sum quarterly actual returns
    investorEvents.forEach((e) => {
      const quarter = Math.floor(new Date(e.event_date).getMonth() / 3);
      if (e.event_type === "Return")
        quarterlyActuals[quarter] += Number(e.event_amount || 0);
    });

    // Expected return per quarter
    const currentInvestor = property.investors?.find((e) => e.id === investor);
    if (currentInvestor) {
      const prefAmount =
        Number(currentInvestor.invested_amount || 0) *
        (Number(currentInvestor.pref_return || 0) / 100);
      const perQuarter = prefAmount / 4;
      for (let i = 0; i < 4; i++) quarterlyExpected[i] = perQuarter;
    }

    // Build cumulative returns

    return {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          type: "bar",
          label: "Quarter Actual Return",
          data: quarterlyActuals,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
        {
          type: "bar",
          label: "Quarter Expected Return",
          data: quarterlyExpected,
          backgroundColor: "rgba(255, 99, 132, 0.7)",
        },
      ],
    };
  }

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            const value = `$${context.raw.toLocaleString()}`;
            return context.dataset.label.includes("Return to Date")
              ? `${context.dataset.label}: ${value}`
              : `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: { ticks: { maxRotation: 0, minRotation: 0 } },
      y: {
        beginAtZero: true,
        ticks: { callback: (val) => `$${val.toLocaleString()}` },
      },
    },
  };

  function formatDate(dateComingIn) {
    const date = new Date(dateComingIn);

    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

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
          width: 60px;
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
      <div className="container-fluid px-4 py-4 bg-light min-vh-100">
        {/* HEADER SECTION */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h2 className="mb-1 fw-bold text-dark">Property Overview</h2>
              <p className="text-muted mb-0">Manage property details and investor activity</p>
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
                <input
                  value={property.property_name}
                  className="form-control fs-3 fw-bold mb-4 border-0 bg-transparent px-0"
                  onChange={(e) =>
                    setProperty({ ...property, property_name: e.target.value })
                  }
                  placeholder="Property Name"
                />

                <div className="row g-3">
                  <div className="col-6 col-lg-3">
                    <div className="stat-card border rounded-3 p-3 text-center bg-white h-100">
                      <div className="text-muted small mb-2">Purchase Price</div>
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
                      <div className="text-muted small mb-2">Total Investors</div>
                      <div className="fw-bold fs-5 text-success">
                        {property.investors?.length || 0}
                      </div>
                    </div>
                  </div>

                  <div className="col-6 col-lg-3">
                    <div className="stat-card border rounded-3 p-3 text-center bg-white h-100">
                      <div className="text-muted small mb-2">Total Events</div>
                      <div className="fw-bold fs-5 text-info">
                        {property.events?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <h4 className="section-header fw-bold">Investor Portfolio</h4>
            <div className="row g-3">
              {property.investors?.map((i) => (
                <div key={i.id} className="col-md-6 col-lg-3">
                  <div className="card investor-card h-100 border">
                    <div className="card-body p-3">
                      <h6 className="fw-bold mb-3 text-truncate">{i.investor_name}</h6>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small">Invested</span>
                        <strong className="text-success">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(i.invested_amount)}
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small">Pref Return</span>
                        <span className="badge bg-primary">{i.pref_return}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>

      

<div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <h4 className="section-header fw-bold">Return Performance Analysis</h4>
            <p className="text-muted mb-4">Compare actual vs expected returns by investor and quarter</p>

            {/* FILTERS */}
            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <label className="form-label fw-semibold small text-muted">SELECT INVESTOR</label>
                <select
                  className="form-select form-select-lg"
                  value={activeInvestor || ""}
                  onChange={(e) => setActiveInvestor(Number(e.target.value))}
                >
                  <option value="">All Investors</option>
                  {property.investors?.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.investor_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold small text-muted">SELECT YEAR</label>
                <select
                  className="form-select form-select-lg"
                  value={activeYear || ""}
                  onChange={(e) => setActiveYear(Number(e.target.value))}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 d-flex align-items-end">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setActiveInvestor(null);
                    setActiveYear(years[0]);
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* RETURN TO DATE STATS */}
            {activeInvestor && (
              <div className="row g-3 mb-4">
                {(() => {
                  const { actual, expected } = getReturnsToDate(
                    property.events,
                    activeInvestor,
                    property,
                  );
                  return (
                    <>
                      <div className="col-md-4">
                        <div className="p-4 bg-light border-start border-5 border-success rounded">
                          <div className="text-muted small mb-1">Actual Return to Date</div>
                          <div className="fw-bold fs-4 text-success">
                            ${actual.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-4 bg-light border-start border-5 border-warning rounded">
                          <div className="text-muted small mb-1">Expected Return to Date</div>
                          <div className="fw-bold fs-4 text-warning">
                            ${expected.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-4 bg-light border-start border-5 border-primary rounded">
                          <div className="text-muted small mb-1">Investment Start Date</div>
                          <div className="fw-bold fs-5">
                            {formatDate(property.closing_date)}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* CHART */}
            <div style={{ height: "400px" }} className="mt-4">
              <Bar
                data={buildChartData(
                  property.events || [],
                  activeYear,
                  activeInvestor,
                )}
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        {/* CAPITAL ACTIVITY */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1">Capital Activity</h4>
                <p className="text-muted small mb-0">Manage ownership, capital calls, and distributions</p>
              </div>
              <button
                className="btn btn-primary btn-icon"
                onClick={() => setInvestorMode("add")}
              >
                <span>+</span> Add Investor
              </button>
            </div>

            {/* ADD INVESTOR FORM */}
            {investorMode === "add" && (
              <div className="card border-primary mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Add New Investor</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleInvestor}>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Investor Name</label>
                        <input
                          className="form-control"
                          placeholder="John Doe"
                          name="investor_name"
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Initial Investment</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="100,000"
                            name="invested_amount"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Preferred Return (%)</label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="8"
                            name="pref_return"
                            step="0.1"
                            required
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 d-flex gap-2">
                      <button type="submit" className="btn btn-success">
                        Save Investor
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setInvestorMode("view")}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* INVESTOR ACTIVITY CARDS */}
            <div className="row g-4">
              {property.investors?.map((inv) => {
                const investorEvents = property.events
                  ?.filter((e) => e.investor_id === inv.id)
                  .slice()
                  .sort(
                    (a, b) => new Date(b.event_date) - new Date(a.event_date),
                  );
                const totalInvestment = investorEvents
                  .filter(
                    (e) =>
                      e.event_type === "Investment" ||
                      e.event_type === "Capital Call",
                  )
                  .reduce((sum, e) => sum + Number(e.event_amount || 0), 0);

                return (
                  <div key={inv.id} className="col-lg-6">
                    <div className="card h-100 border">
                      <div className="card-header bg-white border-bottom">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0 fw-bold">{inv.investor_name}</h5>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => setAddActiveInvestor(inv.id)}
                          >
                            + Add Event
                          </button>
                        </div>
                      </div>

                      <div className="card-body">
                        {/* STATS ROW */}
                        <div className="row g-2 mb-4">
                          <div className="col-4">
                            <div className="text-center p-2 bg-light rounded">
                              <div className="text-muted small">Initial</div>
                              <div className="fw-bold">${formatNumber(inv.invested_amount)}</div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="text-center p-2 bg-light rounded">
                              <div className="text-muted small">To Date</div>
                              <div className="fw-bold">${formatNumber(totalInvestment)}</div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="text-center p-2 bg-light rounded">
                              <div className="text-muted small">Pref Rate</div>
                              <div className="fw-bold">{formatNumber(inv.pref_return)}%</div>
                            </div>
                          </div>
                        </div>

                        {/* ADD EVENT FORM */}
                        {addActiveInvestor === inv.id && (
                          <div className="card bg-light mb-3">
                            <div className="card-body">
                              <h6 className="fw-bold mb-3">New Event</h6>
                              <div className="row g-2">
                                <div className="col-md-6">
                                  <label className="form-label small">Date</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={newEvent.event_date}
                                    onChange={(e) =>
                                      setNewEvent((prev) => ({
                                        ...prev,
                                        event_date: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label small">Event Type</label>
                                  <select
                                    className="form-select"
                                    value={newEvent.event_type}
                                    onChange={(e) =>
                                      setNewEvent((prev) => ({
                                        ...prev,
                                        event_type: e.target.value,
                                      }))
                                    }
                                  >
                                    <option value="">Select Type</option>
                                    <option value="Investment">Investment</option>
                                    <option value="Capital Call">Capital Call</option>
                                    <option value="Return">Pref. Return</option>
                                    <option value="ROC">ROC</option>
                                  </select>
                                </div>
                                <div className="col-12">
                                  <label className="form-label small">Amount</label>
                                  <div className="input-group">
                                    <span className="input-group-text">$</span>
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="0.00"
                                      value={newEvent.event_amount}
                                      onChange={(e) =>
                                        setNewEvent((prev) => ({
                                          ...prev,
                                          event_amount: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-12">
                                  <label className="form-label small">Notes (optional)</label>
                                  <textarea
                                    className="form-control"
                                    rows="2"
                                    placeholder="Add any additional details..."
                                    value={newEvent.notes}
                                    onChange={(e) =>
                                      setNewEvent((prev) => ({
                                        ...prev,
                                        notes: e.target.value,
                                      }))
                                    }
                                  ></textarea>
                                </div>
                                <div className="col-12 d-flex gap-2 mt-2">
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => {
                                      handleEvent(inv.id);
                                      setAddActiveInvestor(null);
                                    }}
                                  >
                                    Save Event
                                  </button>
                                  <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => {
                                      setAddActiveInvestor(null);
                                      setNewEvent({
                                        event_date: "",
                                        event_type: "",
                                        event_amount: "",
                                        notes: "",
                                      });
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* EVENTS LIST */}
                        <div>
                          <h6 className="fw-bold mb-3">Transaction History</h6>
                          {investorEvents?.length ? (
                            <div className="list-group">
                              {investorEvents.map((e) => (
                                <div
                                  key={e.id}
                                  className="list-group-item event-item border-0 border-bottom px-0"
                                >
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                      <div className="d-flex align-items-center gap-2 mb-1">
                                        <span className="fw-semibold">{formatDate(e.event_date)}</span>
                                        <span className={`badge-event ${
                                          e.event_type === 'Return' ? 'bg-success' :
                                          e.event_type === 'Investment' ? 'bg-primary' :
                                          e.event_type === 'Capital Call' ? 'bg-warning' :
                                          'bg-secondary'
                                        }`}>
                                          {e.event_type}
                                        </span>
                                      </div>
                                      {e.notes && (
                                        <p className="text-muted small mb-0" title={e.notes}>
                                          {e.notes.length > 60 ? e.notes.slice(0, 60) + "…" : e.notes}
                                        </p>
                                      )}
                                    </div>
                                    <div className="fw-bold text-end ms-3">
                                      ${formatNumber(e.event_amount)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-muted">
                              <p className="mb-0">No transactions yet</p>
                              <small>Click "Add Event" to record your first transaction</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      
      
    </>
  );
}

export default PropertyDetail;
