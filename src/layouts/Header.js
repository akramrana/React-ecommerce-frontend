import React from 'react';
import Category from '../components/Categories';
import Autosuggest from 'react-autosuggest';
import Web from '../config/Web'

const getSuggestionValue = (suggestion) => suggestion.name
const renderSuggestion = (suggestion) => (<span>{suggestion.name}</span>)

class Header extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
			value: '', 
			suggestions: [] 
		}
	}

	onChange = (event, { newValue, method }) => {
	    this.setState({ 
	    	value: newValue 
	    });
	}
  
	onSuggestionsFetchRequested = ({ value }) => {
	    fetch(`${Web.BaseUrl}api/v1/suggestions?lang=en&q=${value}&store=KW`)
	      .then(response => response.json())
	      .then(
	     		(result) => {
	     			//console.log(result);
	     			if(result.status==200){
	     				this.setState({ 
	     					suggestions: result.data 
	     				})
	     			}
	     		}
	      )
	}

	onSuggestionsClearRequested = () => {
	    this.setState({ 
	    	suggestions:[]
	    });
	}

	renderSectionTitle(section) {
	  return null;
	}

	getSectionItems(section){
		return null;
	}

	headerMenu(){
		if(this.props.userinfo && this.props.userinfo.id){
			return (
				<div>
					    <span>
							<a className="text-light" href="/myaccount">My Account</a> &nbsp;
						</span>
						<span>
							<a className="text-light"  href="/logout" ><i className="glyphicon glyphicon-log-out"></i> Logout</a>
						</span>
				</div>
			)
		}else{
			return (
				<div>
					<div>
						<a className="text-light" href="/login">Login</a> &nbsp;
						<a className="text-light" href="/register">Sign up</a>
					</div>
				</div>
			)
		}
	}

	render() {
		const { value, suggestions } = this.state;
	    const inputProps = {
	      placeholder: "Search Dressly Store",
	      value,
	      onChange: this.onChange,
	      className: "form-control pull pull-right",
	      name:"q"
	    };

	    let searchUrl = window.location.origin+"/products/search";

	    //console.log(searchUrl);


		return(
			<div className="container-fluid">
				<div className="d-flex flex-column flex-md-row  p-3 px-md-4 mb-3 bg-success">
					 <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12">
					     <div>
							 <h5 className="my-0 mr-md-auto font-weight-normal">
							 	<a href="/" className="text-light">Dressly</a>
							  </h5>
						  </div>
					  </div>
					  <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12">
					     <div>
					     	<form className="row" action={searchUrl} method="GET">
					     		<div className="col-12 col-sm pr-sm-0">
							     	<Autosuggest 
								        suggestions={suggestions}
								        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
								        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
								        getSuggestionValue={getSuggestionValue}
								        renderSuggestion={renderSuggestion}
								        highlightFirstSuggestion={true}
								        renderSectionTitle={this.renderSectionTitle}
								        getSectionSuggestions={this.getSectionItems}
								        inputProps={inputProps} />
							    </div>
							    <div className="col-12 col-sm-auto pl-sm-0">
							    	<input className="btn btn-info" type="submit" value="Search" />
							    </div>
						    </form>
					     </div>
					  </div>
					  <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12">
					      <div className="float-right">
						  	  {this.headerMenu()}
					  	  </div>
					  </div>
				</div>
				<div className="d-flex flex-column flex-md-row  p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
				  <Category />
				  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
				      <div className="row float-right">
						  <div className="my-2 my-md-0 mr-md-3">
						      <a href="/cart">
						      	<img width="24" src="/images/_ionicons_svg_md-cart.svg" alt="cart"/> 
						      	<span className="cart-badge badge badge-dark">
						      		{this.props.cartCount}
						      	</span>
						      </a>
						  </div>
					  </div>
				  </div>
				</div>
			</div>
		)
	}
}

export default Header;