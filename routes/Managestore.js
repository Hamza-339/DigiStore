var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var multer  = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var userModule = require('../modules/user');
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

router.get('/', function(req, res, next) {
  //imageData.exec(function(err,data){
  //  if(err) throw err;
    console.log(req.params.id)
    res.render('Managestore', { title: 'Manage Store', records:" " , msg:' ' });
  //})
});

router.post('/', upload , checkShopname , function(req, res, next) {
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
      imagename:imageFile
    })
    shopDetails.save(function(err,doc){
      if (err) throw err;
      var checkshop = shopModel.findOne({shopname:shopname});
      checkshop.exec(function(err,data){
        console.log(data);  
        res.render('Sellerdashboard', { title: 'Manage Store', records:data});      
      });
    //  res.render('CreateStore', { title: 'Upload File', success:success });
    });
});


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