const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schema for a Fridge
let fridgeSchema = Schema({
    id: {
        type: String,
        required: true,
        minLength: [4, "Min length for fridgeId is 4"],
        maxLength: [6, "Max length for fridgeId is 6"]
    },
    name: {
        type: String,
        required: [true, "Fridge name is required"],
        minLength: [2, "Min length for fridge name is 2"],
        maxLength: [20, "Max length for fridge name is 20"]
    },
    numItemsAccepted: {
        type: Number,
        default: 0,
    },
    canAcceptItems: {
        type: Number,
        min: [1, "Minimum is 1 for canAcceptItems"],
        max: [100, "Maximum is 100 for canAcceptItems"]
    },
    contactInfo: {
        contactPerson: {
            type: String,
            required: true
        },
        contactPhone: {
            type: String,
            required: true
        }
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
            // default: "Canada" //
        },
    },
    acceptedTypes: {
        type: [String],
        required: true
    },
    items: [{
        id: { type: String, required: true },
        quantity: { type: Number, required: true }
    }]
});

module.exports = mongoose.model("Fridge", fridgeSchema);
