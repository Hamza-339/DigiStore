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


var Storage = multer.diskStorage({
  destination:"./public/uploads",
  filename:(req,file,cb)=>{
  cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage:Storage
}).single('file');

router.get('/:id', upload , function(req, res, next) {
  var product_id_token = localStorage.getItem("productid");
  var loginUser = localStorage.getItem("loginUser");
  var userid=req.params.id;
  var getshopDetails = shopModel.find({});
  getshopDetails.exec(function(err,data){//shop data execute
    if(err) throw err;
    res.render('Customerviewallstores', { title: 'Customerviewallstores', records:data , user_id:userid , product_id_token:product_id_token , loginUser:loginUser});
  });

});


/*
router.post('/', upload , function(req, res, next) {

    var productid = req.body.productid;
    var productname = req.body.productname;
    var productprice = req.body.productprice;
    var productimage = req.file.filename;
    var shopid = req.body.shopid;
    alert(shopid);
      
    var productDetails=new productModel({
        productid:productid,
        productname:productname,
        productprice:productprice,
        productimage:productimage,
        shop_id:shopid
    });
/*    var shopinfo;
    var checkshop = shopModel.findOne({shopname:shopname});
    checkshop.exec(function(err,data1){//shop data execute
      console.log(data1); 
    //  shopinfo = data ;
    });

    productDetails.save((err,doc)=>{
        if(err) throw err;
        var getproductDetails = productModel.find({shop_id:shopid});
        getproductDetails.exec(function(err,data){//product data execute
          if(err) throw err;
          console.log(data);
          var checkshop = shopModel.findOne({_id:shopid});
          checkshop.exec(function(err,data1){//shop data execute
            if(err) throw err;
            console.log(data1); 
            res.render('Viewallproducts', { title: 'Viewallproducts', records:data1, record:data});
          });
        })
    });
        
      /*  var joinproductshop = productModel.aggregate([
          {
            $lookup:
            {
              from:"shops",
              localField:"shop_id",
              foreignField:"_id",
              as:"shopDetails"
            }
          },
          { $unwind : "$shopDetails" }
        ]);
        joinproductshop.exec(function(err,results){
          if(err) throw err;
          console.log(results);
          res.render('Viewallproducts', { title: 'View all products', records:results});      
        });

        //  productDetails.exec(function(err,data){//product data execute
        //    console.log(shopinfo);
    //})

     //   res.render('Viewallproducts', { title: 'Viewallproducts' });

});*/
 
module.exports = router;