//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const { list, configrableProduct} = require('../controllers/store_query');
   
router.get('/products/', list);
router.get('/products/configrableProduct', configrableProduct);
 
module.exports = router;
