import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import Loader from '../helpers/Loader'
import Web from '../config/Web'
import DB from '../helpers/DB';
import LoginService from '../services/LoginService';
import swal from 'sweetalert';
import CartService from '../services/CartService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import UserLeftMenu from './UserLeftMenu';
import { Link } from "react-router-dom";
import CategoryLeft from '../components/CategoryLeft';

class Wishlist extends Component {

	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			userData: {},
			cartCount: 0,
			userWishlist: [],
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
				fetch(Web.BaseUrl + "api/v1/user-wishlist?user_id=" + userinfo.id + "&lang=en&store=BD", {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}).then(res => res.json())
					.then(
						(result) => {
							//console.log(result);
							loader.hide();
							this.setState({
								userWishlist: result.data ? result.data : [],
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

	showSuccessAlert(title, msg, icon) {
		return swal({
			title: title,
			text: msg,
			icon: icon,
			timer: 2000,
			button: false
		})
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

	renderHrefUrl(id, name) {
		name = name.replace(/\s+/g, '-').toLowerCase();
		var href = '/product/' + id + '/' + name;
		return href;
	}

	handleRemoveWishlist(product_id, obj) {
		//console.log(obj);
		if (this.state.userData.id) {
			let loader = new Loader();
			loader.show();
			let postParams = {
				user_id: this.state.userData.id,
				product_id: product_id,
			}

			fetch(Web.BaseUrl + "api/v1/remove-wishlist?lang=en&store=BD&list=1", {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(postParams),
			}).then(res => res.json())
				.then(
					(result) => {
						loader.hide();
						if (result.status == 200) {
							this.setState({
								userWishlist: result.data ? result.data : [],
							});
							this.showSuccessAlert("", result.message, "success");
						}
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
		else {
			this.showSuccessAlert("", "Please login to continue", "warning");
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
									<h1 className="display-4">MY WISHLIST</h1>
								</div>
								<div className="row">
									<UserLeftMenu />
									<div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12">
										<div className="row">
											{this.state.userWishlist.map((value, index) => {
												return <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6" key={index}>
													<div className="product-image">
														<Link to={this.renderHrefUrl(value.id, value.name)}>
															<img src={value.image} alt={value.name} />
														</Link>
													</div>
													<div className="product-details">
														<Link to={this.renderHrefUrl(value.id, value.name)}>
															<div className="product-name">
																{value.name}
															</div>
															<div className="product-brand">
																{value.brand}
															</div>
															<div className="product-price">
																{value.currency_code} {value.final_price}
															</div>
														</Link>
														<div>
															<button onClick={this.handleRemoveWishlist.bind(this, value.id)} className="btn btn-light"><FontAwesomeIcon icon={faTrashAlt} /></button>
														</div>
													</div>
												</div>
											})}
										</div>
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

export default Wishlist;