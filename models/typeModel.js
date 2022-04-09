const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schema for a Type
let typeSchema = Schema({
    id:{
        type:String,
        required:[true, "Type id is required"],
        minlength:1,
        maxlength:4
    },
    name:{
        type:String,
        required:[true, "Type name is required"],
        minlength:[2, "Type name minlength is 2"],
        maxlength:[30,"Type name maxlength is 30"]
    }
});

const Type = mongoose.model("Type", typeSchema);

module.exports = Type;