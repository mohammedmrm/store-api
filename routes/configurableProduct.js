//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const { list } = require('../controllers/configurableProduct');

router.get('/configurableProduct/byID', list);

module.exports = router;
