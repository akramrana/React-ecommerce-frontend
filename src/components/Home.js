import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import $ from 'jquery';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Loader from '../helpers/Loader'
import Web from '../config/Web'
import DB from '../helpers/DB';
import CartService from '../services/CartService';
import LoginService from '../services/LoginService';
import { Link } from "react-router-dom";
import CategoryLeft from '../components/CategoryLeft';


class Home extends Component {
	constructor(props) {
		super(props);

		this.db = new DB();

		this.state = {
			banners: [],
			new_arrivals: [],
			shops: [],
			slider_new_arrival: [],
			userData: {},
			cartCount: 0
		};

		this.cartService = new CartService(this.db);
		this.loginService = new LoginService(this.db);
	}

	componentDidMount() {
		const { items } = this.state;
		let loader = new Loader();
		loader.show();
		fetch(Web.BaseUrl + "api/v1/home")
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						isLoaded: true,
						banners: result.data.banners,
						new_arrivals: result.data.new_arrivals,
						shops: result.data.shops,
					});
					loader.hide();
				},
				(error) => {
					this.setState({
						isLoaded: true,
						error
					});
					loader.hide();
				}
			)



		this.loginService.getUserData().then((userinfo) => {
			this.setState({
				userData: userinfo,
			})
		})

		this.cartService.getCartCount().then((count) => {
			this.setState({
				cartCount: count,
			})
		});

	}

	renderHrefUrl(id, name, type, link_id, url) {
		var href;
		name = name.replace(/\s+/g, '-').toLowerCase();
		//console.log("came here")
		if (type == 'BR') {
			href = '/products/brand/' + link_id + '/' + name;
		}
		else if (type == 'C') {
			href = '/products/category/' + link_id + '/' + name;
		}
		else if (type == 'FP') {
			href = '/product/' + link_id + '/' + name;
		}
		else if (type == 'P') {
			href = '/product/' + link_id + '/' + name;
		}
		else if (type == 'L') {
			href = url
		}
		return href;
	}

	cleanUrl(name) {
		return name.replace(/\s+/g, '-').toLowerCase();
	}

	renderNewArrivalSlider() {
		//console.log(this.state.new_arrivals);
		if (this.state.new_arrivals.length) {
			return (
				<div className="row">
					<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
						<h1 style={{ width: '100%' }}>New Arrival</h1>
						<OwlCarousel className="owl-theme" margin={5} loop autoplay={true} items={5}>
							{this.state.new_arrivals.map((v, i) => {
								return <div className="item" key={i}>
									<div>
										<Link to={'/product/' + v.id + '/' + this.cleanUrl(v.name)}>
											<img className="img-fluid" src={v.image} alt={v.name} />
										</Link>
									</div>
								</div>
							})}
						</OwlCarousel>
					</div>
				</div>
			)
		}
	}

	renderShopSlider() {
		if (this.state.shops.length) {
			return (
				<div className="row">
					<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
						<h1 style={{ width: '100%' }}>Shops</h1>
						<OwlCarousel className="owl-theme" margin={5} loop autoplay={true} items={6}>
							{this.state.shops.map((value, index) => {
								return <div className="item" key={index}>
									<div className="">
										<Link to={'/products/shop/' + value.id + '/' + this.cleanUrl(value.title)}>
											<img className="img-fluid" src={value.logo} alt={value.title} />
										</Link>
									</div>
								</div>
							})}
						</OwlCarousel>
					</div>
				</div>
			)
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
				<div id="content" className="container-fluid">
				    <div className="row">
				         <div className="col-3">
				            <CategoryLeft />
				         </div>
				         <div className="col-9">
					         <div className="row">
								{this.state.banners.map((value, index) => {
									return <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12" key={index}>
										<h3>{value.name}</h3>
										<Link to={this.renderHrefUrl(value.id, value.name, value.link_type, value.link_id, value.url)}>
											<img className="img-fluid" src={value.image} alt={value.name} />
										</Link>
									</div>
								})}
							</div>

							{this.renderNewArrivalSlider()}

							{this.renderShopSlider()}
				         </div>
				    </div>
				</div>
				<Footer />;
			</div>
		)
	}
}

export default Home;