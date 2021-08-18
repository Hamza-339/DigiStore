var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
var multer  = require('multer');
var path = require('path');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');
var userModule = require('../modules/user')

router.use(express.static(__dirname+"./public/"))

var Storage = multer.diskStorage({
    destination:"./public/uploads",
    filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
  });
  
  var upload = multer({
    storage:Storage
  }).single('file');

/*router.get('/' , function(req, res, next) {
    //var userid = req.params.id;     
    console.log("router called, customer dashboard");
    var userid=req.query.id;
    var getshopDetails = shopModel.find({});
    var getproductDetails = productModel.find({});
  
    getshopDetails.exec(function(err,data){//shop data execute
      if(err) throw err;
      getproductDetails.exec(function(err,data1){
        if(err) throw err;
        res.render('Customerdashboard', { title: 'Customerdashboard', records:data , record:data1});
      })
    });
    //res.render('Sellerdashboard', { title: 'No Stores Exist' });
});*/

router.get('/', upload , function(req, res, next) {
  var product_id_token = localStorage.getItem("productid");
  var loginUser = localStorage.getItem("loginUser");

  console.log("router , with id, post, search products");
  var userid = req.query.id;
  let shopIds=[];
  var getproductDetails = productModel.find({});
  var getshopDetails = shopModel.find({});
  getproductDetails.exec(function(err,data){//shop data execute
    if(err) throw err;

    data.forEach(element => {
      shopIds.push(element.shop_id);
    });

   var getshopName=shopModel.find({_id:{$in:shopIds}});

   getshopName.exec(function(err1,data1){//shop data execute
    if(err1) throw err1;    
    getshopDetails.exec(function(err2,data2){
        if(err2) throw err2;
        res.render('Customerdashboard', { title: ' ', records:data , shoprecord:data1 , shopinfo:data2 , user_id:userid , product_id_token:product_id_token , loginUser:loginUser});
    })
 
    });
   });

});


/*router.post('/:id', upload , function(req, res, next) {
  var shopid = req.params.id;
  var productname = req.body.productname;
  //var shopid = req.body.shopid;
  var getproductDetails = productModel.find({productname:productname});
  var getshopDetails = shopModel.findOne({_id:shopid});
  
  getproductDetails.exec(function(err,data){//shop data execute
    if(err) throw err;
    getshopDetails.exec(function(err,data1){
      if(err) throw err;
      res.render('Searchproducts', { title: ' ', records:data , record:data1});
    });
  });

});*/

module.exports = router;
