//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const { list, creatList, addToList } = require('../controllers/favourite');

router.get('/favourite/', list);
router.get('/favourite/creatList', creatList);
router.get('/favourite/addToList', addToList);

module.exports = router;
