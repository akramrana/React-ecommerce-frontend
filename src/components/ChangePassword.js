import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import Loader from '../helpers/Loader'
import Web from '../config/Web'
import DB from '../helpers/DB';
import LoginService from '../services/LoginService';
import swal from 'sweetalert';
import CartService from '../services/CartService';
import UserLeftMenu from './UserLeftMenu';

class ChangePassword extends Component {

	_isMounted = false;

	constructor(props) {
	    super(props);
	    this.state = {
	    	userData:{},
	    	old_password:"",
	    	new_password:"",
	    	confirm_password:"",
	    	errors: {},
	    	cartCount:0
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
			
			}
			
		})

		this.cartService.getCartCount().then((count) => {
			this.setState({
		   	   cartCount:count,
		   })
		});
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

	componentWillUnmount() {
		this._isMounted = false;
	}

	handleValidation(){
		let errors = {};
        let formIsValid = true;
        if(!this.state.old_password){
           formIsValid = false;
           errors["old_password"] = "Old password cannot be blank";
        }
        if(!this.state.new_password){
           formIsValid = false;
           errors["new_password"] = "New password cannot be blank";
        }
        if(!this.state.confirm_password){
           formIsValid = false;
           errors["confirm_password"] = "Confirm password cannot be blank";
        }
        if(this.state.new_password != "" && this.state.confirm_password!=""){
        	if(this.state.new_password!=this.state.confirm_password){
        		formIsValid = false;
           		errors["confirm_password"] = "Confirm password does not match with new password.";
        	}
        }

        this.setState({errors: errors});
       	return formIsValid;
	}

	handleFormSubmit(event){
		event.preventDefault();
		if(this.handleValidation()){
			let loader = new Loader();
		    loader.show();

			let formData = {
	  			user_id:this.state.userData.id,
			  	old_password: this.state.old_password,
			    new_password: this.state.new_password,
			    confirm_password:this.state.confirm_password,
			};
			
			fetch(Web.BaseUrl+"api/v1/edit-profile",{
			  	  method: 'POST',
				  headers: { 'Content-Type': 'application/json' },
				  body: JSON.stringify(formData),
		    }).then(res => res.json())
		      .then(
		        (result) => {
		        	loader.hide();
		        	if(result.status==200){
		        		this.showSuccessAlert("","Password successfully updated!", "success");
		        	}else{
		        		this.showSuccessAlert("",result.message, "warning");
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
				<div id="content" className="container">
		            <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
		              <div className="pb-5">
		              	<h1 className="display-4">Change Password</h1>
		              </div>
		              <div className="row">
					  	  <UserLeftMenu/>
		              	  <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12 text-left">
		              	  	   <form action="#">
		              	  	   		<div className="row">
				              	  	   <div className="col">
				              	  	   	    <label>Old Password</label>
				              	  	   </div>
				              	  	   <div className="col">
				              	  	   		<input onChange={e => this.setState({ old_password: e.target.value })} defaultValue={this.state.old_password} className="form-control" type="password" id="old_password" name="old_password" placeholder="Old Password"/>
				              	  	        <div className="text-danger">{this.state.errors.old_password}</div>
				              	  	   </div>
			              	  	   </div>
			              	  	   <div className="row mt-3">
				              	  	   <div className="col">
				              	  	   	    <label>New Password</label>
				              	  	   </div>
				              	  	   <div className="col">
				              	  	   		<input onChange={e => this.setState({ new_password: e.target.value })} defaultValue={this.state.new_password} className="form-control" type="password" id="new_password" name="new_password" placeholder="New Password"/>
				              	  	        <div className="text-danger">{this.state.errors.new_password}</div>
				              	  	   </div>
			              	  	   </div>
			              	  	   <div className="row mt-3">
				              	  	   <div className="col">
				              	  	   	    <label>Confirm New Password</label>
				              	  	   </div>
				              	  	   <div className="col">
				              	  	   		<input onChange={e => this.setState({ confirm_password: e.target.value })} defaultValue={this.state.confirm_password} className="form-control" type="password" id="confirm_password" name="confirm_password" placeholder="Confirm Password"/>
				              	  	        <div className="text-danger">{this.state.errors.confirm_password}</div>
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
				<Footer />
			</div>
		)
	}
}

export default ChangePassword;
