var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
var multer  = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
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

  function checkLoginUser(req,res,next){
    var userToken=localStorage.getItem('userToken');
    try {
      var decoded = jwt.verify(userToken, 'loginToken');
    } catch(err) {
      res.redirect('/');
    }
    next();
}

router.post('/:id', upload , checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  var product_id_token = localStorage.getItem("productid");
  console.log("router , with id, post, search products");
  var userid = req.params.id;
  let shopIds=[];
  var productname = req.body.productname;
   //var shopid = req.body.shopid;
  var getproductDetails = productModel.find({productname:productname});
   //var getproductDetails = productModel.find({productname:productname});
   //var getshopDetails = shopModel.findOne({_id:shopid});
  getproductDetails.exec(function(err,data){//shop data execute
    if(err) throw err;

    data.forEach(element => {
      shopIds.push(element.shop_id);
    });

   var getshopName=shopModel.find({_id:{$in:shopIds}});

   getshopName.exec(function(err1,data1){//shop data execute
    if(err1) throw err1;    
      console.log("data1"+data1);
    // res.render('Searchproducts', { title: ' ', records:data1});
     res.render('Searchproducts', { title: ' ', records:data , shoprecord:data1 , user_id:userid , product_id_token:product_id_token , loginUser:loginUser});
 
    });
   });

});

module.exports = router;
