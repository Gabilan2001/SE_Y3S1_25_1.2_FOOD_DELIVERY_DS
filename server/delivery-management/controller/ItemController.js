import Order from "../models/ItemSchema.js";


// export const createOrder = async (req, res) => {
//   try {
//     const {
//       customerId,
//       customerName,
//       phoneNumber,
//       email,
//       deliveryAddress,
//       deliveryType,
//       paymentMethod,
//       items,
//       totalPrice,
//       estimatedDeliveryTime,
//       latitude,
//       longitude
//     } = req.body;
    
//     if (!customerName || !phoneNumber || !email || !deliveryAddress || !deliveryType || !paymentMethod || !items || !totalPrice) {
//       return res.status(400).json({ message: 'Please provide all required fields' });
//     }
    
//     const newOrder = new Order({
//       customerId,
//       customerName,
//       phoneNumber,
//       email,
//       deliveryAddress,
//       deliveryType,
//       paymentMethod,
//       items,
//       totalPrice,
//       estimatedDeliveryTime,
//       location: {
//         latitude,
//         longitude
//       }
//     });
    
//     const savedOrder = await newOrder.save();
    

//     res.status(201).json({
//       message: "Order created successfully",
//       order: savedOrder
//     });
//   } catch (error) {
//     console.error("❌ Error creating order:", error.message);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

export const createOrder = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      phoneNumber,
      email,
      deliveryAddress,
      deliveryType,
      paymentMethod,
      items,
      totalPrice,
      estimatedDeliveryTime,
      location
    } = req.body;
    
    
    if (!customerName || !phoneNumber || !email || !deliveryAddress || !deliveryType || !paymentMethod || !items || !totalPrice) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const newOrder = new Order({
      customerId,
      customerName,
      phoneNumber,
      email,
      deliveryAddress,
      deliveryType,
      paymentMethod,
      items,
      totalPrice,
      estimatedDeliveryTime,
      location
    });
    
    
    const savedOrder = await newOrder.save();
    

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder
    });
  } catch (error) {
    console.error("❌ Error creating order:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};





export const getAllOrders = async(req,res) =>{
    try {
        const orders = await Order.find()
        .sort({createdAt: -1})

        if(orders.length === 0){
            return res.status(404).json({ message: 'No orders found.' });
        }

        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
}



// export const updateOrderStatus = async (req, res) => {
//     const { id } = req.params;
//     const { status } = req.body;
  
//     const validStatuses = ['processing', 'accepted', 'in_progress', 'delivered', 'canceled'];
  
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ error: 'Invalid status value' });
//     }
  
//     try {
//       const order = await Order.findByIdAndUpdate(
//         id,
//         { status },
//         { new: true } // return the updated document
//       );
  
//       if (!order) {
//         return res.status(404).json({ error: 'Order not found' });
//       }
  
//       res.status(200).json({ message: 'Order status updated successfully', order });
//     } catch (error) {
//       res.status(500).json({ error: 'Server error', details: error.message });
//     }
//   };


// Controller to accept an order
export const acceptOrder = async (req, res) => {
    try {
      const orderId = req.params.id;
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: "accepted" },
        { new: true }
      );
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error accepting order:", error);
      res.status(500).json({ message: "Error accepting order" });
    }
  };


  export const rejectOrder = async (req, res) => {
    try {
      const orderId = req.params.id;
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: "rejected" },
        { new: true }
      );
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error rejecting order:", error);
      res.status(500).json({ message: "Error rejecting order" });
    }
  };

  // Mark order as delivered
export const markOrderAsDelivered = async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { status: "delivered" },
        { new: true }
      );
      
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to mark order as delivered" });
    }
  };