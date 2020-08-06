//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const { list } = require('../controllers/favourite');

router.get('/favourite', list);

module.exports = router;
