import "./css/index.css";
import { BarChart } from "./BarChart.jsx";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import actualReturns from "./utils/CalculatingReturns.js";
//import { format } from "date-fns";

function InvestorDetail() {
  const [investorData, setInvestorData] = useState([]);
  const [addEvent, SetAddEvent] = useState(false);
  const [eventType, setEventType] = useState("Investment");
  const targetRef = useRef(null);


  const events = investorData?.events;

  let { propertyId, investorId } = useParams();

  const fetchProperty = async () => {
    await fetch(
      `https://thg-seven.vercel.app/api/investor/${propertyId}/${investorId}`,
    )
      .then((res) => res.json())
      .then((data) => setInvestorData(data));
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  useEffect(() => {
    if (addEvent && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [addEvent]);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const allEventData = Object.fromEntries(formData);

    const payload = {
      ...allEventData,
      propertyId,
      investorId,
    };

    const res = await fetch("https://thg-seven.vercel.app/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    setInvestorData((prev) => ({
      ...prev,
      events: [...prev.events, data],
    }));

    SetAddEvent(false);
    setEventType("Investment");
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
  };

  const barChartData = {
    
    datasets: [
      {
        label: "Actual Return",
         data: actualReturns(events),
        backgroundColor: "#6B47FF",
        barThickness: 20,
      },
      {
        label: "Expected Return",
         data: [
        { x: '2024-01-01', y: 500 }, // Q1
        { x: '2024-04-01', y: 5000 }, // Q2
        { x: '2024-07-01', y: 10000 }, // Q3
        { x: '2024-10-01', y: 20000 }  // Q4
      ],
        backgroundColor: "#FF8548",
        barThickness: 20,
      },
      {
        label: "Missing Return",
         data: [
        { x: '2024-01-01', y: 500 }, // Q1
        { x: '2024-04-01', y: 5000 }, // Q2
        { x: '2024-07-01', y: 10000 }, // Q3
        { x: '2024-10-01', y: 20000 }  // Q4
      ],
        backgroundColor: "#FF4A4A",
        barThickness: 20,
      },
    ],
  };

  const barChartOptions = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "quarter",
        },
         
       
      },
      y: {
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
  };

  //when fetching all data data state is being filled in with object of array with all data

  console.log(investorData?.events)

  return (
    <>
      <div className="right-side">
        <div className="main_page">
          <h3 className="fw600">{investorData?.property?.property_name}</h3>

          <div className="top-flex">
            <img
              src={investorData?.property?.secure_url}
              width={"300px"}
              height={"146px"}
              style={{
                borderRadius: "8px",
                boxShadow: "4px 4px 5px 1px  #1B3C77BF",
              }}
              alt="property_picture"
            />
            <div className="ID_investor_name">
              <h6 style={{ color: "#2570C0" }} className="fw600">
                INVESTOR
              </h6>
              <h3 className="fw600">{investorData?.investor?.name}</h3>
            </div>
            <div className="ID-investor-details">
              <div className="column-flex">
                <h6 className="ID-text fw600">
                  INITIAL<br></br> INVESTMENT{" "}
                </h6>
                <h6 className="fw600">
                  {investorData?.investments?.invested_amount}
                </h6>
              </div>

              <div className="column-flex">
                <h6 className="ID-text fw600">
                  INVESTMENT<br></br> TO DATE{" "}
                </h6>
                <h6 className="fw600">$550.000.00</h6>
              </div>

              <div className="column-flex">
                <h6 className="ID-text fw600">
                  PERF <br></br>RETURN
                </h6>
                <h6 className="fw600">10%</h6>
              </div>
              <div className="column-flex">
                <h6 className="ID-text fw600">
                  ACTUAL<br></br> RETURN
                </h6>
                <h6 className="fw600">$250.000.00</h6>
              </div>
              <div className="column-flex">
                <h6 className="ID-text fw600">
                  EXPECTED <br></br>RETURN
                </h6>
                <h6 className="fw600">$750.000.00</h6>
              </div>
            </div>
          </div>
        </div>

        <div className="capital_breakdown">
          <div className="cb-top">
            <h6>Select Year</h6>

            <button className="add-investor" onClick={() => SetAddEvent(true)}>
              {" "}
              <FiPlus style={{ fontSize: "26px" }} />
              Add Event
            </button>
          </div>

          <div className="capital_events_amount">
            <h4
              style={{
                color: "#2570C0",
                writingMode: "sideways-lr",
                textAlign: "center",
              }}
            >
              Amount
            </h4>
            <div className="quarterly_breakdown">
              <BarChart data={barChartData} options={barChartOptions} />
            </div>

            <h4
              style={{
                color: "#2570C0",
                writingMode: "sideways-lr",
                textAlign: "center",
                width: "0.5rem",
              }}
            >
              Capital Events
            </h4>
            <div className="event_table">
              <table>
                <thead>
                  <tr style={{ color: "#2570C0" }}>
                    <th style={{ minWidth: "30px" }}>Event Date</th>
                    <th style={{ minWidth: "25px" }}>Event Amount</th>
                    <th style={{ minWidth: "25px" }}>Event Type</th>
                    <th style={{ minWidth: "30px" }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {investorData?.events?.length > 0 ? (
                    investorData?.events.map((evt) => (
                      <tr>
                        <td> {evt.event_date}</td>
                        <td>${evt.event_amount}</td>
                        <td>{evt.event_type}</td>
                        <td>
                          <textarea cols="10" readOnly>
                            {evt.notes}
                          </textarea>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <h6>no events yet</h6>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {addEvent && (
          <>
            {" "}
            <div className="add-form-container" ref={targetRef}>
              <h3
                style={{ fontSize: "1.5rem", color: "#2570C0" }}
                className="fw600"
              >
                ADD NEW EVENT
              </h3>
              <p
                style={{ fontSize: "0.9rem", color: "#2570C0" }}
                className="fw600"
              >
                Record a capital transaction for this investor
              </p>

              <form onSubmit={handleAddEvent}>
                <div className="add_event_form_wrapper">
                  <div className="add-event-form" ref={targetRef}>
                    <div className="column-flex">
                      <label htmlFor="eventAmount" className="fw600">
                        Event Amount
                      </label>

                      <span className="deal-input">
                        $
                        <input
                          id="eventAmount"
                          name="event_amount"
                          type="number"
                          required
                          style={{
                            border: "none",
                            outline: "none",
                            backgroundColor: "transparent",
                          }}
                        ></input>
                      </span>
                    </div>

                    <div className="column-flex">
                      <label className="fw600">Event Type</label>
                      <select
                        name="event_type"
                        className="deal-input"
                        style={{ width: "auto" }}
                        value={eventType}
                        onChange={handleEventTypeChange}
                      >
                        <option value="Investment">Investment</option>
                        <option value="Capital Call">Capital Call</option>
                        <option value="Return to Capital">
                          Return to Capital
                        </option>
                        <option value="Return">Return</option>
                      </select>
                    </div>

                    {eventType === "Return" ? (
                      <div style={{ display: "flex", gap: "5px" }}>
                        <div className="column-flex">
                          <label className="fw600">From Date</label>

                          <input
                            className="deal-input"
                            type="date"
                            style={{ width: "auto" }}
                            name="from_date"
                            required
                          ></input>
                        </div>
                        <div className="column-flex">
                          <label className="fw600">To Date</label>

                          <input
                            className="deal-input"
                            type="date"
                            style={{ width: "auto" }}
                            name="to_date"
                            required
                          ></input>
                        </div>
                      </div>
                    ) : (
                      <div className="column-flex">
                        <label className="fw600">Event Date</label>

                        <input
                          className="deal-input"
                          type="date"
                          style={{ width: "auto" }}
                          name="event_date"
                          required
                        ></input>
                      </div>
                    )}

                    <div className="column-flex">
                      <label className="fw600">Notes</label>

                      <textarea className="deal-input" name="notes" />
                    </div>
                  </div>

                  <div className="add_event_btns">
                    <button
                      onClick={() => SetAddEvent(false)}
                      className="add-investor"
                      style={{ backgroundColor: "white", color: "black" }}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="add-investor">
                      Add Event
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default InvestorDetail;
