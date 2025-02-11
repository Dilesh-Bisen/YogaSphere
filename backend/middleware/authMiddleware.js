const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (req, res, next) => {
    const user = req.body;

    if (!user.email) {
        return res.status(400).send({ error: "Email is required to generate a token" });
    }

    const token = jwt.sign({ email: user.email, username: user.username, age: user.age }, process.env.JWT_SECRET_KEY, {
        expiresIn: '24h'
    });
    res.send({ token });
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        console.log("Decoded token:", user); 
        req.user = user;
        next();
    });
};

module.exports = {
    generateToken,
    authenticateToken
};
