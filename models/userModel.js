const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type : String,
        requied : [true, "Please add the user name"]
    },
    email: {
        type : String,
        required : [true, " Please add the user email address"],
        unique: [true," Email address alreadytaken"],
    },
    password: {
        type : String,
        requied : [true, "Pleaseadd the user password"]
    },
    
},
{
    timestamp : true,
}
);

module.exports = mongoose.model("User", userSchema);