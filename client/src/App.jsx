import { useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import AddDeal from "./AddDeal";
import Properties from "./Properties";


function App() {
  const [isAddDealVisible, setIsAddDealVisible] = useState(false);
  const [isPropertyVisibility, setIsPropertyVisibility] = useState(false);

  const addDealVisibility = () => {
    setIsAddDealVisible(true);
  };

  const addPropertyVisibility = () => {
    setIsPropertyVisibility(true);
  };
  return (
    <>
      <Header />
      <Navbar
        addDealVisibility={addDealVisibility}
        addPropertyVisibility={addPropertyVisibility}
      />

      {isAddDealVisible && <AddDeal />}
      {isPropertyVisibility && <Properties />}

      
    </>
  );
}

export default App;