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
  const { propertyId, investorId } = useParams();
   const [isSubmitting, setIsSubmitting] = useState(false);


//   const getDaysBetween = (closingDate) => {
//  const today = new Date();
//  const start = new Date(closingDate);
//
//  const diffTime = today - start; // milliseconds
//  const diffDays = diffTime / (1000 * 60 * 60 * 24);
//
//  return diffDays;
//};

const calculateExpectedPrefReturn = (
  investedAmount,
  prefRate, 
  closingDate
 ) => {
  const today = new Date();
  const start = new Date(closingDate);

  const diffTime = today - start;
  const daysElapsed = diffTime / (1000 * 60 * 60 * 24);

  const annualRate = prefRate / 100;

  const earnedPref =
    investedAmount *
    annualRate *
    (daysElapsed / 365);

  return earnedPref;
};
  

  const eventTypes = [
    {
      value: "investment",
      icon: "💰",
      name: "Investment",
      description: "Initial capital contribution",
      color: "#10b981",
    },
    {
      value: "return_of_capital",
      icon: "📤",
      name: "Return of Capital",
      description: "Principal returned to investor",
      color: "#3b82f6",
    },
    {
      value: "capital_call",
      icon: "📞",
      name: "Capital Call",
      description: "Request for additional funding",
      color: "#f59e0b",
    },
    {
      value: "distribution",
      icon: "💵",
      name: "Distribution",
      description: "Profit distribution payment",
      color: "#8b5cf6",
    },
  ];

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;
    const formData = new FormData(form);
    const objectFormData = Object.fromEntries(formData.entries());

    console.log("form inputs", objectFormData);
    await handleEvents(e);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setAddEvent(false);
  };

  console.log(investor);

  

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
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());

    const payload = {
      ...dataObject,
      propertyId,
      investorId,
    };

    console.log(payload);

    const response = await fetch("https://thg-seven.vercel.app/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result =  await response.json();

   if (response.ok) {
     setInvestor((prev) => ({
       ...prev,
       events: [...(prev.events || []), result],
     }));

     setAddEvent(false);
     form.reset();
   }

    

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
      .event-types-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .event-type-option {
    position: relative;
    cursor: pointer;
  }

  .event-type-option input[type="radio"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .event-type-card {
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.25rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .event-type-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: currentColor;
    transform: scaleY(0);
    transition: transform 0.2s ease;
  }

  .event-type-option:hover .event-type-card {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .event-type-option input[type="radio"]:checked + .event-type-card {
    border-color: currentColor;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%);
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.15);
  }

  .event-type-option input[type="radio"]:checked + .event-type-card::before {
    transform: scaleY(1);
  }

  .event-type-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .event-type-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    background: #f3f4f6;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .event-type-option input[type="radio"]:checked + .event-type-card .event-type-icon-wrapper {
    background: currentColor;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .event-type-info {
    flex: 1;
  }

  .event-type-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 1rem;
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }

  .event-type-option input[type="radio"]:checked + .event-type-card .event-type-name {
    color: #8b5cf6;
  }

  .event-type-description {
    font-size: 0.8125rem;
    color: #6b7280;
    line-height: 1.4;
  }

  .radio-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 20px;
    height: 20px;
    border: 2px solid #d1d5db;
    border-radius: 50%;
    background: white;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .event-type-option input[type="radio"]:checked + .event-type-card .radio-indicator {
    border-color: #8b5cf6;
    background: #8b5cf6;
  }

  .checkmark-icon {
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .event-type-option input[type="radio"]:checked + .event-type-card .checkmark-icon {
    opacity: 1;
  }

  .event-type-option:hover .event-type-icon-wrapper {
    transform: scale(1.05);
  }

  .event-type-option input[type="radio"]:focus + .event-type-card {
    outline: 2px solid #8b5cf6;
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    .event-types-grid {
      grid-template-columns: 1fr;
    }
  }

  @keyframes selectPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .event-type-option input[type="radio"]:checked + .event-type-card {
    animation: selectPulse 0.3s ease;
  }
      .event-form-overlay {
          position: fixed;
          top: 150px;
          left: 0;
          right: 0;
          bottom: 50px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .event-form-modal {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .event-form-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 2.5rem;
          border-radius: 16px 16px 0 0;
          color: white;
          position: relative;
        }

        .event-form-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .event-form-subtitle {
          font-size: 0.9375rem;
          opacity: 0.9;
          margin: 0;
        }

        .close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1.25rem;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .event-form-body {
          padding: 2.5rem;
        }

        .form-group-modern {
          margin-bottom: 1.75rem;
        }

        .form-label-modern {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.625rem;
          font-size: 0.9375rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .required-indicator {
          color: #ef4444;
          font-weight: 700;
        }

        .label-icon {
          font-size: 1rem;
        }

        .form-control-styled {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.875rem 1rem;
          font-size: 1rem;
          transition: all 0.2s ease;
          width: 100%;
          background: white;
        }

        .form-control-styled:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
          outline: none;
        }

        .form-control-styled::placeholder {
          color: #9ca3af;
        }

        .input-with-icon {
          position: relative;
        }

        .input-prefix {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-weight: 600;
          font-size: 1rem;
          pointer-events: none;
        }

        .form-control-styled.with-prefix {
          padding-left: 2.25rem;
        }

        textarea.form-control-styled {
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
        }

        .event-type-option {
          padding: 0.875rem 1rem;
        }

        .helper-text {
          font-size: 0.8125rem;
          color: #6b7280;
          margin-top: 0.375rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f3f4f6;
        }

        .btn-submit {
          flex: 1;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-submit::before {
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

        .btn-submit:hover::before {
          width: 300px;
          height: 300px;
        }

        .btn-cancel {
          flex: 1;
          background: white;
          border: 2px solid #e5e7eb;
          color: #6b7280;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          background: #f9fafb;
          border-color: #9ca3af;
          color: #374151;
        }

        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .event-type-card {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .event-type-card:hover {
          border-color: #8b5cf6;
          background: #faf5ff;
        }

        .event-type-card.selected {
          border-color: #8b5cf6;
          background: #faf5ff;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }

        .event-type-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: #f3f4f6;
        }

        .event-type-card.selected .event-type-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .event-type-info {
          flex: 1;
        }

        .event-type-name {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .event-type-desc {
          font-size: 0.8125rem;
          color: #6b7280;
        }

        .radio-check {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          position: relative;
          transition: all 0.2s ease;
        }

        .event-type-card.selected .radio-check {
          border-color: #8b5cf6;
          background: #8b5cf6;
        }

        .event-type-card.selected .radio-check::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .event-form-modal {
            margin: 1rem;
          }

          .event-form-header,
          .event-form-body {
            padding: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .event-form-title {
            font-size: 1.5rem;
          }
        }
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
                <p className="text-muted text-center">No events yet</p>
              )}
            </table>
            {/* event date , event amount, event type , notes ,  */}
            {addEvent && (
              <div
                className="event-form-overlay"
                onClick={(e) => {
                  // Close if clicking directly on the overlay (not on child elements)
                  if (e.target === e.currentTarget) {
                    handleCancel();
                  }
                }}
              >
                <div className="event-form-modal">
                  <div className="event-form-header">
                    <h2 className="event-form-title">
                      <span>📊</span>
                      Add New Event
                    </h2>
                    <p className="event-form-subtitle">
                      Record a new capital event for this investor
                    </p>
                    <button
                      type="button"
                      className="close-btn"
                      onClick={handleCancel}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="event-form-body">
                      <div className="row g-4">
                        {/* Event Date */}
                        <div className="col-md-6">
                          <div className="form-group-modern">
                            <label className="form-label-modern">
                              <span className="label-icon">📅</span>
                              Event Date
                              <span className="required-indicator">*</span>
                            </label>
                            <input
                              type="date"
                              className="form-control-styled"
                              name="event_date"
                              required
                            />
                            <small className="helper-text">
                              When did this transaction occur?
                            </small>
                          </div>
                        </div>

                        {/* Event Amount */}
                        <div className="col-md-6">
                          <div className="form-group-modern">
                            <label className="form-label-modern">
                              <span className="label-icon">💵</span>
                              Event Amount
                              <span className="required-indicator">*</span>
                            </label>
                            <div className="input-with-icon">
                              <span className="input-prefix">$</span>
                              <input
                                type="number"
                                className="form-control-styled with-prefix"
                                name="event_amount"
                                placeholder="100,000"
                                step="0.01"
                                required
                              />
                            </div>
                            <small className="helper-text">
                              Transaction amount in USD
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Event Type */}
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">🏷️</span>
                          Event Type
                          <span className="required-indicator">*</span>
                        </label>

                        <div className="event-types-grid">
                          {eventTypes.map((type) => (
                            <label
                              key={type.value}
                              className="event-type-option"
                              style={{ color: type.color }}
                            >
                              <input
                                type="radio"
                                name="event_type"
                                value={type.name}
                                required
                              />
                              <div className="event-type-card">
                                <div className="event-type-header">
                                  <div className="event-type-icon-wrapper">
                                    <span>{type.icon}</span>
                                  </div>
                                  <div className="event-type-info">
                                    <div className="event-type-name">
                                      {type.name}
                                    </div>
                                    <div className="event-type-description">
                                      {type.description}
                                    </div>
                                  </div>
                                </div>
                                <div className="radio-indicator">
                                  <span className="checkmark-icon">✓</span>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                      {/* Notes */}
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">📝</span>
                          Notes
                        </label>
                        <textarea
                          className="form-control-styled"
                          name="notes"
                          placeholder="Add any additional details about this event..."
                          rows="4"
                        ></textarea>
                        <small className="helper-text">
                          Optional: Any relevant context or details
                        </small>
                      </div>

                      {/* Action Buttons */}
                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={handleCancel}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting && <span className="spinner" />}
                          {isSubmitting ? "Saving..." : "Save Event"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h1>{calculateExpectedPrefReturn(investor?.investments?.invested_amount, investor?.investments?.perf_return, investor?.property?.closing_date)}</h1>
      </div>
    </>
  );
}

export default InvestorDetail;
