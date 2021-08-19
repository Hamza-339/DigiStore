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

function checkLoginUser(req,res,next){
  var userToken = localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect("/");
  }
  next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

router.get('/delete/:id/:shop_id/:userid', checkLoginUser , function(req, res, next) {
  var userid = req.params.userid;
  var product_id = req.params.id;
  var shop_id = req.params.shop_id;

  var productDelete = productModel.findByIdAndDelete(product_id);
  productDelete.exec(function(err){
    if(err) throw error;
    res.redirect('/Viewallproducts/'+shop_id+'/'+userid);
  })
});

router.get('/update/:id/:shop_id/:userid', upload , checkLoginUser , function(req,res,next){
    var loginUser = localStorage.getItem("loginUser");

    var userid = req.params.userid; 
    var product_id = req.params.id;
    var shop_id = req.params.shop_id;

    var productUpdate = productModel.findById(product_id);
    productUpdate.exec(function(err,data){
      if(err) throw error;
      console.log("Product details data: " + data)
      res.render('UpdateProduct',{ title: 'updateproduct' , records: data , record: shop_id , user_id:userid , loginUser:loginUser});     
    })
  });

  router.post('/update/:id/:shop_id/:userid', upload , checkLoginUser , function(req,res,next){
    var loginUser = localStorage.getItem("loginUser");

    var userid = req.params.userid;
    var productname = req.body.productname;
    var productprice = req.body.productprice;
    var productdetails = req.body.productdetails;
    var productimage = req.file.filename;
    var product_id = req.params.id;
    var shop_id = req.params.shop_id;



    //var shop_id = req.params.id;
    //console.log(`Shop ${shop_id}`);
    //    res.redirect("/UpdateStore");
    //res.render("/Sellerdashboard")
    productModel.findByIdAndUpdate(product_id,{productname:productname , productprice:productprice , productdetails:productdetails , shop_id:shop_id , productimage:productimage}).exec(function(err){
      if(err) throw error;
      var productDetails = productModel.findById({_id:product_id});
      productDetails.exec(function(err,data){
        if(err) throw error;
        res.redirect("/Viewallproducts/"+shop_id+'/'+userid);
      });
    })

  });
  
module.exports = router;