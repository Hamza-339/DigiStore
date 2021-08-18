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



router.get('/:id/:userid', upload , function(req,res,next){
      var product_id_token = localStorage.getItem("productid");
      var loginUser = localStorage.getItem("loginUser");
      var product_id = req.params.id;
      var user_id = req.params.userid;
      console.log("userid in Customerviewproductdetails page " +user_id);
      var productDetails = productModel.findOne({_id:product_id});
      productDetails.exec(function(err,data){
        if(err) throw error;
        console.log(data);
        res.render('Customerviewproductdetails',{ title: 'Customerviewproductdetails' , records:data , productid:product_id , userid:user_id , product_id_token:product_id_token , loginUser:loginUser});     
    })

});

/*  router.post('/update/:id/:shop_id', upload , function(req,res,next){
    var productname = req.body.productname;
    var productprice = req.body.productprice;
    var productdetails = req.body.productdetails;
  //  var shopid = req.body.shopid;
    var productimage = req.file.filename;

    var product_id = req.params.id;
    var shop_id = req.params.shop_id;

    //var shop_id = req.params.id;
    //console.log(`Shop ${shop_id}`);
    //    res.redirect("/UpdateStore");
    //res.render("/Sellerdashboard")
    productModel.findByIdAndUpdate(product_id,{productname:productname , productprice:productprice , productdetails:productdetails , shop_id:shop_id , productimage:productimage}).exec(function(err){
      if(err) throw error
      var productDetails = productModel.findById({_id:product_id});
      productDetails.exec(function(err,data){
        if(err) throw error;
      //  res.render('UpdateStore',{ title: 'shopdetail' , records: data , record: userid});     
        res.redirect("/Viewallproducts/"+shop_id);

      });
    })

  });*/
  
module.exports = router;