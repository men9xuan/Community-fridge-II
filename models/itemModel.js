const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schema for an Item
let itemSchema = Schema({
    id:{
        type:String,
        required:[true, "Item id is required"],
        minlength:[1,"Min length for id is 1"],
        maxlength:[4,'Max length for id is 4'] 
    },
    name:{
        type:String,
        required:[true, "Item name is required"],
        minlength:[2,"Min length for item name is 2"],
        maxlength:[30,"Max length for item name is 30"]
    },
    type:{
        type: String,
        required:[true, "Item type is required"],
    },
    img:{
        type:String,
        required:[true, "Image route is required"],
        minlength:[6,"Min length for image route is 6"],
        maxlength:[40,"Max length for image route is 40"],
    }
});

module.exports = mongoose.model("Item", itemSchema);