const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const isauth = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if(!authHeader) {
            return res.status(401).send({ msg: 'No authorization !!!' });
        }
        const token = req.headers.authorization;
        if(!token) {
            return res.status(401).send({ msg: 'No authorization !!!' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const fonduser= await User.findById({_id: decoded.id});
        if(!fonduser) {
            return res.status(401).send({ msg: 'No authorization !!!' });
        }
        req.user = fonduser;
        next();

    } catch (error) {
        res.status(401).send({ msg: 'No authorization !!!' });
    }
}

module.exports = isauth;
