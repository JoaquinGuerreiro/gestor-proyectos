const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.use(auth);

router.route('/')
  .get(commentController.getProjectComments)
  .post(commentController.createComment);

module.exports = router; 