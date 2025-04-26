import { Router } from 'express'
import auth from '../middleware/authMiddleware.js'
import { CashOnDeliveryOrderController, getAllOrdersController, getOrderDetailsController, paymentController, } from '../controller/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
// orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.get("/all",auth,getAllOrdersController)
export default orderRouter