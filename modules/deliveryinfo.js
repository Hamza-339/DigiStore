const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tutweb:tutweb123@cluster0.gmxzy.mongodb.net/Digistore?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
var conn =mongoose.Collection;

var deliveryinfoSchema = new mongoose.Schema({

    contact:{
        type:Number,
        required: true
    },
    address:{
        type: String,
        required: true
    }

})

var deliveryinfoModel = mongoose.model('deliveryinfo',deliveryinfoSchema);
module.exports = deliveryinfoModel;