import "bootstrap/dist/css/bootstrap.min.css";

function Reports() {
  return (
    <>

    <div className="container py-5">

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-1">

            <div>
      <h2 className="fw-bold mb-0">Investment Reports</h2>
      <p className="text-muted mb-0 small">
        Quarterly performance breakdown
      </p>
    </div>

    <div style={{ maxWidth: "300px", width: "100%" }}>
      <input
        type="text"
        className="form-control rounded-pill"
        placeholder="🔍 Search investor or property..."
      />
    </div>
    </div>

     

    <div className="card shadow-lg border-0 rounded-4 p-4">

    {/* Investor / Property Info */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <div className="text-muted small">Investor</div>
        <div className="fw-semibold fs-5">Investor Name</div>
      </div>

      <div>
        <div className="text-muted small">Property</div>
        <div className="fw-semibold fs-5">Property Name</div>
      </div>
    </div>

    {/* Table */}
    <div className="table-responsive">
      <table className="table align-middle text-center mb-0 table-hover table-bordered">
        <thead className="table-light">
          <tr>
            <th></th>
            <th colspan="2">Q1</th>
            <th colspan="2">Q2</th>
            <th colspan="2">Q3</th>
            <th colspan="2">Q4</th>
          </tr>
          <tr>
            <th className="text-start">Year</th>
            <th>Expected</th>
            <th>Actual</th>
            <th>Expected</th>
            <th>Actual</th>
            <th>Expected</th>
            <th>Actual</th>
             <th>Expected</th>
            <th>Actual</th>
            
          </tr>
        </thead>
        <tbody className="table-group-divider">
          <tr>
            <th className="text-start fw-normal">2025</th>
            <td>$12,500</td>
            <td>$9,200</td>
            <td>$11,300</td>
            <td>$14,000</td>
            <td>$11,300</td>
            <td>$14,000</td>
            <td>$11,300</td>
            <td>$14,000</td>
          </tr>
          <tr>
            <th className="text-start fw-normal">2026</th>
            <td>$10,800</td>
            <td>$13,100</td>
            <td>$15,400</td>
            <td>$16,000</td>
            <td>$11,300</td>
            <td>$14,000</td>
            <td>$11,300</td>
            <td>$14,000</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</div>
      
    </>
  );
}

export default Reports;
