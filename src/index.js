import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom';
import Pace from 'react-pace-progress';
import Home from './components/Home';
const Cms = React.lazy(() => import('./components/Cms'));
const Products = React.lazy(() => import('./components/Products'));
const ProductDetails = React.lazy(() => import('./components/ProductDetails'));
const Registration = React.lazy(() => import('./components/Registration'));
const Login = React.lazy(() => import('./components/Login'));
const Logout = React.lazy(() => import('./components/Logout'));
const Cart = React.lazy(() => import('./components/Cart'));
const Checkout = React.lazy(() => import('./components/Checkout'));
const OrderDetails = React.lazy(() => import('./components/OrderDetails'));
const MyAccount = React.lazy(() => import('./components/MyAccount'));
const MyAddress = React.lazy(() => import('./components/MyAddress'));
const Profile = React.lazy(() => import('./components/Profile'));
const ChangePassword = React.lazy(() => import('./components/ChangePassword'));
const ForgotPassword = React.lazy(() => import('./components/ForgotPassword'));
const Wishlist = React.lazy(() => import('./components/Wishlist'));
const Notfound = React.lazy(() => import('./components/Notfound'));
const paceColor = "#27ae60";

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
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Registration {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/home" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Home {...props}/>
              </Suspense>
            )}/>
	      <Route path="/page/:id/:title" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Cms {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/products/:type/:id/:title" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Products {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/products/:type/:id/:title" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Products {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/products/:type/:id/:title" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Products {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/product/:id/:title" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <ProductDetails {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/products/all-category" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Products {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/login" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Login {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/logout" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Logout {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/cart" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Cart {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/checkout" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Checkout {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/order-details/:id" 
          render={(props) => (
              <Suspense fallback={<Pace color="#FDD670" number={5}/>}>
                <OrderDetails {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/myaccount" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <MyAccount {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/addresses" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <MyAddress {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/profile" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Profile {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/change-password"  
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <ChangePassword />
              </Suspense>
            )}
          />
	      <Route path="/products/search" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Products {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/forgot-password" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <ForgotPassword {...props}/>
              </Suspense>
            )}
          />
	      <Route path="/wishlist" 
          render={(props) => (
              <Suspense fallback={<Pace color={paceColor} number={5}/>}>
                <Wishlist {...props}/>
              </Suspense>
            )}
        />
	      <Route component={Notfound} />
      </Switch>
    </Router>
);
ReactDOM.render(routing,document.getElementById('root'));
