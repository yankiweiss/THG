function Properties() {
  return (
    <>
      <div className="container my-5">
        {/* ================= Patient Info ================= */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light fw-bold">Properties</div>

          <div className="card-body">
            <div
              className="border rounded-3 d-flex align-items-center justify-content-center text-muted m-2"
              style={{ minHeight: "200px" }}
            >
              <div style={{width: '100px', height: '150px'}}>Image coming soon</div>

              <h3>Property Name</h3>

              <button type="button" className="button btn btn-secondary ">
                View
              </button>
            </div>

             <div
              className="border rounded-3 d-flex align-items-center justify-content-center text-muted m-2"
              style={{ minHeight: "200px" }}
            >
              <div style={{width: '100px', height: '150px'}}>Image coming soon</div>

              <h3>Property Name</h3>

              <button type="button" className="button btn btn-secondary ">
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Properties;
