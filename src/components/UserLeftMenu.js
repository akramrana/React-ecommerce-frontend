import React, { Component } from 'react';
import {Link} from "react-router-dom";

class UserLeftMenu extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12 text-left">
		              	  		<nav className="navbar bg-light">
								  <ul className="navbar-nav">
								    <li className="nav-item">
								      <Link className="nav-link" to="/myaccount">MY ORDERS</Link>
								    </li>
								    <li className="nav-item">
								      <Link className="nav-link" to="/wishlist">MY WISHLIST</Link>
								    </li>
								    <li className="nav-item">
								      <Link className="nav-link" to="/addresses">ADDRESSES</Link>
								    </li>
								    <li className="nav-item">
								      <Link className="nav-link" to="/profile">PROFILE</Link>
								    </li>
								    <li className="nav-item">
								      <Link className="nav-link" to="/change-password">CHANGE PASSWORD</Link>
								    </li>
								  </ul>
								</nav>
		              	  </div>
        )
    }
}
export default UserLeftMenu;