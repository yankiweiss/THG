import "./css/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./css/index.css";
import { FiPlus } from "react-icons/fi";
import {Link} from 'react-router-dom';

import { useNavigate } from "react-router-dom";

function PropertyDetail() {
  const [data, setData] = useState([]);

  const handleCancel = () => {
    setIsOpen(false);
  };

  const toLocalDate = (dateString) => {
    if (!dateString) return null;

    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  console.log(data.closing_date);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addInvestor, setAddInvestor] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const goToInvestorDetail = (propertyId, investorId) => {
    navigate(`/investorDetail/${propertyId}/${investorId}`);
  };

  let { id } = useParams();

  const fetchProperty = useCallback(async () => {
    const res = await fetch(
      `https://thg-seven.vercel.app/api/properties/${id}`,
    );
    const property = await res.json();
    setData(property);
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  // ✅ Safe: runs AFTER render

  //  function getQuarter(dateString) {
  //    const month = new Date(dateString).getMonth(); // 0–11
  //    return Math.floor(month / 3); // 0–3
  //  }

  // update field in the properties database table

  const updateField = async (field, value) => {
    try {
      await fetch(`https://thg-seven.vercel.app/api/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field, value }),
      });

      // ✅ Now this works correctly
      fetchProperty();
    } catch (err) {
      console.error("Update failed:", err);
    }
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

  const navigate = useNavigate();

  const addNewInvestor = async (e) => {
    e.preventDefault();
    const form = e.target;

    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());

    const payload = {
      ...dataObject,
      property_id: id,
    };

    console.log(payload);

    await fetch("https://thg-seven.vercel.app/api/investor/addInvestor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setAddInvestor(false);
  };

  return (
    <>
<div className="right-side">
    <div className="main-flex">
      <div className="property-content">
        <h3 className="fw600">8 Smith Clove Road</h3>

        <div className="propertyDetail_flex">
          <img
            src={"../src/assets/g1eyapz0z56ntbnjk13m.webp"}
            max-width={"500px"} max-height={'200px'} width={'500px'} height={'200px'}
            style={{ borderRadius: "8px" , boxShadow:'4px 4px 5px 1px  #1B3C77BF'}}
            alt="property_picture"
          />

          <div className="propertyDetail_fin_flex">
            <div>
              <h6 className="PropertyDetail-fin-text">Total Investors</h6>
              <h6 className="PropertyDetail-fin-value">4</h6>
            </div>
            <div>
              <h6 className="PropertyDetail-fin-text">Purchase Price</h6>
              <h6 className="PropertyDetail-fin-value">$285,000.00</h6>
            </div>
            <div>
              <h6 className="PropertyDetail-fin-text">Closing Date</h6>
              <h6 className="PropertyDetail-fin-value">09/22/1997</h6>
            </div>
          </div>
        </div>
      </div>

      <div className="PD-in-sec">

      <h4 style={{fontWeight: '600', marginBottom: '15px'}}>QUICK INVESTORS OVERVIEW</h4>

      <div className="PD-in-sec-dt">

        <div className="investors_section">
          
        <h3 className="fw600 item" >Joel Freidman</h3>

        
<Link to={'/investorDetail'}>
        <div className="investor_details">

        <h6 style={{textAlign: 'center', color: '#2570C0', fontWeight: '600'}} className="item k">Investor<br></br> Portfolio<br></br> Details</h6>

        <div className="flex-column item k">

          <h6 className="fw600">INVESTED</h6>
          <h6 style={{color: '#2570C0'}} className="fw600">$600,000.00</h6>

        </div>

        <div className="flex-column item k">

          <h6 className="fw600">PERF RETURN</h6>
          <h6 style={{color: '#2570C0'}} className="fw600">10%</h6>

        </div>
        </div>

        </Link>
       
        
        </div>
      </div>
      </div>
      </div>

      <div className="add-investor-section">
        
        <button className="add-investor"><FiPlus style={{fontSize: '26px'}}/>Add Investor</button>
     </div>
      </div>
   
    </>
  );
}

export default PropertyDetail;
