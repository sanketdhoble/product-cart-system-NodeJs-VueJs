var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var crypto = require('crypto');

var CartSchema = new Schema({
    productId:String,
    userId:String,
    url:String,
    title: String,
    description: String,
    price:Number,
    quantity:Number,
    size: {type:String,default: 'N/A'},
  },{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
