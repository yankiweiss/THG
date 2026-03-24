import "./css/index.css";
import { BarChart } from "./BarChart.jsx";
import { useParams } from "react-router-dom";
import {useEffect, useState } from "react";

function InvestorDetail() {
  const [investorData, setInvestorData] = useState([]);

  let { propertyId, investorId } = useParams();

  const fetchProperty = async () => {
    await fetch(
      `https://thg-seven.vercel.app/api/investor/${propertyId}/${investorId}`)
      .then((res) => res.json())
      .then((data) => setInvestorData(data));
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  console.log(investorData);

  const barChartData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Actual Return",
        data: [1200, 1500, 150],
        backgroundColor: "#6B47FF",
        barThickness: 20,
      },
      {
        label: "Expected Return",
        data: [1200, 1500, 150],
        backgroundColor: "#FF8548",
        barThickness: 20,
      },
      {
        label: "Missing Return",
        data: [1200, 1500, 150],
        backgroundColor: "#FF4A4A",

        barThickness: 20,
      },
    ],

    options: {
      scales: {
        x: {
          categoryPercentage: 0.8, // Adjusts space between groups of bars
          barPercentage: 0.9, // Adjusts space within bars in a group
        },
      },
    },
  };

  //when fetching all data data state is being filled in with object of array with all data

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
                <h6 className="fw600">$150.000.00</h6>
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
          <h6>Select Year</h6>

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
              <BarChart data={barChartData} />
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
              <div className="events-table-wrap">
                <table>
                  <thead>
                    <tr style={{ color: "#2570C0" }}>
                      <th>Event Date</th>
                      <th>Event Amount</th>
                      <th>Event Type</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>01/06/2029</td>
                      <td>$250,000.00</td>
                      <td>Return</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>01/06/2029</td>
                      <td>$250,000.00</td>
                      <td>Return</td>
                    </tr>
                    <tr>
                      <td>01/06/2029</td>
                      <td>$250,000.00</td>
                      <td>Return</td>
                    </tr>
                    <tr>
                      <td>01/06/2029</td>
                      <td>$250,000.00</td>
                      <td>Return</td>
                    </tr>
                    <tr>
                      <td>01/06/2029</td>
                      <td>$250,000.00</td>
                      <td>Return</td>
                    </tr>
                    <tr>
                      <td>01/06/2029</td>
                      <td>$250,000.00</td>
                      <td>Return</td>
                    </tr>
                    <tr>
                      <td>01/06/2029</td>
                      <td>$250,000.00</td>
                      <td>Return</td>
                    </tr>
                    <tr>
                      <td>01/06/2029</td>
                      <td>$250,000.00</td>
                      <td>Return</td>
                    </tr>
                    <tr>
                      <td>01/06/2029</td>
                      <td>$250,000.00</td>
                      <td>Return</td>
                    </tr>
                    <tr>
                      <td>01/06/2029</td>
                      <td>$250,000.00</td>
                      <td>Return</td>
                    </tr>
                    <tr>
                      <td>01/06/2029</td>
                      <td>$250,000.00</td>
                      <td>Return</td>
                    </tr>
                    <tr>
                      <td>01/06/2029</td>
                      <td>$250,000.00</td>
                      <td>Return</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InvestorDetail;
