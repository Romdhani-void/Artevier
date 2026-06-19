const router = require('express').Router();
const adminController = require('../controllers/Admin.controller');
const { extractUser, requireAdmin } = require('../middleware/auth');

router.use(extractUser, requireAdmin);

router.get('/', adminController.getUsers);
router.get('/stats', adminController.getStats);
router.put('/:id/role', adminController.updateUserRole);
router.delete('/:id', adminController.deleteUser);

module.exports = router;
