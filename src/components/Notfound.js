import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import DB from '../helpers/DB';
import CartService from '../services/CartService';
import LoginService from '../services/LoginService';

class Notfound extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	cartCount:0,
	    	userData:{},
	    };
	    this.db = new DB();
	    this.cartService = new CartService(this.db); 
	    this.loginService = new LoginService(this.db);
	}

	componentDidMount() {

		this.loginService.getUserData().then((userinfo) => {
			this.setState({
		   	   userData:userinfo,
		   })
		})

		this.cartService.getCartCount().then((count) => {
			this.setState({
		   	   cartCount:count,
		   })
		});
	}

	renderHeader(){
		if(this.state.userData && this.state.userData.id){
			return (
				<Header userinfo = {this.state.userData} cartCount={this.state.cartCount}/>
			)
		}else{
			return (
				<Header userinfo = {this.state.userData} cartCount={this.state.cartCount}/>
			)
		}
	}

	render(){
		return (
      	  <div>
	         {this.renderHeader()}
	         <div id="content">
	            <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
	              <h1 className="display-4">404 Not Found</h1>
	              <p className="lead">
	              	Page not found
	              </p>
	            </div>
	          </div>
	          <Footer />;
          </div>
        )
	}
}

export default Notfound;