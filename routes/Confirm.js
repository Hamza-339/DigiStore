var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var multer  = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');
var cartModel = require('../modules/cart');
var deliveryModel = require('../modules/deliveryinfo');



router.use(express.static(__dirname+"./public/"))
//var imageData = uploadModel.find({});


router.post('/:userid',async function(req, res, next) {
    var product_id_token = localStorage.getItem("productid");
    var loginUser = localStorage.getItem("loginUser");

    var user_id = req.params.userid;
    var contactno = req.body.contact;
    var deliveryaddress = req.body.address;

    console.log("Valuesssssssssssssss: " + contactno + deliveryaddress);

    //var success = req.file.filename+ " upload successfully";
    //console.log(userid);
    var deliveryDetails = new deliveryModel({
      contact:contactno,
      address:deliveryaddress
    })
    await deliveryDetails.save(function(err,doc){
      if (err) throw err;
      console.log(doc);
        res.render('Confirm', { title: 'Digistore', records:doc , user_id:user_id , product_id_token:product_id_token , loginUser:loginUser});      
    //  res.render('CreateStore', { title: 'Upload File', success:success });
    });
   
});

module.exports = router;