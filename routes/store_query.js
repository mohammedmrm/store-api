//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const {  list } = require('../controllers/store_query');
   
router.get('/products/', list);
 
module.exports = router;
