const {check, validationResult } = require('express-validator');

exports.registerValidation = () => [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email is required').notEmpty().isEmail(),
    check('password', 'Password is required').notEmpty().isLength({ min: 6 }),
    check('phone', 'Phone number is required').notEmpty().isMobilePhone()
];

exports.loginValidation = () => [
    check('email', 'Email is required').notEmpty().isEmail(),
    check('password', 'Password is required').notEmpty().isLength({ min: 6 })
];
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};