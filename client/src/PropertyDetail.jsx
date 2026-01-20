import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function PropertyDetail () {

   const [property, setProperty] = useState(null)

    const {id} = useParams()

    useEffect(() => {
    fetch(`https://thg-seven.vercel.app/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => setProperty(data))
      .catch((err) => console.error(err));
  }, [id]); // ✅ dependency array

    console.log(id)
    return (
        <>
        {console.log(property)}
        <h1>Property Details</h1>
        </>
    )
}

export default PropertyDetail