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
   const [selectedYear, setSelectedYear] = useState('')

   console.log(selectedYear)
  

   const years = investor?.events?.map((e) => new Date(e.event_date).getFullYear()) || [];
   const distinctYears = [...new Set(years)];

 

   const formatDate = (dateComingIn) => {
    if (!dateComingIn) return "N/A";
    const date = new Date(dateComingIn);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

   const formatCurrency = (value) => {
    if (!value) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

//   const getDaysBetween = (startDate) => {
//  const today = new Date();
//  const start = new Date(startDate);
//
//  const diffTime = today - start; // milliseconds
//  const diffDays = diffTime / (1000 * 60 * 60 * 24);
//
//  return diffDays;
//  
////};

const calculateActualReturn = () => {
  
  const sum = investor?.events?.reduce((result , e) =>{
if(e.event_type === 'Investment'){
  return result + Number(e.event_amount)
}
return result ;
  }, 0) || 0;

  return Number(sum.toFixed(2))
}



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

  return Number(earnedPref.toFixed(2));
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

  const getQuarterLabel = (year, quarter) => {
  const quarters = {
    Q1: { start: "Jan 1", end: "Mar 31" },
    Q2: { start: "Apr 1", end: "Jun 30" },
    Q3: { start: "Jul 1", end: "Sep 30" },
    Q4: { start: "Oct 1", end: "Dec 31" },
  };

  return `${quarter} ${year} (${quarters[quarter].start} - ${quarters[quarter].end})`;
};

// below method sees which quarter its going into

const getQuarterInfo = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth();
  const year = date.getFullYear();

  let quarter;

  if (month <= 2) quarter = "Q1";
  else if (month <= 5) quarter = "Q2";
  else if (month <= 8) quarter = "Q3";
  else quarter = "Q4";

  return { quarter, year };
};

const quarters = ["Q1", "Q2", "Q3", "Q4"];

let quarterlyData = {};

// Loop over each year and each quarter

  quarters.forEach(q => {
    const key = `${q}-${selectedYear}`;
    quarterlyData[key] = 0;
  });


investor?.events?.forEach(e => {
  if (e.event_type !== "Investment") return;

  const { quarter, year } = getQuarterInfo(e.date_of_event);
  
  const key = `${quarter}-${year}`;

  const amount = Number(e.event_amount);

  quarterlyData[key] += amount; // accumulate
});

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

  return Number(earnedPref.toFixed(2));
};

const expectedReturnChart = () => {
  const investedAmount = investor?.investments[0]?.invested_amount;
  const perfRate =  investor?.investments[0]?.perf_return;

  const 
  
}
expectedReturnChart()



 const labels = Object.keys(quarterlyData).map(key => {
  const [quarter, year] = key.split("-");
  return getQuarterLabel(year, quarter);
});

console.log(quarterlyData)

const data = Object.values(quarterlyData); 

const chartData = {
  labels,
  datasets: [
    {
      label: "Actual Return",
      data,
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },{
      
    label: "Expected Return",
      data,
      backgroundColor: "rgba(192, 75, 139, 0.6)",
      borderColor: "rgb(32, 82, 82)",
      borderWidth: 1,
    }
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,

  plugins: {
    legend: {
      position: "top",
      labels: {
        font: { size: 14 }
      }
    },
    title: {
      display: true,
      text: "Quarterly Returns",
      font: { size: 18 }
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `$${Number(context.raw).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }
      }
    }
  },

  scales: {
    x: {
      position: 'bottom',
      title: {
        display: true,
      },
      ticks: {
        maxRotation: 45,
        minRotation: 25
      }
    },

    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Amount ($)"
      },
      ticks: {
        callback: function (value) {
          return "$" + value.toLocaleString();
        }
      }
    }
  }
};
  
    

  return (
    <>
      
     <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          color: #f5f5f5;
          min-height: 100vh;
        }

        .page-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* HERO SECTION */
        .hero-section {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 3rem;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .hero-content {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 3rem;
          padding: 3rem;
          position: relative;
          z-index: 2;
        }

        .hero-image {
          width: 100%;
          height: 350px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
          border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .property-badge {
          position: absolute;
          top: -12px;
          left: -12px;
          background: linear-gradient(135deg, #00d4ff 0%, #028fbe 100%);
          color: #0a0a0a;
          padding: 0.5rem 1.25rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 8px 20px rgba(0, 212, 255, 0.4);
        }

        .hero-image-container {
          position: relative;
        }

        .hero-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2rem;
        }

        .property-title {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1.1;
          color: #ffffff;
          margin-bottom: 1rem;
          text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
        }

        .investor-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #00d4ff;
          margin-bottom: 0.5rem;
        }

        .closing-date {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        /* STATS GRID */
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          border: 3px solid rgba(0, 0, 0, 0.1);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #00d4ff, #0099cc);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
          border-color: rgba(0, 212, 255, 0.5);
        }

        .stat-card:hover::before {
          transform: scaleX(1);
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgb(0, 0, 0);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .stat-value {
          font-size: 2.25rem;
          font-weight: 700;
          color: #327886;
          font-family: 'Playfair Display', serif;
        }

        .stat-icon {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          font-size: 2rem;
          opacity: 0.3;
        }

        /* MODAL STYLES */
        .modal-overlay-enhanced {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-container-enhanced {
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideUp {
          from {
            transform: translateY(40px) scale(0.96);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .modal-header-enhanced {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
        }

        .modal-header-enhanced::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          border-radius: 50%;
        }

        .modal-header-content {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          position: relative;
          z-index: 1;
        }

        .modal-icon-circle {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          flex-shrink: 0;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .modal-title-enhanced {
          font-size: 1.75rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .modal-subtitle-enhanced {
          font-size: 0.9375rem;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
        }

        .modal-close-enhanced {
          position: relative;
          z-index: 1;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .modal-close-enhanced:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: rotate(90deg);
        }

        .modal-body-enhanced {
          padding: 2.5rem;
          overflow-y: auto;
          flex: 1;
        }

        .form-row-enhanced {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-field-enhanced {
          display: flex;
          flex-direction: column;
        }

        .form-field-full {
          grid-column: 1 / -1;
        }

        .form-label-enhanced {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.75rem;
          font-size: 0.9375rem;
        }

        .label-icon-enhanced {
          font-size: 1.125rem;
        }

        .required-asterisk {
          color: #ef4444;
          font-weight: 700;
          margin-left: 0.125rem;
        }

        .optional-badge {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          background: #f3f4f6;
          padding: 0.25rem 0.625rem;
          border-radius: 12px;
          margin-left: auto;
        }

        .form-input-enhanced {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          color: #1f2937;
          transition: all 0.2s ease;
          background: white;
        }

        .form-input-enhanced:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }

        .form-input-enhanced::placeholder {
          color: #9ca3af;
        }

        .input-wrapper-enhanced {
          position: relative;
        }

        .input-prefix-enhanced {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-weight: 600;
          font-size: 1.125rem;
          pointer-events: none;
        }

        .input-with-prefix-enhanced {
          padding-left: 2.5rem;
        }

        .form-textarea-enhanced {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          color: #1f2937;
          font-family: inherit;
          resize: vertical;
          min-height: 100px;
          transition: all 0.2s ease;
        }

        .form-textarea-enhanced:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }

        .helper-text-enhanced {
          font-size: 0.8125rem;
          color: #6b7280;
          margin-top: 0.5rem;
        }

        /* EVENT TYPE GRID */
        .event-type-grid-enhanced {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 0.75rem;
        }

        .event-type-item-enhanced {
          cursor: pointer;
        }

        .event-radio-enhanced {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .event-card-enhanced {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.25rem;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }

        .event-type-item-enhanced:hover .event-card-enhanced {
          border-color: #c4b5fd;
          background: #faf5ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
        }

        .event-radio-enhanced:checked + .event-card-enhanced {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(102, 126, 234, 0.08) 100%);
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);
        }

        .event-radio-enhanced:checked + .event-card-enhanced::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, #8b5cf6, #667eea);
          border-radius: 12px 0 0 12px;
        }

        .event-card-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .event-icon-enhanced {
          font-size: 2rem;
          line-height: 1;
        }

        .event-text-enhanced {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .event-name-enhanced {
          font-weight: 700;
          color: #1f2937;
          font-size: 1rem;
        }

        .event-desc-enhanced {
          font-size: 0.8125rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .event-checkbox-enhanced {
          width: 24px;
          height: 24px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .event-radio-enhanced:checked + .event-card-enhanced .event-checkbox-enhanced {
          background: #8b5cf6;
          border-color: #8b5cf6;
        }

        .checkmark-enhanced {
          color: white;
          opacity: 0;
          transform: scale(0);
          transition: all 0.2s ease;
        }

        .event-radio-enhanced:checked + .event-card-enhanced .checkmark-enhanced {
          opacity: 1;
          transform: scale(1);
        }

        /* FOOTER */
        .modal-footer-enhanced {
          padding: 1.75rem 2.5rem;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .btn-secondary-enhanced,
        .btn-primary-enhanced {
          padding: 0.875rem 1.75rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
        }

        .btn-secondary-enhanced {
          background: white;
          color: #6b7280;
          border: 2px solid #e5e7eb;
        }

        .btn-secondary-enhanced:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
          color: #374151;
        }

        .btn-primary-enhanced {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .btn-primary-enhanced:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-primary-enhanced:disabled,
        .btn-secondary-enhanced:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-enhanced {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* RESPONSIVE */
        @media (max-width: 968px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .property-title {
            font-size: 2.5rem;
          }

          .stats-container {
            grid-template-columns: repeat(2, 1fr);
          }

          .event-type-grid-enhanced {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .page-wrapper {
            padding: 1rem;
          }

          .hero-content {
            padding: 2rem;
          }

          .stats-container {
            grid-template-columns: 1fr;
          }

          .modal-container-enhanced {
            max-height: 95vh;
          }

          .modal-header-enhanced {
            padding: 1.5rem;
          }

          .modal-header-content {
            gap: 1rem;
          }

          .modal-icon-circle {
            width: 48px;
            height: 48px;
            font-size: 1.5rem;
          }

          .modal-title-enhanced {
            font-size: 1.5rem;
          }

          .modal-body-enhanced {
            padding: 1.5rem;
          }

          .form-row-enhanced {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .modal-footer-enhanced {
            padding: 1.25rem 1.5rem;
            flex-direction: column-reverse;
          }

          .btn-secondary-enhanced,
          .btn-primary-enhanced {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
      {/*<Bar data={chartData} options={chartOptions} />*/}
      <div className="page-wrapper">
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-image-container">
              <div className="property-badge">PROPERTY</div>
              <img
                src={
                  investor?.secure_url ||
                  "https://via.placeholder.com/350x350?text=Property"
                }
                alt="Property"
                className="hero-image"
              />
            </div>
            <div className="hero-info">
              <div>
                <h1 className="property-title">
                  {investor?.property_name || "Property Name"}
                </h1>
                <p className="investor-name">
                  👤 {investor?.name || "Investor Name"}
                </p>
                <p className="closing-date">
                  📅 Closing Date: {formatDate(investor?.closing_date)}
                </p>
              </div>
            </div>
          </div>
        </div>



        <div className="stats-container">
          {investor?.investments?.map((investment, index) => (
            <>
              <div className="stat-card" key={`invested-${index}`}>
                <div className="stat-icon">💰</div>
                <div className="stat-label">Amount Invested</div>
                <div className="stat-value">
                  {formatCurrency(investment.invested_amount)}
                </div>
              </div>
              <div className="stat-card" key={`pref-${index}`}>
                <div className="stat-icon">📊</div>
                <div className="stat-label">Actual Return</div>
                <div className="stat-value">
                  {formatCurrency(calculateActualReturn())}
                </div>
              </div>
              <div className="stat-card" key={`expected-${index}`}>
                <div className="stat-icon">📈</div>
                <div className="stat-label">Expected Return</div>
                <div className="stat-value">
                  {formatCurrency(
                    calculateExpectedPrefReturn(
                      investment.invested_amount,
                      investment.perf_return,
                      investor?.closing_date,
                    ),
                  )}
                </div>
              </div>
            </>
          ))}
        </div>

        <div className="container-fluid px-3 py-5 bg-light ">
       

          <div className="shadow-sm border rounded m-4">
            <div className="d-flex justify-content-center mt-5">
              <div className="m-2">
              <label className="form-label text-dark">Select Year:</label>
            </div>
            <div>
              <select
                class="form-select form-select-sm "
                aria-label="Default select example"
               onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option selected>Select Year</option>
                {distinctYears?.map((y) => (
                  <option value={y}>{y}</option>
                ))}

               
              </select>
            </div>
            </div>
            <div>
            <Bar
              
              data={chartData}
              options={chartOptions}
            />
            </div>
            ;
          </div>
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
                        <td>{formatDate(e.event_date)}</td>
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
    className="modal-overlay-enhanced"
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        handleCancel();
      }
    }}
  >
    <div className="modal-container-enhanced">
      {/* HEADER */}
      <div className="modal-header-enhanced">
        <div className="modal-header-content">
          <div className="modal-icon-circle">📊</div>
          <div>
            <h2 className="modal-title-enhanced">Add New Event</h2>
            <p className="modal-subtitle-enhanced">Record a capital transaction for this investor</p>
          </div>
        </div>
        <button
          type="button"
          className="modal-close-enhanced"
          onClick={handleCancel}
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div className="modal-body-enhanced">
          {/* DATE AND AMOUNT ROW */}
          <div className="form-row-enhanced">
            <div className="form-field-enhanced">
              <label className="form-label-enhanced">
                <span className="label-icon-enhanced">📅</span>
                <span>Event Date</span>
                <span className="required-asterisk">*</span>
              </label>
              <input
                type="date"
                className="form-input-enhanced"
                name="event_date"
                required
              />
              <span className="helper-text-enhanced">When did this occur?</span>
            </div>

            <div className="form-field-enhanced">
              <label className="form-label-enhanced">
                <span className="label-icon-enhanced">💵</span>
                <span>Event Amount</span>
                <span className="required-asterisk">*</span>
              </label>
              <div className="input-wrapper-enhanced">
                <span className="input-prefix-enhanced">$</span>
                <input
                  type="number"
                  className="form-input-enhanced input-with-prefix-enhanced"
                  name="event_amount"
                  placeholder="100,000"
                  step="0.01"
                  required
                />
              </div>
              <span className="helper-text-enhanced">Transaction amount in USD</span>
            </div>
          </div>

          {/* EVENT TYPE SELECTOR */}
          <div className="form-field-enhanced form-field-full">
            <label className="form-label-enhanced">
              <span className="label-icon-enhanced">🏷️</span>
              <span>Event Type</span>
              <span className="required-asterisk">*</span>
            </label>
            <div className="event-type-grid-enhanced">
              {eventTypes.map((type) => (
                <label key={type.value} className="event-type-item-enhanced">
                  <input
                    type="radio"
                    name="event_type"
                    value={type.name}
                    className="event-radio-enhanced"
                    required
                  />
                  <div className="event-card-enhanced">
                    <div className="event-card-content">
                      <span className="event-icon-enhanced">{type.icon}</span>
                      <div className="event-text-enhanced">
                        <div className="event-name-enhanced">{type.name}</div>
                        <div className="event-desc-enhanced">{type.description}</div>
                      </div>
                    </div>
                    <div className="event-checkbox-enhanced">
                      <svg className="checkmark-enhanced" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3334 4L6.00002 11.3333L2.66669 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* NOTES */}
          <div className="form-field-enhanced form-field-full">
            <label className="form-label-enhanced">
              <span className="label-icon-enhanced">📝</span>
              <span>Notes</span>
              <span className="optional-badge">Optional</span>
            </label>
            <textarea
              className="form-textarea-enhanced"
              name="notes"
              placeholder="Add any additional details about this event..."
              rows="4"
            ></textarea>
            <span className="helper-text-enhanced">Any relevant context or details</span>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="modal-footer-enhanced">
          <button
            type="button"
            className="btn-secondary-enhanced"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary-enhanced"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-enhanced"></span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Save Event</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8H4M8 4v8" strokeLinecap="round"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      </div>
      
      
    </>
  );
}

export default InvestorDetail;
