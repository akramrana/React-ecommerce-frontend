import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import Loader from '../helpers/Loader'
import Web from '../config/Web'
import DB from '../helpers/DB';
import LoginService from '../services/LoginService';
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import CartService from '../services/CartService';
import { Button, Modal } from 'react-bootstrap';

class MyAddress extends Component {

	_isMounted = false;

	constructor(props) {
	    super(props);
	    this.state = {
	    	userData:{},
	    	userAddress:[],
	    	cartCount:0,
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
    		is_default:'0',
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
			    if(Object.keys(userinfo).length===0){
						this.props.history.push('/');
				}
				let loader = new Loader();
				loader.show();
				fetch(Web.BaseUrl+"api/v1/user-address?user_id="+userinfo.id+"&lang=en&store=KW",{
			  	  method: 'GET',
				  headers: { 'Content-Type': 'application/json' },
				}).then(res => res.json())
				      .then(
				        (result) => {
				        	loader.hide();
				        	//console.log(result);
				        	this.setState({
					            userAddress:result.data?result.data:[],
					        });
				        },
				        (error) => {
				          console.log(error);
				          loader.hide();
				        }
				)
			}
			
		})

		this.cartService.getCartCount().then((count) => {
			this.setState({
		   	   cartCount:count,
		   })
		});
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

	handleClose(){
    	this.setState({
			modalVisible:false
		})
    }

    handleEditAddress(e,address_id){
	 	e.preventDefault();
	 	this.getUserAddress(this.state.userData.id,address_id);
	 	this.setState({
			modalVisible:true,
			modal_title:"Edit Shipping Address",
		})
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

	 getUserAddress(id,address_id=""){
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
	            vat_charge:result.data.default_address?result.data.default_address.val:0,
	            is_default:result.data.default_address?result.data.default_address.is_default:"0"
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
			    addressline_1:this.state.addressline_1,
			    is_default:this.state.is_default,
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
		        	    this.showSuccessAlert("","Address successfully updated!", "success");
		        	    fetch(Web.BaseUrl+"api/v1/user-address?user_id="+this.state.userData.id+"&lang=en&store=KW",{
					  	  method: 'GET',
						  headers: { 'Content-Type': 'application/json' },
						}).then(res => res.json())
						      .then(
						        (result) => {
						        	this.setState({
							            userAddress:result.data?result.data:[],
							        });
						        },
						        (error) => {
						          console.log(error);
						        }
						)
		        	}else{
		        		this.showSuccessAlert("",result.message, "warning");
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

    showSuccessAlert(title,msg, icon){
		return swal({
          title:title,
          text: msg,
          icon: icon,
          timer: 2000,
          button: false
        })
	}

    handleChecked (e) {
      if(e.target.checked){
      	 this.setState({
            is_default:'1',
        });
      }else{
      	this.setState({
            is_default:'0',
        });
      }
    }

    handleDeleteAddress(event,address_id){
    	event.preventDefault();
    	let loader = new Loader();
		loader.show();
		let formData = {
		    user_id: this.state.userData.id,
		    id: address_id,
		}

		fetch(Web.BaseUrl+"api/v1/delete-address?lang=en",{
	  	  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify(formData),
	  	}).then(res => res.json())
	      .then(
	        (result) => {
	        	loader.hide();
	        	if(result.status==200){
	        	    this.showSuccessAlert("","Address successfully deleted!", "success");
	        	    fetch(Web.BaseUrl+"api/v1/user-address?user_id="+this.state.userData.id+"&lang=en&store=KW",{
				  	  method: 'GET',
					  headers: { 'Content-Type': 'application/json' },
					}).then(res => res.json())
					      .then(
					        (result) => {
					        	this.setState({
						            userAddress:result.data?result.data:[],
						        });
					        },
					        (error) => {
					          console.log(error);
					        }
					)
	        	}else{
	        		this.showSuccessAlert("",result.message, "warning");
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

	render(){
		return (
			<div>
				{this.renderHeader()}
				<div id="content" className="container">
		            <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
		              <div className="pb-5">
		              	<h1 className="display-4">My Addresses</h1>
		              </div>
		              <div className="row">
		              	  <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12 text-left">
		              	  		<nav className="navbar bg-light">
								  <ul className="navbar-nav">
								    <li className="nav-item">
								      <a className="nav-link" href="/myaccount">MY ORDERS</a>
								    </li>
								    <li className="nav-item">
								      <a className="nav-link" href="/addresses">ADDRESSES</a>
								    </li>
								    <li className="nav-item">
								      <a className="nav-link" href="/profile">PROFILE</a>
								    </li>
								    <li className="nav-item">
								      <a className="nav-link" href="/change-password">CHANGE PASSWORD</a>
								    </li>
								  </ul>
								</nav>
		              	  </div>
		              	  <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12 text-left">
		              	  	   <table className="table table-bordered">
		              	  	   		<thead>
		              	  	   			<tr>
		              	  	   				<th>#</th>
		              	  	   				<th>Address</th>
		              	  	   				<th>Default Address</th>
		              	  	   				<th>Action</th>
		              	  	   			</tr>
		              	  	   		</thead>
		              	  	   		<tbody>
		              	  	   			{this.state.userAddress.map((value, index) => {
		              	  	   				return(
				              	  	   			<tr key={index}>
				              	  	   				<td>{index+1}</td>
				              	  	   				<td>
				              	  	   					  <p>{value.first_name} {value.last_name}</p>
									                      <p>{value.mobile_number}</p>
									                      <p>{value.street},{value.block_name},{value.area_name}</p>
									                      <p>{value.governorate_name},{value.country_name}</p>
									                      <p>{value.addressline_1}</p>
				              	  	   				</td>
				              	  	   				<td>{value.is_default_text}</td>
				              	  	   				<td>
				              	  	   				    <a onClick={e => this.handleEditAddress(e,value.address_id)} href="#"> <FontAwesomeIcon icon={faEdit} /></a>
				              	  	   					<a onClick={e => this.handleDeleteAddress(e,value.address_id)} href="#"> <FontAwesomeIcon icon={faTrash} /></a>
				              	  	   				</td>
				              	  	   			</tr>
			              	  	   			)
		              	  	   			})}
		              	  	   		</tbody>
		              	  	   </table>
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
								<div className="row form-group">
									<div className="col-6">
										<input type="checkbox" id="edit_is_default" name="is_default" defaultChecked={this.state.is_default} 
										    onChange={e => this.handleChecked(e)} value={this.state.is_default}/> <label>Default Address?</label>
									</div>
								</div>
								<input className="btn btn-info mb-3" type="submit" onClick={e => this.handleEditFormSubmit(e)} value="Save" />
				            </form>
				        </Modal.Body>
		      		</Modal>
				</div>
			</div>
		)
	}
}
export default MyAddress;