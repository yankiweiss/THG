import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate, useLocation } from "react-router-dom";
import MyBarChart from "./Chatrs";
import logo from '../src/assets/logo.png'

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
     <style>{`
        .modern-navbar {
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.95) !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .logo-image {
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .logo-image:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }

        .nav-pill {
          position: relative;
          padding: 0.5rem 1.25rem;
          border-radius: 50px;
          font-weight: 500;
          font-size: 0.95rem;
          border: 2px solid transparent;
          background: transparent;
          color: #495057;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .nav-pill:hover {
          background-color: #f8f9fa;
          color: #0d6efd;
          transform: translateY(-1px);
        }

        .nav-pill.active {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
          border-color: transparent;
        }

        .nav-pill.active:hover {
          background: linear-gradient(135deg, #0a58ca 0%, #084298 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(13, 110, 253, 0.4);
        }

        .new-deal-btn {
          position: relative;
          padding: 0.6rem 1.75rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.95rem;
          background: linear-gradient(135deg, #198754 0%, #146c43 100%);
          border: none;
          color: white;
          box-shadow: 0 4px 12px rgba(25, 135, 84, 0.25);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .new-deal-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .new-deal-btn:hover::before {
          left: 100%;
        }

        .new-deal-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(25, 135, 84, 0.4);
          background: linear-gradient(135deg, #146c43 0%, #0d5132 100%);
        }

        .new-deal-btn:active {
          transform: translateY(0);
        }

        .deal-dropdown {
          border-radius: 12px;
          border: none;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          padding: 0.5rem;
          min-width: 220px;
          animation: dropdownFade 0.2s ease;
        }

        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .deal-dropdown-item {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-weight: 500;
          color: #495057;
          transition: all 0.2s ease;
          cursor: pointer;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .deal-dropdown-item:hover {
          background-color: #f8f9fa;
          color: #0d6efd;
          transform: translateX(4px);
        }

        .deal-dropdown-item::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.5;
        }

        .navbar-toggler {
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          transition: all 0.2s ease;
        }

        .navbar-toggler:hover {
          border-color: #0d6efd;
          background-color: #f8f9fa;
        }

        .navbar-toggler:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
        }

        .nav-separator {
          width: 1px;
          height: 24px;
          background: linear-gradient(to bottom, transparent, #dee2e6, transparent);
          margin: 0 1rem;
        }

        @media (max-width: 991px) {
          .navbar-nav {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e9ecef;
          }

          .nav-pill {
            justify-content: center;
            text-align: center;
          }

          .new-deal-btn {
            width: 100%;
            margin-top: 1rem;
          }
        }

        /* Mobile menu animation */
        .navbar-collapse {
          transition: height 0.3s ease;
        }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-light modern-navbar sticky-top">
        <div className="container py-2">
          {/* Logo */}
          <img 
            src={logo} 
            alt="Company Logo" 
            className="logo-image"
            style={{ width: '170px' }} 
            onClick={() => navigate("/")}
          />

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            {/* Navigation Items - Centered */}
            <ul className="navbar-nav mx-auto gap-2 my-2 my-lg-0">
              {[
                { label: "Documents", path: "/documents", icon: "📄" },
                { label: "Properties", path: "/properties", icon: "🏢" },
                { label: "Reports", path: "/reports", icon: "📊" },
              ].map((item) => (
                <li className="nav-item" key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`nav-pill ${isActive(item.path) ? "active" : ""}`}
                  >
                    <span className="d-none d-lg-inline me-1">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Separator (desktop only) */}
            <div className="nav-separator d-none d-lg-block"></div>

            {/* New Deal Dropdown */}
            <div className="dropdown">
              <button
                className="new-deal-btn"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span style={{ position: 'relative', zIndex: 1 }}>
                  ✨ New Deal
                </span>
              </button>

              <ul className="dropdown-menu dropdown-menu-end deal-dropdown">
                <li>
                  <button
                    className="deal-dropdown-item"
                    onClick={() => navigate("/addDealLP")}
                  >
                    Limited Partner (LP)
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider my-1" style={{ opacity: 0.1 }} />
                </li>
                <li>
                  <button
                    className="deal-dropdown-item"
                    onClick={() => navigate("/addDealCS")}
                  >
                    Co-Sponsors
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      </>
  );
}

export default Navbar;
