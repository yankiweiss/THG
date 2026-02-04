import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



function Properties() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  const goToPropertyDetail = (id) => {
    navigate(`/property/${id}`)
  }

 const deleteProperty = async (propertyId) => {
  if (!propertyId) return;

  // Optional: Ask user for confirmation
  const confirmed = window.confirm(
    "Are you sure you want to delete this property? This cannot be undone."
  );
  if (!confirmed) return;

  try {
    const res = await fetch(`https://thg-seven.vercel.app/api/properties/${propertyId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(`Failed to delete: ${data.error || 'Unknown error'}`);
      return;
    }

    alert("Property deleted successfully!");
    // Optional: refresh the list or redirect
    window.location.reload(); // simple way to refresh
  } catch (err) {
    console.error(err);
    alert("Error deleting property");
  }
};

  

  useEffect(() => {
    fetch("https://thg-seven.vercel.app/api/properties")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const searchData = data.filter((row) =>
    row.property_name?.toLowerCase().includes(search.toLocaleLowerCase())
  );

  return (
    <>
      <div className="container mt-4 mb-3">
  <div className="row justify-content-center">
    <div className="col-md-4">
      <input
        className="form-control form-control-lg shadow-sm"
        placeholder="🔍 Search properties..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>
</div>
      <div className="container">
  <div className="row g-4">
    {searchData.length > 0 ? (
  searchData.map((row) => (
    <div
      key={row.id}
      className="border rounded-4 d-flex align-items-center justify-content-around text-muted  shadow-sm property-card"
      style={{
        minHeight: "200px",
        padding: "1rem",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onClick={() => goToPropertyDetail(row.id)}
    >
      {/* Image placeholder */}
      <div className="text-center">
        <img src={row.secure_url} style={{width: '300px'}} className="rounded"></img>
        </div>

      {/* Property Name */}
      <h3 className="mx-3">{row.property_name}</h3>

      {/* View Button */}
      <div className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={(e) => {
          e.stopPropagation(); // prevent parent click
          goToPropertyDetail(row.id);
        }}
      >
        View
      </button>
       <button
        type="button"
        className="btn btn-outline-danger"
        onClick={(e) => {
          e.stopPropagation(); // prevent parent click
         deleteProperty(row.id)
        }}
      >
        Delete
      </button>
      </div>
    </div>
  ))
) : (
  <p style={{ textAlign: "center", marginTop: "2rem", color: "#6c757d" }}>
    No matching data
  </p>
)}
  </div>
</div>
    </>
  );
}

export default Properties;
