//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const { list } = require('../controllers/town');

router.get('/town/', list);

module.exports = router;
