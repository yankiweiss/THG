import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function PropertyDetail () {

   const [property, setProperty] = useState('')

    const {id} = useParams()

     useEffect(() => fetch(`https://thg-seven.vercel.app/api/properties/${id}`).then(response => response.json()).then(response => setProperty(response)))

    console.log(id)
    return (
        <>
        {console.log(property)}
        <h1>Property Details</h1>
        </>
    )
}

export default PropertyDetail