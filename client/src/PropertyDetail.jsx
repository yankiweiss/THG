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
      {console.log(property)}
      <div className="container my-4">
        {/* PROPERTY HEADER */}
        <div className="row mb-4 align-items-center m-5">
          <div className="col-md-3">
            <img
              src={property.secure_url}
              alt="Property"
              className="rounded shadow w-100"
              style={{ objectFit: "cover", height: "200px" }}
            />
          </div>
          <div className="col-md-9">
            <input
              value={property.property_name}
              className="form-control fs-1 fw-bold m-5 border-0"
              onChange={(e) =>
                setProperty({ ...property, property_name: e.target.value })
              }
            />

            <div className="row g-3 px-4 pb-3">
              <div className="col-3">
                <div className="border rounded p-3 text-center bg-light">
                  <div className="text-muted small">Purchase Price:</div>
                  <div>
                    <input
                      value={formatNumber(property.purchase_price)}
                      className="form-control border-0 text-center bg-transparent"
                      onChange={(e) =>
                        setProperty({
                          ...property,
                          purchase_price: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="col-3">
                <div className="border rounded p-3 text-center bg-light">
                  <div className="text-muted small">Closing Date</div>
                  <input
                    value={formatDate(property.closing_date)}
                    className="form-control border-0 text-center bg-transparent"
                    onChange={(e) =>
                      setProperty({ ...property, closing_date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="col-3">
                <div className="border rounded p-3 text-center bg-light">
                  <div className="text-muted small">Total Investors</div>
                  <div className="fw-bold fs-6">
                    {property.investors?.length || 0}
                  </div>
                </div>
              </div>

              <div className="col-3">
                <div className="border rounded p-3 text-center bg-light">
                  <div className="text-muted small">Total Events</div>
                  <div className="fw-bold fs-6">
                    {property.events?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4 mt-5">
          <div className="card-body">
            <div className="d-flex flex-column m-5 border-bottom pb-3">
              <h4 className="fw-bold mb-1">Return Performance Breakdown</h4>
              <span className="text-muted small">
                View actual vs expected returns by investor and year
              </span>
            </div>
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
                  className="btn btn-outline-secondary w-50"
                  onClick={() => {
                    setActiveInvestor(null);
                    setActiveYear(years[0]);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {activeInvestor && (
              <div className="row g-3 mb-3">
                {(() => {
                  const { actual, expected } = getReturnsToDate(
                    property.events,
                    activeInvestor,
                    property,
                  );
                  return (
                    <>
                      <div className="d-flex justify-content-center gap-4">
                        <div className="col-md-3">
                          <div className="p-3 bg-light border rounded text-center">
                            <div className="text-muted small">
                              Return to Date (Actual)
                            </div>
                            <div className="fw-bold fs-5">
                              ${actual.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="p-3 bg-light border rounded text-center">
                            <div className="text-muted small">
                              Return to Date (Expected)
                            </div>
                            <div className="fw-bold fs-5">
                              ${expected.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="p-3 bg-light border rounded text-center">
                            <div className="text-muted small">Since</div>
                            <div className="fw-bold fs-5">
                              {formatDate(property.closing_date)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <div style={{ height: "400px" }}>
              <Bar
                data={buildChartData(
                  property.events || [],
                  activeYear,
                  activeInvestor,
                )}
                options={chartOptions}
              />
            </div>

            {/* Return to Date stat above the chart */}

            {/* INVESTORS */}

            <div className="border-bottom d-flex justify-content-between m-5">
              <div>
                <h4 className="fw-bold">Investors</h4>
                <small className="text-muted">
                  Manage ownership, capital, and returns
                </small>
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => setInvestorMode("add")}
                >
                  + Add Investor
                </button>
              </div>
            </div>
            {investorMode === "add" && (
              <div className="card shadow-sm mb-4 border-primary">
                <div className="card-body">
                  <h5 className="fw-semibold mb-3">Add New Investor</h5>

                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Investor Name</label>
                      <input className="form-control" placeholder="John Doe" />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Initial Investment</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="100000"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Preferred Return (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="8"
                      />
                    </div>
                  </div>

                  <div className="mt-4 d-flex gap-2">
                    <button className="btn btn-success">Save Investor</button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setInvestorMode("view")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="row g-3">
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
                  <div key={inv.id} className="col-md-6">
                    <div className="card shadow-sm p-3 auto">
                      <div className="d-flex justify-content-between p-4">
                        <div>
                          <h5 className="fw-semibold">{inv.investor_name}</h5>
                        </div>

                        <div className="d-flex gap-2">
                          <a
                            href="#C4"
                            className="btn btn-outline-success btn-sm text-decoration-none"
                            onClick={() => {
                              setAddActiveInvestor(inv.id);
                            }}
                          >
                            Add Event
                          </a>
                        </div>
                      </div>
                      <div className="row g-3 px-4 pb-3">
                        <div className="col-4">
                          <div className="border rounded p-3 text-center bg-light">
                            <div className="text-muted small">Initial</div>
                            <div className="fw-bold fs-6">
                              ${formatNumber(inv.invested_amount)}
                            </div>
                          </div>
                        </div>

                        <div className="col-4">
                          <div className="border rounded p-3 text-center bg-light">
                            <div className="text-muted small">To Date</div>
                            <div className="fw-bold fs-6">
                              ${formatNumber(totalInvestment)}
                            </div>
                          </div>
                        </div>

                        <div className="col-4">
                          <div className="border rounded p-3 text-center bg-light">
                            <div className="text-muted small">Pref Return</div>
                            <div className="fw-bold fs-6">
                              {formatNumber(inv.pref_return)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {console.log(investorEvents)}

                      {/* COLLAPSIBLE EVENTS + FORM */}

                      <div className="mt-3">
                        {investorMode === "view" && (
                          <>
                            {investorEvents.length ? (
                              <ul className="list-group mb-3 border">
                                {investorEvents.map((e) => (
                                  <li
                                    key={e.id}
                                    className="list-group-item d-flex justify-content-between align-items-start"
                                  >
                                    {/* Date + Type */}
                                    <div
                                      className="me-3"
                                      style={{ minWidth: "120px" }}
                                    >
                                      <div className="fw-semibold">
                                        {formatDate(e.event_date)}
                                      </div>
                                      <small className="text-muted">
                                        {e.event_type}
                                      </small>
                                    </div>

                                    {/* Amount */}
                                    <div
                                      className=" text-center fw-bold"
                                      style={{ minWidth: "150px" }}
                                    >
                                      ${formatNumber(e.event_amount)}
                                    </div>

                                    {/* Notes */}
                                    <div className="flex-grow-1">
                                      {e.notes ? (
                                        <span
                                          className="badge bg-light text-dark"
                                          style={{
                                            display: "inline-block",
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                            maxWidth: "100%",
                                          }}
                                          title={e.notes} // hover to see full note
                                        >
                                          {e.notes.length > 80
                                            ? e.notes.slice(0, 80) + "…"
                                            : e.notes}
                                        </span>
                                      ) : (
                                        <span className="text-muted">—</span>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted">No events yet</p>
                            )}
                          </>
                        )}

                        {addActiveInvestor === inv.id && (
                          <div className="card card-body bg-light p-3">
                            <div className="row g-2 " id="C4">
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
                                  onClick={() => {
                                    handleEvent(inv.id);
                                    setAddActiveInvestor(null);
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => {
                                    setAddActiveInvestor(null);
                                    setInvestorMode("view");
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
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
