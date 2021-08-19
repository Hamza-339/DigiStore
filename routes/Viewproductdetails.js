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

router.get('/:id/:userid', upload , checkLoginUser , function(req,res,next){
      var loginUser = localStorage.getItem("loginUser");

      var product_id = req.params.id;
      var user_id = req.params.userid;
      var productDetails = productModel.findOne({_id:product_id});
      productDetails.exec(function(err,data){
        if(err) throw error;
        console.log(data);
        res.render('Viewproductdetails',{ title: 'updateproduct' , records:data , user_id:user_id , loginUser:loginUser});     
    })

});

module.exports = router;