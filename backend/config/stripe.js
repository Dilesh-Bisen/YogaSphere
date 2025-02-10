const stripe = require('stripe');
require('dotenv').config();

const instance = stripe(process.env.STRIPE_SECRET_KEY);

module.exports = instance;
