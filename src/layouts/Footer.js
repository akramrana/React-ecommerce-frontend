import React from 'react';
import {Link} from "react-router-dom";

class Footer extends React.Component {
	render(){
		return(
			<div className="container">
			  <footer className="pt-4 my-md-5 pt-md-5 border-top">
			    <div className="row">
			      
			      <div className="col-6 col-md">
			        <h5>Help</h5>
			        <ul className="list-unstyled text-small">
			          <li><Link className="text-muted" to="/page/1/about-us">About us</Link></li>
			          <li><Link className="text-muted" to="/page/2/terms-and-condition">Terms and conditions</Link></li>
			          <li><Link className="text-muted" to="/page/4/return-policy">Return Policy & Procedures</Link></li>
			          <li><Link className="text-muted" to="/page/5/privacy">Privacy Policy</Link></li>
			          <li><Link className="text-muted" to="/page/6/shipping-info">Shipping Information</Link></li>
			        </ul>
			      </div>
			    </div>
			    <div className="row">
			      <div className="col-12 col-md">
			        <small className="d-block mb-3 text-muted">&copy; 2017-2019</small>
			      </div>
			    </div>
			  </footer>

			  <div id="preloader" className="global-loader">
		            <div className="main-content">
		                <div className="loading">
		                    <img src="/images/loading-bars.svg" alt="loading"/>
		                </div>
		            </div>
			  </div>
			</div>
		)
	}
}

export default Footer;