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

function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}

var Storage = multer.diskStorage({
  destination:"./public/uploads",
  filename:(req,file,cb)=>{
  cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage:Storage
}).single('file');

router.get('/delete/:id/:adminid', checkLoginUser , function(req, res, next) {
  var shop_id = req.params.id;
  //var user_id = req.params.user_id;
  var admin_id = req.params.adminid;
  var shopDelete = shopModel.findByIdAndDelete(shop_id);
  shopDelete.exec(function(err){
    if(err) throw error;
    //var productsDelete = productModel.findByIdAndDelete(shop_id);
    var productsDelete = productModel.deleteMany({ shop_id : shop_id })
    productsDelete.exec(function(err){
      if(err) throw error; 
      res.redirect('/Adminsellerstores/'+admin_id);
    })
  })
});

 
module.exports = router;