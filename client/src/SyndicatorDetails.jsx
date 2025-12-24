import "bootstrap/dist/css/bootstrap.min.css";

function SyndicatorDetails({ index, data, onChange }) {
  return (
    <>
      <div className="row g-3 mt-2 justify-content-center">
        <div className="col-md-3">
          <label className="form-label">Investor Name:</label>
          <input
            className="form-control"
            value={data.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Amount Invested:</label>
          <input
            className="form-control"
            value={data.amount}
            onChange={(e) => onChange(index, "amount", e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Preferred Return:</label>
          <input
            className="form-control"
            value={data.percent}
            onChange={(e) => onChange(index, "percent", e.target.value)}
          />
        </div>
      </div>
    </>
  );
}

export default SyndicatorDetails;