const { text } = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tutweb:tutweb123@cluster0.gmxzy.mongodb.net/Digistore?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
var conn =mongoose.Collection;

var productSchema = new mongoose.Schema({

    productname:{
        type: String,
        required: true
    },
    productprice:{
        type: Number,
        required: true
    },
    productdetails:{
        type: String,
        required: true
    },
    shop_id:{
        type:mongoose.Schema.ObjectId,
        required: true
    },
    productquantity:{
        type:Number,
        required: true
    },
    productimage:{
        type: String,
        required: true
    }
})

var productModel = mongoose.model('products',productSchema);
module.exports = productModel;