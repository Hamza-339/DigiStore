var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
var multer  = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');
var feedbackModel = require('../modules/feedback');

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
    var loginUser = localStorage.getItem("loginUser");
 
    var adminid=req.params.id;
    var getfeedbackDetails = feedbackModel.find({});
  
    getfeedbackDetails.exec(function(err,data){//shop data execute
      if(err) throw err;
      res.render('Adminviewfeedback', { title: 'Sellerstores', records:data , adminid:adminid , loginUser:loginUser});
    });
    //res.render('Sellerdashboard', { title: 'No Stores Exist' });
});

module.exports = router;
