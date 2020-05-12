import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import Loader from '../helpers/Loader'
import Web from '../config/Web'
import DB from '../helpers/DB';
import LoginService from '../services/LoginService';
import CartService from '../services/CartService';

class OrderDetails extends Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    	userData:{},
	    	orderDetails:{},
	    	userAddress:{},
	    	items:[],
	    	cartCount:0,
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

			    this.cartService.getCartCount().then((count) => {
					this.setState({
				   	   cartCount:count,
				   })
				});

			    if(Object.keys(userinfo).length===0){
						this.props.history.push('/');
				}

				const {params} = this.props.match;
				var order_id = params.id;
				let loader = new Loader();
				loader.show();
				fetch(Web.BaseUrl+"api/v1/order-details?lang=en&id="+order_id+"&user_id="+this.state.userData.id+"&store=BD",{
			  	  method: 'GET',
				  headers: { 'Content-Type': 'application/json' },
			  	}).then(res => res.json())
			      .then(
			        (result) => {
			        	loader.hide();
			        	if(result.status==200){
			        	    this.setState({
					    		orderDetails:result.data?result.data:{},
					    		userAddress:result.data?result.data.shipping_address:{},
					    		items:result.data?result.data.items:[]
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
		})
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

	getPaymodeName(paymode){
		if(paymode=='C'){
			return "Cash on Delivery"
		}
		else if(paymode=='K'){
			return "K-Net"
		}
		else if(paymode=='CC'){
			return "Credit Card"
		}
	}

	getDeliveryOptionName(option_id){
		return (option_id==1)?"Standard Delivery":"Express Delivery"
	}

	render(){
		return (
			<div>
				{this.renderHeader()}
				<div id="content" className="container">
					<div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
						<div className="pb-5">
			              	<h1 className="display-4">Order #{this.state.orderDetails.order_number}</h1>
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
					            <div className="row">
					            	<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 text-left">
					            		<h3><u>Order Information</u></h3>
					            		<p><b>Order Date:</b> {this.state.orderDetails.created_date}</p>
					            		<p><b>Order Number:</b> {this.state.orderDetails.order_number}</p>
					            		<p><b>Payment Method:</b> {this.getPaymodeName(this.state.orderDetails.payment_mode)}</p>
					            		<p><b>Delivery Method:</b> {this.getDeliveryOptionName(this.state.orderDetails.delivery_option_id)}</p>
					            	</div>
					            </div>
					            <div className="row">
					            	<div className="col-12 text-left mt-3">
					            		<h3><u>Items Ordered</u></h3>
					            		<table className="table table-bordered">
					            			<thead>
					            				<tr>
					            					<th>#</th>
					            					<th>Item</th>
					            					<th>Price</th>
					            					<th>Quantity</th>
					            					<th>Total</th>
					            				</tr>
					            				{this.state.items.map((value, index) => {
					            					let subtotal = (value.quantity*value.final_price).toFixed(3);
					            					return(
					            						<tr key={index}>
					            						    <td>{index+1}</td>
							            					<td>
							            					    <img style={{width:"98px"}} src={value.image}/>
							            					    <br/>
							            						{value.name}<br/>
							            						{value.configurable_option.map((v, i) => {
							            							return(
							            								<span key={i}>
							            									<b>{v.type} :</b>
							            										{v.attributes.map((vv, ii) => {
							            											return(
							            												<span key={ii}> {vv.value}</span>
							            											)
							            										})}
							            									<br/>
							            								</span>
							            							)
							            						})}
							            					</td>
							            					<td>{value.currency_code} {value.final_price}</td>
							            					<td>{value.quantity}</td>
							            					<td>{value.currency_code} {subtotal}</td>
							            				</tr>
					            					)
					            				})}
					            				<tr>
					            				    <td>&nbsp;</td>
					            				    <td>&nbsp;</td>
					            					<td>Order Total</td>
					            					<td>&nbsp;</td>
					            					<td>{this.state.orderDetails.baseCurrencyName} {this.state.orderDetails.sub_total}</td>
					            				</tr>
					            				<tr>
					            				    <td>&nbsp;</td>
					            				    <td>&nbsp;</td>
					            					<td>Shipping Cost</td>
					            					<td>&nbsp;</td>
					            					<td>{this.state.orderDetails.baseCurrencyName} {this.state.orderDetails.delivery_charges}</td>
					            				</tr>
					            				<tr>
					            				    <td>&nbsp;</td>
					            				    <td>&nbsp;</td>
					            					<td>Cash on Delivery Cost</td>
					            					<td>&nbsp;</td>
					            					<td>{this.state.orderDetails.baseCurrencyName} {this.state.orderDetails.cod_cost}</td>
					            				</tr>
					            				<tr>
					            				    <td>&nbsp;</td>
					            				    <td>&nbsp;</td>
					            					<td>Grand Total</td>
					            					<td>&nbsp;</td>
					            					<td>{this.state.orderDetails.baseCurrencyName} {this.state.orderDetails.total}</td>
					            				</tr>
					            			</thead>
					            		</table>
					            	</div>
					            </div>
					            <div className="row">
					            	<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 text-left">
					            		<h3><u>Shipping Information</u></h3>
					            		<p><b>Name:</b> {this.state.userAddress.first_name}</p>
					            		<p><b>Governorate:</b> {this.state.userAddress.governorate_name} <b>Area:</b> {this.state.userAddress.area_name}</p>
					            		<p><b>Block:</b> {this.state.userAddress.block_name} <b>Street:</b> {this.state.userAddress.street}</p>
					            		<p><b>Address:</b> {this.state.userAddress.addressline_1}</p>
					            		<p><b>Phone:</b> {this.state.userAddress.mobile_number}</p>
					            	</div>
					            </div>
					            <div className="row">
					            	<div className="col-12 text-left mt-3">
					            		<h3><u>Order Status</u></h3>
					            		<p style={{background:this.state.orderDetails.status_color,padding:"5px",color:"#FFF"}}>{this.state.orderDetails.status}</p>
					            	</div>
					            </div>
		              	  </div>
			            </div>
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}
export default OrderDetails;