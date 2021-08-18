var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var multer  = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');
var cartModel = require('../modules/cart');

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

router.get('/:productid/:userid',async function(req, res, next) {
    var loginUser = localStorage.getItem("loginUser");

    console.log("router called, customer view all products");
    //var userid=req.query.id;
    var productid = req.params.productid;
    var user_id = req.params.userid;
    let productDetails=[];

    var getcartDetails = cartModel.find({user_id:user_id}).populate("product_id");
    //var getproductDetails = productModel.find({productname:productname});
    //var getshopDetails = shopModel.findOne({_id:shopid});
    getcartDetails.exec(function(err,data){//shop data execute
        if(err) throw err;
        data[0].product_id[0].name;
       
        data.forEach(element => {
            element.product_id.forEach(element1 => {
                console.log(`\n Cart Elements: ${element1.productname}`)
                productDetails.push(element1);
            });
        });

         // 'data' would be returned as an array because there may be more than one records
         // in 'data' array against provided user id , but there would always be zero or on
         // due to our implementation logic, but 'data' would always be accessed using subscript
         // notation
         // Inside each cart document there is an array product_id so to access its elements
         // again we need to use subscript notation and populate method provides its data values
        /*data.forEach(element => {
        productIds.push(element.product_id);
        });*/
        console.log("iddddddddsssssss "+ productDetails);
        var subtotal = 0;
        productDetails.forEach(element => {
          subtotal = subtotal + element.productprice;
        });
        console.log("SUBTOTAL------->" + subtotal)
        res.render('Cart', { title: 'Upload File' , cartproducts:productDetails , userid:user_id , loginUser:loginUser});
    });
});

 
module.exports = router;