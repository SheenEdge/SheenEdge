const mongoose = require("mongoose")

const PostSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true, "Please add the title"]
    },
    content:{
        type: String,
        required: [true, "Please add the content"]
    },
    tags:[{
        type: String,
    }]
},{
    timestamps:true,
})

module.exports = mongoose.model("Post", PostSchema);