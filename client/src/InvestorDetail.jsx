import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import "chartjs-adapter-date-fns";
import { NumericFormat } from "react-number-format";
import './css/index.css'

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

import { Chart } from "chart.js";
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

function InvestorDetail() {
  const [data, setData] = useState();
  const [addEvent, setAddEvent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [eventTypeSelected, setEventTypeSelected] = useState("");
  const { propertyId, investorId } = useParams();
  const [numericFields, setNumericFields] = useState({
    event_amount: 0,
  });

  const property = data?.property;
  const investor = data?.investor;
  const investments = data?.investments || {};
  const events = data?.events || [];

  console.log(data);

  const eventTypes = [
    {
      value: "investment",
      icon: "💰",
      name: "Investment",
      description: "Initial capital contribution",
      color: "#10b981",
    },
    {
      value: "capital_call",
      icon: "📞",
      name: "Capital Call",
      description: "Request for additional funding",
      color: "#f59e0b",
    },
    {
      value: "return_of_capital",
      icon: "📤",
      name: "Return of Capital",
      description: "Principal returned to investor",
      color: "#3b82f6",
    },

    {
      value: "Return",
      icon: "💵",
      name: "Return",
      description: "Profit distribution payment",
      color: "#8b5cf6",
    },
  ];

  const allYears =
    events?.flatMap((e) => {
      if (e.event_date) {
        return [new Date(e.event_date).getFullYear()];
      } else if (e.from_date && e.to_date) {
        const startYear = new Date(e.from_date).getFullYear();
        const endYear = new Date(e.to_date).getFullYear();
        const years = [];

        for (let y = startYear; y <= endYear; y++) {
          years.push(y);
        }

        return years;
      }
    }) || [];

  const uniqueYears = Array.from(new Set(allYears)).sort((a, b) => a - b);

  const formatDate = (dateComingIn) => {
    if (!dateComingIn) return "N/A";

    let date;

    // If it's already a Date object
    if (dateComingIn instanceof Date) {
      date = dateComingIn;
    } else if (typeof dateComingIn === "string") {
      // Try to parse as ISO string
      const parsed = new Date(dateComingIn);

      if (isNaN(parsed)) {
        // If parsing failed, try manual split
        const parts = dateComingIn.split("-").map(Number);
        if (parts.length === 3) {
          const [year, month, day] = parts;
          date = new Date(Date.UTC(year, month - 1, day));
        } else {
          return "Invalid Date";
        }
      } else {
        date = parsed;
      }
    } else {
      return "Invalid Date";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const formatCurrency = (value) => {
    if (!value) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",

    }).format(value);
  };

  const calculateActualReturn = () => {
    const sum =
      events?.reduce((result, e) => {
        if (e.event_type === "Return") {
          return result + Number(e.event_amount);
        }
        return result;
      }, 0) || 0;

    return Number(sum.toFixed(2));
  };

  // Need to review below function

  const calculateExpectedPrefReturn = () => {
    const perfReturn = investments?.perf_return || 0;
    const rate = perfReturn / 100;
    const today = new Date();

    if (!property?.closing_date || !investments?.invested_amount) return 0;

    let totalExpected = 0;

    // 1️⃣ Build chronological event list
    const timeline = [
      {
        date: new Date(property?.closing_date),
        amount: investments?.invested_amount || 0,
        type: "Initial Investment",
      },
      ...(events || []).map((e) => ({
        date: new Date(e.event_date),
        amount: Number(e.event_amount) || 0,
        type: e.event_type,
      })),
    ];

    // 2️⃣ Sort by date ascending
    timeline.sort((a, b) => a.date - b.date);

    let currentPrincipal = 0;

    for (let i = 0; i < timeline.length; i++) {
      const event = timeline[i];

      // 3️⃣ Update principal first (before calculating return)
      if (
        event.type === "Initial Investment" ||
        event.type === "Investment" ||
        event.type === "Capital Call"
      ) {
        currentPrincipal += Number(event.amount);
      }

      if (event.type === "Return of Capital") {
        currentPrincipal -= Number(event.amount);
        if (currentPrincipal < 0) currentPrincipal = 0;
      }

      // 4️⃣ Calculate return from this event date to next event (or today)
      const daysElapsed = (today - event.date) / (1000 * 60 * 60 * 24);

      if (daysElapsed > 0 && currentPrincipal > 0) {
        totalExpected += currentPrincipal * rate * (daysElapsed / 365);
      }
    }

    return Number(totalExpected.toFixed(2));
  };

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

    const response = await fetch("https://thg-seven.vercel.app/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      setData((prev) => ({
        ...prev,
        events: [...(prev.events || []), result],
      }));

      setAddEvent(false);
      form.reset();
    }

    // You can add success notification or redirect here
  };

  const fetchInvestor = useCallback(async () => {
    const res = await fetch(
      `https://thg-seven.vercel.app/api/investor/${propertyId}/${investorId}`,
    );
    const investor = await res.json();
    setData(investor);
  }, [propertyId, investorId]);

  useEffect(() => {
    fetchInvestor();
  }, [fetchInvestor]);

  const updateField = async (field, value) => {
    try {
      await fetch(`https://thg-seven.vercel.app/api/investor/${investorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field, value }),
      });

      // ✅ Now this works correctly
      fetchInvestor();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const msPerDay = 1000 * 60 * 60 * 24;
  // CHART.js functions
  // getting all Return events
  const returnEvents = events?.filter((e) => e.event_type === "Return");

  // defining all quarters and start date and end date.
  const getQuarterRange = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();

    if (month <= 2)
      return { start: new Date(year, 0, 1), end: new Date(year, 3, 0) };
    if (month <= 5)
      return { start: new Date(year, 3, 1), end: new Date(year, 6, 0) };
    if (month <= 8)
      return { start: new Date(year, 6, 1), end: new Date(year, 9, 0) };
    return { start: new Date(year, 9, 1), end: new Date(year, 12, 0) };
  };

  const splitEventByQuarter = (startDate, endDate, amount, selectedYear) => {
    const result = [];

    const originalStart = new Date(startDate);

    const originalEnd = new Date(endDate);

    const yearStart = new Date(selectedYear, 0, 1);
    const yearEnd = new Date(selectedYear, 11, 31);

    const overlapStart = originalStart > yearStart ? originalStart : yearStart;
    const overlapEnd = originalEnd < yearEnd ? originalEnd : yearEnd;

    if (overlapStart > overlapEnd) return [];

    const totalDays = Math.round((originalEnd - originalStart) / msPerDay) + 1;

    let current = new Date(overlapStart);

    while (current <= overlapEnd) {
      let { start: quarterStart, end: quarterEnd } = getQuarterRange(current);

      // Clamp quarter to event range
      const periodStart = current > quarterStart ? current : quarterStart;
      const periodEnd = overlapEnd < quarterEnd ? overlapEnd : quarterEnd;

      const daysInPeriod = Math.round((periodEnd - periodStart) / msPerDay) + 1;

      const portion = (daysInPeriod / totalDays) * amount;

      // Push with the actual start of period (for accurate charting)
      result.push({ x: periodStart, y: portion });

      // Move to the next quarter
      current = new Date(periodEnd);
      current.setDate(current.getDate() + 1);
    }

    return result;
  };

  let chartPoints = [];

  returnEvents.forEach((event) => {
    const points = splitEventByQuarter(
      new Date(event.from_date),
      new Date(event.to_date),
      event.event_amount,
      selectedYear,
    );

    chartPoints = chartPoints.concat(points);
  });

  const aggregateByQuarter = (points, selectedYear) => {
    const quarters = [0, 3, 6, 9]; // Jan, Apr, Jul, Oct
    const result = [];

    quarters.forEach((month) => {
      const quarterStart = new Date(selectedYear, month, 1);
      const quarterEnd = new Date(selectedYear, month + 3, 0);

      // sum all actual amounts that belong to this quarter
      const sum = points
        .filter((p) => p.x >= quarterStart && p.x <= quarterEnd)
        .reduce((acc, p) => acc + p.y, 0);
      result.push({ x: quarterStart, y: sum });
    });

    const yearEndTotal = points.reduce((acc, p) => acc + p.y, 0);
    result.push({ x: new Date(selectedYear, 11, 31), y: yearEndTotal });

    return result;
  };

  const actualPerQuarter = aggregateByQuarter(chartPoints, selectedYear);

  // Expected Return per Quarter for Char.js,

  const expectedQuarterReturn = (selectedYear) => {
    const amountInvested = investments?.invested_amount || 0;
    const prefReturn = investments?.perf_return || 0;

    const perfReturnPercent = prefReturn / 100;
    const quarterReturn = (amountInvested * perfReturnPercent) / 4;

    return [
      { x: new Date(selectedYear, 0, 1), y: quarterReturn }, // Q1
      { x: new Date(selectedYear, 3, 1), y: quarterReturn }, // Q2
      { x: new Date(selectedYear, 6, 1), y: quarterReturn }, // Q3
      { x: new Date(selectedYear, 9, 1), y: quarterReturn }, // Q4
    ];
  };

  const yearEndDataset = [
    {
      label: "TO DATE CALCULATIONS",
      data: [
        {
          x: new Date(selectedYear, 11, 31),
          y: chartPoints.reduce((acc, p) => acc + p.y, 0),
        },
      ],
      backgroundColor: "rgba(0, 0, 0, 0.6)", // dark for year-end
    },
  ];

  const expectedPerQuarter = expectedQuarterReturn(selectedYear);

  const missingPerQuarter = expectedPerQuarter.map((exp, i) => {
    const actualY = actualPerQuarter[i]?.y || 0;
    return {
      x: exp.x,
      y: Math.max(exp.y - actualY, 0), // never negative
    };
  });

  const chartData = {
    datasets: [
      {
        label: "ACTUAL QUARTER RETURN",
        data: actualPerQuarter,
        backgroundColor: "rgba(75,192,192,0.6)",
        barThickness: 40, // fixed width
        maxBarThickness: 50, // optional
      },
      {
        label: "EXPECTED QUARTER RETURN",
        data: expectedQuarterReturn(selectedYear),
        backgroundColor: "rgba(192, 132, 75, 0.6)",
        barThickness: 40, // fixed width
        maxBarThickness: 50, // optional
      },
      {
        label: "MISSING AMOUNT PER QUARTER",
        data: missingPerQuarter,
        backgroundColor: "rgba(192, 75, 75, 0.6)",
        barThickness: 40, // fixed width
        maxBarThickness: 50, // optional
      },
      ...yearEndDataset,
    ],
  };

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
        type: "time",
        min: new Date(selectedYear, 0, 1), // April 1 (month is 0-indexed)
        max: new Date(selectedYear, 11, 30),
        time: {
          unit: "quarter",
        },
        ticks: {
          callback: function (value) {
            const startDate = new Date(value);

            const startMonth = startDate.getMonth();
            const year = startDate.getFullYear();

            // Last day of the quarter
            const endDate = new Date(year, startMonth + 3, 0);

            const format = (date) =>
              date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

            return `${selectedYear} ${format(startDate)} - ${format(endDate)}`;
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
        },
      },
    },
  };

  const investmentToDate = () => {
    const investmentEvents = events
      ?.filter(
        (e) => e.event_type === "Investment" || e.event_type === "Capital Call",
      )
      .map((e) => e.event_amount);

    const total = investmentEvents.reduce((result, investmentEvents) => {
      return result + Number(investmentEvents);
    }, 0);

    const returnEvents = events
      ?.filter((e) => e.event_type === "Return of Capital")
      .map((e) => e.event_amount);

    const totalFromReturnEvents = returnEvents.reduce(
      (result, returnEvents) => {
        return result + Number(returnEvents);
      },
      0,
    );

    const initialInvestment = Number(investments?.invested_amount);

    return Number(total + initialInvestment - totalFromReturnEvents).toFixed(2);
  };

  return (
    <>
      <style>{`
        .section-subtitle {
          color: #6b7280;
          font-size: 0.9375rem;
          margin: 0;
        }

      :root{
       --border-radius: 16px;
      }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

          .section-card {
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .section-header {
          padding: 2rem 2.5rem 1.5rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-subtitle {
          color: #6b7280;
          font-size: 0.9375rem;
          margin: 0;
        }


        body {
          font-family: 'DM Sans', sans-serif;
          color: #f8f9fa;
          min-height: 100vh;
        }

        .page-wrapper {
          margin: 0 auto;
          padding: 2rem;
        }

        /* HERO SECTION */
        
        
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
  display: flex;
  flex-direction: column;
  overflow-y: scroll; 
   overflow-x: hidden; 
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
          .form-control:focus{
          color: black}

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
        <div className="hero-section ">
          <div className="hero">
            
             
  <div className="hero-left">
    <img
      src={
        property?.secure_url ||
        "https://via.placeholder.com/400x300?text=Property"
      }
      alt="Property"
      className="hero-image"
    />
  </div>

  <div className="hero-right">
   
      <span className="hero-eyebrow">Investor</span>
      <input
        className="hero-main-title"
        value={investor?.name}
        onChange={(e) =>
          setData((prev) => ({
            ...prev,
            investor: {
              ...prev.investor,
              name: e.target.value,
            },
          }))
        }
        onBlur={(e) => updateField("name", e.target.value)}
      />
    

    <div className="hero-context">
      <h2>{property?.property_name}</h2>
      <p>Closing Date: {formatDate(property?.closing_date)}</p>
    </div>
  </div>

          </div>
          </div>
          
        

      <div className="section-card mx-3">
       <div className="section-header">
          <h2 >
            <span style={{ fontSize: "1.5rem" }}>📈</span>
            Investment Summary
          </h2>

          <p className="section-subtitle">
            Overview of capital invested and return performance to date.
          </p>
          </div>
          
        

       

        <div className="stats-container m-5">
          <>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-label">INITIAL INVESTMENT</div>
              <div className="stat-value">
                {formatCurrency(investments?.invested_amount)}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-label">INVESTMENT TO DATE</div>
              <div className="stat-value">
                {formatCurrency(investmentToDate())}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💹</div>
              <div className="stat-label">Perf Return</div>
              <div className="stat-value">% {investments?.perf_return}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-label">Actual Return</div>
              <div className="stat-value">
                {formatCurrency(calculateActualReturn())}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-label">Expected Return</div>
              <div className="stat-value">
                {formatCurrency(
                  calculateExpectedPrefReturn(
                    investments?.invested_amount,
                    investments?.perf_return,
                    property?.closing_date,
                  ),
                )}
              </div>
            </div>
          </>
        </div>
      </div>

      

      

      <div className="m-5">
        <div className="card shadow-sm m-5">
          <div className="card-body m-5">
            <div className="d-flex align-items-center mb-4">
              <label className="form-label me-2 mb-0 fw-semibold">
                Select Year:
              </label>
              <select
                className="form-select form-select-sm w-auto"
                onChange={(e) => setSelectedYear(e.target.value)}
                value={selectedYear}
              >
                <option value="">Select Year</option>
                {uniqueYears?.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ height: "450px" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="m-5">
          <div class="card m-5">
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
            <div>
              <div class="card-body">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th className="text-center">Event Date:</th>
                      <th>Event Amount:</th>
                      <th>Event Type:</th>
                      <th>Notes:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events?.length > 0 ? (
                      events?.map((e, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            {e.event_type === "Return"
                              ? `${formatDate(e.from_date)} - ${formatDate(e.to_date)}`
                              : formatDate(e.event_date)}
                          </td>

                          <td>${formatNumber(e.event_amount)}</td>
                          <td>{e.event_type}</td>
                          <td>{e.notes}</td>
                        </tr>
                      ))
                    ) : (
                      <div className="text-center mt-5">
                        <p className="text-muted ">No events yet</p>
                      </div>
                    )}
                  </tbody>
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
                            <h2 className="modal-title-enhanced">
                              Add New Event
                            </h2>
                            <p className="modal-subtitle-enhanced">
                              Record a capital transaction for this investor
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="modal-close-enhanced"
                          onClick={handleCancel}
                          aria-label="Close"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
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
                                <span className="label-icon-enhanced">💵</span>
                                <span>Event Amount</span>
                                <span className="required-asterisk">*</span>
                              </label>
                              <div className="input-wrapper-enhanced">
                                <NumericFormat
                                  className="form-control "
                                  placeholder="$1,500,000"
                                  thousandSeparator={true}
                                  
                                  prefix={"$"}
                                  decimalScale={2}
                                  fixedDecimalScale={true}
                                  onValueChange={(values) => {
                                    setNumericFields((prev) => ({
                                      ...prev,
                                      event_amount: values.floatValue || 0,
                                    }));
                                  }}
                                />
                                <input
                                  type="hidden"
                                  name="event_amount"
                                  value={numericFields.event_amount}
                                />
                              </div>

                              <span className="helper-text-enhanced">
                                Transaction amount in USD
                              </span>
                            </div>
                          </div>

                          <div className="form-field-enhanced form-field-full">
                            <label className="form-label-enhanced">
                              <span className="label-icon-enhanced">🏷️</span>
                              <span>Event Type</span>
                              <span className="required-asterisk">*</span>
                            </label>
                            <div className="event-type-grid-enhanced">
                              {eventTypes.map((type) => (
                                <label
                                  key={type.value}
                                  className="event-type-item-enhanced"
                                >
                                  <input
                                    type="radio"
                                    name="event_type"
                                    value={type.name}
                                    className="event-radio-enhanced"
                                    required
                                    onChange={(e) =>
                                      setEventTypeSelected(e.target.value)
                                    }
                                  />
                                  <div className="event-card-enhanced">
                                    <div className="event-card-content">
                                      <span className="event-icon-enhanced">
                                        {type.icon}
                                      </span>
                                      <div className="event-text-enhanced">
                                        <div className="event-name-enhanced">
                                          {type.name}
                                        </div>
                                        <div className="event-desc-enhanced">
                                          {type.description}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="event-checkbox-enhanced">
                                      <svg
                                        className="checkmark-enhanced"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                      >
                                        <path
                                          d="M13.3334 4L6.00002 11.3333L2.66669 8"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                          {(eventTypeSelected === "Investment" ||
                            eventTypeSelected === "Capital Call" ||
                            eventTypeSelected === "Return of Capital") && (
                            <div className="form-field-enhanced col-md-6 mt-4">
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
                              <span className="helper-text-enhanced">
                                When did this occur?
                              </span>
                            </div>
                          )}

                          {eventTypeSelected === "Return" && (
                            <div className="row">
                              <div className="form-field-enhanced col-md-6 mt-4">
                                <label className="form-label-enhanced">
                                  <span className="label-icon-enhanced">
                                    📅
                                  </span>
                                  <span>From:</span>
                                  <span className="required-asterisk">*</span>
                                </label>
                                <input
                                  type="date"
                                  className="form-input-enhanced"
                                  name="from_date"
                                  required
                                />
                              </div>

                              <div className="form-field-enhanced col-md-6 mt-4">
                                <label className="form-label-enhanced">
                                  <span className="label-icon-enhanced">
                                    📅
                                  </span>
                                  <span>To:</span>
                                  <span className="required-asterisk">*</span>
                                </label>
                                <input
                                  type="date"
                                  className="form-input-enhanced"
                                  name="to_date"
                                  required
                                />
                              </div>
                            </div>
                          )}

                          {/* EVENT TYPE SELECTOR */}

                          {/* NOTES */}
                          <div className="form-field-enhanced form-field-full mt-2">
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
                            <span className="helper-text-enhanced">
                              Any relevant context or details
                            </span>
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
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path
                                    d="M12 8H4M8 4v8"
                                    strokeLinecap="round"
                                  />
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
      </div>
    
    </div>
    </>
  );
}

export default InvestorDetail;
