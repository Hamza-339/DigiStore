const { text } = require('express');
const mongoose = require('mongoose');
var productModel = require('../modules/product');

mongoose.connect('mongodb+srv://tutweb:tutweb123@cluster0.gmxzy.mongodb.net/Digistore?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
var conn =mongoose.Collection;

var cartSchema = new mongoose.Schema({

    user_id:{
        type:mongoose.Schema.ObjectId
    },
    product_id:{
        type:[mongoose.Schema.ObjectId],
        ref:productModel
    }
})

var cartModel = mongoose.model('cart',cartSchema);
module.exports = cartModel;