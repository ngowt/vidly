const config = require('config');
const jwt = require('jsonwebtoken');

let authToken = 'x-auth-token';

function auth(req, res, next) {
    const token = req.header(`${authToken}`);
    if (!token) return res.status(401).send('Access denied. Invalid authentication token');

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid authentication token');
    }
}

module.exports = auth;