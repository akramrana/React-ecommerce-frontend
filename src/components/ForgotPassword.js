import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import Loader from '../helpers/Loader'
import Web from '../config/Web'
import DB from '../helpers/DB';
import LoginService from '../services/LoginService';
import swal from 'sweetalert';
import CartService from '../services/CartService';

class ForgotPassword extends Component{

	_isMounted = false;

	constructor(props) {
	    super(props);
	    this.state = {
	    	userData:{},
	    	email:"",
	    	errors: {},
	    	cartCount:0
	    }
	    this.db = new DB();
	    this.loginService = new LoginService(this.db);
	    this.cartService = new CartService(this.db); 
	}

	componentDidMount() {
		this._isMounted = true;

		this.loginService.getUserData().then((userinfo) => {
			if (this._isMounted) {
				this.setState({
			   	   userData:userinfo,
			    })
			    if(Object.keys(userinfo).length!=0){
						this.props.history.push('/');
				}
			
			}
			
		})

		this.cartService.getCartCount().then((count) => {
			this.setState({
		   	   cartCount:count,
		   })
		});
	}

	showSuccessAlert(title,msg, icon){
		return swal({
          title:title,
          text: msg,
          icon: icon,
          timer: 2000,
          button: false
        })
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handleValidation(){
		let errors = {};
        let formIsValid = true;
        if(!this.state.email){
           formIsValid = false;
           errors["email"] = "E-mail cannot be blank";
        }

        if(this.state.email != ""){
           if(!this.state.email.match(/^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/)){
              formIsValid = false;
              errors["email"] = "Email is not a valid email address.";
           }        
        }

        this.setState({errors: errors});
       	return formIsValid;
    }

	handleFormSubmit( event ) {
	  event.preventDefault();
	  if(this.handleValidation()){
	  	let loader = new Loader();
		loader.show();
	  	let formData = {
		    email: this.state.email,
		  }
		  fetch(Web.BaseUrl+"api/v1/forgot-password",{
		  	  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify(formData),
		  }).then(res => res.json())
		      .then(
		        (result) => {
		        	loader.hide();
		        	if(result.status==200){
		        		this.showSuccessAlert("",result.message,"success");
		        		this.setState({email: ""});
		        	}else{
		        		this.showSuccessAlert("",result.message,"error");
		        	}
		        },
		        // Note: it's important to handle errors here
		        // instead of a catch() block so that we don't swallow
		        // exceptions from actual bugs in components.
		        (error) => {
		          this.setState({
		            isLoaded: true,
		            error
		          });
		          loader.hide();
		        }
		    )
	  }
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
				<div id="content" className="container">
		            <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto">
		              <div className="pb-5">
		              	<h1 className="display-4 text-center">Forgot Password</h1>
		              </div>
		              <form action="#" className="offset-xl-3 offset-lg-3 offset-md-3 offset-sm-0">
		            	<div>
			            	<div className="row form-group">
								  <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12">
									  <input className="form-control" type="email" id="email" name="email" placeholder="E-mail"
									    value={this.state.email}
									    onChange={e => this.setState({ email: e.target.value })}
									  />
									  <div className="text-danger">{this.state.errors.email}</div>
								  </div>
							</div>
						</div>
						<div className="text-left">
							<input className="btn btn-info mb-3" type="submit" onClick={e => this.handleFormSubmit(e)} value="Submit" />
						</div>
		             </form>
		            </div>
		        </div>
				<Footer />
			</div>
		)
	}

}
export default ForgotPassword;