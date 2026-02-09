import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function InvestorDetail () {

    const [investor , setInvestor] = useState()

    const investorID = useParams()

    console.log(investor)

     useEffect(() => {
        fetch(`https://thg-seven.vercel.app/api/investor/${investorID}`)
          .then((res) => res.json())
          .then((data) => setInvestor(data))
          .catch((err) => console.error(err));
      }, [investorID]);

   
    return (
        <>
        <h1>This is the investor Detail Component </h1>
        </>
    )
}

export default InvestorDetail;



