const bcrypt = require('bcrypt');
const { errorHandler } = require("../helpers/dbErrorHandler");
var configuration = require("../databaseConfig");
const { add } = require('lodash');
var con = configuration.connection;
let success = 0;
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
                query = `select basket.*,cites.name as city,towns.name as town from basket 
                    LEFT join cites on cites.id = basket.city_id
                    LEFT join towns on towns.id = basket.town_id
                    where staff_id=${id}`;
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
        query = `select * from staff where phone=?`;
        con.query(query, [username], function (err, data) {
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
exports.deleteBasket = (req,response) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        const basket_id = req.query.basket_id;
        var id = 0;
        query = `select * from staff where phone=?`;
        con.query(query, [username], function (err, data) {
            //console.log('data',data);
            hash = data[0].password.replace(/^\$2y(.+)$/i, '$2a$1');
            bcrypt.compare(password, hash, function (err, res) {
                access = res;
            });
            if (access) {
                id = data[0].id;
                try {
                    query = `delete from basket where id=${basket_id} and staff_id=${id}`;
                    console.log(query);
                    con.query(query, function (err, data) {
                        numRows = data.affectedRows;
                        if (numRows > 0) {
                            response.json({
                                code: 200,
                                success: '1',
                                data: data,
                            });
                        } else {
                            response.json({
                                code: 200,
                                success: '0',
                                data: data,
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
exports.updateBasket = (req,response) => {
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
                        numRows = data.affectedRows;
                        if (numRows > 0) {
                            response.json({
                                code: 200,
                                success: '1',
                                data: data,
                            });
                        } else {
                            response.json({
                                code: 200,
                                success: '0',
                                data: data,
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
exports.createBasket = (req, response) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        const name = req.query.name;
        const city_id = req.query.city_id;
        const town_id = req.query.town_id;
        const address = req.query.address;
        const note = req.query.note;
        const phone = req.query.phone;
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
                    query = `insert into basket 
                    (customer_name,customer_phone,city_id,town_id,address,note) values(?,?,?,?,?,?)`;
                    con.query(query,[name,phone,city_id,town_id,address,note], function (err, data) {
                        numRows = data.affectedRows;
                        if (numRows > 0) {
                            response.json({
                                code: 200,
                                success: '1',
                                data: data,
                            });
                        } else {
                            response.json({
                                code: 200,
                                success: '0',
                                data: data,
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
exports.addToBasket = (req,response) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        const basket_id = req.query.basket_id;
        const qty = req.query.qty ? req.query.qty : 1;
        const product = req.query.product;
        const config = req.query.options;
        let options = "";
        let count = 0;
        let id = 0;
        query = `select * from staff where phone=${username}`;
        con.query(query, function (err, user) {
            //console.log('data',data);
            hash = user[0].password.replace(/^\$2y(.+)$/i, '$2a$1');
            bcrypt.compare(password, hash, function (err, res) {
                access = res;
            });
            console.log(access);
            if (access) {
                id = user[0].id;
                try {
                    sql = `select attribute_id from sub_option 
                            left join configurable_product on configurable_product.id = sub_option.configurable_product_id
                            left join product on product.id = configurable_product.product_id
                            where product.id = ${product} GROUP by sub_option.attribute_id`;
                    console.log(sql);
                    con.query(sql, function (error, adj) {
                        count = adj.length;
                        console.log(count, config.length);
                        if (count == config.length) {
                            i = 0;
                            config.forEach((conf) => {
                                if (conf) {
                                    if (i == 0) {
                                        options += ' attribute_config_id=' + conf;
                                    } else {
                                        options += ' or attribute_config_id=' + conf;
                                    }
                                    i++;
                                } else {
                                    break;
                                }
                                
                            });
                            if (i == count){
                            query = `SELECT configurable_product_id,COUNT(configurable_product_id) as count 
                                        FROM sub_option 
                                        left join configurable_product on configurable_product.id = sub_option.configurable_product_id 
                                        left join product on configurable_product.product_id = product.id 
                                        where ( ${options} ) and product.id = ${product} 
                                        GROUP by configurable_product_id 
                                        order by COUNT(configurable_product_id) DESC 
                                        limit 1`;
                            con.query(query, function (error, configrable_product_id) {
                                query = `insert into basket_items (configurable_product_id,basket_id,qty,staff_id) 
                                            values (?,?,?,?)`;
                                console.log(configrable_product_id[0]['configurable_product_id']);
                                con.query(query, [configrable_product_id[0]['configurable_product_id'], basket_id, qty, id], function (err, data) {
                                    numRows = data.affectedRows;
                                    if (numRows > 0) {
                                        response.json({
                                            code: 200,
                                            success: '1',
                                            data: data,
                                        });
                                    } else {
                                        response.json({
                                            code: 200,
                                            success: '0',
                                            data: data,
                                        });
                                    }
                                });
                            });
                            }else{
                                response.json({
                                    code: 200,
                                    success: "0",
                                    error: 'select all options',
                                });
                            }
                        } else {
                            response.json({
                                code: 200,
                                success: "0",
                                error: 'select all options',
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
exports.emptyBasket = (req,response) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        const basket_id = req.query.basket_id;
        const c_id = req.query.c_id;
        const qty = req.query.qty;
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
                    query = `delete from basket_items 
                    where basket_id = ${basket_id} and staff_id = ${id}`;
                    con.query(query, function (err, data) {
                        numRows = data.affectedRows;
                        if (numRows > 0) {
                            response.json({
                                code: 200,
                                success: '1',
                                data: data,
                            });
                        } else {
                            response.json({
                                code: 200,
                                success: '0',
                                data: data,
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
exports.cancelBasket = (req, response) => {
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
                    query = `update basket set status = 1 where id=? and staff_id=?`;
                    con.query(query, [ basket_id, id], function (err, data) {
                        numRows = data.affectedRows;
                        if (numRows > 0) {
                            response.json({
                                code: 200,
                                success: '1',
                                data: data,
                            });
                        } else {
                            response.json({
                                code: 200,
                                success: '0',
                                data: data,
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
exports.sendBasket = (req, response) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        const basket_id = req.query.basket_id;
        const discount = req.query.discount ? req.query.discount : 0;
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
                    query = `update basket set status = 2 , discount=? where id=? and staff_id=?`;
                    con.query(query,[discount,basket_id,id], function (err, data) {
                        numRows = data.affectedRows;
                        if (numRows > 0) {
                            response.json({
                                code: 200,
                                success: '1',
                                data: data,
                            });
                        } else {
                            response.json({
                                code: 200,
                                success: '0',
                                data: data,
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