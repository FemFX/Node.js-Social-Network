const express = require('express');
const router = express.Router();
// Controllers
const home = require('../controllers/home');
const image = require('../controllers/image');

router.get('/', home.index);
router.get('/images/:image_id', image.index);
router.post('/images', image.create);
router.post('/images/:image_id/like', image.like);
router.post('/images/:image_id/comment', image.comment);

module.exports = router;
