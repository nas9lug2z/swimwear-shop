import React, { Suspense } from 'react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import Layout from './components/Layout/Layout';
import Loader from './components/UI/Loader/Loader';
import Notification from './components/UI/Notification/Notification';

import { setProductsAction } from './store/products/products-actions';
import { authActions } from './store/auth/authSlice';
import { autoLogoutAction } from './store/auth/auth-actions';
import { cartActions } from './store/cart/cartSlice';

const Home = React.lazy(() => import('./pages/Home'));
const Shop = React.lazy(() => import('./pages/Shop'));
const SingleProduct = React.lazy(() =>
	import('./components/Shop/Single/SingleProduct')
);
const Orders = React.lazy(() => import('./pages/Orders'));
const Page404 = React.lazy(() => import('./pages/404'));
const DeliveryAndReturns = React.lazy(() =>
	import('./pages/Legal/DeliveryAndReturns')
);
const PrivacyPolicy = React.lazy(() => import('./pages/Legal/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() =>
	import('./pages/Legal/TermsAndConditions')
);
const LegalAdvice = React.lazy(() => import('./pages/Legal/LegalAdvice'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const UserAccountPage = React.lazy(() => import('./pages/UserAccountPage'));
const OrderSummary = React.lazy(() => import('./pages/OrderSummary'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const PaymentPage = React.lazy(() => import('./pages/PaymentPage'));

const promise = loadStripe(
	'pk_test_51JAK0OJVwUyiicVaFrZinQmk4ZV5PUiYqyEZWAy9L3Lp3LjM9sq4uXrwvrcfZqMs0gn04Z8PUWwVOKS3Qm6y6ME700tWvfnhdC'
);

const App = () => {
	const authStore = useSelector(state => state.auth);
	const cartStore = useSelector(state => state.cart);
	const checkoutStore = useSelector(state => state.checkout);
	const notificationStore = useSelector(state => state.notification);
	const dispatch = useDispatch();
	//set products and check if user is logged in
	useEffect(() => {
		dispatch(setProductsAction());
		dispatch(authActions.checkAuth());
	}, [dispatch]);

	useEffect(() => {
		if (!!authStore.token) {
			dispatch(autoLogoutAction());
		}
	}, [dispatch, authStore.token]);

	//retrieve cart from the local storage
	useEffect(() => {
		if (localStorage.getItem('cart')) {
			dispatch(
				cartActions.setCart({
					localCart: JSON.parse(localStorage.getItem('cart')),
				})
			);
		}
	}, [dispatch]);

	//update cart in the local storage everytime we change it
	useEffect(() => {
		if (cartStore.length > 0) {
			localStorage.setItem('cart', JSON.stringify(cartStore));
		} else if (cartStore.length === 0) {
			localStorage.removeItem('cart');
		}
	}, [cartStore]);

	useEffect(() => {}, []);

	return (
		<Layout>
			<Loader />
			<Suspense fallback={<Loader />}>
				<Switch>
					<Route path='/' exact>
						<Home />
					</Route>
					<Route path='/shop' exact>
						<Shop />
					</Route>
					<Route path='/shop/:category/:id' exact>
						<SingleProduct />
					</Route>
					{!!authStore.token && (
						<Route path='/user-account' exact>
							<UserAccountPage />
						</Route>
					)}
					{!authStore.token && (
						<Route path='/auth' exact>
							<AuthPage />
						</Route>
					)}
					{authStore.token && (
						<Route path='/orders' exact>
							<Orders />
						</Route>
					)}
					{!!authStore.token && checkoutStore.checkoutStarted && (
						<Route path='/order-summary' exact>
							<OrderSummary />
						</Route>
					)}
					{!!authStore.token && checkoutStore.checkoutStarted && (
						<Route path='/checkout' exact>
							<Checkout />
						</Route>
					)}
					{!!authStore.token && checkoutStore.checkoutStarted && (
						<Route path='/payment' exact>
							<Elements stripe={promise}>
								<PaymentPage />
							</Elements>
						</Route>
					)}
					<Route path='/delivery-and-returns' exact>
						<DeliveryAndReturns />
					</Route>
					<Route path='/privacy-policy' exact>
						<PrivacyPolicy />
					</Route>
					<Route path='/terms-and-conditions' exact>
						<TermsAndConditions />
					</Route>
					<Route path='/legal-advice' exact>
						<LegalAdvice />
					</Route>
					<Route path='*'>
						<Page404 />
					</Route>
				</Switch>
			</Suspense>
			{notificationStore.show && <Notification />}
		</Layout>
	);
};

export default App;
