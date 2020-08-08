//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const { sendBasket, list, basket, updateBasket, addToBasket, deletebasket, createBasket} = require('../controllers/myBasket');

router.get('/myBasket/', list);
router.get('/myBasket/getBasket', basket);
router.get('/myBasket/updateBasket', updateBasket);
router.get('/myBasket/addToBasket', addToBasket);
router.get('/myBasket/deletebasket', deletebasket);
router.get('/myBasket/sendBasket', sendBasket);
router.get('/myBasket/createBasket', createBasket);

module.exports = router;
