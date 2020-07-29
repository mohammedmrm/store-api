const bcrypt = require('bcrypt');
const { errorHandler } = require("../helpers/dbErrorHandler");
var configuration = require("../databaseConfig");
var con = configuration.connection;
let success=0;
let data;
var products = [];
let access = false;
exports.list = (req, response) => {
    const username = req.query.username;
    const password = req.query.password;
    var id = 0;
    query = `select * from staff where phone=${username}`;
    con.query(query, function (err, data) {
        //console.log('data',data);
        hash = data[0].password.replace(/^\$2y(.+)$/i, '$2a$1');
        bcrypt.compare(password, hash, function (err, res) {
            access = res;
        });
        if (access) {
            id = data[0].id;
            try {
                query = `select * from basket where staff_id=${id}`;
                console.log(query);
                con.query(query, function (err, data) {
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
    });
};
exports.basket = (req, response) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        const basket_id = req.query.basket_id;
        var id = 0;
        query = `select * from staff where phone=${username}`;
        con.query(query, function (err, data) {
            //console.log('data',data);
            hash = data[0].password.replace(/^\$2y(.+)$/i, '$2a$1');
            bcrypt.compare(password, hash, function (err, res) {
                access = res;
            });
            if (access) {
                id = data[0].id;
                try {
                    query = `select * from basket where id=${basket_id} and staff_id=${id}`;
                    console.log(query);
                    con.query(query, function (err, data) {
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
        });
    } catch (err) {
        response.json({
            code: 200,
            success: "0",
            data: [{ error: err }],
        });
    }
};
exports.updateBasket = (req, response) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        const basket_id = req.query.basket_id;
        const name = req.query.basket_id;
        const city_id = req.query.city_id;
        const town_id = req.query.town_id;
        const address = req.query.address;
        const note = req.query.note;
        const phone = req.query.basket_id;
        var id = 0;
        query = `select * from staff where phone=${username}`;
        con.query(query, function (err, data) {
            //console.log('data',data);
            hash = data[0].password.replace(/^\$2y(.+)$/i, '$2a$1');
            bcrypt.compare(password, hash, function (err, res) {
                access = res;
            });
            if (access) {
                id = data[0].id;
                try {
                    query = `update * from basket set
                            customer_name = ${name},customer_phone=${phone},
                            address=${address},city_id=${city_id},
                            town_id=${town_id},note=${note}     
                            where id=${basket_id} and staff_id=${id}`;
                    con.query(query, function (err, data) {
                        response.json({
                            code: 200,
                            success: '1',
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
        });
    } catch (err) {
        response.json({
            code: 200,
            success: "0",
            data: [{ error: err }],
        });
    }
};