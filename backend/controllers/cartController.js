const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');

async function addToCart(req, res) {
    const { cartCollection } = getCollections();
    const newItem = req.body;
    const result = await cartCollection.insertOne(newItem);
    res.send(result);
}

async function getCartItems(req, res) {
    const { cartCollection } = getCollections();
    const result = await cartCollection.find().toArray();
    res.send(result);
}

async function getCartItemsByUserId(req, res) {
    const { cartCollection } = getCollections();
    const userId = req.params.userId; 
    const query = { userId: userId };
    const result = await cartCollection.find(query).toArray(); 
    res.send(result);
}

async function getCartItemsByUserEmail(req, res) {
    const { cartCollection, classCollection } = getCollections();
    const email = req.params.email;
    const query1 = { email: email }; 
    const projection = { classId: 1 };
    const carts = await cartCollection.find(query1, { projection }).toArray(); 
    const classIds = carts.map((cart) => new ObjectId(cart.classId));
    const query2 = { _id: { $in: classIds } };
    const result = await classCollection.find(query2).toArray(); 
    res.send(result);
}

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
    getCartItemsByUserEmail,
    removeFromCart
};
