// components/AdminOrderPage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllAdminOrders } from '../store/adminOrderSlice';  // Redux action to fetch orders
import NoData from './NoData';  // Component for displaying when there are no orders

const AdminOrderPage = () => {
    const dispatch = useDispatch();
    const orders = useSelector(state => state.adminOrders.orders);
    const status = useSelector(state => state.adminOrders.status);
    const error = useSelector(state => state.adminOrders.error);

    // Fetch orders on page load
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllAdminOrders());
        }
    }, [dispatch, status]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <div>
            <div className='bg-white shadow-md p-3 font-semibold'>
                <h1>All Orders (Admin)</h1>
            </div>
            {orders.length === 0 ? (
                <NoData />
            ) : (
                orders.map((order, index) => (
                    <div key={order._id + index + "order"} className='order rounded p-4 text-sm'>
                        <p>Order No: {order?.orderId}</p>
                        <div className='flex gap-3'>
                            <img
                                src={order.product_details?.image?.[0] || 'default_image_path.jpg'}
                                alt={order.product_details?.name || "Product Image"}
                                className='w-14 h-14'
                            />
                            <p className='font-medium'>{order.product_details?.name || "Product Name"}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminOrderPage;
