//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const { list, basket, updateBasket} = require('../controllers/myBasket');

router.get('/myBasket/', list);
router.get('/myBasket/getBasket', basket);
router.get('/myBasket/updateBasket', updateBasket);

module.exports = router;
