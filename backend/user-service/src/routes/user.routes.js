const router = require('express').Router();
const userController = require('../controllers/User.controller');
const { extractUser } = require('../middleware/auth');
const { updateProfileValidation, changePasswordValidation } = require('../validators/auth.validator');
const { validate } = require('../middleware/validate');

router.use(extractUser);

router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, validate, userController.updateProfile);
router.put('/change-password', changePasswordValidation, validate, userController.changePassword);

module.exports = router;
