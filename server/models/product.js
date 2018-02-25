var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var crypto = require('crypto');

var ProductSchema = new Schema({
  title: String,
  description: String,
  url:String,
  price:Number,
  quantity:Number,
  done:Boolean,
  size: {type:String,default: 'N/A'},
  productId: {
    type: String,
    default: function() {
      return crypto.randomBytes(12).toString('hex');
    }
  }
},
    { versionKey: false });

var Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
