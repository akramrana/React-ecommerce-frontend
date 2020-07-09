import React, { Component } from 'react';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer.js'
import ReactPaginate from 'react-paginate';
import Loader from '../helpers/Loader'
import Web from '../config/Web'
import DB from '../helpers/DB';
import CartService from '../services/CartService';
import LoginService from '../services/LoginService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faMinus } from '@fortawesome/free-solid-svg-icons';

class Products extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	products:[],
	    	total_products:0,
	    	total_pages:1,
	    	max_product_price:0,
	    	filter:[],
	    	subcategory:[],
	    	filter_brands:[],
	    	filter_attributes:[],
	    	userData:{},
	    	cartCount:0,
	    };
	    this.db = new DB();
	    this.cartService = new CartService(this.db); 
	    this.loginService = new LoginService(this.db);

	   


	}

	componentDidMount() {
    	const {params} = this.props.match;
    	var category_id = "";
    	var shop_id = "";
    	var brand_id = "";
    	if(params.type==='category'){
    		category_id = params.id;
    	}
    	if(params.type==='brand'){
    		brand_id = params.id;
    	}
    	if(params.type==='shop'){
    		shop_id = params.id;
    	}

    	this.getProductFromServer(category_id,brand_id,shop_id,1,16,{},true);

    	this.loginService.getUserData().then((userinfo) => {
			this.setState({
		   	   userData:userinfo,
		   })
		})

		this.cartService.getCartCount().then((count) => {
			this.setState({
		   	   cartCount:count,
		   })
		});
		
	 }

	 getProductFromServer(category_id,brand_id,shop_id,page,per_page, postParam, changeFilter){
	    let loader = new Loader();
		loader.show();
	    let query = window.location.search.substring(1);
		let vars = query.split("=");
		let q = vars[1]?vars[1]:"";

	    fetch(Web.BaseUrl+"api/v1/search?q="+q+"&lang=en&category_id="+category_id+"&attribute_id=&brand_id="+brand_id+"&shop_id="+shop_id+"&collection_id=&price_range=&in_stock=&page="+page+"&per_page="+per_page+"&is_featured=&latest=&best_selling=&sort_by=1&store=BD",{
	    	method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(postParam),
	    }).then(res => res.json())
	      .then(
	        (result) => {
	          if(changeFilter){
	          	this.setState({
		            isLoaded: true,
		            products: result.data.products?result.data.products:[],
		            total_pages:result.data.total_pages?result.data.total_pages:1,
		            filter:result.data.filter?result.data.filter:[],
		            subcategory:result.data.subcategory?result.data.subcategory:[],
		            filter_brands:postParam.brands?postParam.brands:[],
		 			filter_attributes:postParam.attributes?postParam.attributes:[],
		         })
	          }else{
	          	this.setState({
		            isLoaded: true,
		            products: result.data.products?result.data.products:[],
		            total_pages:result.data.total_pages?result.data.total_pages:1,
		            subcategory:result.data.subcategory?result.data.subcategory:[],
		            filter_brands:postParam.brands?postParam.brands:[],
		 			filter_attributes:postParam.attributes?postParam.attributes:[],
		         })
	          }
	          loader.hide();
	          window.scrollTo({top: 0, behavior: 'smooth'});
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

	 renderHrefUrl(id,name){
	 	name = name.replace(/\s+/g, '-').toLowerCase();
	 	var href = '/product/'+id+'/'+name;
	 	return href;
	 }

	 handlePageClick(data){
	 	const {params} = this.props.match;
   		//console.log(params);
    	var category_id = "";
    	var shop_id = "";
    	var brand_id = "";
    	if(params.type==='category'){
    		category_id = params.id;
    	}
    	if(params.type==='brand'){
    		brand_id = params.id;
    	}
    	if(params.type==='shop'){
    		shop_id = params.id;
    	}
	 	let page_num = (data.selected+1);
	 	this.getProductFromServer(category_id,brand_id,shop_id,page_num,16,{},true);
	 }

	 handleFilterClick(data){
	 	const {params} = this.props.match;
	 	//console.log(data);
	 	let brands_id = [];
	 	let attributes_id = [];
	 	let brandFilter = document.getElementsByClassName('brand-filter');
	 	for(var i=0; i<brandFilter.length; i++){
			if(brandFilter[i].type=='checkbox' && brandFilter[i].checked==true){
				brands_id.push(brandFilter[i].value);
			}
		}
		let attFilter = document.getElementsByClassName('attribute-filter');
	 	for(var i=0; i<attFilter.length; i++){
			if(attFilter[i].type=='checkbox' && attFilter[i].checked==true){
				attributes_id.push(attFilter[i].value);
			}
		}
		let category_id = "";
    	let shop_id = "";
    	let brand_id = "";
    	if(params.type==='category'){
    		category_id = params.id;
    	}
    	if(params.type==='brand'){
    		brand_id = params.id;
    	}
    	if(params.type==='shop'){
    		shop_id = params.id;
    	}
	 	let page_num = (data.selected+1);
	 	let postParam = {
	 		attribute_id:attributes_id.join(),
	 		brand_id:brands_id.join(),
	 		attributes:attributes_id,
	 		brands:brands_id,
	 	}
		this.getProductFromServer(category_id,brand_id,shop_id,page_num,16,postParam,false);
	 }

	 resetFilter(){
	 	const {params} = this.props.match;
    	//console.log(params);
    	var category_id = "";
    	var shop_id = "";
    	var brand_id = "";
    	if(params.type==='category'){
    		category_id = params.id;
    	}
    	if(params.type==='brand'){
    		brand_id = params.id;
    	}
    	if(params.type==='shop'){
    		shop_id = params.id;
    	}

    	this.getProductFromServer(category_id,brand_id,shop_id,1,16,{},true);
	 }

	 buildPaginateHref(data){
	 	return "#";
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
		const {params} = this.props.match;
		var title = (params.title)?params.title.replace(/-/g, ' ').toUpperCase():"All Products";
		//console.log(this.state.products);
		return (
      	  <div>
	         <div id="content" className="container">
	            <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
	              <div>
	              	<h1 className="display-4">{title}</h1>
	              </div>
	              <div className="row">
	                   <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
		                  <div>
		                      <div className="filter-heading">
		                      	<h6 className="text-left">Categories </h6>
		                      </div>
		                      <div className="filter-att">
			                      <ul className="product-filters">
			                      	  {this.state.subcategory.map((value, index) => {
			                      	  	  var name = value.name.replace(/\s+/g, '-').toLowerCase();
			                      	  	  return(
			                      	  	  	 <li key={index}>
			                      	  	  	 	<a href={'/products/category/'+value.id+'/'+name}>{value.name}</a>
			                      	  	  	 </li>
			                      	  	  )
			                      	  })}
			                      </ul>
		                      </div>
	                      </div>
	                      <ul className="product-filters">
	                      		{this.state.filter.map((value, index) => {
	                      			return (
	                      				<li key={index}>
	                      					<div className="filter-heading">
		                      			 		<h6>Filter by {value.filter_name} </h6>
		                      			 	</div>
		                      			 	<div className="filter-att">
		                      			 		<div>
				                      			 	{value.filter_values.map((v, i) => {
				                      			 		let filterClassName = "";
				                      			 		if(value.input_name=='brand_id'){
				                      			 			filterClassName = "brand-filter";
				                      			 		}
				                      			 		if(value.input_name=='attribute_id'){
				                      			 			filterClassName = "attribute-filter";
				                      			 		}
			                      			 			return(
				                      			 		    <div key={i}>
				                      			 				<input onChange={this.handleFilterClick.bind(this)} className={filterClassName} type="checkbox" name={value.input_name+'[]'} value={v.id}/> {v.value}
				                      			 			</div>
				                      			 		)
				                      			 	})}
			                      			 	</div>
		                      			 	</div>
		                      			</li>
	                      			)
	                      		})}
				                <li>
				                	<a href="#" onClick={this.resetFilter.bind(this)}><b>Reset Filter</b></a>
				                </li>
	                      </ul>
	                   </div>
	                   <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12">
	                   		<div className="row">
	                   			{this.state.products.map((value, index) => {
							        return <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6" key={index}>
							                    <div className="product-image">
								                    <a href={this.renderHrefUrl(value.id,value.name)}>
								        				<img src={value.image} alt={value.name}/>
								        			</a>
							        			</div>
							        			<div className="product-details">
							        				<a href={this.renderHrefUrl(value.id,value.name)}>
							        					<div className="product-name">
							        						{value.name}
							        					</div>
							        					<div className="product-brand">
							        						{value.brand}
							        					</div>
							        					<div className="product-price">
							        						{value.currency_code} {value.final_price}
							        					</div>
							        				</a>
							        			</div>
							        	  </div>
							     })}
	                   			<div className="col-12 clearfix">
			              		    <hr/>
			              		    <div className="d-flex justify-content-center">
					              		<nav aria-label="Page navigation example">
						              		<ReactPaginate
									          previousLabel={'previous'}
									          nextLabel={'next'}
									          breakLabel={'...'}
									          breakClassName={'break-me'}
									          pageCount={this.state.total_pages}
									          marginPagesDisplayed={2}
									          pageRangeDisplayed={5}
									          onPageChange={this.handlePageClick.bind(this)}
									          containerClassName={'pagination'}
									          subContainerClassName={'pages pagination'}
									          activeClassName={'active'}
									          pageClassName={'page-item'}
									          pageLinkClassName={'page-link'}
									          previousClassName={'page-link'}
									          nextClassName={'page-link'}
									          hrefBuilder={this.buildPaginateHref}
									        />
								        </nav>
							        </div>
						        </div>
	                   		</div>
	                   </div>
	              </div>
	            </div>
	          </div>
          </div>
        )
	}
}
export default Products;