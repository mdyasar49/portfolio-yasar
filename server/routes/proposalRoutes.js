const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit', proposalController.submitProposal);
router.get('/:id', proposalController.getProposal);
router.put('/approve/:id', protect, proposalController.approveProposal);

module.exports = router;
