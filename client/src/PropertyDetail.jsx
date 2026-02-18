import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";


function PropertyDetail() {
  const [data, setData] = useState([]);
  console.log(data)
  
 const handleCancel = () => {
    setIsOpen(false);
  };

 
 const [isSubmitting, setIsSubmitting] = useState(false);
  const [addInvestor, setAddInvestor] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const goToInvestorDetail = (propertyId, investorId) => {
    navigate(`/investorDetail/${propertyId}/${investorId}`);
  };

  const { id } = useParams();

  useEffect(() => {
    fetch(`https://thg-seven.vercel.app/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, [id]);

  

  

  // ✅ Safe: runs AFTER render
  
 

 

  //  function getQuarter(dateString) {
  //    const month = new Date(dateString).getMonth(); // 0–11
  //    return Math.floor(month / 3); // 0–3
  //  }

  const formatCurrency = (value) => {
    if (!value) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateComingIn) => {
    if (!dateComingIn) return "N/A";
    const date = new Date(dateComingIn);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

 
  const navigate = useNavigate();

  

  const addNewInvestor = async (e) => {
    e.preventDefault();
    const form = e.target;

    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());

    const payload = {
      ...dataObject,
      property_id : id
    };

    console.log(payload);

    await fetch("https://thg-seven.vercel.app/api/investor/addInvestor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });



    setAddInvestor(false)

  
  };

  

  return (
    <>
      <style>{`
        :root {
       
          --primary-gradient: linear-gradient(135deg, #0240dbe5 0%, #a2b9dd 100%);
          --success-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          --info-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          --border-radius: 16px;
          --shadow-sm: 0 2px 4px rgba(0,0,0,0.08);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
          --shadow-lg: 0 12px 24px rgba(0,0,0,0.15);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

        
        .page-wrapper {
          margin: 0 auto;
          padding: 2rem;
        }

        /* HERO SECTION */
        .hero-section {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 3rem;
          background: linear-gradient(135deg, #0240dbe5 0%, #a2b9dd 100%);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .hero-content {
          display: grid;
          grid-template-columns: 500px 1fr;
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


        body {
          background: #f8f9fa;
        }

        .property-hero {
          background: var(--primary-gradient);
          border-radius: var(--border-radius);
          padding: 0;
          margin-bottom: 2rem;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          position: relative;
        }

        .property-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          color: white;
          padding: 3rem 2.5rem;
        }

        .property-image-wrapper {
          position: relative;
          height: 100%;
          min-height: 400px;
        }

        .property-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .property-name-input {
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          transition: var(--transition);
          backdrop-filter: blur(10px);
          width: 100%;
        }

        .property-name-input:focus {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.6);
          outline: none;
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
        }

        .property-name-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .property-name-display {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .edit-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.4);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          transition: var(--transition);
          cursor: pointer;
          backdrop-filter: blur(10px);
        }

        .edit-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.6);
          transform: translateY(-2px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .stat-card-modern {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          border: 1px solid #e5e7eb;
          position: relative;
          overflow: hidden;
        }

        .stat-card-modern::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--primary-gradient);
          transform: scaleY(0);
          transition: var(--transition);
        }

        .stat-card-modern:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .stat-card-modern:hover::before {
          transform: scaleY(1);
        }

        .stat-label {
          font-size: 0.8125rem;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-value {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
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

        .investor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          padding: 2rem 2.5rem;
        }

        .investor-card-modern {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.75rem;
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }

        .investor-card-modern::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--primary-gradient);
          transform: scaleX(0);
          transition: var(--transition);
        }

        .investor-card-modern:hover {
          border-color: #a78bfa;
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .investor-card-modern:hover::before {
          transform: scaleX(1);
        }

        .investor-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .investor-initial {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.125rem;
        }

        .investor-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .investor-stat-item {
          text-align: center;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .investor-stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .investor-stat-value {
          font-size: 1.125rem;
          font-weight: 700;
          color: #059669;
        }

        .investor-stat-badge {
          display: inline-block;
          padding: 0.375rem 0.875rem;
          background: var(--primary-gradient);
          color: white;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9375rem;
        }

        .view-details-btn {
          width: 100%;
          background: var(--primary-gradient);
          border: none;
          color: white;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          transition: var(--transition);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
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

        .view-details-btn::before {
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

        .view-details-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .view-details-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .quick-investors {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }

        .quick-investor-chip {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 50px;
          padding: 0.625rem 1.25rem;
          font-weight: 600;
          color: #374151;
          transition: var(--transition);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quick-investor-chip:hover {
          border-color: #a78bfa;
          background: #f9fafb;
          transform: translateY(-2px);
        }

        .chip-initial {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.75rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #9ca3af;
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .property-hero {
            margin-bottom: 1.5rem;
          }

          .hero-content {
            padding: 2rem 1.5rem;
          }

          .property-name-input,
          .property-name-display {
            font-size: 1.75rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .investor-grid {
            grid-template-columns: 1fr;
            padding: 1.5rem;
          }

          .section-header {
            padding: 1.5rem;
      }
      
            .modal-overlay{
            position: fixed; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(119, 119, 119, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
            }

.custom-modal {
 background: white;
  padding: 20px;
  border-radius: 8px;
  width: 1000px;
  max-width: 90%;

}
  .modal-footer-enhanced {
          padding: 1.75rem 2.5rem;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
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
        
        
      `}</style>

      <div className="page-wrapper">
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-image-container">
              <div className="property-badge">PROPERTY</div>
              <img
                src={
                  data.secure_url ||
                  "https://via.placeholder.com/350x350?text=Property"
                }
                alt="Property"
                className="hero-image"
              />
            </div>
            <div className="hero-info">
              <div>
                <h1 className="property-title">
                  {data.property_name || "Property Name"}
                </h1>
              </div>

              <div className="stats-grid">
                <div className="stat-card-modern">
                  <div
                    className="stat-icon"
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      color: "#3b82f6",
                    }}
                  >
                    💰
                  </div>
                  <div className="stat-label">Purchase Price</div>
                  <div className="stat-value">
                    {formatCurrency(data.purchase_price)}
                  </div>
                </div>

                <div className="stat-card-modern">
                  <div
                    className="stat-icon"
                    style={{
                      background: "rgba(139, 92, 246, 0.1)",
                      color: "#8b5cf6",
                    }}
                  >
                    📅
                  </div>
                  <div className="stat-label">Closing Date</div>
                  <div className="stat-value" style={{ fontSize: "1.5rem" }}>
                    {formatDate(data.closing_date)}
                  </div>
                </div>

                <div className="stat-card-modern">
                  <div
                    className="stat-icon"
                    style={{
                      background: "rgba(245, 158, 11, 0.1)",
                      color: "#f59e0b",
                    }}
                  >
                    👥
                  </div>
                  <div className="stat-label">Total Investors</div>
                  <div className="stat-value">
                    {data.investors?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK INVESTORS OVERVIEW */}
      {data.investors && data.investors.length > 0 && (
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">
              <span style={{ fontSize: "1.5rem" }}>👥</span>
              Quick Investor Overview
            </h2>
            <p className="section-subtitle">
              {data.investors.length} investor
              {data.investors.length !== 1 ? "s" : ""} in this property
            </p>
            <div className="quick-investors">
              {data.investors.map((investor) => (
                <div
                  key={investor.id}
                  className="quick-investor-chip"
                  onClick={() => goToInvestorDetail(data.id, investor.id)}
                >
                  <div className="chip-initial">
                    {investor.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <span>{investor.name}</span>
                  <span style={{ color: "#059669", fontWeight: "700" }}>
                    {formatCurrency(investor.invested_amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DETAILED INVESTOR PORTFOLIO */}
      <div className="section-card">
        <div className="section-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="section-title">
                <span style={{ fontSize: "1.5rem" }}>📋</span>
                Investor Portfolio Details
              </h2>
              <p className="section-subtitle">
                Comprehensive breakdown of investor contributions and returns
              </p>
            </div>

            <div>
              <button
                className="btn btn-primary"
                onClick={() => setIsOpen(true)}
              >
                Add Investor{" "}
              </button>
            </div>
          </div>
        </div>

        {data.investors && data.investors.length > 0 ? (
          <div className="investor-grid">
            {data.investors.map((investor) => (
              <div key={investor.id} className="investor-card-modern">
                <div className="investor-name">
                  <div className="investor-initial">
                    {investor.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <span>{investor.name}</span>
                </div>

                <div className="investor-stats">
                  <div className="investor-stat-item">
                    <div className="investor-stat-label">Invested</div>
                    <div className="investor-stat-value">
                      {formatCurrency(investor.invested_amount)}
                    </div>
                  </div>

                  <div className="investor-stat-item">
                    <div className="investor-stat-label">Pref Return</div>
                    <div>
                      <span className="investor-stat-badge">
                        {investor.perf_return || 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className="view-details-btn"
                  onClick={() => goToInvestorDetail(data.id, investor.id)}
                >
                  View Full Details →
                </button>
              </div>
            ))}
          </div>
        ) : !addInvestor ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>No Investors Yet</h3>
            <p>Add investors to track their portfolio details</p>
          </div>
        ) : null}
      </div>

      {isOpen && (
        <div className="modal-overlay-enhanced"
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
                <div className="modal-icon-circle">👥</div>
                <div>
                  <h2 className="modal-title-enhanced">Add New Investor</h2>
                  <p className="modal-subtitle-enhanced">
                    Provide the required information to onboard a new investor.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-enhanced"
                aria-label="Close"
               onClick={handleCancel}
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
            <form onSubmit={addNewInvestor}>
              <div className="modal-body-enhanced">
                {/* DATE AND AMOUNT ROW */}
                <div className="form-row-enhanced">
                  <div className="form-field-enhanced">
                    <label className="form-label-enhanced">
                      <span className="label-icon-enhanced"></span>
                      <span>Investor Name</span>
                      <span className="required-asterisk">*</span>
                    </label>
                    <div className="input-wrapper-enhanced">
                      <input
                        type="text"
                        className="form-input-enhanced input-with-prefix-enhanced"
                        name="investor_name"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-field-enhanced">
                    <label className="form-label-enhanced">
                      <span className="label-icon-enhanced"></span>
                      <span>Amount Invested</span>
                      <span className="required-asterisk">*</span>
                    </label>
                    <div className="input-wrapper-enhanced">
                      <span className="input-prefix-enhanced">$</span>
                      <input
                        type="number"
                        className="form-input-enhanced input-with-prefix-enhanced"
                        name="investor_name"
                        placeholder="100,000"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row-enhanced">
                  <div className="form-field-enhanced">
                    <label className="form-label-enhanced">
                      <span className="label-icon-enhanced"></span>
                      <span>Perf Return</span>
                      <span className="required-asterisk">*</span>
                    </label>
                    <div className="input-wrapper-enhanced">
                      <span className="input-prefix-enhanced">$</span>
                      <input
                        type="number"
                        className="form-input-enhanced input-with-prefix-enhanced"
                        name="investor_name"
                        placeholder="100,000"
                        required
                      />
                    </div>
                  </div>
                </div>
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
              </div>
            </form>
          </div>

               
        </div>
      )}
    </>
  );
}

export default PropertyDetail;
