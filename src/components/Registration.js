import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import DB from '../helpers/DB';
import CartService from '../services/CartService';
import LoginService from '../services/LoginService';
import Loader from '../helpers/Loader';
import swal from 'sweetalert';
import Web from '../config/Web';
import CategoryLeft from '../components/CategoryLeft';

class Registration extends Component {
	constructor(props) {
		super(props);
		this.state = {
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			phone: '',
			mailSent: false,
			error: null,
			newsletter_subscribed: 1,
			errors: {},
			success: ''
		}
		this.db = new DB();
		this.cartService = new CartService(this.db);
		this.loginService = new LoginService(this.db);
	}

	componentDidMount() {

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

	handleValidation() {
		let errors = {};
		let formIsValid = true;

		if (!this.state.first_name) {
			formIsValid = false;
			errors["first_name"] = "First Name cannot be blank";
		}

		if (this.state.first_name != "") {
			if (!this.state.first_name.match(/^[a-zA-Z]+$/)) {
				formIsValid = false;
				errors["first_name"] = "First Name should be letters only";
			}
		}

		if (this.state.last_name != "") {
			if (!this.state.last_name.match(/^[a-zA-Z]+$/)) {
				formIsValid = false;
				errors["last_name"] = "Last Name should be letters only";
			}
		}

		if (!this.state.email) {
			formIsValid = false;
			errors["email"] = "E-mail cannot be blank";
		}

		if (this.state.email != "") {
			if (!this.state.email.match(/^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/)) {
				formIsValid = false;
				errors["email"] = "Email is not a valid email address.";
			}
		}

		if (!this.state.phone) {
			formIsValid = false;
			errors["phone"] = "Phone cannot be blank";
		}
		if (this.state.phone != "") {
			if (!this.state.phone.match(/^[0-9-+]+$/)) {
				formIsValid = false;
				errors["phone"] = "Your phone can only contain numeric characters with +/-";
			}
		}

		if (!this.state.password) {
			formIsValid = false;
			errors["password"] = "Password cannot be blank";
		}

		//console.log(errors);

		this.setState({ errors: errors });
		return formIsValid;
	}

	handleFormSubmit(event) {
		event.preventDefault();
		if (this.handleValidation()) {
			//console.log(this.state);
			let loader = new Loader();
			loader.show();

			let formData = {
				first_name: this.state.first_name,
				last_name: this.state.last_name,
				email: this.state.email,
				password: this.state.password,
				phone: this.state.phone,
				newsletter_subscribed: 1,
			}
			fetch(Web.BaseUrl + "api/v1/register", {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			}).then(res => res.json())
				.then(
					(result) => {
						loader.hide();
						//console.log(result);
						let serverErrors = {};
						if (result.status == 406) {
							serverErrors["email"] = result.message;
							this.setState({
								errors: serverErrors
							});
						}
						if (result.status == 200) {
							this.showSuccessAlert("", result.message, "success");
							this.setState({
								first_name: '',
								last_name: '',
								email: '',
								password: '',
								phone: '',
							})
						}
					},
					// Note: it's important to handle errors here
					// instead of a catch() block so that we don't swallow
					// exceptions from actual bugs in components.
					(error) => {
						loader.hide();
						this.setState({
							isLoaded: true,
							error
						});
					}
				)
		}
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

	render() {
		return (
			<div>
				<Header cartCount={this.state.cartCount} />
				<div id="content" className="container-fluid">
					<div className="row">
						<div className="col-3">
							<CategoryLeft />
						</div>
						<div className="col-9">
							<div className="pricing-header px-3 py-3 pb-md-4 mx-auto text-center">
								<h1 className="display-4">Registration</h1>
							</div>

							<form action="#">
								<div className="row form-group">
									<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
										<input className="form-control" type="text" id="firstname" name="firstname" placeholder="First Name"
											value={this.state.firstname}
											onChange={e => this.setState({ first_name: e.target.value })}
										/>
										<div className="text-danger">{this.state.errors.first_name}</div>
									</div>

									<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
										<input className="form-control" type=" text" id="last_name" name="lastname" placeholder="Last Name"
											value={this.state.last_name}
											onChange={e => this.setState({ last_name: e.target.value })}
										/>
										<div className="text-danger">{this.state.errors.last_name}</div>
									</div>
								</div>
								<div className="row form-group">
									<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
										<input className="form-control" type="email" id="email" name="email" placeholder="E-mail"
											value={this.state.email}
											onChange={e => this.setState({ email: e.target.value })}
										/>
										<div className="text-danger">{this.state.errors.email}</div>
									</div>


									<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
										<input className="form-control" type="password" id="password" name="password" placeholder="Password"
											value={this.state.password}
											onChange={e => this.setState({ password: e.target.value })}
										/>
										<div className="text-danger">{this.state.errors.password}</div>
									</div>
								</div>

								<div className="row form-group">
									<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
										<input className="form-control" type="phone" id="phone" name="phone" placeholder="Phone Number"
											value={this.state.phone}
											onChange={e => this.setState({ phone: e.target.value })}
										/>
										<div className="text-danger">{this.state.errors.phone}</div>
									</div>
								</div>

								<input className="btn btn-info mb-3" type="submit" onClick={e => this.handleFormSubmit(e)} value="Submit" />
							</form>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}
export default Registration;