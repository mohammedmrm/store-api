//-----------------Imports Lib-------------
const express = require('express');
const router = express.Router();
//-----------------Imports-----------------
const { list, createList, addToList } = require('../controllers/favourite');

router.get('/favourite/', list);
router.get('/favourite/createList', createList);
router.get('/favourite/addToList', addToList);

module.exports = router;
