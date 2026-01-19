function Properties () {


    return (
        <>
        
          <div className="container my-5">
      {/* ================= Patient Info ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light fw-bold">Property Information:</div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
                
                <label className="form-label">Property Name</label>
              <input
                className="form-control"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Purchase Price</label>
              <input
                className="form-control"
              
              />
            </div>
          </div>
          </div>
          </div>
          

           <div className="card shadow-sm mb-4">
        <div className="card-header bg-light fw-bold">Investor Information:</div>
    

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
                
                <label className="form-label">Investor Name</label>
              <input
                className="form-control"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Amount Invested</label>
              <input
                className="form-control"
              
              />
            </div>

              <div className="col-md-3">
              <label className="form-label">Preferred Return:</label>
              <input
                className="form-control"
              
              />
            </div>
          </div>
          </div>
          </div>
          </div>

        </>
    )
}

export default Properties