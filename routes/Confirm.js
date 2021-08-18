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


router.get('/:userid',async function(req, res, next) {
    var product_id_token = localStorage.getItem("productid");
    var loginUser = localStorage.getItem("loginUser");
    var user_id = req.params.userid;
    res.render('Confirm', { title: 'Digistore', user_id:user_id , product_id_token:product_id_token , loginUser:loginUser});      
  
});

module.exports = router;