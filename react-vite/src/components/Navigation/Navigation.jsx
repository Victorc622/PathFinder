import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import "./Navigation.css";

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  const handleLogout = async () => {
    await dispatch(thunkLogout());
    navigate("/");
  };

  return (
    <nav className="navigation-container">
      <div className="nav-left">
        <NavLink to="/" className="nav-logo">
          Pathfinder
        </NavLink>
      </div>

      <ul className="nav-links">
  {sessionUser && (
    <>
      <li>
        <NavLink
          to="/trips"
          className={({ isActive }) => (isActive ? "active-link" : "nav-link")}
        >
          My Trips
        </NavLink>
      </li>
    </>
  )}
</ul>

      <div className="nav-right">
        {sessionUser ? (
          <button className="nav-button" onClick={handleLogout}>
            Log Out
          </button>
        ) : (
          <>
            <button
              className="nav-button"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
            <button
              className="nav-button signup-button"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation;