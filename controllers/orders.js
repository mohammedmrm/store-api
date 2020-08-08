const bcrypt = require('bcrypt');
const { errorHandler } = require("../helpers/dbErrorHandler");
var configuration = require("../databaseConfig");
var con = configuration.connection;
let success;
let data;
let products = [];
let access = false;
exports.list = (req, response) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 20;
    let page = ((req.query.page && parseInt(req.query.page) > 0) ? parseInt(req.query.page) : 1);
    const username = req.query.username;
    const password = req.query.password;
    const city = req.query.city;
    const money_status = req.query.money_status;
    const store = req.query.store;
    const invoice = req.query.invoice;
    const customer = req.query.customer;
    const order = req.query.order;
    const status = req.query.status;
    let where = "";
    let filter = "";
    let id = 0;
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
                    query = `select orders.*, date_format(orders.date,'%Y-%m-%d') as date,
                            ((if(earnings_fix is null,0,earnings_fix)) + ((if(earnings_total is null,0,earnings_total/100)) * orders.total_price)) as mandop_earnings,
                            cites.name as city,towns.name as town,clients.phone as client_phone,mandop.name as mandop_name,
                            order_status.status as status_name,staff.name as staff_name,b.rep as repated,stores.name as store_name
                            from orders
                            left join cites on  cites.id = orders.city_id
                            left join towns on  towns.id = orders.town_id
                            left join staff on  staff.id = orders.manager_id
                            left join stores on  stores.id = orders.store_id
                            left join clients on  clients.id = stores.client_id
                            left join staff  mandop on  mandop.id = orders.mandop_id
                            left join order_status on  order_status.id = orders.order_status_id
                            left join mandop_stores on  mandop_stores.store_id = stores.id
                            left join (
                            select order_no,count(*) as rep from orders
                            GROUP BY order_no
                            HAVING COUNT(orders.id) > 1
                            ) b on b.order_no = orders.order_no
                            `;
                    where = "where";
                    filter = "orders.confirm = 1 and orders.mandop_id =" + id;
                    sort = " order by orders.date DESC ";
                    if (city >= 1) {
                        filter += " and orders.city_id=" + city;
                    }
                    if ((money_status == 1 || money_status == 0) && money_status != "") {
                        filter += " and money_status='" + money_status + "'";
                    }
                    if (store >= 1) {
                        filter += " and orders.store_id=" + store;
                    }
                    if (invoice == 1) {
                        filter += " and ((orders.invoice_id ='' or orders.invoice_id =0) or ((order_status_id=6 or order_status_id=5) and (orders.invoice_id2 ='' or orders.invoice_id2 =0)))";
                    } else if (invoice == 2) {
                        filter += " and ((orders.invoice_id !='' and orders.invoice_id != 0))";
                    }
                    if (customer) {
                        filter += " and (customer_name like '%" + customer + "%' or customer_phone like '%" + $customer + "%') ";
                    }
                    if (order) {
                        filter += " and orders.order_no like '%" + order + "%'";
                    }
                    ///-----------------status
                    if (status == 4) {
                        filter += " and (order_status_id =" + status + " or order_status_id = 6 or order_status_id = 5)";
                    } else if (status == 9) {
                        filter += " and (order_status_id =" + status + " or order_status_id =11 or order_status_id = 6 or order_status_id = 5)";
                    } else if (status >= 1) {
                        filter += " and order_status_id =" + status;
                    }
                    if (filter != "") {
                        filter = where + " " + filter;
                        query += " " + filter;
                    }
                    page = (page - 1) * limit;
                    query += ` limit ${page} , ${limit}`;
                    console.log(query);
                    con.query(query, function (error, data) {
                        let id;
                        data.forEach((product) => {
                            id = product["id"];
                            sql = `select * from order_items where order_id=?`;
                            con.query(sql, [id], function (error, res) {
                                product.items = res;
                                products.push(product);

                            });
                        });
                        response.json({
                            code: 200,
                            success: "1",
                            data: products,
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
                    message: "incorect username or password!"
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
