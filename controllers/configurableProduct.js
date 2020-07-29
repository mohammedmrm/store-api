const bcrypt = require('bcrypt');
const { errorHandler } = require("../helpers/dbErrorHandler");
var configuration = require("../databaseConfig");
var con = configuration.connection;
let success = 0;
let access = false;
exports.list = (req, response) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        const c_id = req.query.c_id;
        var id = 0;
        query = `select * from staff where phone=?`;
        con.query(query, [username], function (err, data) {
            numRows = data.length;
            console.log(numRows);
            if (numRows == 1) {
                hash = data[0].password.replace(/^\$2y(.+)$/i, '$2a$1');
                bcrypt.compare(password, hash, function (err, res) {
                    access = res;
                });
                if (access) {
                    id = data[0].id;
                    try {
                        query = `select * from configurable_product where id=?`;
                        console.log(query);
                        con.query(query, [c_id], function (err, data) {
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
    } catch (err) {
        response.json({
            code: 200,
            success: "0",
            data: [{ error: err }],
        });
    }
};