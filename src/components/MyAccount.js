import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import Loader from '../helpers/Loader'
import Web from '../config/Web'
import DB from '../helpers/DB';
import LoginService from '../services/LoginService';
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import CartService from '../services/CartService';
import UserLeftMenu from './UserLeftMenu';
import { Link } from "react-router-dom";
import CategoryLeft from '../components/CategoryLeft';
class MyAccount extends Component {

	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			userData: {},
			userOrders: [],
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
					userData: userinfo,
				})
				if (Object.keys(userinfo).length === 0) {
					this.props.history.push('/');
				}
				let loader = new Loader();
				loader.show();
				fetch(Web.BaseUrl + "api/v1/user-orders?user_id=" + userinfo.id + "&lang=en&store=BD", {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}).then(res => res.json())
					.then(
						(result) => {
							//console.log(result);
							loader.hide();
							this.setState({
								userOrders: result.data ? result.data : [],
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
				cartCount: count,
			})
		});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	renderHeader() {
		if (this.state.userData && this.state.userData.id) {
			return (
				<Header userinfo={this.state.userData} cartCount={this.state.cartCount} />
			)
		} else {
			return (
				<Header userinfo={this.state.userData} cartCount={this.state.cartCount} />
			)
		}
	}

	getPaymodeName(paymode) {
		if (paymode == 'C') {
			return "Cash on Delivery"
		}
		else if (paymode == 'K') {
			return "K-Net"
		}
		else if (paymode == 'CC') {
			return "Credit Card"
		}
	}

	render() {
		return (
			<div>
				{this.renderHeader()}
				<div id="content" className="container-fluid">
					<div className="row">
						<div className="col-3">
							<CategoryLeft />
						</div>
						<div className="col-9">
							<div className="pricing-header px-3 py-3 pb-md-4 mx-auto text-center">
								<div className="pb-5">
									<h1 className="display-4">My Orders</h1>
								</div>
								<div className="row">
									<UserLeftMenu />
									<div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12 text-left">
										<table className="table table-bordered">
											<thead>
												<tr>
													<th>#</th>
													<th>Order Number</th>
													<th className="d-none d-sm-block">Pay Mode</th>
													<th>Total</th>
													<th className="d-none d-sm-block">Created Date</th>
													<th>Status</th>
													<th>Action</th>
												</tr>
											</thead>
											<tbody>
												{this.state.userOrders.map((value, index) => {
													return (
														<tr key={index}>
															<td>{index + 1}</td>
															<td>{value.order_number}</td>
															<td className="d-none d-sm-block">{this.getPaymodeName(value.payment_mode)}</td>
															<td>{value.baseCurrencyName} {value.total}</td>
															<td className="d-none d-sm-block">{value.created_date}</td>
															<td><span style={{ color: value.status_color }}>{value.status}</span></td>
															<td>
																<Link to={'/order-details/' + value.id}> <FontAwesomeIcon icon={faEye} /></Link>
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
					</div>
				</div>
				<Footer />
			</div>
		)
	}

}
export default MyAccount;