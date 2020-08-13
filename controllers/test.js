const bcrypt = require('bcrypt');
const { errorHandler } = require("../helpers/dbErrorHandler");
var configuration = require("../databaseConfig");
var con = configuration.connection;
async function getAttr(id, product) {
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
      return product;
    });
  });
}
async function list2(req) {
  let limit = parseInt(req.query.limit) || 20;
  let page = parseInt(req.query.page) || 1;
  const search = !req.query.search ? "" : req.query.search;
  const category = !req.query.category ? "" : req.query.category;
  const username = req.query.username;
  const password = req.query.password;
  let access = false;
  let id = 0;
  sql = `select product.*,category.title as category_name,
            stores.name as store_name,image.img as img
            from product
            left join stores on stores.id = product.store_id
            left join category on category.id = product.category_id
            left join (select max(path) as img,product_id from images 
            group by product_id) image on image.product_id = product.id
            where product.id <> 0`;
  if (category >= 1) {
    sql += ` and category.id=${category}`;
  }
  if (search != '') {
    sql += ` and (MATCH (product.name) AGAINST ('${search}*' IN BOOLEAN MODE))`;
  }
  page = (page - 1) * limit;
  sql += ` limit ${page} , ${limit}`;
    await con.query(sql, function (error, data) {
    let products = [];
    let id;
    data.forEach(async (product) => {
      let pro = await getAttr(product["id"], product);
      products.push(pro);
    })
    
  });  
  return products;
}

exports.list = (req, res) => {
  res.json({
    code: 200,
    success: "1",
    data: list2(req)
  })
}


exports.configrableProduct = (req, response) => {
  let product = req.query.product;
  let config = req.query.options;
  let options = "";
  let count = 0;
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
          if (i == 0) {
            options += ' attribute_config_id=' + conf;
          } else {
            options += ' or attribute_config_id=' + conf;
          }
          i++;
        });
        query = `SELECT configurable_product_id,COUNT(configurable_product_id) as count 
                FROM sub_option 
                left join configurable_product on configurable_product.id = sub_option.configurable_product_id 
                left join product on configurable_product.product_id = product.id 
                where ( ${options} ) and product.id = ${product} 
                GROUP by configurable_product_id 
                order by COUNT(configurable_product_id) DESC 
                limit 1`;
        console.log(query);
        con.query(query, function (error, data) {
          response.json({
            code: 200,
            success: "1",
            data: data,
          });
        });
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
};

