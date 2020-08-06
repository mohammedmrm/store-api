//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const { list } = require('../controllers/city');

router.get('/city/', list);

module.exports = router;
