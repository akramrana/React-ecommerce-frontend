import React from 'react';
import Web from '../config/Web'
import DB from '../helpers/DB';
import CommonService from '../services/CommonService';
import {Link} from "react-router-dom";

class Category extends React.Component {
	constructor(props) {
	    super(props);
	    this.db = new DB();
	    this._isMounted = false;
	    this.state = {
	    	categories:[]
	    };
	    this.commonService = new CommonService(this.db);
	}

	componentDidMount() {
		this._isMounted = true;
		this.commonService.getAllCategories().then((categories) => {
			if(categories && categories.length){
				this.setState({
			   	   categories:categories,
			    })
			}
			else{
				fetch(Web.BaseUrl+"api/v1/all-categories")
			      .then(res => res.json())
			      .then(
			        (result) => {
			          this.db.insert("settings",result.data,'allCategories');
			          this._isMounted && this.setState({
			            isLoaded: true,
			            categories: result.data
			          });
			        },
			        // Note: it's important to handle errors here
			        // instead of a catch() block so that we don't swallow
			        // exceptions from actual bugs in components.
			        (error) => {
			          this._isMounted &&  this.setState({
			            isLoaded: true,
			            error
			          });
			        }
			    )
			}
		})
	    
	 }

	componentWillUnmount(){
		this._isMounted = false;
	}

	render() {
		return(
			  <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12">
			      <div className="row">
					  {this.state.categories.map((value, index) => {
					      var name = value.name.replace(/\s+/g, '-').toLowerCase();
						  return(
						  	<div data-key={value.id} key={index} className="my-2 my-md-0 mr-md-3">
							  	<a className="dropdown-toggle" href="#" id={"dropdown"+value.id} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							  		<i className="glyphicon glyphicon-align-justify"></i> {value.name}
							  	</a>
						        <div className="dropdown-menu" aria-labelledby={"dropdown"+value.id}>
							      {value.subcategories.map((v, i) => {
							      	var subname = v.name.replace(/\s+/g, '-').toLowerCase();
							        return <Link className="dropdown-item" data-key={v.id} to={'/products/category/'+v.id+'/'+subname} key={i}>{v.name}</Link>
							      })}
						        </div>
						  	</div>
						  )
					  })}
					  
				  </div>
			  </div>
		)
	}
}
export default Category;