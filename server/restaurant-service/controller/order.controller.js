import Stripe from '../config/stripe.js';
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import { loadStripe } from '@stripe/stripe-js';
import ProductModel from "../models/product.model.js";
import AddressModel from "../models/address.model.js"
export async function CashOnDeliveryOrderController(request, response) {
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

        const payload = list_items.map(el => {
            return({
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : el.productId._id, 
                product_details : {
                    name : el.productId.name,
                    image : el.productId.image
                } ,
                paymentId : "",
                payment_status : "CASH ON DELIVERY",
                delivery_address : addressId ,
                subTotalAmt  : subTotalAmt,
                totalAmt  : totalAmt,
            });
        });

        const generatedOrder = await OrderModel.insertMany(payload);

        ///remove from the cart
        const removeCartItems = await CartProductModel.deleteMany({ userId : userId });
        const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : [] });

        return response.json({
            message : "Order successfully",
            error : false,
            success : true,
            data : generatedOrder
        });

    } catch (error) {
        return response.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        });
    }
}



export const pricewithDiscount = (price, dis = 1) => {
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100);
    const actualPrice = Number(price) - Number(discountAmout);
    return actualPrice;
}





///////////////////////////////////////////////////////////////////
//auto fill some of the feald
// export async function paymentController(request, response) {
//     try {
//         const userId = request.userId;
//         const { list_items, addressId } = request.body;

//         // Validate inputs
//         if (!list_items?.length) {
//             return response.status(400).json({
//                 success: false,
//                 message: 'Cart is empty'
//             });
//         }

//         if (!addressId) {
//             return response.status(400).json({
//                 success: false,
//                 message: 'Shipping address is required'
//             });
//         }

//         // Get user data (including email)
//         const user = await UserModel.findById(userId);
//         if (!user) {
//             return response.status(404).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         }

//         // Get the user's saved address
//         const address = await AddressModel.findOne({ _id: addressId, user: userId });
//         if (!address) {
//             return response.status(404).json({
//                 success: false,
//                 message: 'Address not found'
//             });
//         }

//         // Prepare line items (same as before)
//         const line_items = await Promise.all(list_items.map(async (item) => {
//             const product = await ProductModel.findById(item.productId._id);
//             if (!product) throw new Error(`Product ${item.productId._id} not found`);

//             let productImage = product.image;
//             if (Array.isArray(productImage)) productImage = productImage[0];
//             else if (typeof productImage !== 'string') productImage = '';

//             return {
//                 price_data: {
//                     currency: 'lkr',
//                     product_data: {
//                         name: product.name,
//                         images: [productImage],
//                         metadata: { productId: product._id.toString() }
//                     },
//                     unit_amount: Math.round(pricewithDiscount(product.price, product.discount)) * 100
//                 },
//                 quantity: item.quantity
//             };
//         }));

//         // Create Stripe session with AUTO-FILLED data
//         const session = await Stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             customer_email: user.email, // Auto-fill user's email
//             line_items,
//             mode: 'payment',
//             success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${process.env.FRONTEND_URL}/cart`,
//             metadata: {
//                 userId: userId.toString(),
//                 addressId: addressId.toString()
//             },
//             shipping_options: [{
//                 shipping_rate_data: {
//                     type: 'fixed_amount',
//                     fixed_amount: { amount: 0, currency: 'lkr' }, // Free shipping (adjust as needed)
//                     display_name: 'Standard Shipping',
//                     delivery_estimate: {
//                         minimum: { unit: 'business_day', value: 3 },
//                         maximum: { unit: 'business_day', value: 5 }
//                     }
//                 }
//             }],
//             shipping_address_collection: {
//                 allowed_countries: ['LK'] // Only allow Sri Lankan addresses
//             },
//             // Pre-fill the shipping address (if available)
//             shipping_address: {
//                 line1: address.street,
//                 city: address.city,
//                 state: address.province,
//                 postal_code: address.postalCode,
//                 country: 'LK' // Sri Lanka
//             }
//         });

//         return response.json({
//             success: true,
//             message: 'Payment session created',
//             sessionId: session.id
//         });

//     } catch (error) {
//         console.error('Payment error:', error);
//         return response.status(500).json({
//             success: false,
//             message: error.message || 'Payment processing failed'
//         });
//     }
// }

//////////////////////////////////////////////////////////////////////////

//showing the image when do pay ment 
export async function paymentController(request, response) {
    try {
        const userId = request.userId;
        const { list_items, addressId } = request.body;

        // Validate inputs
        if (!list_items?.length) {
            return response.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        if (!addressId) {
            return response.status(400).json({
                success: false,
                message: 'Shipping address is required'
            });
        }

        // Verify user and address
        const user = await UserModel.findById(userId);
        if (!user) {
            return response.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prepare line items
        const line_items = await Promise.all(list_items.map(async (item) => {
            const product = await ProductModel.findById(item.productId._id);
            if (!product) {
                throw new Error(`Product ${item.productId._id} not found`);
            }

            // Ensure the image is a string URL
            let productImage = product.image;
            if (Array.isArray(productImage)) {
                productImage = productImage[0]; // Take the first image if it's an array
            } else if (typeof productImage !== 'string') {
                productImage = ''; // Fallback to empty string if not a string
            }

            return {
                price_data: {
                    currency: 'lkr',
                    product_data: {
                        name: product.name,
                        images: [productImage], // Ensure this is a string array
                        metadata: {
                            productId: product._id.toString()
                        }
                    },
                    unit_amount: Math.round(pricewithDiscount(product.price, product.discount)) * 100
                },
                quantity: item.quantity
            };
        }));

        // Create Stripe session
        const session = await Stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                userId: userId.toString(),
                addressId: addressId.toString()
            },
            shipping_address_collection: {
                allowed_countries: ['LK'] // Sri Lanka
            }
        });

        return response.json({
            success: true,
            message: 'Payment session created',
            sessionId: session.id
        });

    } catch (error) {
        console.error('Payment error:', error);
        return response.status(500).json({
            success: false,
            message: error.message || 'Payment processing failed'
        });
    }
}


///////////////////////////////////////////////////////////////////////////








//not showing the image when doing the pay ment
// export async function paymentController(request, response) {
//     try {
//         const userId = request.userId;
//         const { list_items, addressId } = request.body;

//         // Validate inputs
//         if (!list_items?.length) {
//             return response.status(400).json({
//                 success: false,
//                 message: 'Cart is empty'
//             });
//         }

//         // Verify product data exists
//         if (!list_items.every(item => item.productId?._id)) {
//             return response.status(400).json({
//                 success: false,
//                 message: 'Invalid product data in cart'
//             });
//         }

//         // Prepare line items with proper image formatting
//         const line_items = await Promise.all(list_items.map(async (item) => {
//             const product = await ProductModel.findById(item.productId._id);
//             if (!product) {
//                 throw new Error(`Product ${item.productId._id} not found`);
//             }

//             // Handle different image formats
//             let productImage = '';
//             if (typeof product.image === 'string') {
//                 productImage = product.image;
//             } else if (product.image?.url) {
//                 productImage = product.image.url;
//             } else if (product.image?.secure_url) {
//                 productImage = product.image.secure_url;
//             }

//             if (!productImage) {
//                 console.warn(`No valid image found for product ${product._id}`);
//             }

//             return {
//                 price_data: {
//                     currency: 'lkr',
//                     product_data: {
//                         name: product.name,
//                         images: productImage ? [productImage] : [], // Must be an array
//                         metadata: {
//                             productId: product._id.toString()
//                         }
//                     },
//                     unit_amount: Math.round(pricewithDiscount(product.price, product.discount)) * 100
//                 },
//                 quantity: item.quantity
//             };
//         }));

//         // Create Stripe session
//         const session = await Stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items,
//             mode: 'payment',
//             success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${process.env.FRONTEND_URL}/cart`,
//             metadata: {
//                 userId: userId.toString(),
//                 addressId: addressId.toString()
//             },
//             shipping_address_collection: {
//                 allowed_countries: ['LK']
//             }
//         });

//         return response.json({
//             success: true,
//             message: 'Payment session created',
//             sessionId: session.id
//         });

//     } catch (error) {
//         console.error('Payment processing error:', {
//             message: error.message,
//             stack: error.stack,
//             timestamp: new Date().toISOString()
//         });
        
//         return response.status(500).json({
//             success: false,
//             message: 'Payment processing failed',
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// }





const getOrderProductItems = async ({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
}) => {
    const productList = [];

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            // Commented out Stripe product retrieval
            // const product = await Stripe.products.retrieve(item.price.product);

            const paylod = {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: item.price.metadata.productId,
                product_details: {
                    name: item.price.product_data.name,
                    image: item.price.product_data.images,
                },
                paymentId: paymentId,
                payment_status: payment_status,
                delivery_address: addressId,
                subTotalAmt: Number(item.amount_total / 100),
                totalAmt: Number(item.amount_total / 100),
            };

            productList.push(paylod);
        }
    }

    return productList;
};

// http://localhost:8080/api/order/webhook
// export async function webhookStripe(request, response) {
//     const event = request.body;
//     const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY;

//     console.log("event", event);

//     // Handle the event
//     switch (event.type) {
//         case 'checkout.session.completed':
//             const session = event.data.object;
//             // Commented out Stripe line items listing
//             // const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
//             const userId = session.metadata.userId;
//             const orderProduct = await getOrderProductItems(
//                 {
//                     lineItems: {}, // Temporarily using an empty object since we're not fetching Stripe data
//                     userId: userId,
//                     addressId: session.metadata.addressId,
//                     paymentId: session.payment_intent,
//                     payment_status: session.payment_status,
//                 });

//             const order = await OrderModel.insertMany(orderProduct);

//             console.log(order);
//             if (Boolean(order[0])) {
//                 const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
//                     shopping_cart: []
//                 });
//                 const removeCartProductDB = await CartProductModel.deleteMany({ userId: userId });
//             }
//             break;
//         default:
//             console.log(`Unhandled event type ${event.type}`);
//     }

//     // Return a response to acknowledge receipt of the event
//     response.json({ received: true });
// }

export async function getOrderDetailsController(request, response) {
    try {
        const userId = request.userId; // order id

        const orderlist = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('delivery_address');

        return response.json({
            message: "order list",
            data: orderlist,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getAllOrdersController(request, response) {
    try {
        // Fetch all orders from the OrderModel
        const allOrders = await OrderModel.find().sort({ createdAt: -1 }).populate('userId delivery_address');

        return response.json({
            message: "All orders fetched successfully",
            data: allOrders,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}