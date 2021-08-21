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
  
router.get('/:id', checkLoginUser , function(req, res, next) {
    var adminid = req.params.id;  
    var loginUser = localStorage.getItem("loginUser");   
    console.log("router called, admin dashboard");
    //var userid=req.query.id;
    var getuserDetails = userModule.find({});
  
    getuserDetails.exec(function(err,data){//shop data execute
      if(err) throw err;
      res.render('Viewregisteredusers', { title: ' ', records:data , admin_id:adminid , loginUser:loginUser});
    });
    //res.render('Sellerdashboard', { title: 'No Stores Exist' });
});

module.exports = router;