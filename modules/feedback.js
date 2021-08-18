const { text } = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tutweb:tutweb123@cluster0.gmxzy.mongodb.net/Digistore?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
var conn =mongoose.Collection;

var feedbackSchema = new mongoose.Schema({

    q1:{
        type: String,
        required: true
    },
    q2:{
        type: String,
        required: true
    },
    q3:{
        type: String,
        required: true
    },
    q4:{
        type: String,
        required: true
    },
    q5:{
        type: String,
        required: true
    },
    q6:{
        type: String,
        required: true
    },
    q7:{
        type: String,
        required: true
    } 
})

var feedbackModel = mongoose.model('feedback',feedbackSchema);
module.exports = feedbackModel;