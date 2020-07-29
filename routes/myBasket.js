//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const { list } = require('../controllers/myBasket');

router.get('/myBasket/', list);

module.exports = router;
