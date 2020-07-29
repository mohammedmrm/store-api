//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const { list } = require('../controllers/category');

router.get('/category/', list);

module.exports = router;
