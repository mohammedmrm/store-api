const bcrypt = require('bcrypt');
const { errorHandler } = require("../helpers/dbErrorHandler");
var configuration = require("../databaseConfig");
var con = configuration.connection;
let success = 0;
let access = false;
exports.list = (req, response) => {
    const username = req.query.username;
    const password = req.query.password;
    var id = 0;
    query = `select * from staff where phone=?`;
    con.query(query, [username], function (err, data) {
        numRows = data.length;
        if (numRows == 1) {
            hash = data[0].password.replace(/^\$2y(.+)$/i, '$2a$1');
            bcrypt.compare(password, hash, function (err, res) {
                access = res;
            });
            if (access) {
                id = data[0].id;
                try {
                    query = `select * from list where mandop_id=?`;
                    console.log(query);
                    con.query(query, [id], function (err, data) {
                        response.json({
                            code: 200,
                            success: "1",
                            data: data,
                        });
                    });
                } catch (err) {
                    response.json({
                        code: 200,
                        success: "0",
                        data: [{ error: err }],
                    });
                }
            } else {
                response.json({
                    code: 300,
                    success: "0",
                    message: "incorect username or password"
                });
            }
        } else {
            response.json({
                code: 300,
                success: "0",
                message: "incorect username or password"
            });
        }
    });
};
exports.creatList = (req, response) => {
    const username = req.query.username;
    const password = req.query.password;
    const listname = req.query.listname;
    var id = 0;
    query = `select * from staff where phone=?`;
    con.query(query, [username], function (err, data) {
        numRows = data.length;
        if (numRows == 1) {
            hash = data[0].password.replace(/^\$2y(.+)$/i, '$2a$1');
            bcrypt.compare(password, hash, function (err, res) {
                access = res;
            });
            if (access) {
                id = data[0].id;
                try {
                    query = `insert into list (mandop_id,name) values(?,?)`;
                    console.log(query);
                    con.query(query, [id, listname], function (err, data) {
                        response.json({
                            code: 200,
                            success: "1",
                            data: data,
                        });
                    });
                } catch (err) {
                    response.json({
                        code: 200,
                        success: "0",
                        data: [{ error: err }],
                    });
                }
            } else {
                response.json({
                    code: 300,
                    success: "0",
                    message: "incorect username or password"
                });
            }
        } else {
            response.json({
                code: 300,
                success: "0",
                message: "incorect username or password"
            });
        }
    });
};
exports.addToList = (req, response) => {
    const username = req.query.username;
    const password = req.query.password;
    const list = req.query.list;
    const product = req.query.product;
    var id = 0;
    query = `select * from staff where phone=?`;
    con.query(query, [username], function (err, data) {
        numRows = data.length;
        if (numRows == 1) {
            hash = data[0].password.replace(/^\$2y(.+)$/i, '$2a$1');
            bcrypt.compare(password, hash, function (err, res) {
                access = res;
            });
            if (access) {
                id = data[0].id;
                try {
                    query = `insert into list_items (product_id,list_id) values(?,?)`;
                    console.log(query);
                    con.query(query, [product, list], function (err, data) {
                        response.json({
                            code: 200,
                            success: "1",
                            data: data,
                        });
                    });
                } catch (err) {
                    response.json({
                        code: 200,
                        success: "0",
                        data: [{ error: err }],
                    });
                }
            } else {
                response.json({
                    code: 300,
                    success: "0",
                    message: "incorect username or password"
                });
            }
        } else {
            response.json({
                code: 300,
                success: "0",
                message: "incorect username or password"
            });
        }
    });
};