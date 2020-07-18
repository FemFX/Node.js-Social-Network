const path = require('path');
const { randomNumber } = require('../helpers/libs');
const fs = require('fs-extra');
const Image = require('../models/Image');
const Comment = require('../models/Comment');
const helpers = require('../server/helpers');
const md5 = require('md5');
const ctrl = {};

ctrl.index = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    image.views = image.views + 1;
    await image.save();
    const comments = await Comment.find({ image_id: image._id }).sort({
      timestamp: -1,
    });
    const time = helpers.timeago(image.timestamp);
    res.render('image', { image, time, comments });
  } else {
    return res.redirect('/');
  }
};

ctrl.create = (req, res) => {
  const saveImage = async () => {
    const imgUrl = randomNumber();
    const images = await Image.find({ filename: imgUrl });
    if (images.length > 0) {
      saveImage();
    } else {
      // Image Location
      const imageTempPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.resolve(`./public/upload/${imgUrl}${ext}`);

      // Validate Extension
      if (
        ext === '.png' ||
        ext === '.jpg' ||
        ext === '.jpeg' ||
        ext === '.gif'
      ) {
        await fs.rename(imageTempPath, targetPath);
        const newImg = new Image({
          title: req.body.title,
          filename: imgUrl + ext,
          description: req.body.description,
        });
        const imageSaved = await newImg.save();

        res.redirect('/');
      } else {
        await fs.unlink(imageTempPath);
        res.status(500).json({ error: 'Only Images are allowed' });
      }
    }
    s;
  };

  saveImage();
};
ctrl.like = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    image.likes = image.likes + 1;
    await image.save();
    res.json({ likes: image.likes });
  } else {
    res.status(500).json({ error: 'Internal Error' });
  }
};
ctrl.comment = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    await newComment.save();
    res.redirect('/');
  } else {
    res.redirect('/');
  }
};


module.exports = ctrl;
