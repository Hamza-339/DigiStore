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

router.get('/delete/:id/:user_id', checkLoginUser , function(req, res, next) {
  var shop_id = req.params.id;
  var user_id = req.params.user_id;
  var shopDelete = shopModel.findByIdAndDelete(shop_id);
  shopDelete.exec(function(err){
    if(err) throw error;
    //var productsDelete = productModel.findByIdAndDelete(shop_id);
    var productsDelete = productModel.deleteMany({ shop_id : shop_id })
    productsDelete.exec(function(err){
      if(err) throw error; 
      res.redirect("/Sellerdashboard?id="+user_id);
    })
  })
});

router.get('/UpdateStore/:id/:user_id', upload , checkLoginUser , function(req,res,next){
    var loginUser = localStorage.getItem("loginUser");
    var shopid = req.params.id;
    var userid = req.params.user_id;
    console.log("shopid and userid " + shopid + userid);
    console.log('Router Called in update store');  
    //var shop_id = req.params.id;
    //console.log(`Shop ${shop_id}`);
    //    res.redirect("/UpdateStore");
    //res.render("/Sellerdashboard")
    var shopUpdate = shopModel.findById(shopid);
    shopUpdate.exec(function(err,data){
      if(err) throw error;
      console.log("Shop details data: " + data)
      res.render('UpdateStore',{ title: 'shopdetail' , records: data , record: userid , loginUser:loginUser});     
    })
  });

  router.post('/UpdateStore/:id/:user_id', upload , checkLoginUser , function(req,res,next){
    var loginUser = localStorage.getItem("loginUser");
    var shop_name = req.body.shopname;
    var shop_address = req.body.shopaddress;
    var imageFile = req.file.filename;
    //var userid = req.body.userid;
    var shopid = req.params.id;
    var userid = req.params.user_id;
    console.log("shopid and userid " + shopid + userid);
    console.log('Router Called in update store');  
    //var shop_id = req.params.id;
    //console.log(`Shop ${shop_id}`);
    //    res.redirect("/UpdateStore");
    //res.render("/Sellerdashboard")
    shopModel.findByIdAndUpdate(shopid,{shopname:shop_name , shopaddress:shop_address , user_id:userid , imagename:imageFile}).exec(function(err){
      if(err) throw error
      var shopDetails = shopModel.findById({_id:shopid});
      shopDetails.exec(function(err,data){
        if(err) throw error;
      //  res.render('UpdateStore',{ title: 'shopdetail' , records: data , record: userid});     
        res.redirect("/Sellerdashboard?id="+userid);

      });
    })

  });
  
module.exports = router;