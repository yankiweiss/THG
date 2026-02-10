import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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

function InvestorDetail() {
  const [investor, setInvestor] = useState();
  const [addEvent, setAddEvent] = useState(false);

  console.log(investor);

  const { propertyId, investorId } = useParams();

  useEffect(() => {
    fetch(
      `https://thg-seven.vercel.app/api/investor/${propertyId}/${investorId}`,
    )
      .then((res) => res.json())
      .then((data) => setInvestor(data))
      .catch((err) => console.error(err));
  }, [propertyId, investorId]);

  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("en-US");
  };


  const handleEvents = async (e) => {
    e.preventDefault()
    const form = e.target;
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());
    
     const payload = {
      ...dataObject,
      propertyId,
      investorId,
    };

    console.log(payload);

    await fetch("https://thg-seven.vercel.app/api/event/postAEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // You can add success notification or redirect here
  };

     
  




//    const chartData = {
//      labels: investor?.events?.map((e) => e.date_of_event) || [],
//      datasets: [
//        {
//          label: "Amount",
//          data: investor?.investor.events?.map((e) => e.amount) || [],
//          backgroundColor: "rgba(75, 192, 192, 0.6)",
//          borderColor: "rgba(75, 192, 192, 1)",
//          borderWidth: 1,
//        },
//      ],
//    };
//  
//    const chartOptions = {
//      responsive: true,
//      plugins: {
//        legend: { position: "top" },
//        title: { display: true, text: "Investor Event Amounts" },
//      },
//      scales: {
//        y: { beginAtZero: true },
//      },
//    };

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
          width: 200px;
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

      {/*<Bar data={chartData} options={chartOptions} />*/}

      <div className="container-fluid px-3 py-5 bg-light ">
        {/* HEADER SECTION */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h2 className="mb-1 fw-bold section-header text-dark">
                Property
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          {investor?.property?.map((p, index) => (
            <div key={index} className="mb-4">
              <h1>{p.property_name}</h1>
              <div className="col-md-3 mb-3 mb-md-0">
                <img
                  src={p.secure_url}
                  alt="Property"
                  className="rounded shadow-sm w-100"
                  style={{ objectFit: "cover", height: "220px" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-fluid px-3 py-5 bg-light ">
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h2 className="mb-1 fw-bold section-header text-dark">
                Investor Info
              </h2>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4 d-flex">
            <div>
              <label className="form-label">Investor Name:</label>
              <input
                value={investor?.name}
                className="form-control fs-3 fw-bold mb-4 border-0 bg-transparent px-0 w-auto"
              ></input>
            </div>

            {investor?.investments?.map((i, index) => (
              <div key={index} className="d-flex">
                <div>
                  <label className="form-label">Amount Invested:</label>
                  <input
                    value={formatNumber(i.invested_amount)}
                    className="form-control fs-3 fw-bold mb-4 border-0 bg-transparent px-0 w-auto"
                  ></input>
                </div>
                <div>
                  <label className="form-label">Pref Return:</label>
                  <input
                    value={i.perf_return}
                    className="form-control fs-3 fw-bold mb-4 border-0 bg-transparent px-0 w-auto"
                  ></input>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*<Bar data={chartData} options={chartOptions} />;*/}
        <div class="card mx-5">
          <div className="d-flex justify-content-between card-header p-5">
            <div>Capital Events</div>
            <div>
              <a href="#h1">
                <button
                  type="button"
                  className="border-0 btn btn-outline-dark"
                  onClick={() => setAddEvent(true)}
                >
                  Add event
                </button>
              </a>
            </div>
          </div>
          <div class="card-body">
            <table className="table">
              {investor?.events?.length > 0 ? (
                investor?.events?.map((e, index) => (
                  <tbody>
                    <tr key={index}>
                      <td>${formatNumber(e.event_amount)}</td>
                      <td>{e.event_type}</td>
                      <td>{e.notes}</td>
                    </tr>
                  </tbody>
                ))
              ) : (
                <p className="text-muted text-center">No events yes</p>
              )}
            </table>
            {/* event date , event amount, event type , notes ,  */}
            {addEvent && (
              <form id="h1" onSubmit={handleEvents}>
                <div className="row">
                  <div className="col-md-2">
                    <label className="form-label">Event Date:</label>
                    <input type="date" className="form-control" name="event_date"></input>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Event amount:</label>
                    <input className="form-control" name="event_amount"></input>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Event amount:</label>
                    <textarea className="form-control" name="notes"></textarea>
                  </div>
                </div>
                <button type="submit">Save Event</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default InvestorDetail;
