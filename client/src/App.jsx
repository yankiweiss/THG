import Header from "./Header";
import Navbar from "./Navbar";
import AddDeal from "./AddDeal";
import Properties from "./Properties";
import {Routes, Route} from 'react-router-dom'
import Documents from "./Documents";


function App() {
  

 
  return (
    <>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/properties" element={<Properties />} />
        <Route path="/addDeal" element={<AddDeal />} />
         <Route path="/documents" element={<Documents/>} />
      </Routes>

   
      
    </>
  );
}

export default App;