import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import Loader from '../helpers/Loader'
import Web from '../config/Web'
import DB from '../helpers/DB';
import CartService from '../services/CartService';
import LoginService from '../services/LoginService';
import CategoryLeft from '../components/CategoryLeft';

class Cms extends Component {

	constructor(props) {
		super(props);
		this.state = {
			cms_info: {},
			cartCount: 0,
			userData: {}
		};
		this.db = new DB();
		this.cartService = new CartService(this.db);
		this.loginService = new LoginService(this.db);
	}

	componentDidMount() {
		const { params } = this.props.match;
		this.getCmsDetails(params.id);
		this.loginService.getUserData().then((userinfo) => {
			this.setState({
				userData: userinfo,
			});
		});

		this.cartService.getCartCount().then((count) => {
			this.setState({
				cartCount: count,
			});
		});
	}

	getCmsDetails(id) {
		let loader = new Loader();
		loader.show();
		fetch(Web.BaseUrl + "api/v1/cms?page=" + id)
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						isLoaded: true,
						cms_info: result.data
					});
					loader.hide();
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

	componentDidUpdate(prevProps, prevState, snapshot) {
		let oldParams = prevProps.match.params;
		let newParams = this.props.match.params;
		if (oldParams.id !== newParams.id) {
			this.getCmsDetails(newParams.id);
		}
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

	render() {
		return (
			<div>
				{this.renderHeader()}
				<div className="container-fluid">
					<div className="row">
						<div className="col-3">
							<CategoryLeft />
						</div>
						<div className="col-9">
							<div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-justify">
								<h1 className="display-4">{this.state.cms_info.page}</h1>
								<p dangerouslySetInnerHTML={{ __html: this.state.cms_info.content }} />
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}

export default Cms;