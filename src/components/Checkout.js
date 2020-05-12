import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import Loader from '../helpers/Loader'
import Web from '../config/Web'
import DB from '../helpers/DB';
import CartService from '../services/CartService';
import LoginService from '../services/LoginService';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom'
import { Button, Modal } from 'react-bootstrap';

class Checkout extends Component {

	_isMounted = false;

	constructor(props) {
	    super(props);
	    this.state = {
	    	cartCount:0,
	    	userData:{},
	    	cartItems:[],
	    	cartTotal:0,
	    	isLoaded:false,
	    	shippingAddrss:{},
	    	modalVisible:false,
	    	errors:{},
	    	first_name:"",
    		last_name:"",
    		country_id:"",
    		state_id:"",
    		area_id:"",
    		block_id:"",
    		street:"",
    		addressline_1:"",
    		mobile_number:"",
    		countries:[],
    		states:[],
    		areas:[],
    		blocks:[],
    		modal_title:"",
    		scenerio:"",
  			modalOtherAddressVisible:false,
  			allAddress:[],
  			shipping_cost:0,
  			cod_cost:0,
  			vat_charge:0,
  			paymentTypes:[],
  			pay_method:"C",
  			baseCurrencyName:"",
  			promo_code:"",
  			order_total:0,
  			discount_price:0,
	    };
	    this.db = new DB();
	    this.cartService = new CartService(this.db); 
	    this.loginService = new LoginService(this.db);
	}

	componentDidMount() {

		this._isMounted = true;

		this.loginService.getUserData().then((userinfo) => {
			if (this._isMounted) {
				this.setState({
			   	   userData:userinfo,
			    })

			    if(Object.keys(userinfo).length===0){
						this.props.history.push('/');
				}

				if(userinfo.id){
					//this.getUserDefaultAddress(userinfo.id)
				}
			}
			
		})

		this.cartService.getCartCount().then((count) => {
			if (this._isMounted) {
				this.setState({
			   	   cartCount:count,
			   })

			   if(count < 1){
			   	  this.props.history.push('/');
			   }
			}
		});

		/*this.cartService.getCartItems().then((items) => {
			if (this._isMounted) {
				this.setState({
			   	   cartItems:items,
			   })
			}
		});

		this.cartService.getCartTotal().then((cartTotal) => {
			if (this._isMounted) {
				this.setState({
			   	   cartTotal:cartTotal,
			   })
			}
		});*/

		this.cartService.getOrderId().then((orderId) => {
			let loader = new Loader();
			loader.show();
			var checkItemStockParams = {
				"user_id":this.state.userData.id,
				"order_id":orderId
			}
			fetch(Web.BaseUrl+"api/v1/check-item-stock?lang=en&store=BD",{
			  	  method: 'POST',
				  headers: { 'Content-Type': 'application/json' },
				  body: JSON.stringify(checkItemStockParams),
			}).then(res => res.json())
			      .then(
			        (result) => {
			        	//console.log(result);
			        	loader.hide();
			        	let sp = result.data.default_address?result.data.default_address.shipping_cost:0;
				        if(sp==undefined){
				        	sp = 0;
				        }
				        let shipping_price = parseFloat(sp).toFixed(3);
				        //
				        let cod = result.data.default_address?result.data.default_address.cod_cost:0;
				        if(cod==undefined){
				        	cod = 0;
				        }
				        let cod_cost = parseFloat(cod).toFixed(3);

			        	this.setState({
					   	    paymentTypes:result.data.payment_types?result.data.payment_types:[],
					   	    cartItems:result.data.cart.items?result.data.cart.items:[],
					   	    shippingAddrss:result.data.default_address?result.data.default_address:{},
				            countries:result.data.country_list?result.data.country_list:[],
				            first_name:result.data.default_address?result.data.default_address.first_name:"",
				            last_name:result.data.default_address?result.data.default_address.last_name:"",
				            country_id:result.data.default_address?result.data.default_address.country_id:"",
				            state_id:result.data.default_address?result.data.default_address.governorate_id:"",
				            area_id:result.data.default_address?result.data.default_address.area_id:"",
				            block_id:result.data.default_address?result.data.default_address.block_id:"",
				            street:result.data.default_address?result.data.default_address.street:"",
				            mobile_number:result.data.default_address?result.data.default_address.mobile_number:"",
				            addressline_1:result.data.default_address?result.data.default_address.addressline_1:"",
				            //states:result.data.states?result.data.states:[],
				            //areas:result.data.areas?result.data.areas:[],
				            //blocks:result.data.blocks?result.data.blocks:[],
				            shipping_cost:shipping_price,
				            cod_cost:cod_cost,
				            vat_charge:result.data.default_address?result.data.default_address.val:0,
				            cartTotal:result.data.sub_total?result.data.sub_total:0,
				            order_total:result.data.sub_total?result.data.total:0,
				            discount_price:result.data.discount_price?result.data.discount_price:0,
				            baseCurrencyName:result.data.baseCurrencyName?result.data.baseCurrencyName:"",
					   })
			        },
			        (error) => {
			        	loader.hide();
			            console.log(error);
			        }
			)
	   });
	}

	getUserDefaultAddress(id,address_id=""){
		let loader = new Loader();
		loader.show();

		fetch(Web.BaseUrl+"api/v1/user-default-address?user_id="+id+"&address_id="+address_id)
	      .then(res => res.json())
	      .then(
	        (result) => {
	          loader.hide();
	          let sp = result.data.default_address?result.data.default_address.shipping_cost:0;
	          let shipping_price = parseFloat(sp).toFixed(3);
	          //
	          let cod = result.data.default_address?result.data.default_address.cod_cost:0;
	          let cod_cost = parseFloat(cod).toFixed(3);

	          this.setState({
	            isLoaded: true,
	            shippingAddrss:result.data.default_address?result.data.default_address:{},
	            countries:result.data.country_list?result.data.country_list:[],
	            first_name:result.data.default_address?result.data.default_address.first_name:"",
	            last_name:result.data.default_address?result.data.default_address.last_name:"",
	            country_id:result.data.default_address?result.data.default_address.country_id:"",
	            state_id:result.data.default_address?result.data.default_address.governorate_id:"",
	            area_id:result.data.default_address?result.data.default_address.area_id:"",
	            block_id:result.data.default_address?result.data.default_address.block_id:"",
	            street:result.data.default_address?result.data.default_address.street:"",
	            mobile_number:result.data.default_address?result.data.default_address.mobile_number:"",
	            addressline_1:result.data.default_address?result.data.default_address.addressline_1:"",
	            states:result.data.states?result.data.states:[],
	            areas:result.data.areas?result.data.areas:[],
	            blocks:result.data.blocks?result.data.blocks:[],
	            shipping_cost:shipping_price,
	            cod_cost:cod_cost,
	            vat_charge:result.data.default_address?result.data.default_address.val:0
	          });
	        },
	        (error) => {
	          this.setState({
	            isLoaded: true,
	            error
	          });

	          loader.hide();
	        }
	    )
	}

	componentWillUnmount() {
	    this._isMounted = false;
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

	handleClose(){
    	this.setState({
			modalVisible:false
		})
    }



    handleOtherAddressClose(){
    	this.setState({
			modalOtherAddressVisible:false
		})
    }

	 handleEditAddress(e){
	 	e.preventDefault();
	 	if(this.state.shippingAddrss.address_id){
		 	this.getUserDefaultAddress(this.state.userData.id,this.state.shippingAddrss.address_id);
		 	this.setState({
				modalVisible:true,
				modal_title:"Edit Shipping Address",
				scenerio:"EDIT",
			})
	 	}
	 }

	 handleCountryChange(i,e){
	 	let country_id = e.target.value;
	 	//console.log(country_id);
	 	let loader = new Loader();
		loader.show();
		//
		fetch(Web.BaseUrl+"api/v1/state?country_id="+country_id)
	      .then(res => res.json())
	      .then(
	        (result) => {
	          loader.hide();	
	          this.setState({
	            isLoaded: true,
	            states:result.data?result.data:[],
	            country_id:country_id,
	          });
	        },
	        (error) => {
	          this.setState({
	            isLoaded: true,
	            error
	          });

	          loader.hide();
	        }
	    )
	 }

	 handleStateChange(i,e){
	 	let state_id = e.target.value;
	 	//console.log(state_id);
	 	let loader = new Loader();
		loader.show();
		//
		fetch(Web.BaseUrl+"api/v1/area?state_id="+state_id)
	      .then(res => res.json())
	      .then(
	        (result) => {
	          loader.hide();	
	          this.setState({
	            isLoaded: true,
	            areas:result.data?result.data:[],
	            state_id:state_id,
	          });
	        },
	        (error) => {
	          this.setState({
	            isLoaded: true,
	            error
	          });

	          loader.hide();
	        }
	    )
	 }

	 handleAreaChange(i,e){
	 	let area_id = e.target.value;
	 	let loader = new Loader();
		loader.show();
		fetch(Web.BaseUrl+"api/v1/sector?area_id="+area_id)
	      .then(res => res.json())
	      .then(
	        (result) => {
	          loader.hide();	
	          this.setState({
	            isLoaded: true,
	            blocks:result.data?result.data:[],
	            area_id:area_id,
	          });
	        },
	        (error) => {
	          this.setState({
	            isLoaded: true,
	            error
	          });

	          loader.hide();
	        }
	    )
	 }

	 handleEditFormSubmit(event){
	 	event.preventDefault();
	 	if(this.handleEditValidation()){
	 		let loader = new Loader();
			loader.show();
			let formData = {
			    user_id: this.state.userData.id,
			    shipping_address_id: this.state.shippingAddrss.address_id,
			    first_name:this.state.first_name,
			    last_name:this.state.last_name,
			    country_id:this.state.country_id,
			    state_id:this.state.state_id,
			    area_id:this.state.area_id,
			    block_id:this.state.block_id,
			    street:this.state.street,
			    mobile_number:this.state.mobile_number,
			    addressline_1:this.state.addressline_1
			}

			fetch(Web.BaseUrl+"api/v1/update-address?lang=en",{
		  	  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify(formData),
		  	}).then(res => res.json())
		      .then(
		        (result) => {
		        	loader.hide();
		        	if(result.status==200){
		        	    this.showSuccessAlert("","Address successfully saved","success");
		        	    this.getUserDefaultAddress(this.state.userData.id,result.data.address_id);
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

	 handleEditValidation(){
		let errors = {};
        let formIsValid = true;
        if(!this.state.first_name){
           formIsValid = false;
           errors["first_name"] = "First Name cannot be blank";
        }

        if(!this.state.country_id){
           formIsValid = false;
           errors["country_id"] = "Please select country";
        }

        if(!this.state.state_id){
           formIsValid = false;
           errors["state_id"] = "Please select state";
        }

        if(!this.state.area_id){
           formIsValid = false;
           errors["area_id"] = "Please select area";
        }

        if(!this.state.street){
           formIsValid = false;
           errors["street"] = "Street cannot be blank";
        }

        if(!this.state.mobile_number){
           formIsValid = false;
           errors["mobile_number"] = "Mobile Number cannot be blank";
        }

        this.setState({errors: errors});
       	return formIsValid;
    }

    handleAddFormSubmit(event){
    	event.preventDefault();
	 	if(this.handleEditValidation()){
	 		let loader = new Loader();
			loader.show();
			let formData = {
			    user_id: this.state.userData.id,
			    first_name:this.state.first_name,
			    last_name:this.state.last_name,
			    country_id:this.state.country_id,
			    state_id:this.state.state_id,
			    area_id:this.state.area_id,
			    block_id:this.state.block_id,
			    street:this.state.street,
			    mobile_number:this.state.mobile_number,
			    addressline_1:this.state.addressline_1
			}

			fetch(Web.BaseUrl+"api/v1/add-address?lang=en",{
		  	  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify(formData),
		  	}).then(res => res.json())
		      .then(
		        (result) => {
		        	loader.hide();
		        	if(result.status==200){
		        		this.showSuccessAlert("","Address successfully saved","success");
		        	    this.getUserDefaultAddress(this.state.userData.id,result.data.address_id);
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

    handleAddAddress(e){
    	e.preventDefault();
	 	this.setState({
			modalVisible:true,
			modal_title:"Add Shipping Address",
			first_name:"",
            last_name:"",
            country_id:"",
            state_id:"",
            area_id:"",
            block_id:"",
            street:"",
            mobile_number:"",
            addressline_1:"",
            states:[],
            areas:[],
            blocks:[],
            scenerio:"ADD",
		})
    }

    handleOtherAddress(e){
    	e.preventDefault();
    	let loader = new Loader();
		loader.show();
    	fetch(Web.BaseUrl+"api/v1/user-address?lang=en&user_id="+this.state.userData.id,{
	  	  method: 'GET',
		  headers: { 'Content-Type': 'application/json' },
	  	}).then(res => res.json())
	      .then(
	        (result) => {
	        	loader.hide();
	        	if(result.status==200){
	        	    this.setState({
			    		modalOtherAddressVisible:true,
			    		allAddress:result.data?result.data:[]
			    	})
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

    hideOtherAddModal(e){
    	this.setState({
    		modalOtherAddressVisible:false,
    	})
    }

    chooseShippingAddress(e){
    	var radios = document.getElementsByName('other_address_name');
    	var shipping_address_id = '';
    	for(var i = 0; i < radios.length; i++) { 
    		if(radios[i].checked) {
    			shipping_address_id = radios[i].value;
    		}
    	}
    	this.setState({
    		modalOtherAddressVisible:false,
    	})
    	this.getUserDefaultAddress(this.state.userData.id,shipping_address_id);
    }

    onPaymentMethodChanged(e,i){
    	//console.log(e.currentTarget.value);
    	if(e.currentTarget.value!='C'){
    		this.setState({
		      cod_cost: 0
		    });
    	}else{
    		let cod = this.state.shippingAddrss.cod_cost;
	        let cod_cost = parseFloat(cod).toFixed(3);
	        this.setState({
		      cod_cost: cod_cost
		    });
    	}

    	//console.log(this.state.cod_cost);
    }

    placeOrder(e){
    	e.preventDefault();
    	var radios = document.getElementsByName('paymode');
    	var pay_mode = '';
    	for(var i = 0; i < radios.length; i++) { 
    		if(radios[i].checked) {
    			pay_mode = radios[i].value;
    		}
    	}
    	this.cartService.getOrderId().then((orderId) => {
			var checkoutParams = {
				"user_id":this.state.userData.id,
				"order_id":orderId,
				"shipping_address_id":this.state.shippingAddrss.address_id,
				"pay_mode":pay_mode,
				"device_token":"",
				"device_type":"Web",
				"device_model":"",
				"app_version":"1.0",
				"os_version":""
			}
			if(this.state.shippingAddrss.address_id){
				let loader = new Loader();
				loader.show();
				fetch(Web.BaseUrl+"api/v1/checkout?lang=en&store=BD",{
				  	  method: 'POST',
					  headers: { 'Content-Type': 'application/json' },
					  body: JSON.stringify(checkoutParams),
				}).then(res => res.json())
				      .then((result) => {
				        	//console.log(result);
				        	  loader.hide();
				        	  if(result.status==200){
				        	  		this.db.delete('settings','cartData');
									this.db.delete('settings','orderId');
									this.props.history.push('/order-details/'+orderId);
				        	  }

					        },(error) => {
					          loader.hide();
					          console.log(error);
					        }
					    )
			}else{
				this.showSuccessAlert("Error","Shipping address missing!","error");
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

	applyPromo(e){
		e.preventDefault();
		let errors = {};
		if(!this.state.promo_code){
           errors["promo_code"] = "Enter discount code";
           this.setState({errors: errors});
        }else{
        	this.cartService.getOrderId().then((orderId) => {
	        	let loader = new Loader();
				loader.show();
				var checkItemStockParams = {
					"user_id":this.state.userData.id,
					"order_id":orderId,
					"coupon_code":this.state.promo_code,
					"shipping_address_id":this.state.shippingAddrss.address_id,
				}
				fetch(Web.BaseUrl+"api/v1/redeem-coupon?lang=en&store=BD",{
				  	  method: 'POST',
					  headers: { 'Content-Type': 'application/json' },
					  body: JSON.stringify(checkItemStockParams),
				}).then(res => res.json())
				      .then(
				        (result) => {
				        	console.log(result);
				        	loader.hide();
				        	
				        },
				        (error) => {
				        	loader.hide();
				            console.log(error);
				        }
				)
			});
        }
	}

	render(){
	 	let grand_total = parseFloat(this.state.cartTotal)-(parseFloat(this.state.discount_price))+parseFloat(this.state.cod_cost)+parseFloat(this.state.shipping_cost);
	 	let gt = parseFloat(grand_total).toFixed(3)
	 	
	 	return (
	 		<div>
		 		{this.renderHeader()}
		         <div id="content" className="container">
		            <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
		              <div className="pb-5">
		              	<h1 className="display-4">Checkout</h1>
		              </div>
		              <div className="row">
		                   <div className="col-12 text-left">
		                       <div className="card">
		                       		<div className="card-header">Ship To</div>
		                       		 <div className="card-body">
		                       		 	  <p>{this.state.shippingAddrss.first_name} {this.state.shippingAddrss.last_name}<br/>
					                      {this.state.shippingAddrss.mobile_number}<br/>
					                      {this.state.shippingAddrss.street} {this.state.shippingAddrss.block_name} {this.state.shippingAddrss.area_name}<br/>
					                      {this.state.shippingAddrss.governorate_name} {this.state.shippingAddrss.country_name}<br/>
					                      {this.state.shippingAddrss.addressline_1}</p>
		                       		 </div>
		                       		 <div className="card-footer">
		                       		 	<div className="row">
			                       		 	<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
			                       		 	    <div className="float-left">
			                       		 	    	<a onClick={e => this.handleEditAddress(e)} href="#" className="btn btn-primary">Edit</a>
			                       		 	    </div>
			                       		 	    <div className="float-right">
			                       		 	    	<a onClick={e => this.handleAddAddress(e)} href="#" className="btn btn-info mr-1">Add Address</a>
			                       		 			<a onClick={e => this.handleOtherAddress(e)} href="#" className="btn btn-warning">Other Address</a> 
			                       		 		</div>
			                       		 	</div>
		                       		 	</div>
		                       		 </div>
		                       </div>
		                   </div>
		                   
		              </div>
		              <div className="row mt-3">
		                   <div className="col-12 text-left">
		                   	  <div className="card">
		                   	  	  <div className="card-header">Payment Method</div>
		                   	  	  <div className="card-body">
		                   	  	        {this.state.paymentTypes.map((value, index) => {
		                   	  	  			return(
		                   	  	  				<p key={index}>
		                   	  	  					<input defaultChecked={this.state.pay_method === value.code} onChange={this.onPaymentMethodChanged.bind(this)} type="radio" name="paymode" value={value.code}/> {value.type}
		                   	  	  				</p>
		                   	  	  			)
		                   	  	  		})}
		                   	  	  </div>
		                   	  </div>
		                   </div>
		              </div>
		              <div className="row mt-3">
		                   <div className="col-12 text-left">
		                      <div className="card">
		                   	  	  <div className="card-header">Order Summary</div>
		                   	  	  <div className="card-body">
		                   	  	  	 	{this.state.cartItems.map((value, index) => {
				                        	let subtotal = (value.quantity*value.final_price).toFixed(3);
					                   		return(
					                   			<div className="row  mb-3" key={index}>
						                   			<div className="col d-none d-sm-none d-sm-block product-image">
												     	<a href={this.renderHrefUrl(value.id,value.name)}>
											        		<img src={value.image} alt={value.name}/>
											        	</a>
												    </div>
												    <div className="col">
												      <a href={this.renderHrefUrl(value.id,value.name)}>
													      <b>{value.name}</b>
													      <p>{value.short_description}</p>
													      <p><b>SKU: </b>{value.SKU}</p>
												      </a>
												    </div>
												    <div className="col">
												      <b>{value.currency_code}</b> {value.final_price}
												    </div>
												    <div className="col">
												      <b>Quantity</b> {value.quantity} 
												    </div>
												    <div className="col">
												    	<b>{value.currency_code} </b>{subtotal}
												    </div>
						                   		</div>
					                   		)
				                   		})}
				                   		<div className="row">
				                   			<div className="col-md-5 offset-md-7">
				                   				 <div className="form-inline">
													  <div className="form-group">
													    <input value={this.state.promo_code}
										    onChange={e => this.setState({ promo_code: e.target.value })} placeholder="Enter discount code!" type="text" className="form-control"/>

													  </div>
													  <button onClick={e => this.applyPromo(e)} className="btn btn-warning">Apply</button>
													  <div className="text-danger">{this.state.errors.promo_code}</div>
												 </div>
				                   				 <hr/>
				                   			</div>
				                   		</div>
				                   		<div className="row">
											<div className="col-md-5 offset-md-7 text-left">
											    <h5> Summary  </h5>
										    </div>
										</div>
										<div className="row">
										    <div className="col-md-5 offset-md-7 text-left">
										    	<b>Total Qty</b> <span className="float-right">{this.state.cartCount}</span>
										    </div>
										</div>
										<div className="row">
										    <div className="col-md-5 offset-md-7 text-left">
										    	<b>Product Subtotal</b> <span className="float-right"><b>{this.state.baseCurrencyName} </b> {this.state.cartTotal}</span>
										    </div>
										</div>
										<div className="row">
										    <div className="col-md-5 offset-md-7 text-left">
										    	<b>Discount Price</b> <span className="float-right"><b>{this.state.baseCurrencyName} </b> {this.state.discount_price}</span>
										    </div>
										</div>
										<div className="row">
										    <div className="col-md-5 offset-md-7 text-left">
										    	<b>Shipping Cost</b> <span className="float-right"><b>{this.state.baseCurrencyName} </b> {this.state.shipping_cost}</span>
										    </div>
										</div>
										<div className="row">
										    <div className="col-md-5 offset-md-7 text-left">
										    	<b>COD Cost</b> <span className="float-right"><b>{this.state.baseCurrencyName} </b> {this.state.cod_cost}</span>
										    </div>
										</div>
										<div className="row">
										    <div  className="col-md-5 offset-md-7 text-left">
												<hr/>
											</div>
										</div>
										<div className="row">
										    <div className="col-md-5 offset-md-7 text-left">

										    	<b>Grand Total</b> <span className="float-right"><b>{this.state.baseCurrencyName} </b> {gt}</span>
										    </div>
										</div>
										<div className="row">
										    <div  className="col-md-5 offset-md-7 text-left">
												<hr/>
											</div>
										</div>
										<div className="row">
											<div className="col-md-5 offset-md-7 text-right">
											    <a href="/cart" className="btn btn-dark">Back</a> 
											    <a href="#" onClick={e => this.placeOrder(e)} className="btn btn-info ml-1">Place Order</a> 
										    </div>
										</div>
		                   	  	  </div>
		                   	  </div>
		                   </div>
		              </div>
		            </div>
		        </div>
		        <Footer />
		        <div>
			        <Modal size="lg" show={this.state.modalVisible} onHide={this.handleClose.bind(this)}>
				        <Modal.Header closeButton>
				          <Modal.Title>{this.state.modal_title}</Modal.Title>
				        </Modal.Header>
				        <Modal.Body>
				        	<div className="text-center">
				              <div className="text-success">{this.state.success}</div>
				            </div>
				            <form action="#">
				            	<div className="row form-group">
									  <div className="col">
									    <label>First Name</label>
										<input className="form-control" type="text" id="edit_first_name" name="first_name" placeholder="First Name"
										    value={this.state.first_name}
										    onChange={e => this.setState({ first_name: e.target.value })}
										  />
										  <div className="text-danger">{this.state.errors.first_name}</div>
									  </div>
									  <div className="col">
									    <label>Last Name</label>
									  	<input className="form-control" type="text" id="edit_last_name" name="last_name" placeholder="Last Name"
										    value={this.state.last_name}
										    onChange={e => this.setState({ last_name: e.target.value })}
										  />
										  <div className="text-danger">{this.state.errors.last_name}</div>
									  </div>
								</div>
								<div className="row form-group">
									<div className="col">
									    <label>Country</label>
										<select value={this.state.country_id} className="form-control" type="text" id="edit_country_id" name="country_id" onChange={this.handleCountryChange.bind(this, "edit_state_id")}>
										   <option value="">Country</option>
										   {this.state.countries.map((value, index) => {
										   		return(
										   			<option key={index} value={value.id}>{value.name}</option>
										   		)
										   })}
										</select>
										<div className="text-danger">{this.state.errors.country_id}</div>
									</div>
									<div className="col">
									    <label>State</label>
									    <select value={this.state.state_id} className="form-control" type="text" id="edit_state_id" name="state_id" onChange={this.handleStateChange.bind(this, "edit_area_id")}>
										   <option value="">State</option>
										   {this.state.states.map((value, index) => {
										   		return(
										   			<option key={index} value={value.id}>{value.name}</option>
										   		)
										   })}
										</select>
										<div className="text-danger">{this.state.errors.state_id}</div>
									</div>
								</div>
								<div className="row form-group">
									<div className="col">
									    <label>Area</label>
									    <select value={this.state.area_id} className="form-control" type="text" id="edit_area_id" name="area_id" onChange={this.handleAreaChange.bind(this, "edit_block_id")}>
										   <option value="">Area</option>
										   {this.state.areas.map((value, index) => {
										   		return(
										   			<option key={index} value={value.id}>{value.name}</option>
										   		)
										   })}
										</select>
										<div className="text-danger">{this.state.errors.area_id}</div>
									</div>
									<div className="col">
									    <label>Block</label>
									    <select value={this.state.block_id} className="form-control" type="text" id="edit_block_id" name="block_id" onChange={e => this.setState({ block_id: e.target.value })}>
										   <option value="">Block</option>
										   {this.state.blocks.map((value, index) => {
										   		return(
										   			<option key={index} value={value.id}>{value.name}</option>
										   		)
										   })}
										</select>
										<div className="text-danger">{this.state.errors.block_id}</div>
									</div>
								</div>
								<div className="row form-group">
									<div className="col-6">
									    <label>Street</label>
										<input className="form-control" type="text" id="edit_street" name="street" placeholder="Street"
										    value={this.state.street}
										    onChange={e => this.setState({ street: e.target.value })}
										  />
										  <div className="text-danger">{this.state.errors.street}</div>
									</div>
									<div className="col-6">
									    <label>Mobile Number</label>
										<input className="form-control" type="text" id="edit_mobile_number" name="mobile_number" placeholder="Mobile Number"
										    value={this.state.mobile_number}
										    onChange={e => this.setState({ mobile_number: e.target.value })}
										  />
										  <div className="text-danger">{this.state.errors.mobile_number}</div>
									</div>
								</div>
								<div className="row form-group">
									<div className="col">
										<label>Address Line</label>
										<textarea className="form-control" type="text" id="edit_addressline_1" name="addressline_1" placeholder="Address Line"
										    onChange={e => this.setState({ addressline_1: e.target.value })} value={this.state.addressline_1}></textarea>
										  <div className="text-danger">{this.state.errors.addressline_1}</div>
									</div>
								</div>
								{(() => {
									if(this.state.scenerio=='EDIT'){
										return (
											<input className="btn btn-info mb-3" type="submit" onClick={e => this.handleEditFormSubmit(e)} value="Save" />
										)
									}
									else{
										return (
											<input className="btn btn-info mb-3" type="submit" onClick={e => this.handleAddFormSubmit(e)} value="Submit" />
										)
									}
								})()}
				            </form>
				        </Modal.Body>
		      		</Modal>
		      	</div>
		      	<div>
			      <Modal  size="lg" show={this.state.modalOtherAddressVisible} onHide={this.handleOtherAddressClose.bind(this)}>
			        <Modal.Header closeButton>
			          <Modal.Title>Other Address</Modal.Title>
			        </Modal.Header>
			        <Modal.Body>
			        	<table className="table table-bordered">
			        		<thead>
			        			<tr>
			        				<th>#</th>
			        				<th>Address</th>
			        			</tr>
			        		</thead>
			        		<tbody>
		                      	  {this.state.allAddress.map((value, index) => {
		                      	  	 return(
		                      	  	 	<tr key={index}>
		                      	  	 		<td>
		                      	  	 			<input type="radio" name="other_address_name" value={value.address_id}/>
		                      	  	 		</td>
		                      	  	 		<td>
		                      	  	 			{value.first_name} {value.last_name} <br/>
		                      	  	 			{value.mobile_number} <br/>
		                      	  	 			{value.street}, {value.block_name}, {value.area_name} <br/>
		                      	  	 			{value.governorate_name}, {value.country_name} <br/>
		                      	  	 			{value.addressline_1}
		                      	  	 		</td>
		                      	  	 	</tr>
		                      	  	 )
		                      	  })}


			        		</tbody>
			        	</table>
			        </Modal.Body>
			        <Modal.Footer>
			        	<Button onClick={e => this.chooseShippingAddress(e)} className="btn btn-info">Choose</Button>
				        <Button onClick={e => this.hideOtherAddModal(e)}>Close</Button>
				    </Modal.Footer>
			      </Modal>
			    </div>
	        </div>
	 	)
	 }
}
export default Checkout;