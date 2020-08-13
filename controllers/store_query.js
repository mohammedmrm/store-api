const bcrypt = require("bcrypt");
const { errorHandler } = require("../helpers/dbErrorHandler");
var configuration = require("../databaseConfig");
const { attempt } = require("lodash");
var con = configuration.connection;

function list_working(req, response) {
  console.log("called list working");
  let limit = req.query.limit ? parseInt(req.query.limit) : 20;
  let page =
    req.query.page && parseInt(req.query.page) > 0
      ? parseInt(req.query.page)
      : 1;
  const search = !req.query.search ? "" : req.query.search;
  const category = !req.query.category ? "" : req.query.category;
  const list_id = !req.query.list ? "" : req.query.list;
  const username = req.query.username;
  const password = req.query.password;
  let products = [];
  query = `select product.*,category.title as category_name,
stores.name as store_name,image.img as img
from product
left join stores on stores.id = product.store_id
left join category on category.id = product.category_id
left join (select max(path) as img,product_id from images
group by product_id) image on image.product_id = product.id
where product.id <> 0`;
  if (category >= 1) {
    query += ` and category.id=${category}`;
  }
  if (list_id >= 1) {
    query += ` and list_items.list_id=${list_id}`;
  }
  if (search != "") {
    query += ` and (MATCH (product.name) AGAINST ('${search}*' IN BOOLEAN MODE))`;
  }
  page = (page - 1) * limit;
  query += ` limit ${page} , ${limit}`;
  console.log("step 2");
  //--------------------------------------------------------------------------
  con.query(query, function (error, data) {
    console.log("done step 3");
    data.forEach((product) => {
      console.log("done step 4");
      getProductAttribute(product, attr => {
        product.attribute = attr;
        products.push(product);
        if (products.length >= data.length) {
          response.json({
            code: 200,
            success: "1",
            data: products,
          });
        }
      });
    });
  });
}

async function getProductAttribute(product, callBack_getProductAttribute) {
  console.log("done step 5");
  let id = product["id"];
  console.log("done step6");

  queryY = `SELECT attribute.* FROM configurable_product
left join product on product.id = configurable_product.product_id
left join sub_option on sub_option.configurable_product_id = configurable_product.id
left join attribute on sub_option.attribute_id = attribute.id
where product.id =${id} group by attribute.id`;

  console.log("done step 7");
  let attributes = [];
  con.query(queryY, function (error, res) {
    console.log("step 88");

    res.forEach((att) => {
      //-------------------
      console.log("step 9999");
      attributeConfig(att, id, (x) => {
        attributes.push(x);
        console.log("xxxxxx: ", x);
        if (res.length <= attributes.length)
          callBack_getProductAttribute(attributes);
      });

      //------------------
    });
  });
}

//-----------------------
function attributeConfig(attr, id, callback_attributeConfig) {
  console.log("step 101010", "attr:", attr.id, " \t id:", id);

  query = `select attribute_config.*, attribute.id as attribute_id from attribute
LEFT JOIN attribute_config on attribute_config.attribute_id = attribute.id
left join sub_option on sub_option.attribute_config_id = attribute_config.id
left join configurable_product on configurable_product.id = sub_option.configurable_product_id
where attribute.id = 2 and configurable_product.product_id =1 GROUP by attribute_config.id`;

  console.log("step 11111");

  con.query(query, function (error, config) {
    console.log("step 121212");
    attr.config = config;
    console.log("inside step 121212+:", attr.id);
    callback_attributeConfig(attr);
  });

}

//============================

exports.list = (req, response) => {
  list_working(req, response);
};
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
            options += " attribute_config_id=" + conf;
          } else {
            options += " or attribute_config_id=" + conf;
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
          error: "select all options",
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