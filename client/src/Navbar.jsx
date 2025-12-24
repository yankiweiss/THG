import "bootstrap/dist/css/bootstrap.min.css";

function Navbar({addDealVisibility, addPropertyVisibility}) {


  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid d-flex justify-content-center gap-4">

          <li class="nav-item">
            <button type="button" class="btn btn-light btn-outline-secondary" onClick={() => addPropertyVisibility()}>
              Properties
            </button>
          </li>

           <li class="nav-item">
            <button type="button" class="btn btn-light btn-outline-secondary" onClick={() => addDealVisibility()}>
              Add Deal:
            </button>
          </li>
        </div>
      </nav>
    </>
  );
}

export default Navbar;