const { errorHandler } = require("../helpers/dbErrorHandler");
var configuration = require("../databaseConfig");
var con = configuration.connection;
let success;
let data;
var products = [];

exports.list = (req, response) => {
  const limit = !req.limit && req.limit < 10 ? 10 : req.limit;
  const pageIndex = !req.limit && req.pageIndex < 1 ? 1 : req.pageIndex;
  const search = !req.search ? "" : req.search;
  const category=!req.category ? "" : req.category;

  try {
    query = `select product.*,category.title as category_name,
            stores.name as store_name,image.img as img
            from product
            left join stores on stores.id = product.store_id
            left join category on category.id = product.category_id
            left join (select max(path) as img,product_id from images 
            group by product_id) image on image.product_id = product.id`;
            if(category>=1){
              query+=` and category.id=${category}`;
            }
            let page = (1-1)*10;
            query+=` limit ${page} , ${10}`;
            console.log(query);
    con.query(query, function (error, data) {
      let id;
      data.forEach((product) => {
        id = product["id"];
        sql = `SELECT attribute.* FROM configurable_product
              left join product on product.id = configurable_product.product_id
              left join sub_option on sub_option.configurable_product_id = configurable_product.id
              left join attribute on sub_option.attribute_id = attribute.id
              where product.id =${id} group by attribute.id`;
        con.query(sql, function (error, res) {
          let attributes = [];
          res.forEach((attr) => {
            // console.log(attr.id);
            sql2 = `select attribute_config.*, attribute.id as attribute_id from attribute
                LEFT JOIN attribute_config on attribute_config.attribute_id = attribute.id
                left join sub_option on sub_option.attribute_config_id = attribute_config.id
                left join configurable_product on configurable_product.id = sub_option.configurable_product_id
                where attribute.id = ${attr.id} and configurable_product.product_id = ${id} GROUP by attribute_config.id`;
            con.query(sql2, function (error, config) {
              attr.config = config;
              attributes.push(attr);
              // console.log(attributes);
              // response.send(attributes);
            });
            product.attribute = attributes;
            products.push(product);
            //  console.log(products);
          });
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
};

// response.json({
//     data,
//   });
