import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Loader from './components/UI/Loader/Loader';

import Home from './pages/Home';
import Shop from './pages/Shop';
import CreateYours from './pages/CreateYours';
import About from './pages/About';
import Contact from './pages/Contact';
import DeliveryAndReturns from './pages/Legal/DeliveryAndReturns';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsAndConditions from './pages/Legal/TermsAndConditions';
import LegalAdvice from './pages/Legal/LegalAdvice';
import Page404 from './pages/404';
import SingleProduct from './components/Shop/Single/SingleProduct';
import AuthPage from './pages/AuthPage';
import UserAccountPage from './pages/UserAccountPage';

import { setProductsAction } from './store/products/products-actions';

const App = _ => {
	const authStore = useSelector(state => state.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setProductsAction());
	}, [dispatch]);

	const routerSettings = (
		<Switch>
			<Route path='/' exact>
				<Home />
			</Route>
			<Route path='/shop' exact>
				<Shop />
			</Route>
			<Route path='/shop/:category' exact>
				{/* TODO: add component for the category */}
				<div>Category Listing</div>
			</Route>
			<Route path='/shop/:category/:id' exact>
				<SingleProduct />
			</Route>
			<Route path='/create-yours' exact>
				<CreateYours />
			</Route>
			<Route path='/user-account' exact>
				<UserAccountPage />
			</Route>
			<Route path='/auth' exact>
				{!!authStore.token ? <Redirect to='/user-account' /> : <AuthPage />}
			</Route>
			<Route path='/orders' exact>
				{/* TODO: Add orders page */}
				{!!authStore.token ? 'Orders page' : <Redirect to='/auth' />}
			</Route>
			<Route path='/about' exact>
				<About />
			</Route>
			<Route path='/contact' exact>
				<Contact />
			</Route>
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
	);

	return (
		<Layout>
			<Loader />
			{routerSettings}
		</Layout>
	);
};

export default App;
