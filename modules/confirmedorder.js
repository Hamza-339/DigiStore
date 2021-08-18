const { text } = require('express');
const mongoose = require('mongoose');
var productModel = require('../modules/product');
var userModel = require('../modules/user');

mongoose.connect('mongodb+srv://tutweb:tutweb123@cluster0.gmxzy.mongodb.net/Digistore?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
var conn =mongoose.Collection;

var confirmedorderSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:userModel
    },
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:productModel
    },
    quantity:Number,
    shop_id:String,
    isDeleiverd:Boolean

    
});


// var confirmedorderSchema = new mongoose.Schema({

//     productname:[{ 
//         type: String,
//         required: true
//     }],
//     productprice:[{
//         type: Number,
//         required: true
//     }],
//     shop_id:[{
//         type:mongoose.Schema.ObjectId,
//         required: true
//     }],
//     productquantity:[{
//         type:Number,
//         required: true
//     }],
//     productimage:[{
//         type: String,
//         required: true
//     }]
// })

var confirmedorderModel = mongoose.model('confirmedorder',confirmedorderSchema);
module.exports = confirmedorderModel;
