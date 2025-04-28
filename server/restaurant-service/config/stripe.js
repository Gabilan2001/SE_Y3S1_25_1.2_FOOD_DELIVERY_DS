// import stripe from 'stripe'

// const Stripe = stripe(process.env.STRIPE_SECRET_KEY)

// export default Stripe

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' // Use latest API version
});

export default stripe;