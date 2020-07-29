const bcrypt = require('bcrypt');
const { errorHandler } = require("../helpers/dbErrorHandler");
var configuration = require("../databaseConfig");
var con = configuration.connection;
let success;
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