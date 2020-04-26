import React from 'react';

class Footer extends React.Component {
	render(){
		return(
			<div className="container">
			  <footer className="pt-4 my-md-5 pt-md-5 border-top">
			    <div className="row">
			      
			      <div className="col-6 col-md">
			        <h5>Help</h5>
			        <ul className="list-unstyled text-small">
			          <li><a className="text-muted" href="/page/1/about-us">About us</a></li>
			          <li><a className="text-muted" href="/page/2/terms-and-condition">Terms and conditions</a></li>
			          <li><a className="text-muted" href="/page/4/return-policy">Return Policy & Procedures</a></li>
			          <li><a className="text-muted" href="/page/5/privacy">Privacy Policy</a></li>
			          <li><a className="text-muted" href="/page/6/shipping-info">Shipping Information</a></li>
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