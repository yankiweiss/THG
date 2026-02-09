import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function InvestorDetail () {

    const [investor , setInvestor] = useState()

    const investorDetail = useParams()

     useEffect(() => {
        fetch(`https://thg-seven.vercel.app/api/investor/${investorDetail}`)
          .then((res) => res.json())
          .then((data) => setInvestor(data))
          .catch((err) => console.error(err));
      }, [investorDetail]);

   
    return (
        <>
        <h1>This is the investor Detail Component </h1>
        </>
    )
}

export default InvestorDetail;



