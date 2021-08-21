const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tutweb:tutweb123@cluster0.gmxzy.mongodb.net/Digistore?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
var conn =mongoose.Collection;

var shopSchema = new mongoose.Schema({
    shopname:{
        type: String,
        required: true
    },
    shopaddress:{
        type: String,
        required: true
    },
    user_id:{
        type:mongoose.Schema.ObjectId,
        required: true
    }, 
    imagename:{
        type: String,
        required: true
    }

})

var shopModel = mongoose.model('shops',shopSchema);
module.exports = shopModel;