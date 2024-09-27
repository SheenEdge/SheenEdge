const mongoose = require("mongoose");
const User = require("./User");

const CodeFileSchema = mongoose.Schema({
    FileName: {
        type: String,
        required: [true, "Plaese provide the File Name"]
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    }, 
    Access: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    content: {
        type:String,
    },
    language:{
        type: String,
        required: [true, "Please add the langauge"]
    }
},
{
    timestamps:true,
})

module.exports = mongoose.model("CodeFile", CodeFileSchema);