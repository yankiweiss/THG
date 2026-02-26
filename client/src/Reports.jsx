import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { newCal } from "./utils/CalculatingReturns";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, // <-- add this
  Tooltip,
  TimeScale,
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
  TimeScale,
  Legend,
);

function Reports() {
  // getting all data as useState
  const [data, setData] = useState();

  // get out unique years from the events from and to

  // need to understand this better

  const years = (events = []) => {
    const allYears = new Set();

    events.forEach((e) => {
      const from = new Date(e.from).getFullYear();
      const to = new Date(e.to).getFullYear();

      for (let y = from; y <= to; y++) {
        allYears.add(y);
      }
    });
    return [...allYears].sort();
  };

  console.log(data);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: function (context) {
            const date = new Date(context[0].raw.x);

            return date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
          },
          label: function (context) {
            const formattedAmount = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(context.raw.y);

            return `Amount: ${formattedAmount}`;
          },
        },
      },
    },

    scales: {
      x: {
        type: "category", // <-- change this
    title: {
      display: true,
      text: "Quarter",
        },
        ticks: {},

        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Amount ($)",
          },
        },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://thg-seven.vercel.app/api/investment");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-1">
        <div>
          <h2 className="fw-bold mb-0">Investment Reports</h2>
          <p className="text-muted mb-0 small">
            Quarterly performance breakdown
          </p>
        </div>

        <div style={{ maxWidth: "300px", width: "100%" }}>
          <input
            type="text"
            className="form-control rounded-pill"
            placeholder="🔍 Search investor or property..."
          />
        </div>
      </div>

      {data?.map((i) => {
        return (
          <div className="card shadow-lg border-0 rounded-4 p-4 m-4">
            {/* Investor / Property Info */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <div className="text-muted small">Investor</div>
                <div className="fw-semibold fs-5">{i.investor_name}</div>
              </div>

              <div>
                <div className="text-muted small">Property</div>
                <div className="fw-semibold fs-5">{i.property_name}</div>
              </div>
            </div>

            <ul class="nav nav-tabs" id="myTab" role="tablist">
              {years(i.events).map((y, index) => {
                return (
                  <li key={y} class="nav-item" role="presentation">
                    <button
                      className={`nav-link ${index === 0 ? "active" : ""}`}
                      id={`tab-${y}`}
                      data-bs-toggle="tab"
                      data-bs-target={`#content-${y}`}
                      type="button"
                      role="tab"
                    >
                      {y}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="tab-content">
              {years(i.events).length > 0 ? (
                years(i.events).map((y, index) => {
                  const chartDataPerYear = {
                    labels: ["Q1", "Q2", "Q3", "Q4"], // or dynamically calculate per quarter
                    datasets: [
                      {
                        label: "ACTUAL RETURN", // the label shown in the tooltip/legend
                        data: [
                          newCal(i.events, y)
                        ],
                        backgroundColor: "rgba(75,192,192,0.6)", // color of bars
                        barThickness: 40,
                        maxBarThickness: 50,
                      },
                    ],
                  };

                  return (
                    <div
                      key={y}
                      className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
                      id={`content-${y}`}
                      role="tabpanel"
                    >
                      <div style={{ height: "200px", width: "100%" }}>
                        <Bar data={chartDataPerYear} options={chartOptions} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="tab-pane fade show active">
                  <p className="text-center py-5">No events yet</p>
                </div>
              )}
            </div>

            {/* Table */}
          </div>
        );
      })}
    </div>
  );
}

export default Reports;
