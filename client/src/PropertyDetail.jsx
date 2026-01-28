import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

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

  const handleEvent = async (investorId) => {
    const payload = { ...newEvent, investor_id: investorId };
   
    const res = await fetch(
        "https://thg-seven.vercel.app/api/event",
        {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        }
    );

    const {event } = await res.json();

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

  setActiveInvestor(null)
  };

  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("en-US");
  };

  return (
    <>
      <div className="container my-5 bg-light rounded p-4">
        <div className="row g-4 mb-1 d-flex justify-content-center">
          {/* LEFT */}
          <div className="col-md-3 d-flex">
            <img
              src={property.secure_url}
              className="rounded-4 shadow-sm w-75"
              style={{ height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* RIGHT */}
          <div className="col-md-8">
            {/* TOP ROW: Header + Stats */}
            <div className="row g-3 align-items-start mb-1">
              {/* Header (TEXT ONLY) */}
              <div className="col-md-6">
                <h1 className="fw-bold mb-1">{property.property_name}</h1>
                <div className="text-muted small">Purchase Price</div>
                <div className="fs-4 fw-semibold">
                  ${formatNumber(property.purchase_price)}
                </div>
              </div>

              {/* Total Investors */}
              <div className="col-md-2 d-flex">
                <div className="card shadow-sm rounded-4 text-center p-3 w-100">
                  <div className="text-muted small">Total Investors</div>
                  <div className="fs-2 fw-bold">
                    {property.investors?.length || 0}
                  </div>
                </div>
              </div>

              {/* Total Events */}
              <div className="col-md-2 d-flex">
                <div className="card shadow-sm rounded-4 text-center p-3 w-100">
                  <div className="text-muted small">Total Events</div>
                  <div className="fs-2 fw-bold">
                    {property.events?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="mb-5" />

        <h4 className="fw-bold mb-3">Investors</h4>

        {console.log(property)}

        {property.investors?.map((investor) => {
          const investorEvents =
            property.events?.filter((e) => e.investor_id === investor.id) || [];

          const investorChartData = {
            labels: ["Investment", "Capital Call", "Return", "ROC"],
            datasets: [
              {
                data: [
                  investorEvents
                    .filter((e) => e.event_type === "Investment")
                    .reduce((a, b) => a + Number(b.event_amount), 0),
                  investorEvents
                    .filter((e) => e.event_type === "Capital Call")
                    .reduce((a, b) => a + Number(b.event_amount), 0),
                  investorEvents
                    .filter((e) => e.event_type === "Return")
                    .reduce((a, b) => a + Number(b.event_amount), 0),
                  investorEvents
                    .filter((e) => e.event_type === "ROC")
                    .reduce((a, b) => a + Number(b.event_amount), 0),
                ],
                backgroundColor: ["#0d6efd", "#ffc107", "#198754", "#6f42c1"],
              },
            ],
          };

          return (
            <div
              key={investor.id}
              className="bg-white rounded-4 shadow-sm mb-3 p-3"
            >
              {/* LEFT: Name + Total */}
              <div className="d-flex align-items-center justify-content-between">
                {/* LEFT: Name + Total + Buttons */}
                <div>
                  <div className="fw-semibold">{investor.investor_name}</div>
                  <div className="text-muted small mb-2">
                    Total Invested: ${formatNumber(investor.event_amount)}
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() =>
                        setActiveInvestor(
                          activeInvestor === investor.id ? null : investor.id,
                        )
                      }
                    >
                      {" "}
                      View Events
                    </button>
                  </div>
                </div>

                {/* RIGHT: Doughnut with labels side-by-side */}
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: 120, height: 120 }}>
                    <Doughnut
                      data={investorChartData}
                      options={{ plugins: { legend: { display: false } } }}
                    />
                  </div>

                  {/* Labels */}
                  <div>
                    {investorChartData.labels.map((label, index) => (
                      <div
                        key={label}
                        className="d-flex align-items-center mb-1"
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "12px",
                            height: "12px",
                            backgroundColor:
                              investorChartData.datasets[0].backgroundColor[
                                index
                              ],
                            marginRight: "6px",
                            borderRadius: "2px",
                          }}
                        />
                        <span className="small">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {activeInvestor === investor.id && (
                <div className="mt-3">
                  <table className="table table-sm align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th className="text-end">Amount</th>
                        <th>Type</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investorEvents.length ? (
                        investorEvents.map((event) => (
                          <tr key={event.id}>
                            <td>
                              {new Date(event.event_date).toLocaleDateString()}
                            </td>
                            <td className="text-end fw-semibold">
                              ${formatNumber(event.event_amount)}
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">
                                {event.event_type}
                              </span>
                            </td>
                            <td>{event.notes}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            No events yet
                          </td>
                        </tr>
                      )}

                      {/* ADD EVENT ROW */}
                      <tr>
                        <td>
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
                        </td>
                        <td>
                          <input
                            type="number"
                            value={newEvent.event_amount}
                            className="form-control form-control-sm"
                            placeholder="Amount"
                            onChange={(e) =>
                              setNewEvent((prev) => ({
                                ...prev,
                                event_amount: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td>
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
                            <option value="">Choose Event</option>
                            <option value="Investment">Investment</option>
                            <option value="Capital Call">Capital Call</option>
                            <option value="Return">Pref. Return</option>
                            <option value="ROC">ROC</option>
                          </select>
                        </td>
                        <td>
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
                          />
                        </td>
                      </tr>
                      <tr className="d-flex justify-content-center">
                        <td className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleEvent(investor.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setActiveInvestor(null)}
                          >
                            {console.log(event)}
                            Cancel
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PropertyDetail;
