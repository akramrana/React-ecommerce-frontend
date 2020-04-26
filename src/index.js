import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'

import { Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom'
import App from './App';
import Cms from './components/Cms';
import Home from './components/Home';
import Notfound from './components/Notfound';
import Products from './components/Products';
import ProductDetails from './components/ProductDetails';
import Registration from './components/Registration';
import Login from './components/Login';
import { loadLocalStorageData } from './helpers/LocalStorage';
import Logout from './components/Logout';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderDetails from './components/OrderDetails';
import MyAccount from './components/MyAccount';
import MyAddress from './components/MyAddress';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';


//window.jQuery = $;
//window.$ = $;
//global.jQuery = $;

const routing = (
	<Router>
	  <Switch>
	      <Route exact  path="/" component={Home}/>
	      <Route path="/home" component={Home} />
	      <Route path="/page/:id/:title" component={Cms} />
	      <Route path="/products/:type/:id/:title" component={Products} />
	      <Route path="/products/:type/:id/:title" component={Products} />
	      <Route path="/products/:type/:id/:title" component={Products} />
	      <Route path="/product/:id/:title" component={ProductDetails} />
	      <Route path="/products/all-category" component={Products} />
	      <Route path="/register" component={Registration} />
	      <Route path="/login" component={Login} />
	      <Route path="/logout" component={Logout} />
	      <Route path="/cart" component={Cart} />
	      <Route path="/checkout" component={Checkout} />
	      <Route path="/order-details/:id" component={OrderDetails} />
	      <Route path="/myaccount" component={MyAccount} />
	      <Route path="/addresses" component={MyAddress} />
	      <Route path="/profile" component={Profile} />
	      <Route path="/change-password" component={ChangePassword} />
	      <Route path="/products/search" component={Products} />
	      <Route component={Notfound} />
      </Switch>
    </Router>
);
ReactDOM.render(routing,document.getElementById('root'));
