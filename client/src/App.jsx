import Header from "./Header";
import Navbar from "./Navbar";
import AddDeal from "./AddDeal";
import Properties from "./Properties";
import { Routes, Route } from "react-router-dom";
import Documents from "./Documents";
import PropertyDetail from "./PropertyDetail";
import { useState } from "react";




function App() {
  
const [showForm, setShowForm] = useState(true);

  return (
    <>
      <Header />
   
      <Navbar  setShowForm={setShowForm}/>
      <Routes>
        <Route path="/properties" element={<Properties />} />
        <Route path="/addDeal" element={<AddDeal showForm={showForm} setShowForm={setShowForm}/>} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
      </Routes>
    </>
  );
}

export default App;
