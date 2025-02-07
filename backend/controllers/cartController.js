const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');

// POST add item to cart
async function addToCart(req, res) {
    const { cartCollection } = getCollections();
    const newItem = req.body;
    const result = await cartCollection.insertOne(newItem);
    res.send(result);
}

// GET all items in cart
async function getCartItems(req, res) {
    const { cartCollection } = getCollections();
    const result = await cartCollection.find().toArray();
    res.send(result);
}

// GET cart items by user ID
async function getCartItemsByUserId(req, res) {
    const { cartCollection } = getCollections();
    const userId = req.params.userId;
    const query = { userId: userId };
    const result = await cartCollection.find(query).toArray();
    res.send(result);
}

// DELETE remove item from cart
async function removeFromCart(req, res) {
    const { cartCollection } = getCollections();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await cartCollection.deleteOne(query);
    res.send(result);
}

module.exports = {
    addToCart,
    getCartItems,
    getCartItemsByUserId,
    removeFromCart
};
