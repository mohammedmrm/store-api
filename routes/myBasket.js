//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const { basketItems, qtyProductInBasket, sendBasket, list, basket, updateBasket, addToBasket, deleteBasket, createBasket, cancelBasket, emptyBasket} = require('../controllers/myBasket');

router.get('/myBasket/', list);
router.get('/myBasket/getBasket', basket);
router.get('/myBasket/updateBasket', updateBasket);
router.get('/myBasket/addToBasket', addToBasket);
router.get('/myBasket/deleteBasket', deleteBasket);
router.get('/myBasket/cancelBasket', cancelBasket);
router.get('/myBasket/sendBasket', sendBasket);
router.get('/myBasket/createBasket', createBasket);
router.get('/myBasket/emptyBasket', emptyBasket);
router.get('/myBasket/qtyProductInBasket', qtyProductInBasket);
router.get('/myBasket/basketItems', basketItems);

module.exports = router;
