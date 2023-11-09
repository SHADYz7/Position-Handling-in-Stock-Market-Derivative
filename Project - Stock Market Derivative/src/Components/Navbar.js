import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Navbar = (props) => {
    let location = useLocation();
    const navigate = useNavigate();

    const HandleLogout = ()=>{
        localStorage.removeItem('token');
        navigate('/login');
        props.showAlert("Loggedout Successfully", "success")
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-0">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">ProductX</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        
                        {/* <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/create" ? "active" : ""}`} to="/create">Place Order</Link>
                        </li> */}
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/view" ? "active" : ""}`} to="/view">Strategy</Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/Contact" ? "active" : ""}`} to="/Contact">Contact</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/Orders" ? "active" : ""}`} to="/Orders">Orders</Link>
                        </li>

                    </ul>

                    {!localStorage.getItem('token') ?
                        <form className="d-flex">
                            <Link className="btn btn-primary mx-1 btn-sm" to="/login" role="button">Login</Link>
                            <Link className="btn btn-primary mx-1 btn-sm" to="/signup" role="button">Signup</Link>
                        </form> :<input type='button' className="btn btn-primary btn-sm" value="Logout" onClick={HandleLogout}/>
                    }
                    
                    
                    
                </div>
            </div>
        </nav>
    )
}


export default Navbar
