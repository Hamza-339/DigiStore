var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var multer  = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var userModule = require('../modules/user');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');
var jwt = require('jsonwebtoken');

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

function checkShopname(req,res,next){
  var shopname = req.body.shopname;
  var checkShopname = shopModel.findOne({shopname:shopname});
  checkShopname.exec(function(err,data){
    if(err) throw err;
    if(data){
      return res.render('Createstore', { title: 'Digi Store', msg:'Shopname Already Exists' });
    }
    next();
  });
};

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

router.get('/:id/:userid', checkLoginUser ,function(req, res, next) {
    var loginUser = localStorage.getItem("loginUser");

  //imageData.exec(function(err,data){
  //  if(err) throw err;
    var shopid = req.params.id;
    var userid = req.params.userid;
    console.log("shop id in /addproduct ************"+shopid);
    res.render('Addproduct', { title: 'Addproduct', records:shopid , msg:' ' , user_id:userid , loginUser:loginUser});
  //})
});

/*


/*router.post('/addproduct', upload , function(req, res, next) {

  var productid = req.body.productid;
  var productname = req.body.productname;
  var productprice = req.body.productprice;
  var productimage = req.body.productimage;

  var productDetails=new productModel({
    productid:productid,
    productname:productname,
    productprice:productprice,
    productimage:productimage
  });
  productDetails.save((err,doc)=>{
    if(err) throw err;  
    res.render('Managestore', { title: ''});
  });
});
*/
module.exports = router;