import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Properties() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const goToPropertyDetail = (id) => {
    navigate(`/property/${id}`);
  };

  const deleteProperty = async (propertyId) => {
    if (!propertyId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this property? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `https://thg-seven.vercel.app/api/properties/${propertyId}`,
        {
          method: "DELETE",
        }
      );
      const result = await res.json();

      if (!res.ok) {
        alert(`Failed to delete: ${result.error || "Unknown error"}`);
        return;
      }

      // Remove deleted property from state for smoother UX
      setData((prev) => prev.filter((p) => p.id !== propertyId));
      alert("Property deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting property");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://thg-seven.vercel.app/api/properties");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const searchData = data.filter((row) =>
    row.property_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container my-4">
      {/* Search Bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <input
            className="form-control form-control-lg shadow-sm"
            placeholder="🔍 Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <p className="text-center text-muted">Loading properties...</p>
      ) : searchData.length > 0 ? (
        <div className="row g-4">
          {searchData.map((row) => (
            <div key={row.id} className="col-md-6 col-lg-4">
              <div
                className="card shadow-sm property-card h-100"
                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                onClick={() => goToPropertyDetail(row.id)}
              >
                {/* Property Image */}
                <img
                  src={row.secure_url}
                  alt={row.property_name}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: "180px" }}
                />

                <div className="card-body d-flex flex-column">
                  {/* Property Name */}
                  <h5 className="card-title">{row.property_name}</h5>

                  {/* Details row */}
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPropertyDetail(row.id);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProperty(row.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted mt-5">No matching properties found.</p>
      )}
    </div>
  );
}

export default Properties;