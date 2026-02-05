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
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">

        <img src={logo} alt="logo" style={{display: 'block', width: '170px'}} onClick={() => navigate("/")}/>
        {/* Brand / Logo */}

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          {/* Left Nav */}
   

            <ul className="navbar-nav mx-auto gap-2">

            {[
              { label: "Documents", path: "/documents" },
              { label: "Properties", path: "/properties" },
              { label: "Reports", path: "/reports" },
            ].map((item) => (
              <li className="nav-item" key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`nav-link px-3 rounded-pill fw-medium ${
                    isActive(item.path)
                      ? "bg-primary text-white"
                      : "text-dark"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

         
         

          <div className="dropdown ms-auto">
            <button
              className="btn btn-primary rounded-pill px-4 fw-semibold"
              data-bs-toggle="dropdown"
            >
              + New Deal
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => navigate("/addDealLP")}
                >
                  Limited Partner (LP)
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
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
  );
}

export default Navbar;
