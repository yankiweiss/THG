import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";
import { BiHomeAlt } from "react-icons/bi";
import { LuFiles, LuChartColumnDecreasing } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import MyBarChart from "./Chatrs";
import logo from "../src/assets/logo.png";
import "./css/index.css";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [activeIcon, setActiveIcon] = useState(null);

  return (
    <>
      <div className="navbar">
        <div className="logo_company_name">
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: "145px" }}
            onClick={() => navigate("/")}
          />
        </div>

        <div className="icons">
          <button
            className={`icon ${activeIcon === "home" ? "active" : " "} `}
            onClick={() => setActiveIcon("home")}
          >
            <BiHomeAlt /> Properties
          </button>

          <button
            className={`icon ${activeIcon === "file" ? "active" : " "} `}
            onClick={() => setActiveIcon("file")}
          >
            <LuFiles /> Files
          </button>

          <button
            className={`icon ${activeIcon === "chart" ? "active" : " "} `}
            onClick={() => setActiveIcon("chart")}
          >
            <LuChartColumnDecreasing /> Reports
          </button>

          <button
            className={`icon ${activeIcon === "plus" ? "active" : " "} `}
            onClick={() => setActiveIcon("plus")}
          >
            <FiPlus /> Add Deal
          </button>
        </div>

        <section className="log">
          <button className="logOut">Log Out</button>
          
        </section>
      </div>
    </>
  );
}

export default Navbar;
