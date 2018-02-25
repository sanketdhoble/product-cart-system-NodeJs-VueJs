var mongoose=require('mongoose');
var Profile=require('../models/user');
var Product=require('../models/product');
var Cart=require('../models/cart');
// var jwt    = require('jsonwebtoken');
var session = require('express-session');
// const ObjectId = mongoose.Types.ObjectId;

module.exports = function(app) {
  var session;
  app.get('/products',auth, (req, res) => {
    Product.find({}, function (error, products) {
      if (error) {
        console.error(error);
      }
      res.send({
        products: products
      })
    })
  })
  function updateProduct(status,product,res){
    console.log("update->",product)
    Product.update(
        { productId: product.productId },
        {$inc: { quantity: status.inc*parseInt(product.quantity) }},function(err,product){
          if (err)
            res.send(err);
          res.json(product);
        }
    )
  }

  app.post('/add_products',auth, (req, res) => {
    Product.create({
      description : req.body.description,
      title : req.body.title,
      price:req.body.price,
      quantity:req.body.quantity,
      url:req.body.url,
      size:req.body.size
    }, function(err, product) {
      if (err)
        res.send(err);
      res.json(product);
    });
  })
  /**ADD TO CART**/

  app.post('/addtocart',auth, (req, res) => {
    Cart.findOne({userId:req.body.userId,productId: req.body.productId}, function(err, cart) {

      if (err) throw err;

      if (cart) {
        res.status(409).json({ success: false, message: 'This product is already added to cart'});
      }
      else{
        Cart.create({
          description : req.body.description,
          title : req.body.title,
          price:req.body.price,
          quantity:req.body.quantity,//cart quantity
          url:req.body.url,
          size:req.body.size,
          productId:req.body.productId,
          userId:req.body.userId
        }, function(err, product) {
          if (err)
            res.send(err);
          else {
            var status = {inc: -1}
            updateProduct(status, product, res);
          }
          // res.json(product);
        });
      }

    })

    // Cart.findOneAndUpdate({ productId: product.productId }, {quantity: parseInt(product.quantity)}, {upsert:true}, function(err, doc){
    //   if (err) return res.send(500, { error: err });
    //   return res.send("succesfully saved");
    // });


  })
  /**Cart product list**/
  app.get('/cart/:id',auth, (req, res) => {
    console.log('userId--',req.params)
    Cart.find({userId:req.params.id}, function (error, products) {
      if (error) {
        console.error(error);
      }
      res.send({
        products: products
      })
    })
  })
  /**Remove single product from CART**/
  app.delete('/cart/removeproduct/:id',auth, (req,res)=>{
    console.log("Test--cartId",req.params)
    Cart.findByIdAndRemove(req.params.id, function (err, product) {
      console.log(err)
      console.log('pro-->',product)
      if (err)
        res.send({msg:"cannot find id"});
      else {
        var status = {inc: 1}
        updateProduct(status, product, res);
      }
    })

  })


  //Register User
  app.post('/register', function(req, res) {

    console.log(req)
    Profile.findOne({email: req.body.email}, function(err, user) {

      if (err) throw err;

      if (user) {
        console.log(user)
        res.status(409).json({ success: false, message: 'Email already taken'});
      }
      else
      {

        Profile.create({
          username : req.body.username,
          password:req.body.password,
          email:req.body.email,
          done : true
        }, function(err, userDetails) {
          if (err) {
            // if(err.code==11000)
            //     return res.status(409).json({ success: false, message: 'username or email already taken'})
            // else {
            return res.status(401).send(err);
            // }
          }
          else
            return res.json(userDetails);

        });
      }
    })

  });



  //authenticate
  app.post('/authenticate', function(req, res) {

    // find the user
    Profile.findOne({
      username: req.body.username
    }, function(err, user) {

      if (err) throw err;

      if (!user) {
        res.status(410).json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {

        // check if password matches
        if (user.password != req.body.password) {
          res.status(411).json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {

          // if user is found and password is right
          // create a token
          // var token = jwt.sign(user, 'superSecret', {
          //     expiresIn: 86400 // expires in 24 hours
          // });

          req.session.user = req.body.username;
          req.session.admin = true;
          //res.send("login success!");
          session=req.session.user
          res.json({
            success: true,
            message: 'Enjoy your session!',
            session: req.session.user,
            data:{"username":user.username,"password":user.password,"email":user.email,"_id":user._id,"userId":user.userId}
          });
        }

      }

    });
  });
  app.get('/logout', function (req, res) {
    req.session.destroy();
    session='';
    res.send("logout success!");
  });
  app.get('/verify',auth,function(req,res){

    res.json({islogin:true});
  })
  app.get('/content',auth, function (req, res) {
    res.send("You can only see this after you've logged in.");
  });


  function auth(req, res, next) {
    var sessionValue = req.body.token || req.params.token|| req.headers['token'];
    if ( session === sessionValue)
      return next();
    else {
      // if there is no token
      // return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });

    }
  };


}