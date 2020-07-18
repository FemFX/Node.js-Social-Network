const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');

const app = express();

dotenv.config();

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(
  multer({ dest: path.join(__dirname, 'public/upload/temp') }).single('image')
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', require('./routes'));

app.use('/public', express.static(path.join(__dirname, './public')));

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
