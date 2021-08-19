var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var multer  = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');
var feedbackModel = require('../modules/feedback');

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

router.get('/:id', upload , checkLoginUser ,function(req,res,next){
    var product_id_token = localStorage.getItem("productid");
    var loginUser = localStorage.getItem("loginUser");

    var userid = req.params.id;
    res.render('Customerfeedback',{ title: 'Customerfeedback' , user_id:userid , product_id_token:product_id_token , Msg:' ' , loginUser:loginUser});     
});

router.post('/:id', upload , function(req,res,next){
    var product_id_token = localStorage.getItem("productid");
    var loginUser = localStorage.getItem("loginUser");

    var userid = req.params.id;
    var question1 = req.body.q1;
    var question2 = req.body.q2;
    var question3 = req.body.q3;
    var question4 = req.body.q4;
    var question5 = req.body.q5;
    var question6 = req.body.q6;
    var question7 = req.body.q7;

    var Feedbackanswers = new feedbackModel({
        q1:question1,
        q2:question2, 
        q3:question3, 
        q4:question4,
        q5:question5,
        q6:question6,
        q7:question7,
    });
    Feedbackanswers.save(function(err,doc){
        if(err) throw err;
        res.render('Customerfeedback',{ title: 'Customerfeedback' , user_id:userid , product_id_token:product_id_token , Msg:'Thank you for submitting your feedback !' , loginUser:loginUser});     
    });
});

module.exports = router;