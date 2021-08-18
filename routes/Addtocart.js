var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var multer  = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');
var cartModel = require('../modules/cart');
var mongoose = require('mongoose');

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
    console.log("router called, customer view all products");
    //var userid=req.query.id;
    var productid = req.params.productid;
    var user_id = req.params.userid;
    var cart =await cartModel.findOne({user_id:user_id});
        //3 cases to handle in add to cart
        // No cart exist for this user
        // Cart Exist For user and new product is added
        // Cart Exist for user but user clicked on same product for adding to cart
    if(!cart){
      var cart = new cartModel({
          user_id:user_id,
          product_id:productid
      })
      cart.save(function(err,data){
          if (err) throw err;
          res.redirect("/Cart/" + productid +"/"+ user_id);
      });
    }
    else{
      var stringProductIds=cart.product_id.map(x => x.toString());
      if (!(stringProductIds.indexOf(productid) > -1)) {
        cart['product_id'].push(productid);
        cart.save(function(err,data){
          if (err) throw err;               
          
        });
      } 
      res.redirect("/Cart/" + productid +"/"+ user_id);
      
      // if product already exist in cart don't add new product
     // var arraycontainsturtles = (myarr.indexOf() > -1);
      //var _id = mongoose.mongo.BSONPure.ObjectID.fromHexString("4eb6e7e7e9b7f4194e000001");
      const stringsArray = cart.product_id.map(x => x.toString());
      
        //cart.product_id.push(productid);
    }
  });

/*router.post('/:productid/:userid', function(req, res, next) {
  console.log("router called, customer view all products");
  //var userid=req.query.id;
  var productid = req.params.productid;
  var user_id = req.params.userid;
  var cart = cartModel.findOne({user_id:user_id});
  if(!cart){
    var cart = new cartModel({
        user_id:user_id,
        product_id:product_id
    })
    cart.save(function(err,data){
        if (err) throw err;
        res.redirect("/Customerviewproductdetails");
    });
  }
  else{
    cart['product_id'].push(productid);
    //cart.product_id.push(productid);
  }
});*/

 
module.exports = router;