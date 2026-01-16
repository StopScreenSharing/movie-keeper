import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";


function NavBar() {
    const { user, setUser } = useContext(UserContext);
    const history = useHistory();

    function handleLogout() {
        fetch("/logout", { method:"DELETE" }).then(() => {
            setUser(null);
            history.push("/login")
        });
    }

     return (
    <nav className="nav-bar">
      <NavLink exact to="/" className="nav-link">
        Home
      </NavLink>

      <NavLink to="/genrespage" className="nav-link">
        Genres
      </NavLink>

      <NavLink to="/moviespage" className="nav-link">
        Movies
      </NavLink>

      {!user ? (
        <>
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>

          <NavLink to="/signup" className="nav-link">
            Sign Up
          </NavLink>
        </>
      ) : (
        <>
        <button onClick={handleLogout} className="nav-link">
            Logout
          </button>
          <br/>
          
        
        </>
      )}
    </nav>
  );
}

export default NavBar;