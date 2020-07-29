const express = require('express');
var mysql = require('mysql');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
require('dotenv').config();
// import routes

const store_query = require('./routes/store_query');
const myBasket = require('./routes/myBasket');
const category = require('./routes/category');


// app
const app = express();

// db

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.disable('etag');

// routes middleware

app.use('/api', store_query);
app.use('/api', myBasket);
app.use('/api', category);
const port = process.env.PORT || 8050;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
