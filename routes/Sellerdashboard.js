var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
var multer  = require('multer');
var path = require('path');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');
var userModule = require('../modules/user')

router.use(express.static(__dirname+"./public/"))

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
  
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
} 
  
router.get('/', checkLoginUser , function(req, res, next) {
    //var userid = req.params.id;  
    var loginUser = localStorage.getItem("loginUser");   
    console.log("router called, seller dashboard");
    var userid=req.query.id;
    var getshopDetails = shopModel.find({user_id:userid});
  
    getshopDetails.exec(function(err,data){//shop data execute
      if(err) throw err;
      res.render('Sellerdashboard', { title: ' ', records:data , user_id:userid , loginUser:loginUser});
    });
    //res.render('Sellerdashboard', { title: 'No Stores Exist' });
});

router.post('/', upload  ,  function(req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  //var userid = req.params.id;
  var shopname = req.body.shopname;
  var shopaddress = req.body.shopaddress;
  var userid = req.body.userid;
  var imageFile = req.file.filename;
  
  
  //var success = req.file.filename+ " upload successfully";
  //console.log(userid);
  var shopDetails = new shopModel({
    shopname:shopname,
    shopaddress:shopaddress, 
    user_id:userid, 
    imagename:imageFile,
  })
  shopDetails.save(function(err,doc){
    var getshopDetails = shopModel.find({user_id:userid});
  
    getshopDetails.exec(function(err,data){//shop data execute
      if(err)
        throw err;
      res.render('Sellerdashboard', { title: ' ', records:data , user_id:userid , loginUser:loginUser});
    });
  //  res.render('CreateStore', { title: 'Upload File', success:success });
  });
});
  
module.exports = router;
  
