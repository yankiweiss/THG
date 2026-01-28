import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ setShowForm }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
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
          <ul className="navbar-nav mx-auto gap-lg-3">
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link ${isActive("/documents") ? "fw-bold text-primary" : "text-dark"}`}
                onClick={() => navigate("/documents")}
              >
                Documents
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link btn btn-link ${isActive("/properties") ? "fw-bold text-primary" : "text-dark"}`}
                onClick={() => navigate("/properties")}
              >
                Properties
              </button>
            </li>

            {/* Add Deal Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-dark"
                data-bs-toggle="dropdown"
              >
                Add Deal
              </button>
              <ul className="dropdown-menu shadow-sm">
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/addDeal")}>Sponsor</button>
                </li>
                <li>
                  <button className="dropdown-item">Limited Partner</button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item">Sponsor / GP</button>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link btn btn-link ${isActive("/reports") ? "fw-bold text-primary" : "text-dark"}`}
                onClick={() => navigate("/reports")}
              >
                Reports
              </button>
            </li>
          </ul>

          {/* Right CTA */}
          <div className="d-flex">
            <button
              className="btn btn-primary rounded-pill px-4"
              onClick={() => {navigate("/addDeal"); setShowForm(true)}}
              
            >
              + New Deal
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
