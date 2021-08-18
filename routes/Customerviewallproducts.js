var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var multer  = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');

router.use(express.static(__dirname+"./public/"))
//var imageData = uploadModel.find({});


var Storage = multer.diskStorage({
  destination:"./public/uploads",
  filename:(req,file,cb)=>{
  cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage:Storage
}).single('file');

/*router.get('/', function(req, res, next) {

    res.render('Viewallproducts', { title: 'Viewallproducts'});

});*/

router.get('/:id/:userid', function(req, res, next) {
  var product_id_token = localStorage.getItem("productid");
  var loginUser = localStorage.getItem("loginUser");

  console.log("router called, customer view all products");
  //var userid=req.query.id;
  var shopid = req.params.id;
  var user_id = req.params.userid;

  var getshopDetails = shopModel.findOne({_id:shopid});
  var getproductDetails = productModel.find({shop_id:shopid});

  getproductDetails.exec(function(err,data){//shop data execute
    if(err) throw err;
    getshopDetails.exec(function(err,data1){
      if(err) throw err;
      res.render('Customerviewallproducts', { title: 'Customerviewallproducts', records:data , shop_id:shopid , record:data1 , userid:user_id , product_id_token:product_id_token , loginUser:loginUser});
    });
  });
  //res.render('Sellerdashboard', { title: 'No Stores Exist' });
});

 
module.exports = router;