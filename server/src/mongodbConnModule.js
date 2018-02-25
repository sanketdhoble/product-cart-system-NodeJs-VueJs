var mongoose = require('mongoose');

module.exports.connect = function() {
	// mongoose.connect('mongodb://localhost:27017/cart');
	mongoose.connect('mongodb://heroku_wzx292v1:ov4ufiasdkmta14k26g2jl3i9a@ds129010.mlab.com:29010/heroku_wzx292v1');
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function(callback){
	  console.log("Connection Succeeded");
	});
	return db;
}