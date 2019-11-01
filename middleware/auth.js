const jwt = require('jsonwebtoken');
const config = require('../config');


const authentication = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(401).send('Access denied! no token provided');
    }

    try {
        const decode = jwt.verify(token, config.secret);
        req.user = decode;
        next();
    } catch(e) {
        res.status(400).send('authrization failed! invalid token');
    }

}