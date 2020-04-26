import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import DB from '../helpers/DB';

class Logout extends Component {

	constructor(props) {
		super(props);
		this.state = {
  			toHome:false,
		}
		this.db = new DB();
	}

	componentDidMount(){
		this.db.delete('settings','userData');
		this.db.delete('settings','cartData');
		this.db.delete('settings','orderId');
		//
		this.setState({
		    toHome:true
		})
	}

	render(){
		if (this.state.toHome === true) {
	      return <Redirect to='/' />
	    }
	    return (
	    	<div></div>
	    );
	}

}
export default Logout;