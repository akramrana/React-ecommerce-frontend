import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import { Redirect } from 'react-router-dom'
import Loader from '../helpers/Loader'
import Web from '../config/Web'
import DB from '../helpers/DB';
import CartService from '../services/CartService';
import LoginService from '../services/LoginService';

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
		    email: '',
		    password: '',
  			error: '',
  			success:'',
  			errors: {},
  			userData:{},
  			toHome:false,
  			userData:{},
  			cartCount:0
		}
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

        if(!this.state.password){
           formIsValid = false;
           errors["password"] = "Password cannot be blank";
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
		    password: this.state.password,
		  }
		  fetch(Web.BaseUrl+"api/v1/login",{
		  	  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify(formData),
		  }).then(res => res.json())
		      .then(
		        (result) => {
		        	loader.hide();
		        	let serverErrors = {};
		        	if(result.status==404){
		        		serverErrors["email"] = result.message;
		        		this.setState({
		        			errors:serverErrors
		        		});
		        	}
		        	if(result.status==201){
		        		serverErrors["password"] = result.message;
		        		this.setState({
		        			errors:serverErrors
		        		});
		        	}
		        	if(result.status==200){
		        		let userData = {
		        			id:result.data.id,
		        			first_name:result.data.first_name,
		        			last_name:result.data.last_name,
		        			gender:result.data.gender,
		        			dob:result.data.dob,
		        			phone:result.data.phone,
		        			email:result.data.email,
		        			image:result.data.image,
		        			create_date:result.data.create_date
		        		};

		        		try{
		        			this.db.insert("settings",userData,'userData');
			        	}catch(err){
			        		console.log(err)
			        	}

			        	this.cartService.getCartItems().then((items) => {
					    	var qtyArr = [];
				    		var productArr = [];
				    		items.forEach(function(item){
							  qtyArr.push(item.qty);
							  productArr.push(item.product_id);
							})
							var cartParams = {
								"user_id":result.data.id,
								"products":productArr.join(),
								"quantity":qtyArr.join()
							}
							if(qtyArr && qtyArr.length){
								fetch(Web.BaseUrl+"api/v1/add-to-cart?lang=en&store=BD",{
								  	  method: 'POST',
									  headers: { 'Content-Type': 'application/json' },
									  body: JSON.stringify(cartParams),
								}).then(res => res.json())
								      .then(
								        (result_cart) => {
								        	let cartData = [];
								        	let cartItem = result_cart.data.items;
							        		cartItem.forEach(function(cartItem){
								        		let item = {
										    		product_id:cartItem.parent_id,
										    		qty:cartItem.quantity,
										    		image:cartItem.image,
										    		sku:cartItem.SKU,
										    		name:cartItem.name,
										    		short_description:cartItem.short_description,
										    		final_price:cartItem.final_price,
										    		currency_code:cartItem.currency_code,
										    		remaining_quantity:cartItem.remaining_quantity
										       }
										       cartData.push(item);
								        	})
									        this.db.insert("settings",cartData,'cartData');
									        this.db.insert("settings",result_cart.data.id,'orderId');
									        this.cartService.getCartCount().then((count) => {
												this.setState({
											   	   cartCount:count,
											   	   success:result_cart.message,
												   email: '',
												   password: '',
												   userData:userData,
												   toHome:true
											   })

											   this.props.history.push("/");
										   });
								        },
								        (error) => {
								          console.log(error)
								        }
								)
							}else{
								fetch(Web.BaseUrl+"api/v1/cart-items?lang=en&user_id="+result.data.id+"&store=BD")
							      .then(res => res.json())
							      .then(
							        (result_cart) => {
							          //console.log(result);
							            let cartData = [];
							        	let cartItem = result_cart.data.items;
						        		cartItem.forEach(function(cartItem){
							        		let item = {
									    		product_id:cartItem.parent_id,
									    		qty:cartItem.quantity,
									    		image:cartItem.image,
									    		sku:cartItem.SKU,
									    		name:cartItem.name,
									    		short_description:cartItem.short_description,
									    		final_price:cartItem.final_price,
									    		currency_code:cartItem.currency_code,
									    		remaining_quantity:cartItem.remaining_quantity
									       }
									       cartData.push(item);
							        	})
								        this.db.insert("settings",cartData,'cartData');
								        this.db.insert("settings",result_cart.data.id,'orderId');
								        this.cartService.getCartCount().then((count) => {
											this.setState({
										   	   cartCount:count,
										   	   success:result_cart.message,
											   email: '',
											   password: '',
											   userData:userData,
											   toHome:true
										   })

										   this.props.history.push("/");
									   });
										
							        },
							        (error) => {
							          console.log(error)
							        }
							    )
							}
							//
							
					   });
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

	render(){

	   if(this.state.userData && this.state.userData.id){
			return (
				<Redirect to='/'/>
			)
	   }else{
	   		return (
				<div>
					<div>
			         <Header userinfo = {this.state.userData} cartCount={this.state.cartCount}/>
			         <div id="content" className="container">
				         	<div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
				              <h1 className="display-4">Login</h1>
				              <div className="text-success">{this.state.success}</div>
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
									<div className="row form-group">
										<div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12">
											  <input className="form-control" type="password" id="password" name="password" placeholder="Password"
											    value={this.state.password}
											    onChange={e => this.setState({ password: e.target.value })}
											  />
											  <div className="text-danger">{this.state.errors.password}</div>
										  </div>
									</div>
								</div>
								<input className="btn btn-info mb-3" type="submit" onClick={e => this.handleFormSubmit(e)} value="Submit" />
								<span className="ml-3">
									<a href="/forgot-password">Forgot Password ?</a>
								</span>
				            </form>
			         </div>
			         <Footer />
		           </div>
	           </div>
	        )
	   }
    }
}
export default Login;