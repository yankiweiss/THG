import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 


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


          <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle border rounded p-2" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Add Deal
          </a>
          {/* Sponsor => when having the property and having invest together */}
          {/* Limited Partner => when investing in someones else property */}
          {/* Sponsor / GP=> when investing in someone else and having under him investors */}
          <ul class="dropdown-menu">
            <li onClick={() => addDealVisibility()}><a class="dropdown-item" href="#">Sponsor </a></li>
            <li><a class="dropdown-item" href="#">Limited Partner</a></li>
            <li><hr class="dropdown-divider"/></li>
            <li><a class="dropdown-item" href="#">Sponsor / GP</a></li>
          </ul>
        </li>
        </div>
      </nav>
    </>
  );
}

export default Navbar;