var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
var multer  = require('multer');
var path = require('path');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');
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


router.get('/' , function(req, res, next) {
    var regex = new RegExp(req.query["term"],'i');
    var getproductDetails = productModel.find({productname:regex},{'productname':1}.sort({"updated_at":-1}).sort({"created_at":-1}).limit(20));

    getproductDetails.exec(function(err,data){
        console.log(data);
        var result=[];
        if(!err){
            if(data && data.length && data.length>0){
                data.forEach(user => {
                    let obj={
                        id:user._id,
                        label:user.productname
                    };
                    result.push(obj);
                });
            }
            res.jsonp(result);
        }
    });

});

module.exports = router;
