import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { lazy, Suspense } from 'react';
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
import ForgotPassword from './components/ForgotPassword';
import Wishlist from './components/Wishlist';
import Header from './layouts/Header'
import Footer from './layouts/Footer.js'

//window.jQuery = $;
//window.$ = $;
//global.jQuery = $;

const routing = (
	<Router>
	  <Switch>
	      <Route exact  path="/" component={Home}/>
          <Route
            path="/register"
            render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Registration {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/home" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Home {...props}/>
              </Suspense>
            )}/>
	      <Route path="/page/:id/:title" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Cms {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/products/:type/:id/:title" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Products {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/products/:type/:id/:title" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Products {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/products/:type/:id/:title" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Products {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/product/:id/:title" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <ProductDetails {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/products/all-category" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Products {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/login" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Login {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/logout" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Logout {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/cart" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Cart {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/checkout" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Checkout {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/order-details/:id" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <OrderDetails {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/myaccount" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <MyAccount {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/addresses" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <MyAddress {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/profile" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Profile {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/change-password"  
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <ChangePassword />
              </Suspense>
            )}
          />
	      <Route path="/products/search" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Products {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/forgot-password" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <ForgotPassword {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/wishlist" 
          render={(props) => (
              <Suspense fallback={<h1>Loading....</h1>}>
                <Wishlist {...props}/>
              </Suspense>
            )}
        />
	      <Route component={Notfound} />
      </Switch>
    </Router>
);
ReactDOM.render(routing,document.getElementById('root'));
