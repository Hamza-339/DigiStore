
var express = require('express');
var router = express.Router();
//router.use(express.static(__dirname+"./public/"))
var bcrypt = require("bcrypt");
var userModule = require('../modules/user')
var jwt = require('jsonwebtoken');
var productModel = require('../modules/product');

function checkCredentials(req,res,next){
  var username=req.body.uname;
  var password=req.body.password;
  var checkusername = userModule.findOne({username:username});
  checkusername.exec(function(err,data){
    if(err) throw err;
    if(!data){
     return res.render('account', { title: 'Digi Store', SignupMsg:' ',LoginMsg:'Invalid Username and Password' });
    }
    next();
  });
};
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

router.get('/', function(req, res, next) {
  res.render('account', { title: 'Express' , SignupMsg:' ',LoginMsg:' ' , productid:' ' });
});

router.post('/', checkCredentials , function(req, res, next) {
  var getproductid;
  var username=req.body.uname;
  var password=req.body.password;
  //var product_id=req.body.productid;

  //var customertype=req.body.checking;

  console.log("sdad"+username,password);

  var checkuser = userModule.findOne({username:username});
  console.log(checkuser);
  checkuser.exec(function(err,data){
   // console.log("nO  cERROR"+data);
    if(err) throw err;
    //console.log("nO  ERROR"+data);
    var getPassword = data.password;
    var getchecking = data.usertype;
    var getuserid = data._id;
   // console.log(getchecking);
    var productDetail = productModel.findOne({productname:"Tomato 1kg"});
    if(bcrypt.compareSync(password,getPassword)){// first jo user ne enter kiya second database wala mtlb us username k against jo datbase me password ha
      
      productDetail.exec(function(err,data){
        if(err) throw err;
        //console.log(data);
         getproductid = data._id;
         localStorage.setItem('productid', getproductid);
      });

      if(getchecking=="seller"){
        console.log("I am seller");
        //var idd=2;
        //res.redirect("/Sellersaddsdashboarsd?id="+idd);
        var token = jwt.sign({ userID: getuserid }, 'loginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', username); 
        res.redirect("/Sellerdashboard?id="+getuserid);
      }
      else if(getchecking=="customer"){
        console.log("I am buyer");
        var token = jwt.sign({ userID: getuserid }, 'loginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', username); 
        res.redirect("/Customerdashboard?id="+getuserid); 
      }
      else{
        console.log("I am admin");
        var token = jwt.sign({ userID: getuserid }, 'loginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', username); 
        res.redirect("/Admindashboard?id="+getuserid); 
      }
    }  
    else{
      res.render('account', { title: 'Digi Store', SignupMsg:' ',LoginMsg:'Invalid Username and Password' , productid:getproductid });     
    }
  });
  
});

router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  //localStorage.removeItem('loginUser');
  res.redirect('/');
});

module.exports = router;
