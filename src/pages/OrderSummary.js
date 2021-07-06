import CartItems from '../components/Shop/CartItems/CartItems';

const OrderSummary = _ => {
	return (
		<div className='inputPageContainer'>
			<h1>Order Summary</h1>
			<CartItems checkoutConfirmed />
		</div>
	);
};

export default OrderSummary;
