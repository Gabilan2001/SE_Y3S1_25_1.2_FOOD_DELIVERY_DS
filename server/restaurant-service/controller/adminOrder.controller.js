import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";

// Get all orders (Admin View)
export async function getAllOrdersController(request, response) {
    try {
        // Fetch all orders with associated delivery addresses and user details
        const allOrders = await OrderModel.find()
            .sort({ createdAt: -1 })
            .populate('delivery_address') // Populate delivery address
            .populate('userId', 'name email'); // Populate user info

        return response.json({
            message: "All orders fetched successfully",
            data: allOrders,
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "An error occurred while fetching orders",
            error: true,
            success: false,
        });
    }
}

// Update order status (e.g., processing, shipped, delivered)
export async function updateOrderStatusController(request, response) {
    try {
        const { orderId, status } = request.body;

        if (!orderId || !status) {
            return response.status(400).json({
                message: "Order ID and status are required",
                error: true,
                success: false,
            });
        }

        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            { payment_status: status },
            { new: true }
        );

        if (!updatedOrder) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false,
            });
        }

        return response.json({
            message: "Order status updated successfully",
            data: updatedOrder,
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "An error occurred while updating order status",
            error: true,
            success: false,
        });
    }
}

// Delete an order (Admin functionality)
export async function deleteOrderController(request, response) {
    try {
        const { orderId } = request.body;

        if (!orderId) {
            return response.status(400).json({
                message: "Order ID is required",
                error: true,
                success: false,
            });
        }

        const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false,
            });
        }

        return response.json({
            message: "Order deleted successfully",
            data: deletedOrder,
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "An error occurred while deleting the order",
            error: true,
            success: false,
        });
    }
}
