var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var multer  = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');
const cartModel = require('../modules/cart');


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

router.get('/delete/:id/:userId',async function(req, res, next) {
  const product_id = req.params.id;
  const user=require('mongoose').Types.ObjectId(req.params.userId);

  const cart=await cartModel.findOne({user_id:user});
  if (cart) {
    var updatedArray=[];
    var productsArray=cart.product_id;
    for (let index = 0; index < productsArray.length; index++) {
      const element = productsArray[index];
      if(product_id.localeCompare(element.toString())){
        updatedArray.push(element);
      }
    }
    const result=await cartModel.findByIdAndUpdate(cart._id,{product_id:updatedArray});
  } else {
    console.log("No Cart Exist against user"+user_id);
  }

  // var productDelete = productModel.findByIdAndDelete(product_id);
  // productDelete.exec(function(err){
  //   if(err) throw error;
  //   res.redirect('/Viewallproducts/'+shop_id);
  // })
  //res.redirect("/Cart/" + productid +"/"+ user_id);
  res.redirect(`/Cart/${product_id}/${req.params.userId}`)
}); 
 
module.exports = router;

