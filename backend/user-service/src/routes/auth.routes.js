const router = require('express').Router();
const authController = require('../controllers/Auth.controller');
const { registerValidation, loginValidation } = require('../validators/auth.validator');
const { validate } = require('../middleware/validate');

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/logout', authController.logout);

module.exports = router;
