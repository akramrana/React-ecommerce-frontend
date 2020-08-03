import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import Loader from '../helpers/Loader'
import Web from '../config/Web'
import DB from '../helpers/DB';
import CartService from '../services/CartService';
import LoginService from '../services/LoginService';
import swal from 'sweetalert';
import { Button, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";

class Cart extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	cartCount:0,
	    	userData:{},
	    	cartItems:[],
	    	cartTotal:0,
	    	modalVisible:false,
	    	errors: {},
	    	email: '',
		    password: '',
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

		this.cartService.getCartItems().then((items) => {
		   this.setState({
		   	   cartItems:items,
		   })
		});

		this.cartService.getCartTotal().then((cartTotal) => {
			this.setState({
		   	   cartTotal:cartTotal,
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

	renderHrefUrl(id,name){
	 	name = name.replace(/\s+/g, '-').toLowerCase();
	 	var href = '/product/'+id+'/'+name;
	 	return href;
	 }

	 handleRemoveFromCart(pid,obj){
	 	this.cartService.removeProductFromCart(pid).then((response) => {

	 		this.showSuccessAlert("","Product removed from your cart!", "success");

			if(this.state.userData.id){
				this.cartService.getOrderId().then((orderId) => {
					var cartParams = {
						"user_id":this.state.userData.id,
						"products":pid,
						"order_id":orderId
					}
					this.deleteCart(cartParams);
			   });
	 		}
	 		else{

		 		this.cartService.getCartCount().then((count) => {
					this.setState({
				   	   cartCount:count,
				   })
				});

				this.cartService.getCartItems().then((items) => {
				   this.setState({
				   	   cartItems:items,
				   })
				});

				this.cartService.getCartTotal().then((cartTotal) => {
					this.setState({
				   	   cartTotal:cartTotal,
				   })
				});
	 		}
	 	});
	 }

	 showSuccessAlert(title,msg,icon){
		return swal({
          title:title,
          text: msg,
          icon: icon,
          timer: 2000,
          button: false
        })
	}

	handleQtyChange(pid,remain_qty, obj){
		//console.log(obj.target.value);
		//console.log(remain_qty);
		if(obj.target.value > remain_qty){
			this.showSuccessAlert("","Product out of stock", "error");
		}else{
			this.cartService.updateCartProductQty(pid,obj.target.value).then((response) => {
				
				this.cartService.getCartItems().then((items) => {
				   this.setState({
				   	   cartItems:items,
				   })

				   if(this.state.userData.id){
			    		var qtyArr = [];
			    		var productArr = [];
			    		items.forEach(function(item){
						  qtyArr.push(item.qty);
						  productArr.push(item.product_id);
						})

						this.cartService.getOrderId().then((orderId) => {
							var cartParams = {
								"user_id":this.state.userData.id,
								"products":productArr.join(),
								"quantity":qtyArr.join(),
								"order_id":orderId
							}
							this.updateCart(cartParams);
					   });
						
			    	}else{

					   this.cartService.getCartCount().then((count) => {
							this.setState({
						   	   cartCount:count,
						   })
					   });

					   this.cartService.getCartTotal().then((cartTotal) => {
							this.setState({
						   	   cartTotal:cartTotal,
						   })
						});
			    	}
				});

				
			});
		}
	}

	updateCart(cartParams){
		fetch(Web.BaseUrl+"api/v1/update-cart?lang=en&store=BD",{
		  	  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify(cartParams),
		}).then(res => res.json())
		      .then(
		        (result) => {
		        	let cartData = [];
		        	let cartItem = result.data.items;
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
		        	//console.log(cartData);
			        this.db.insert("settings",cartData,'cartData');
			        this.cartService.getCartCount().then((count) => {
						this.setState({
					   	   cartCount:count,
					   })
				   });

			        this.cartService.getCartTotal().then((cartTotal) => {
						this.setState({
					   	   cartTotal:cartTotal,
					   })
					});
		        	
		        },
		        (error) => {
		          this.setState({
		            isLoaded: true,
		            error
		          });
		        }
		)
	}

	deleteCart(cartParams){
		fetch(Web.BaseUrl+"api/v1/delete-from-cart?lang=en&store=BD",{
		  	  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify(cartParams),
		}).then(res => res.json())
		      .then(
		        (result) => {
		        	let cartData = [];
		        	let cartItem = result.data.items;
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
			        this.cartService.getCartCount().then((count) => {
						this.setState({
					   	   cartCount:count,
					   })
				   });
			        this.cartService.getCartTotal().then((cartTotal) => {
						this.setState({
					   	   cartTotal:cartTotal,
					   })
					});

					this.cartService.getCartItems().then((items) => {
					   this.setState({
					   	   cartItems:items,
					   })
					});
		        	
		        },
		        (error) => {
		          this.setState({
		            isLoaded: true,
		            error
		          });
		        }
		)
	}

	handleClose(){
    	this.setState({
			modalVisible:false
		})
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
		        		this.setState({
		        			success:result.message,
						    email: '',
						    password: '',
						    userData:result.data,
						    modalVisible:false
		        		})

		        		
		        		//let db = new DB();
		        		let userData = {
		        			id:this.state.userData.id,
		        			first_name:this.state.userData.first_name,
		        			last_name:this.state.userData.last_name,
		        			email:this.state.userData.email,
		        			image:this.state.userData.image,
		        			gender:this.state.userData.gender,
		        			dob:this.state.userData.dob,
		        			phone:this.state.userData.phone,
		        			create_date:this.state.userData.create_date,
		        		};
		        		this.db.insert("settings",userData,'userData');

		        		this.cartService.getCartItems().then((items) => {
					    	if(this.state.userData.id){
					    		var qtyArr = [];
					    		var productArr = [];
					    		items.forEach(function(item){
								  qtyArr.push(item.qty);
								  productArr.push(item.product_id);
								})
								var cartParams = {
									"user_id":this.state.userData.id,
									"products":productArr.join(),
									"quantity":qtyArr.join()
								}
								this.addToCart(cartParams);
					    	}else{

							   this.cartService.getCartCount().then((count) => {
									this.setState({
								   	   cartCount:count,
								   })
							   });
					    	}
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


	addToCart(cartParams){
		fetch(Web.BaseUrl+"api/v1/add-to-cart?lang=en&store=BD",{
		  	  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify(cartParams),
		}).then(res => res.json())
		      .then(
		        (result) => {
		        	let cartData = [];
		        	let cartItem = result.data.items;
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
			        this.db.insert("settings",result.data.id,'orderId');
			        
			        this.cartService.getCartCount().then((count) => {
						this.setState({
					   	   cartCount:count,
					   })
				    });

				    this.cartService.getCartItems().then((items) => {
					   this.setState({
					   	   cartItems:items,
					   })
					});

					this.cartService.getCartTotal().then((cartTotal) => {
						this.setState({
					   	   cartTotal:cartTotal,
					   })
					});
		        	
		        },
		        (error) => {
		          this.setState({
		            isLoaded: true,
		            error
		          });
		        }
		)
	}

	handleCheckout(e){
		e.preventDefault();
		if(this.state.userData && this.state.userData.id){
			//console.log(this.state.userData);
			this.props.history.push('/checkout');
		}
		else{
			this.setState({
				modalVisible:true 
			})
		}
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

	render(){
		let currency_code = "";
		return (
      	  <div>
	         {this.renderHeader()}
	         <div id="content" className="container">
	            <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
	              <div className="pb-5">
	              	<h1 className="display-4">Shopping Cart</h1>
	              </div>
	              <div className="row">
	                   <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
	                        {this.state.cartItems.map((value, index) => {
	                        	let subtotal = (value.qty*value.final_price).toFixed(3);
	                        	currency_code = value.currency_code;
		                   		return(
		                   			<div className="row  mb-3" key={index}>
			                   			<div className="col d-none d-sm-none d-sm-block product-image">
									     	<Link to={this.renderHrefUrl(value.product_id,value.name)}>
								        		<img src={value.image} alt={value.name}/>
								        	</Link>
									    </div>
									    <div className="col">
									      <Link to={this.renderHrefUrl(value.product_id,value.name)}>
										      <b>{value.name}</b>
										      <p>{value.short_description}</p>
										      <p><b>SKU: </b>{value.sku}</p>
									      </Link>
									    </div>
									    <div className="col d-none d-sm-none d-sm-block">
									      <b>{value.currency_code}</b> {value.final_price}
									    </div>
									    <div className="col">
									      <b>Quantity</b> 
									      <div>
										      <input min="1" onChange={this.handleQtyChange.bind(this, value.product_id, value.remaining_quantity)}  className="form-control" type="number" name="qty" value={value.qty} />
									      </div>
									    </div>
									    <div className="col">
									    	<b>{value.currency_code} </b>{subtotal}
									    </div>
									    <div className="col text-right">
									      <a onClick={this.handleRemoveFromCart.bind(this,value.product_id)} href="#" className="btn btn-xs btn-light"><FontAwesomeIcon icon={faTrashAlt} /></a>
									    </div>
			                   		</div>
		                   		)
	                   		})}
	                   </div>
	               </div>
	               <div></div>
					{(() => {
						if(this.state.cartTotal > 0){
							return(
				               <div>
					               <div className="row">
										<div className="col-md-4 offset-md-8 text-left">
										    <h5> Cart Total  </h5>
									    </div>
									</div>
									<div className="row">
									    <div className="col-md-4 offset-md-8 text-left">
									    	Total <span className="float-right"><b>{currency_code} </b> {this.state.cartTotal}</span>
									    </div>
									</div>
									<div className="row">
										<div className="col-md-4 offset-md-8 text-right">
										    <a onClick={e => this.handleCheckout(e)} href="#" className="btn btn-info">Checkout</a> 
									    </div>
									</div>
								</div>
							)
						}else{
								return(
									<div className="row">
										<div className="col-md-12 ">
										    <p> Your shoping cart is empty!  </p>
									    </div>
									</div>
								)
							}
					})()}
	            </div>
	          </div>
	          <Footer />
	          <Modal size="lg" show={this.state.modalVisible} onHide={this.handleClose.bind(this)}>
		        <Modal.Header closeButton>
		          <Modal.Title>Login</Modal.Title>
		        </Modal.Header>
		        <Modal.Body>
		        	<div className="text-center">
		              <div className="text-success">{this.state.success}</div>
		            </div>
		            <form action="#" className="offset-xl-3 offset-lg-3 offset-md-3 offset-sm-0">
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
						<input className="btn btn-info mb-3" type="submit" onClick={e => this.handleFormSubmit(e)} value="Submit" />
						<span className="ml-3">
							<a href="/forgot-password">Forgot Password ?</a>
						</span>
		            </form>
		        </Modal.Body>
		      </Modal>
          </div>
        )
	}

}
export default Cart;