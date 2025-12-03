import { NavLink } from 'react-router-dom';
import "./Navbar.css";

export default function Navbar() {
    return(
        <nav className='navbar'>
            <div className='navbar-container'>
                <NavLink to="/" className="nav-item"> Pokemons </NavLink>
                <NavLink to="/movie" className="nav-item"> Movie </NavLink>
                <NavLink to="/money" className="nav-item"> Crypto </NavLink>
                <NavLink to="/weather" className="nav-item"> Weather </NavLink>
            </div>
        </nav>
    );
}