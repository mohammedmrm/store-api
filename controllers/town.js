const bcrypt = require('bcrypt');
const { errorHandler } = require("../helpers/dbErrorHandler");
var configuration = require("../databaseConfig");
var con = configuration.connection;
let success = 0;
let access = false;
exports.list = (req, response) => {
    const username = req.query.username;
    const password = req.query.password;
    const city = req.query.city;
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
                    if(city > 0){
                        query = `select * from towns where city_id=${city}`;
                    }else{
                        query = `select * from towns`;
                    }
                    
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
        } else {
            response.json({
                code: 300,
                success: "0",
                message: "incorect username or password"
            });
        }
    });
};
