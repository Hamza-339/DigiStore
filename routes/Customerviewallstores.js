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
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}

router.get('/:id', upload , checkLoginUser , function(req, res, next) {
  var product_id_token = localStorage.getItem("productid");
  var loginUser = localStorage.getItem("loginUser");
  var userid=req.params.id;
  var getshopDetails = shopModel.find({});
  getshopDetails.exec(function(err,data){//shop data execute
    if(err) throw err;
    res.render('Customerviewallstores', { title: 'Customerviewallstores', records:data , user_id:userid , product_id_token:product_id_token , loginUser:loginUser});
  });

});

 
module.exports = router;