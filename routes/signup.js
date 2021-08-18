var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var userModule = require('../modules/user')

function checkUser(req,res,next){
  var username=req.body.uname;
  var checkexituser = userModule.findOne({username:username});
  checkexituser.exec(function(err,data){
    if(err) throw err;
    if(data){
      return res.render('account', { title: 'Digi Store', LoginMsg:' ',SignupMsg:'Username Already Exists' });
    }
    next();
  });
};

function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail = userModule.findOne({email:email});
  checkexitemail.exec(function(err,data){
    if(err) throw err;
    if(data){
     return res.render('account', { title: 'Digi Store', LoginMsg:' ',SignupMsg:'Email Already Registered' });
    }
    next();
  });
};

function validateEmail(req,res,next){
  var email=req.body.email;
  const emailToValidate = email;
  const emailRegexp = "";
  if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(emailToValidate)){
    return res.render('account', { title: 'Digi Store', LoginMsg:' ',SignupMsg:'Incorrect Email Format' });
  }
  next();
  //console.log("Validation Email Result:  " + emailRegexp.test(emailToValidate));
};




router.get('/', function(req, res, next) {
  res.render('account', { title: ' ', LoginMsg:' ',SignupMsg:' ' });
});

router.post('/', checkUser , checkEmail , validateEmail , function(req, res, next) {
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;//not encrypted password
  var confpassword=req.body.confpassword;
  var address = req.body.address;
  var usertype=req.body.checking;
  
  //console.log("sdad"+username,password,seller);
  //console.log("sdad"+username,password,usertype);
  console.log(req.body);

  if(confpassword!=password){
    res.render('account', { title: 'Password Management System', LoginMsg:' ',SignupMsg:'Password did not match with confirm password' });
  }
  else{
    //console.log(username);
    password = bcrypt.hashSync(req.body.password,10);//encrypt password and store again in password variable
    var userDetails=new userModule({
      username:username,
      email:email,
      password:password,
      address:address,
      usertype:usertype
    });
    userDetails.save((err,doc)=>{
    if(err) throw err;
    
    res.render('account', { title: 'Password Management System', LoginMsg:' ',SignupMsg:'User Registered Successfully' });
    });
  }

});

module.exports = router;