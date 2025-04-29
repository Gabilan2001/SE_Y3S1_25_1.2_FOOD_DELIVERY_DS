import React, { useEffect } from "react";
import { useSelector } from "react-redux"; // Use Redux's useSelector hook
import { useGlobalContext } from "../provider/GlobalProvider"; // You can still keep this for other context functions
import NoData from "../components/NoData";

const Totalorder = () => {
  const orders = useSelector((state) => state.orders.order); // Get orders from Redux
  const { fetchAllOrders } = useGlobalContext(); // Fetch all orders from context

  useEffect(() => {
    fetchAllOrders(); // Fetch orders on component mount
  }, [fetchAllOrders]);

  return (
    <div>
      <h1>Total Orders</h1>
      {orders && orders.length > 0 ? (
        <div>
          {orders.map((order, index) => (
            <div
              key={order._id + index + "order"}
              className="order rounded p-4 text-sm bg-gray-100 my-2"
            >
              {/* Order Details */}
              <p>
                <strong>Order No:</strong> {order?.orderId}
              </p>
              <p>
                <strong>Payment Status:</strong> {order?.payment_status}
              </p>
              <p>
                <strong>Total Amount:</strong> ${order?.totalAmt}
              </p>
              <p>
                <strong>Sub Total:</strong> ${order?.subTotalAmt}
              </p>

              {/* Product Details */}
              <div className="flex gap-3 mt-2 items-center">
                <img
                  src={order?.product_details?.image[0]}
                  alt={order?.product_details?.name}
                  className="w-16 h-16 rounded-md border"
                />
                <div>
                  <p className="font-medium text-lg">{order?.product_details?.name}</p>
                  <p className="text-gray-500">
                    <strong>Price:</strong> ${order?.subTotalAmt}
                  </p>
                </div>
              </div>

              {/* Delivery Address and Mobile */}
              <div className="mt-2">
                <p>
                  <strong>Delivery Address:</strong>
                  <br />
                  {[
                    order?.delivery_address?.addressLine1,
                    order?.delivery_address?.addressLine2,
                    order?.delivery_address?.city,
                    order?.delivery_address?.state,
                    order?.delivery_address?.zip,
                    order?.delivery_address?.country,
                  ]
                    .filter(Boolean) // Filter out null/undefined/empty values
                    .join(", ")}
                </p>
                <p>
                  <strong>Mobile Number:</strong> {order?.delivery_address?.mobile || "Not Provided"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default Totalorder;
