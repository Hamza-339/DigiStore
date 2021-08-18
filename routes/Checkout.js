var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var multer  = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var shopModel = require('../modules/shop');
var productModel = require('../modules/product');
var cartModel = require('../modules/cart');
var confirmedorderModel = require('../modules/confirmedorder');



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

router.get('/:productid/:userid',async function(req, res, next) {
    var loginUser = localStorage.getItem("loginUser");

    let productDetails=[];
    console.log("router called, customer view all products");
    //var userid=req.query.id;
    var productid = req.params.productid;
    var user_id = req.params.userid;
    var getcartDetails = cartModel.find({user_id:user_id}).populate("product_id");
    //var getproductDetails = productModel.find({productname:productname});
    //var getshopDetails = shopModel.findOne({_id:shopid});
    getcartDetails.exec(function(err,data){//shop data execute
        if(err) throw err;
        data[0].product_id[0].name;
       
        data.forEach(element => {
            element.product_id.forEach(element1 => {
                console.log(`\n Cart Elements: ${element1.productname}`)
                productDetails.push(element1);
            });
        });

         // 'data' would be returned as an array because there may be more than one records
         // in 'data' array against provided user id , but there would always be zero or on
         // due to our implementation logic, but 'data' would always be accessed using subscript
         // notation
         // Inside each cart document there is an array product_id so to access its elements
         // again we need to use subscript notation and populate method provides its data values
        /*data.forEach(element => {
        productIds.push(element.product_id);
        });*/
        console.log("iddddddddsssssss "+ productDetails);
        res.render('Cart', { title: 'Upload File' , cartproducts:productDetails , loginUser:loginUser});
    });
});

router.post('/:userid',async function(req, res, next) {
    var product_id_token = localStorage.getItem("productid");
    var loginUser = localStorage.getItem("loginUser");
    let productDetailsArr=[];
    let cartproductquantity=[];
   var user_id = req.params.userid;
    var cart =await cartModel.findOne({user_id:user_id});
    if (cart) { 
        var already=true;
        for (let i = 0; i < (cart.product_id).length; i++) {
            const productIdinCart = cart.product_id[i].toString();
            var quantity=req.body[productIdinCart];
            console.log(`${productIdinCart} has quantity ${quantity}`);
            const productIdinCartObject = cart.product_id[i];
            try {
                var productDetails = await productModel.findOne({_id:productIdinCartObject});
                var productquantity=parseInt(productDetails.productquantity);
                console.log(productDetails.productname);
            } catch (err) {
                console.log(err.message);
            }
            var finalquantity = productquantity - quantity;
            console.log("Final quantity ******** " + finalquantity);
            if(finalquantity>-1){              
            }else{
                already=false;
                const url=`/Cart/${productIdinCart}/${user_id.toString()}?InvalidStock=Invalid Stock Data`;
                res.redirect(url); 
            }
        }   
        if (already) {
            for (let i = 0; i < (cart.product_id).length; i++) {
                const productIdinCart = cart.product_id[i].toString();
                var quantity=req.body[productIdinCart];
                console.log(`${productIdinCart} has quantity ${quantity}`);
                const productIdinCartObject = cart.product_id[i];
                try {
                    var productDetails = await productModel.findOne({_id:productIdinCartObject});
                    var productquantity=parseInt(productDetails.productquantity);
                    console.log(productDetails.productname);
                } catch (err) {
                    console.log(err.message); 
                }
                cartproductquantity.push(quantity);
                
                var finalquantity = productquantity - quantity;
    
                console.log("Final quantity ******** " + finalquantity);
                var productDetails = productModel.findByIdAndUpdate(productIdinCartObject,{productquantity:finalquantity});
                productDetails.exec(function(err,data){
                    if(err) throw error;
                    //  res.render('UpdateStore',{ title: 'shopdetail' , records: data , record: userid});               
                });
                var productscheckout =await productModel.findOne({_id:productIdinCartObject});
                productDetailsArr.push(productscheckout);
                
            } 
        }
        // My Code
            // 1- productDetailsArr - > contains all products Info
            // 2- cartproductquantity contains quantity
            // 3-  user_id contains user name who placed th order
            for (let index = 0; index < productDetailsArr.length; index++) {
                const productElement = productDetailsArr[index];
                const productquantity= cartproductquantity[index];

                const confirmProduct=new confirmedorderModel({
                    user_id:require('mongoose').Types.ObjectId(user_id),
                    product_id:productElement._id,
                    quantity:productquantity,
                    shop_id:productElement.shop_id,
                    isDeleiverd:false
                    
                });
                const savedStatus=await confirmProduct.save();
            }
          

        // My Code  


     //   res.render('Checkout', { title: 'Password Management System'}); 
            
            // var i = 0;
            // productDetailsArr.forEach(element => {
            //     //shopIds.push(element.shop_id);
            //     confirmedorder['productname'].push(element.productname);
            //     confirmedorder['productprice'].push(element.productprice * cartproductquantity[i++]);
            //     confirmedorder['shop_id'].push(element.shop_id);
            //     confirmedorder['productquantity'].push(cartproductquantity[i++]);
            //     confirmedorder['productimage'].push(element.productimage);
            // });
            // //cart['product_name'].push(productname);

            // console.log("FINALL ARRAY : " + productDetailsArr);
            // console.log("DDDDDDDAAAAAATTTTTTTTAAAAAAAAA:: "+ cartproductquantity);
            // res.render('Checkout', { title: 'Password Management System' , productsincart:productDetailsArr , cartproductquantity:cartproductquantity , user_id:user_id , product_id_token:product_id_token}); 
            res.render('Checkout', { title: 'Password Management System' , productsincart:productDetailsArr , cartproductquantity:cartproductquantity , user_id:user_id , product_id_token:product_id_token , loginUser:loginUser}); 

    }   
    
    //var product_id = req.body;    
    // console.log('in post');
});
 
module.exports = router;