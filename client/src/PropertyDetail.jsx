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
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function PropertyDetail() {
  const [property, setProperty] = useState([]);
  const [activeInvestor, setActiveInvestor] = useState(null);
  const [newEvent, setNewEvent] = useState({
    event_date: "",
    event_type: "",
    event_amount: "",
    notes: "",
  });

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

  function getQuarter(dateString) {
    const month = new Date(dateString).getMonth(); // 0–11
    return Math.floor(month / 3); // 0–3
  }

  function buildChartData(events, year, investor) {
    const actuals = [0, 0, 0, 0];
    const expecteds = [0, 0, 0, 0];

    events
      .filter((e) => e.investor_id === investor)

      .filter((e) => new Date(e.event_date).getFullYear() === year)
      .forEach((e) => {
        const q = getQuarter(e.event_date);
        const amount = Number(e.event_amount || 0);

        // Separate logic for Actual vs Expected
        if (e.event_type === "Return") {
          actuals[q] += amount;
        }

        const amountInvested = property.investors.map((e) => e.invested_amount);

        console.log(amountInvested);
      });

    return {
      labels: [
        "First Quarter",
        "Second Quarter",
        "Third Quarter",
        "Fourth Quarter",
      ],
      datasets: [
        {
          label: "Actual Return",
          data: actuals,
          categoryPercentage: 0.65,
          barPercentage: 0.55,
          backgroundColor: "rgba(54, 162, 235, 0.7)", // blue
          borderColor: "rgba(54, 162, 235, 1)",
        },
        {
          label: "Expected Return",
          data: expecteds,
          categoryPercentage: 0.65,
          barPercentage: 0.55,
          backgroundColor: "rgba(255, 99, 132, 0.7)", // red
          borderColor: "rgba(255, 99, 132, 1)",
        },
      ],
    };
  }

  function formatDate(dateComingIn) {
    const date = new Date(dateComingIn);

    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  return (
    <>
      {console.log(property)}
      <div className="container my-4">
        {/* PROPERTY HEADER */}
        <div className="row mb-4 align-items-center">
          <div className="col-md-3">
            <img
              src={property.secure_url}
              alt="Property"
              className="rounded shadow w-100"
              style={{ objectFit: "cover", height: "200px" }}
            />
          </div>
          <div className="col-md-9">
            <h2 className="fw-bold">{property.property_name}</h2>
            <div className="d-flex gap-4 mt-2">
              <div className="text-muted">
                Purchase Price <br />
                <span className="fw-semibold fs-5">
                  ${formatNumber(property.purchase_price)}
                </span>
              </div>
              <div className="text-muted">
                Closing Date <br />
                <span className="fw-semibold fs-5">
                  {formatDate(property.closing_date)}
                </span>
              </div>
              <div className="text-muted">
                Total Investors <br />
                <span className="fw-semibold fs-5">
                  {property.investors?.length || 0}
                </span>
              </div>
              <div className="text-muted">
                Total Events <br />
                <span className="fw-semibold fs-5">
                  {property.events?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            {/* YEAR TAB + CHART */}
            <div className="row g-3 align-items-end mb-3 d-flex justify-content-center">
              {/* INVESTOR SELECT */}
              <div className="col-md-5 ">
                <label className="form-label fw-semibold">Investor</label>
                <select
                  className="form-select"
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

              {/* YEAR SELECT */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">Year</label>
                <select
                  className="form-select"
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

              {/* RESET */}
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setActiveInvestor(null);
                    setActiveYear(years[0]);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            <div style={{ height: "360px" }}>
              {activeYear && (
                <Bar
                  data={buildChartData(
                    property.events || [],
                    activeYear,
                    activeInvestor,
                  )}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      tooltip: { mode: "index", intersect: false },
                    },
                  }}
                />
              )}
            </div>

            {/* INVESTORS */}
            <h4 className="fw-bold my-4">Investors</h4>
            <div className="row g-3">
              {property.investors?.map((inv) => {
                const investorEvents =
                  property.events?.filter((e) => e.investor_id === inv.id) ||
                  [];
                const totalInvestment = investorEvents
                  .filter(
                    (e) =>
                      e.event_type === "Investment" ||
                      e.event_type === "Capital Call",
                  )
                  .reduce((sum, e) => sum + Number(e.event_amount || 0), 0);

                return (
                  <div key={inv.id} className="col-md-6">
                    <div className="card shadow-sm p-3 h-100">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="fw-semibold">{inv.investor_name}</h5>
                          <small className="text-muted">
                            Initial: ${formatNumber(inv.invested_amount)} <br />
                            To Date: ${formatNumber(totalInvestment)}
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() =>
                              setActiveInvestor(
                                activeInvestor === inv.id ? null : inv.id,
                              )
                            }
                          >
                            {activeInvestor === inv.id
                              ? "Hide Events"
                              : "View Events"}
                          </button>
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() =>
                              setActiveInvestor(
                                activeInvestor === inv.id ? null : inv.id,
                              )
                            }
                          >
                            Add Event
                          </button>
                        </div>
                      </div>

                      {/* COLLAPSIBLE EVENTS + FORM */}
                      {activeInvestor === inv.id && (
                        <div className="mt-3">
                          {investorEvents.length ? (
                            <ul className="list-group mb-3">
                              {investorEvents.map((e) => (
                                <li
                                  key={e.id}
                                  className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                  <div>
                                    <div>{formatDate(e.event_date)}</div>
                                    <small className="text-muted">
                                      {e.event_type}
                                    </small>
                                  </div>
                                  <div className="fw-semibold">
                                    ${formatNumber(e.event_amount)}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted">No events yet</p>
                          )}

                          {/* ADD EVENT FORM */}
                          <div className="card card-body bg-light p-3">
                            <div className="row g-2">
                              <div className="col-4">
                                <input
                                  type="date"
                                  className="form-control form-control-sm"
                                  value={newEvent.event_date}
                                  onChange={(e) =>
                                    setNewEvent((prev) => ({
                                      ...prev,
                                      event_date: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="col-4">
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  placeholder="Amount"
                                  value={newEvent.event_amount}
                                  onChange={(e) =>
                                    setNewEvent((prev) => ({
                                      ...prev,
                                      event_amount: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="col-4">
                                <select
                                  className="form-select form-select-sm"
                                  value={newEvent.event_type}
                                  onChange={(e) =>
                                    setNewEvent((prev) => ({
                                      ...prev,
                                      event_type: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="">Event Type</option>
                                  <option value="Investment">Investment</option>
                                  <option value="Capital Call">
                                    Capital Call
                                  </option>
                                  <option value="Return">Pref. Return</option>
                                  <option value="ROC">ROC</option>
                                </select>
                              </div>
                              <div className="col-12 mt-2">
                                <textarea
                                  className="form-control form-control-sm"
                                  placeholder="Notes"
                                  value={newEvent.notes}
                                  onChange={(e) =>
                                    setNewEvent((prev) => ({
                                      ...prev,
                                      notes: e.target.value,
                                    }))
                                  }
                                ></textarea>
                              </div>
                              <div className="col-12 mt-2 d-flex gap-2">
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleEvent(inv.id)}
                                >
                                  Save
                                </button>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => setActiveInvestor(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PropertyDetail;
