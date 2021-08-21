var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require("bcrypt");
var multer  = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');
var confirmedorderModel = require('../modules/confirmedorder');
var userModule = require('../modules/user')


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

router.get('/:orderid/:shopid/:adminid/userid' , checkLoginUser ,async function(req, res, next) {
  var ordersDetails = await confirmedorderModel.update({_id:req.params.orderid},{
    $set:{
      isDeleiverd:true
  }});
 
  res.redirect(`/Adminviewallproducts/${req.params.shopid}/${req.params.adminid}/${req.params.userid}`);
})

router.get('/:id/:adminid/:userid' , checkLoginUser ,async function(req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  let customerids = []; 
  let customernames = [];
  let customeraddresses =[];
  console.log("router called view all products");
  //var userid=req.query.id;
  var shopid = req.params.id;
  var admin_id = req.params.adminid;
  var user_id = req.params.userid;
  var ordersDetails = await confirmedorderModel.find({shop_id:shopid,isDeleiverd:false}).populate("product_id").populate("user_id");
  console.log("orders fetched");
  var getshopDetails = shopModel.findOne({_id:shopid});
  var getproductDetails = productModel.find({shop_id:shopid});

  getproductDetails.exec(function(err,data){//shop data execute
    if(err) throw err;
    getshopDetails.exec(function(err,data1){
      if(err) throw err;
          res.render('Adminviewallproducts', { title: 'Viewallproducts', orders:ordersDetails, records:data , shop_id:shopid , record:data1 , admin_id:admin_id , user_id:user_id , loginUser:loginUser });
    });
  });
});   

 
module.exports = router;