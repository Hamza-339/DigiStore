var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup');
var sellerdashboardRouter = require('./routes/Sellerdashboard');
var customerdashboardRouter = require('./routes/Customerdashboard');
var createstoreRouter = require('./routes/Createstore');
var managestoreRouter = require('./routes/Managestore');
var ViewallproductsRouter = require('./routes/Viewallproducts');
var CustomerviewallstoresRouter = require('./routes/Customerviewallstores');
var ShopdetailRouter = require('./routes/Shopdetail');
var AddproductRouter = require('./routes/Addproduct');
var ProductdetailRouter = require('./routes/Productdetail');
var ViewproductdetailsRouter = require('./routes/Viewproductdetails');
var CustomerviewallproductsRouter = require('./routes/Customerviewallproducts');
var SearchproductsRouter = require('./routes/Searchproducts');
var AutocompleteRouter = require('./routes/Autocomplete');
var CustomerviewproductdetailsRouter = require('./routes/Customerviewproductdetails');
var AddtocartRouter = require('./routes/Addtocart');
var CartRouter = require('./routes/Cart');
var CheckoutRouter = require('./routes/Checkout');
var CartdetailRouter = require('./routes/Cartdetail');
var ConfirmRouter = require('./routes/Confirm');
var CustomershowallproductsRouter = require('./routes/Customershowallproducts');
var CustomerfeedbackRouter = require('./routes/Customerfeedback');
var SellerstoresRouter = require('./routes/Sellerstores');
var AdmindashboardRouter = require('./routes/Admindashboard');
var AdminsellerstoresRouter = require('./routes/Adminsellerstores');
var AdminviewallproductsRouter = require('./routes/Adminviewallproducts');
var AdmindeleteproductRouter = require('./routes/Admindeleteproduct');
var AdmindeletestoreRouter = require('./routes/Admindeletestore');
var AdminuserdeleteRouter = require('./routes/Adminuserdelete')
var ViewregisteredusersRouter = require('./routes/Viewregisteredusers')
var SellerfeedbackRouter = require('./routes/Sellerfeedback')





var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter);
app.use('/Sellerdashboard', sellerdashboardRouter);
app.use('/Customerdashboard', customerdashboardRouter);
app.use('/Createstore', createstoreRouter);
app.use('/Managestore', managestoreRouter);
app.use('/Viewallproducts', ViewallproductsRouter);
app.use('/Customerviewallstores', CustomerviewallstoresRouter);
app.use('/Shopdetail', ShopdetailRouter);
app.use('/Addproduct', AddproductRouter);
app.use('/Productdetail', ProductdetailRouter);
app.use('/Viewproductdetails', ViewproductdetailsRouter);
app.use('/Customerviewallproducts', CustomerviewallproductsRouter);
app.use('/Searchproducts', SearchproductsRouter);
app.use('/Autocomplete', AutocompleteRouter);
app.use('/Customerviewproductdetails', CustomerviewproductdetailsRouter);
app.use('/Addtocart', AddtocartRouter);
app.use('/Cart', CartRouter);
app.use('/Checkout', CheckoutRouter);
app.use('/Cartdetail', CartdetailRouter);
app.use('/Confirm', ConfirmRouter);
app.use('/Customershowallproducts', CustomershowallproductsRouter);
app.use('/Customerfeedback', CustomerfeedbackRouter);
app.use('/Sellerstores', SellerstoresRouter);
app.use('/Admindashboard', AdmindashboardRouter);
app.use('/Adminsellerstores', AdminsellerstoresRouter);
app.use('/Adminviewallproducts', AdminviewallproductsRouter);
app.use('/Admindeleteproduct', AdmindeleteproductRouter);
app.use('/Admindeletestore', AdmindeletestoreRouter);
app.use('/Adminuserdelete', AdminuserdeleteRouter);
app.use('/Viewregisteredusers', ViewregisteredusersRouter);
app.use('/Sellerfeedback', SellerfeedbackRouter);











// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
