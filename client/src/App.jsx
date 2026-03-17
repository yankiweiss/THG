import Navbar from "./Navbar";
import AddDealLP from "./AddDealLP";
import Properties from "./Properties";
import { Routes, Route } from "react-router-dom";
import Documents from "./Documents";
import PropertyDetail from "./PropertyDetail";
import AddDealCS from "./AddDeailCS";
import Reports from "./Reports";
import InvestorDetail from "./InvestorDetail";
import './css/index.css'


function App() {
  return (
    <>

    <div className="app">
      <Navbar />

     
      <Routes>
        <Route path="/" element={<Properties />} />
      
        <Route path="/properties" element={<Properties />} />
       
        <Route path="/addDealLP" element={<AddDealLP />} />
        <Route path="/addDealCS" element={<AddDealCS />} />
        <Route path="/investorDetail/:propertyId/:investorId" element={<InvestorDetail />} />

        <Route path="/documents" element={<Documents />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>

      </div>
    </>
  );
}

export default App;
