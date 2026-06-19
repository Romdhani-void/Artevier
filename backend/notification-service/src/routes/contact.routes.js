const router = require('express').Router();
const contactController = require('../controllers/Contact.controller');
const { contactValidation } = require('../validators/contact.validator');
const { validate } = require('../middleware/validate');

router.post('/', contactValidation, validate, contactController.submit);

module.exports = router;
