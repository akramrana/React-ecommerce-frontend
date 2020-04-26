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


class Home extends Component {
	constructor(props) {
	    super(props);

	    this.db = new DB();

	    this.state = {
	    	banners:[],
	    	new_arrivals:[],
	    	shops:[],
	    	slider_new_arrival:[],
	    	userData:{},
	    	cartCount:0
	    };

	    this.cartService = new CartService(this.db); 
	    this.loginService = new LoginService(this.db);
	}

	componentDidMount() {
		const {items} = this.state;
		let loader = new Loader();
		loader.show();
		fetch(Web.BaseUrl+"api/v1/home")
	      .then(res => res.json())
	      .then(
	        (result) => {
	          this.setState({
	            isLoaded: true,
	            banners: result.data.banners,
	            new_arrivals:result.data.new_arrivals,
	            shops:result.data.shops,
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
		   	   userData:userinfo,
		   })
		})

		this.cartService.getCartCount().then((count) => {
			this.setState({
		   	   cartCount:count,
		   })
		});
		
	}

	renderHrefUrl(id,name,type,link_id,url){
		var href;
		name = name.replace(/\s+/g, '-').toLowerCase();
	    //console.log("came here")
	    if(type=='BR'){
	    	href = '/products/brand/'+link_id+'/'+name;
	    }
	    else if(type=='C'){
	    	href = '/products/category/'+link_id+'/'+name;
	    }
	    else if(type=='FP'){
	    	href = '/product/'+link_id+'/'+name;
	    }
	    else if(type=='P'){
	    	href = '/product/'+link_id+'/'+name;
	    }
	    else if(type=='L'){
	    	href = url
	    }
	    return href;
	}

	cleanUrl(name){
		return name.replace(/\s+/g, '-').toLowerCase();
	}

	renderNewArrivalSlider(){
		//console.log(this.state.new_arrivals);
		if(this.state.new_arrivals.length){
			return (
				<OwlCarousel className="owl-theme" margin={5} loop autoplay={true}>
					{this.state.new_arrivals.map((v, i) => {
						return <div className="item" key={i}>
								    <div>
					                    <a href={'/product/'+v.id+'/'+this.cleanUrl(v.name)}>
					        				<img className="img-fluid" src={v.image} alt={v.name}/>
					        			</a>
					        	    </div>
								</div>
				    })}
				</OwlCarousel>
			)
		}
	}

	renderShopSlider(){
		if(this.state.shops.length){
			return (
				<OwlCarousel className="owl-theme" margin={5} loop autoplay={true}>
					{this.state.shops.map((value, index) => {
					        return <div className="item" key={index}>
					        			<div className="">
						                    <a href={'/products/shop/'+value.id+'/'+this.cleanUrl(value.title)}>
						        				<img className="img-fluid" src={value.logo} alt={value.title}/>
						        			</a>
					        	  		</div>
					        	  </div>
					     })}
				</OwlCarousel>
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
	            <div className="row">
		            {this.state.banners.map((value, index) => {
				        return <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12" key={index}>
				                    <h3 className="text-uppercase">{value.name}</h3>
				        			<a href={this.renderHrefUrl(value.id,value.name,value.link_type,value.link_id,value.url)}>
				        				<img className="img-fluid" src={value.image} alt={value.name}/>
				        		    </a>
				        	  </div>
				     })}
			    </div>
			    <hr/>
			    <div className="row">
			    	<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
			        	<h1 style={{width: '100%'}}>NEW ARRIVAL</h1>
			        	 {this.renderNewArrivalSlider()}
			        </div>
			    </div>
			    <hr/>
			    <div className="row">
			    	<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
				    	<h1 style={{width: '100%'}}>SHOPS</h1>
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