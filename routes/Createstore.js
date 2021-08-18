var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');

router.use(express.static(__dirname+"./public/"))

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

router.get('/', checkLoginUser , function(req, res, next) {
    var loginUser = localStorage.getItem("loginUser");

    console.log("routerCalled at create store");
    var userid = req.query.id;
    console.log(userid);
    res.render('CreateStore', { title: 'Create Store' , success:' ' , msg:' ' , records:userid , user_id:userid , loginUser:loginUser});
});




/*router.post('/', upload , function(req, res, next) {
    var shopname = req.body.shopname;
    var imageFile = req.file.filename;
    var success = req.file.filename+ " upload successfully";
    var imageDetails = new uploadModel({
      shopname:shopname,
      imagename:imageFile
    })
    imageDetails.save(function(err,doc){
      if (err) throw err;

      imageData.exec(function(err,data){
        if(err) throw err;
        res.render('CreateStore', { title: 'Upload File', records:data , success:success});
      })
    //  res.render('CreateStore', { title: 'Upload File', success:success });
    });
});  */

module.exports = router;