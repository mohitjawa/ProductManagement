const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId:{type:String,ref:'user'},
    token:[{type:String}]
});


module.exports = mongoose.model("revokeToken", UserSchema);