//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const { list, basket, updateBasket, addToBasket} = require('../controllers/myBasket');

router.get('/myBasket/', list);
router.get('/myBasket/getBasket', basket);
router.get('/myBasket/updateBasket', updateBasket);
router.get('/myBasket/addToBasket', addToBasket);

module.exports = router;
