const { errorHandler } = require("../helpers/dbErrorHandler");
var configuration = require("../databaseConfig");
var con = configuration.connection;
let success;
let data;
var products = [];

exports.list = (req, response) => {
    response.send("hello from Category");
}