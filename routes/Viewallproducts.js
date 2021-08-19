var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require("bcrypt");
var multer  = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');
var confirmedorderModel = require('../modules/confirmedorder');
var userModule = require('../modules/user')


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

/*function checkNegativeQuantity(req,res,next){
  var quantity=req.body.productquantity;
  if(quantity<1){
    return res.render('Addproduct', { title: 'Digi Store', LoginMsg:' ',SignupMsg:'Product quantity must be positive' });
  }
  next();
};*/

function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}

router.get('/:orderid/:shopid/:userid' , checkLoginUser ,async function(req, res, next) {
  var ordersDetails = await confirmedorderModel.update({_id:req.params.orderid},{
    $set:{
      isDeleiverd:true
  }});
 
  res.redirect(`/Viewallproducts/${req.params.userid}/${req.params.shopid}`);
})

router.get('/:id/:userid' , checkLoginUser ,async function(req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  let customerids = []; 
  let customernames = [];
  let customeraddresses =[];
  console.log("router called view all products");
  //var userid=req.query.id;
  var shopid = req.params.id;
  var user_id = req.params.userid;
  var ordersDetails = await confirmedorderModel.find({shop_id:shopid,isDeleiverd:false}).populate("product_id").populate("user_id");
  console.log("orders fetched");
  var getshopDetails = shopModel.findOne({_id:shopid});
  var getproductDetails = productModel.find({shop_id:shopid});

  getproductDetails.exec(function(err,data){//shop data execute
    if(err) throw err;
    getshopDetails.exec(function(err,data1){
      if(err) throw err;
          res.render('Viewallproducts', { title: 'Viewallproducts', orders:ordersDetails, records:data , shop_id:shopid , record:data1 , user_id:user_id , loginUser:loginUser });
    });
  });
});   

router.post('/:id/:userid', upload , function(req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  var user_id = req.params.userid;
  var shopid = req.params.id;
  var productname = req.body.productname;
  var productprice = req.body.productprice;
  var productdetails = req.body.productdetails;
  var shopid = req.body.shopid;
  var productquantity = req.body.productquantity;
  var productimage = req.file.filename;
  
  //var success = req.file.filename+ " upload successfully";
  //console.log(userid);
  var productDetails = new productModel({
    productname:productname,
    productprice:productprice,
    productdetails:productdetails,
    shop_id:shopid,
    productquantity:productquantity,
    productimage:productimage
  })
  productDetails.save(function(err,doc){
    var getproductDetails = productModel.find({shop_id:shopid});
    var getshopDetails = shopModel.findOne({_id:shopid});

    getproductDetails.exec(function(err,data){//shop data execute
      if(err) throw err;
      getshopDetails.exec(function(err,data1){
        if(err) throw err;
        res.render('Viewallproducts', { title: 'Viewallproducts', records:data , shop_id:shopid , record:data1 , user_id:user_id , loginUser:loginUser});
      });
    });
  //  res.render('CreateStore', { title: 'Upload File', success:success });
  });
});
 
module.exports = router;