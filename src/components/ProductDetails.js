import React, { Component, useState } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer.js';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import Loader from '../helpers/Loader';
import Web from '../config/Web';
import DB from '../helpers/DB';
import { Button, Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import CartService from '../services/CartService';
import LoginService from '../services/LoginService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';


class ProductDetails extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	product_details:{},
	    	configurable_options:[],
	    	options:[],
	    	attributes:[],
	    	final_price:"",
	    	product_images:[],
	    	SKU:"",
	    	entity_id:"",
	    	modalVisible:false,
	    	errors: {},
	    	email: '',
		    password: '',
  			error: '',
  			success:'',
  			userData:{},
  			cartCount:0,
  			currency_code:"",
  			image_url:"",
  			name:"",
  			short_description:"",
  			remaining_quantity:0,

	    };
	    this.db = new DB();
	    this.cartService = new CartService(this.db); 
	    this.loginService = new LoginService(this.db);
	}

	componentDidMount() {
		const {params} = this.props.match;
		var product_id = params.id;
		let loader = new Loader();
		loader.show();
		fetch(Web.BaseUrl+"api/v1/product-details?product_id="+product_id+"&store=BD")
	      .then(res => res.json())
	      .then(
	        (result) => {
	          this.setState({
	            isLoaded: true,
	            product_details: result.data?result.data:{},
	            configurable_options:result.data?result.data.configurable_option:[],
	            final_price:result.data?result.data.final_price:0,
	            product_images:result.data?result.data.images:[],
	            SKU:result.data?result.data.SKU:"",
	            image_url:result.data?result.data.image:"",
	            currency_code:result.data?result.data.currency_code:"",
	            name:result.data?result.data.name:"",
	            short_description:result.data?result.data.short_description:"",
	            remaining_quantity:result.data?result.data.remaining_quantity:0
	          });
	          //console.log(this.state.configurable_options);

			    let attributes = [];
				let options = [];
				//
				var selectionAttributes = document.getElementsByClassName("attributes");
			    Array.prototype.forEach.call(selectionAttributes, function(el,i) {
				    let attribute_id = el.getAttribute("data-attribute_id");
				    let option_id = el.value;
				    //
				    attributes[i] = attribute_id;
				    options[i] = option_id;
				});

				//console.log(attributes);
				//console.log(options);

			    this.setState({
			    	attributes:attributes,
			    	options:options,
			    });

			    loader.hide();

			    this.getConfigureOptions(attributes,options);
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
	    //
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

	handleAddToCartClick(e) {
		e.preventDefault();
		// if(this.state.userData && this.state.userData.id){
			
		// }else{
		// 	this.setState({
		// 		modalVisible:true 
		// 	})
		// }

		let promise = this.db.getOne('settings','cartData');
  	    promise.then((cartinfo) => {
  	       let cartData = cartinfo?cartinfo:[];
		   if (cartinfo && cartinfo.length) {
		   	    let arrayIndex = -1;
		   		cartinfo.forEach((entry,key)=>{
				    if(parseInt(entry.product_id)===parseInt(this.state.entity_id)){ 
				    	arrayIndex = key;
				    	return;
				    }
			   });
		   	   if(arrayIndex!=-1){
		   	   	  let oldQty = parseInt(cartData[arrayIndex].qty);
		   	   	  let newQty = ( oldQty + 1);
		   	   	  if(newQty > this.state.remaining_quantity){
		   	   	  	 return 0;
		   	   	  }else{
				      //
				      if(this.state.userData.id){
					      var cartParams = {
							"user_id":this.state.userData.id,
							"products":this.state.entity_id,
							"quantity":1
						  }
					      this.addToCart(cartParams);
					  }else{
				   	   	  cartData[arrayIndex]= {
					    		product_id:this.state.entity_id,
					    		qty:newQty,
					    		image:this.state.image_url,
					    		sku:this.state.SKU,
					    		name:this.state.name,
					    		short_description:this.state.short_description,
					    		final_price:this.state.final_price,
					    		currency_code:this.state.currency_code,
					    		remaining_quantity:this.state.remaining_quantity
					      };
					      this.db.insert("settings",cartData,'cartData');
				    	  this.showSuccessAlert("","Product added to your cart!", "success");
				      }
				      return 1;
		   	   	  }
		   	   }else{
		   	   	    if(this.state.remaining_quantity >= 1){
				       if(this.state.userData.id){
					      var cartParams = {
							"user_id":this.state.userData.id,
							"products":this.state.entity_id,
							"quantity":1
						  }
					      this.addToCart(cartParams);
					  }else{
				    	cartData.push({
				    		product_id:this.state.entity_id,
				    		qty:1,
				    		image:this.state.image_url,
				    		sku:this.state.SKU,
				    		name:this.state.name,
				    		short_description:this.state.short_description,
				    		final_price:this.state.final_price,
				    		currency_code:this.state.currency_code,
				    		remaining_quantity:this.state.remaining_quantity
				        }); 
				        this.db.insert("settings",cartData,'cartData');
				    	this.showSuccessAlert("","Product added to your cart!", "success");
				      }
				       return 1;
				    }else{
				       return 0;
				    }
			   }
		   }else{
		   	   if(this.state.remaining_quantity >= 1){
		   	   	   if(this.state.userData.id){
					      var cartParams = {
							"user_id":this.state.userData.id,
							"products":this.state.entity_id,
							"quantity":1
						  }
					      this.addToCart(cartParams);
				    }else{
			   	   		cartData.push({
				    		product_id:this.state.entity_id,
				    		qty:1,
				    		image:this.state.image_url,
				    		sku:this.state.SKU,
				    		name:this.state.name,
				    		short_description:this.state.short_description,
				    		final_price:this.state.final_price,
				    		currency_code:this.state.currency_code,
				    		remaining_quantity:this.state.remaining_quantity
				       }); 
			   	   	   this.db.insert("settings",cartData,'cartData');
				       this.showSuccessAlert("","Product added to your cart!", "success");
				    }
		   	   	   return 1;
		   	   }else{
			   	   	return 0;
		   	   }
		   }
     	   
		}).then((res) => {
			//console.log(res);
			if(res==1){
			   this.cartService.getCartCount().then((count) => {
					this.setState({
				   	   cartCount:count,
				   })
			   });	
			   
			}else{
				this.showSuccessAlert("","Product out of stock", "error");
			}
		});
	}

	addToCart(cartParams){
		fetch(Web.BaseUrl+"api/v1/add-to-cart?lang=en&store=BD",{
		  	  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify(cartParams),
		}).then(res => res.json())
		      .then(
		        (result) => {
		        	if(result.status==200){
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
					    this.showSuccessAlert("","Product added to your cart!","success");
				    }else{
				    	this.showSuccessAlert("",result.message,"error");
				    }
		        	
		        },
		        (error) => {
		          this.setState({
		            isLoaded: true,
		            error
		          });
		        }
		)
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

    handleClose(){
    	this.setState({
			modalVisible:false
		})
    }

	handleChange(i,e){
		let options = [...this.state.options];
	    options[i] = e.target.value;
	    //
	    let attributes = [...this.state.attributes];
	    attributes[i] = e.target.getAttribute("data-attribute_id");
	    this.setState({
	    	attributes:attributes,
	    	options:options,
	    });

	    let attArray = [];
	    let optionArray = [];
	    var selectionAttributes = document.getElementsByClassName("attributes");
	    Array.prototype.forEach.call(selectionAttributes, function(el,i) {
		    let attribute_id = el.getAttribute("data-attribute_id");
		    let option_id = el.value;
		    //
		    attArray.push(attribute_id);
		    optionArray.push(option_id);
		});
		this.getConfigureOptions(attArray,optionArray);
	}

	getConfigureOptions(attArray,optionArray){
		const {params} = this.props.match;
		let product_id = params.id;
		//let loader = new Loader();
		//loader.show();
		let postParams = {
			attribute_id:attArray.join(),
			option_id:optionArray.join(),
			product_id:product_id
		}

		fetch(Web.BaseUrl+"api/v1/configurable-options?lang=en&store=BD",{
		  	  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify(postParams),
		}).then(res => res.json())
		      .then(
		        (result) => {
		        	//loader.hide();
		        	//console.log(result);
		        	 this.setState({
		        	 	final_price:result.data[0]?result.data[0].final_price:this.state.final_price,
		        	 	product_images:result.data[0]?result.data[0].images:this.state.product_images,
		        	 	SKU:result.data[0]?result.data[0].sku:this.state.SKU,
		        	 	entity_id:result.data[0]?result.data[0].entity_id:"",
		        	 	image_url:result.data[0]?result.data[0].image_url:"",
			            currency_code:result.data[0]?result.data[0].currency_code:"",
		        	 });
		        	 this.ProductImageGallery();
		        },
		        (error) => {
		          this.setState({
		            isLoaded: true,
		            error
		          });
		          //loader.hide();
		        }
		)
	}

	ProductImageGallery(){
		if(this.state.product_images){
			const images = [];
			this.state.product_images.forEach(function(entry) {
			    //console.log(entry);
			    let d = {
			    	'original':entry,
			    	'thumbnail':entry,
			    }
			    images.push(d)
			});
			return (
				<ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} thumbnailPosition={'left'}/>
			)
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
		        			image:this.state.userData.image
		        		};
		        		this.db.insert("settings",userData,'userData');
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
	         <div id="content">
	            <div className="container">
		            <div className="row">
		            	<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
			        	 	{this.ProductImageGallery()}
		            	</div>
		            	<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
		            	    <div>
		            	       <h3>{this.state.product_details.name}</h3>
			            	   <p>{this.state.product_details.short_description}</p>
			            	   <p>SKU:{this.state.SKU}</p>
			            	   <p>{this.state.product_details.description}</p>
			            	   <h5>{this.state.currency_code} {this.state.final_price}</h5>
		            	   </div>
		            	   <div className="row">
			            	   {this.state.configurable_options.map((value, index) => {
		              			return <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12" key={index}>
		              						<div className="row">
				              					<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
				              			            <label>{value.type}</label>
				              						<select defaultValue={value.attributes[0].option_id} onChange={this.handleChange.bind(this, index)} data-attribute_id={value.attribute_id}  name={value.attribute_code} className="form-control attributes">
				              							{value.attributes.map((v, i) => {
				              								return <option key={i} value={v.option_id}>{v.value}</option>
				              							})}	
				              						</select>
				              						<p></p>
				              					</div>
			              					</div>
		              				   </div>
		              			})}
			            	   <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
			            	   		<div className="row">
			            	   			<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
			            	   			    <div className="input-group mb-3">
			            	   			    	<div className="input-group-append">
												    <div className="mr-2">
												    	<button onClick={this.handleAddToCartClick.bind(this)} className="btn btn-info"><FontAwesomeIcon icon={faShoppingCart} /> Add to cart</button>
												    </div>
												    <div>
												    	<button className="btn btn-light"><FontAwesomeIcon icon={faHeart} /> Wish List</button>
												    </div>
												</div>
											</div>
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
		          <Modal  size="lg" show={this.state.modalVisible} onHide={this.handleClose.bind(this)}>
			        <Modal.Header closeButton>
			          <Modal.Title>Login</Modal.Title>
			        </Modal.Header>
			        <Modal.Body>
			        	<div className="text-center">
			              <div className="text-success">{this.state.success}</div>
			            </div>
			            <form action="#" className="offset-md-3">
			            	<div className="row form-group">
								  <div className="col-9">
									  <input className="form-control" type="email" id="email" name="email" placeholder="E-mail"
									    value={this.state.email}
									    onChange={e => this.setState({ email: e.target.value })}
									  />
									  <div className="text-danger">{this.state.errors.email}</div>
								  </div>
							</div>
							<div className="row form-group">
								<div className="col-9">
									  <input className="form-control" type="password" id="password" name="password" placeholder="Password"
									    value={this.state.password}
									    onChange={e => this.setState({ password: e.target.value })}
									  />
									  <div className="text-danger">{this.state.errors.password}</div>
								  </div>
							</div>
							<input className="btn btn-info mb-3" type="submit" onClick={e => this.handleFormSubmit(e)} value="Submit" />
			            </form>
			        </Modal.Body>
			      </Modal>
			    </div>
			    
          </div>
        )
	}
}
export default ProductDetails;