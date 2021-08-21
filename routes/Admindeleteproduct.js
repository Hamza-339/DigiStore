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

router.get('/delete/:id/:shop_id/:userid/:adminid', checkLoginUser , function(req, res, next) {
  var userid = req.params.userid;
  var product_id = req.params.id;
  var shop_id = req.params.shop_id; 
  var admin_id = req.params.adminid;

  var productDelete = productModel.findByIdAndDelete(product_id);
  productDelete.exec(function(err){
    if(err) throw error;
    res.redirect('/Adminviewallproducts/'+shop_id+'/'+admin_id+'/'+userid);//shop_admin_user
  })
});


module.exports = router;