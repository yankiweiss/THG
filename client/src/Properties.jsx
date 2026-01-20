import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



function Properties() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  const goToPropertyDetail = (id) => {
    navigate(`/property/${id}`)
  }

  

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
      <div className="col-md-2 mx-auto mt-3">
        <input
          className="form-control shadow-sm"
          placeholder="🔍 Search Property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="container my-5">
        {/* ================= Patient Info ================= */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light fw-bold">Properties</div>

          <div className="card-body">
            { searchData.length > 0 ? ( [...searchData].map((row) => (
                <div
                  className="border rounded-4 d-flex align-items-center justify-content-around text-muted mb-3" key={row.id}
                  style={{ minHeight: "200px" }}
                 
                >
                    
                  <img
                  className="img-thumbnail"
                    style={{
                      width: "100px",
                      height: "150px",
                      backgroundColor: "rgba(223, 223, 223, 1)",
                      borderRadius: "8px",
                    }}
                  >
                   
                  </img>
                  

                  <h3>{row.property_name}</h3>

                  <button
                    type="button"
                    className="button btn btn-secondary"
                    onClick={() => goToPropertyDetail(row.id)}
                  >
                    View
                  </button>
                </div>
              ))) : (
                <p style={{textAlign: 'center'}}>No matching data</p>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Properties;
