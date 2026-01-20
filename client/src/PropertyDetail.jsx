import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PropertyDetail() {
  const [property, setProperty] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    fetch(`https://thg-seven.vercel.app/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => setProperty(data))
      .catch((err) => console.error(err));
  }, [id]); // ✅ dependency array

  console.log(property)

  return (
    <>
      <div className="container my-5">
        {/* ================= Patient Info ================= */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light fw-bold">Properties</div>

          <div className="card-body">

        
          
         
    
      </div>
      </div>
      </div>
    </>
  );
}

export default PropertyDetail;
