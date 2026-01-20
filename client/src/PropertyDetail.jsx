import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PropertyDetail() {
  const [property, setProperty] = useState([]);

  const [activeInvestor, setActiveInvestor] = useState(null);

  const [event, setEvent] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    fetch(`https://thg-seven.vercel.app/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => setProperty(data))
      .catch((err) => console.error(err));
  }, [id]); 

  const handleEvent = (id) => {
    const payload = { ...event, investor_id: id };
    fetch("https://thg-seven.vercel.app/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  return (
    <>
      <div className="container my-5">
        {/* ================= Patient Info ================= */}
       
 {console.log(property)}
        <h4 className="m-5">{property.property_name}</h4>
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light fw-bold">Property Details</div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-2">
                <label className="form-label">Property Name</label>
                <input
                  className="form-control"
                  value={property.property_name}
                ></input>
              </div>

              <div className="col-md-2">
                <label className="form-label">Purchase Price</label>
                <input
                  className="form-control"
                  value={property.purchase_price}
                ></input>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5 p-2 border-0 border-rounded bg-light">
        <div className="d-flex align-items-center mb-3">
          <h5 className="mb-0 fw-bold">Investors</h5>
          <span className="badge bg-secondary ms-2">
            {property.investors?.length || 0}
          </span>
        </div>
        <hr />

        {property.investors?.map((investor) => (
          <div className="card mb-4" key={investor.id}>
            <div className="card-header fw-bold d-flex justify-content-between">
              <h4>{investor.investor_name}</h4>
              <h3 class="badge text-bg-light">Investor</h3>
            </div>

            <div className="card-body">
              {/* Summary */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Total Invested</label>
                  <input
                    className="form-control"
                    value={investor.total_amount}
                    readOnly
                  />
                </div>
              </div>

              {/* Events Table */}
              <h6 className="fw-bold">Investment Events</h6>

              <table className="table table-sm table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {investor.events?.length ? (
                    investor.events.map((event) => (
                      <tr key={event.id}>
                        <td>{event.event_date}</td>
                        <td>${event.event_amount}</td>
                        <td>{event.event_type}</td>
                        <td>{event.note}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No events yet
                      </td>
                    </tr>
                  )}

                  {activeInvestor === investor.id && (
                    <tr className="table-light">
                      <td>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          onChange={(e) =>
                            setEvent((prev) => ({
                              ...prev,
                              event_date: e.target.value,
                            }))
                          }
                        />
                      </td>
                  
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Amount"
                          onChange={(e) =>
                            setEvent((prev) => ({
                              ...prev,
                              event_amount: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          onChange={(e) =>
                            setEvent((prev) => ({
                              ...prev,
                              event_type: e.target.value,
                            }))
                          }
                        >
                          <option value={"Investment"}>Investment</option>
                          <option value={"Capital Call"}>Capital Call</option>
                          <option value={"Return"}>Return</option>
                        </select>
                      </td>
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
                          Cancel
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Add Event Button */}
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setActiveInvestor(investor.id)}
              >
                + Add Event
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default PropertyDetail;
