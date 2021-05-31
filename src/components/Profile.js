import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import Loader from '../helpers/Loader'
import Web from '../config/Web'
import DB from '../helpers/DB';
import LoginService from '../services/LoginService';
import swal from 'sweetalert';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import CartService from '../services/CartService';
import UserLeftMenu from './UserLeftMenu';
import CategoryLeft from '../components/CategoryLeft';

class Profile extends Component {

	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			userData: {},
			userAddress: [],
			first_name: "",
			last_name: "",
			gender: "",
			dob: "",
			phone: "",
			image: "",
			userImage: "",
			startDate: new Date(),
			errors: {},
			cartCount: 0
		}
		this.db = new DB();
		this.loginService = new LoginService(this.db);
		this.cartService = new CartService(this.db);
	}

	handleChange = date => {
		this.setState({
			dob: date
		});
	}

	handleUpload = e => {
		let loader = new Loader();
		loader.show();
		const files = Array.from(e.target.files)
		const formData = new FormData()
		files.forEach((file, i) => {
			formData.append(i, file)
		})

		fetch(Web.BaseUrl + 'api/v1/upload', {
			method: 'POST',
			body: formData
		})
			.then(res => res.json())
			.then(images => {
				//console.log(images);
				loader.hide();
				this.setState({
					uploading: false,
					userImage: images.data.location,
					image: images.data.name
				},
					(error) => {
						loader.hide();
					})
			})

	}

	componentDidMount() {

		this._isMounted = true;

		this.loginService.getUserData().then((userinfo) => {
			if (this._isMounted) {
				this.setState({
					userData: userinfo,
					userImage: userinfo.image,
					first_name: userinfo.first_name,
					last_name: userinfo.last_name,
					phone: userinfo.phone,
					gender: userinfo.gender,
					dob: userinfo.dob,
				})
				if (Object.keys(userinfo).length === 0) {
					this.props.history.push('/');
				}
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

		this.setState({ errors: errors });
		return formIsValid;
	}

	handleFormSubmit(event) {
		event.preventDefault();
		if (this.handleValidation()) {
			let loader = new Loader();
			loader.show();
			let formData = {
				user_id: this.state.userData.id,
				first_name: this.state.first_name,
				last_name: this.state.last_name,
				phone: this.state.phone,
				dob: this.state.dob,
				gender: this.state.gender,
				image: this.state.image
			}
			fetch(Web.BaseUrl + "api/v1/edit-profile", {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			}).then(res => res.json())
				.then(
					(result) => {
						loader.hide();
						if (result.status == 200) {
							this.showSuccessAlert("", "Profile successfully updated!", "success");
							let userData = {
								id: result.data.id,
								first_name: result.data.first_name,
								last_name: result.data.last_name,
								gender: result.data.gender,
								dob: result.data.dob,
								phone: result.data.phone,
								email: result.data.email,
								image: result.data.image,
								create_date: result.data.create_date
							};

							try {
								this.db.insert("settings", userData, 'userData');
							} catch (err) {
								console.log(err)
							}
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

	change(e) {
		this.setState({ gender: e.target.value });
	}

	render() {
		//console.log(this.state.userData.gender);
		var date = (this.state.dob) ? moment.utc(this.state.dob).local().toDate() : null;

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
									<h1 className="display-4">Update Profile</h1>
								</div>
								<div className="row">
									<UserLeftMenu />
									<div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12 text-left">
										<form action="#">
											<div className="row">
												<div className="col">
													<label>First Name</label>
												</div>
												<div className="col">
													<input onChange={e => this.setState({ first_name: e.target.value })} defaultValue={this.state.userData.first_name} className="form-control" type="text" id="first_name" name="first_name" placeholder="First Name" />
													<div className="text-danger">{this.state.errors.first_name}</div>
												</div>
											</div>
											<div className="row mt-3">
												<div className="col">
													<label>Last Name</label>
												</div>
												<div className="col">
													<input onChange={e => this.setState({ last_name: e.target.value })} defaultValue={this.state.userData.last_name} className="form-control" type="text" id="last_name" name="last_name" placeholder="Last Name" />
													<div className="text-danger">{this.state.errors.last_name}</div>
												</div>
											</div>
											<div className="row mt-3">
												<div className="col">
													<label>Gender</label>
												</div>
												<div className="col">
													<select defaultValue={this.state.userData.gender} value={this.state.gender} onChange={this.change.bind(this)} className="form-control" id="gender" name="gender">
														<option value="">Please Select</option>
														<option value="M">Male</option>
														<option value="F">Female</option>
													</select>
												</div>
											</div>
											<div className="row mt-3">
												<div className="col">
													<label>Phone</label>
												</div>
												<div className="col">
													<input onChange={e => this.setState({ phone: e.target.value })} defaultValue={this.state.userData.phone} className="form-control" type="tel" id="phone" name="phone" placeholder="Phone" />
													<div className="text-danger">{this.state.errors.phone}</div>
												</div>
											</div>
											<div className="row mt-3">
												<div className="col">
													<label>DOB</label>
												</div>
												<div className="col">
													<DatePicker showMonthDropdown showYearDropdown dropdownMode="select" dateFormat="yyyy-MM-dd" selected={date} onChange={this.handleChange.bind(this)} className="form-control" />
												</div>
											</div>
											<div className="row mt-3">
												<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12"></div>
												<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
													<input className="btn btn-info mb-3" type="submit" onClick={e => this.handleFormSubmit(e)} value="Submit" />
												</div>
											</div>
										</form>
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

export default Profile;