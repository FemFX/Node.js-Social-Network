const Image = require('../models/Image');
const Stats = require('../helpers/stats')
const ctrl = {};

ctrl.index = async (req, res) => {
  const images = await Image.find().sort({ timestamp: -1 })
  const stats = await Stats()
  res.render('index', { images : images.slice(0,6),stats });
};

module.exports = ctrl;
