import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function InvestorDetail () {

    const [investor , setInvestor] = useState()

    const { id } = useParams()

    console.log(id)

    console.log(investor)

     useEffect(() => {
        fetch(`https://thg-seven.vercel.app/api/investor/${id}`)
          .then((res) => res.json())
          .then((data) => setInvestor(data))
          .catch((err) => console.error(err));
      }, [id]);

   
    return (
        <>
        <h1>This is the investor Detail Component </h1>
        </>
    )
}

export default InvestorDetail;



