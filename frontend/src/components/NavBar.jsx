import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "../css/Navbar.css";

function NavBar() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/"); // Redirect to login
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/home">StreamLog</Link>
      </div>
      <div className="navbar-links">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
        <button className="nav-link" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
