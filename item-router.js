// This module is cached as it has already been loaded
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
let router = express.Router();

let Type = require("./models/typeModel");
let Fridge = require("./models/fridgeModel");
let Item = require("./models/itemModel");



app.use(express.json()); // body-parser middleware


// // 3.2.2 Adding a new item into the items collection

// routes /items
router.post("/items", function (req, res, next) {
	console.log("add item to items");
	console.log(req.body);
	// find if item existed, need to check if id exists 
	Item.findOne({ name: req.body.name }, function (err, result) {
		if (result != null) {
			console.log("duplicate");
			res.status(409).send("Item duplicated");
		} else {
			Item.count({}, function (err, count) {
				if (err) throw err;
				let newItem = {
					id: count + 1,
					name: req.body.name,
					type: req.body.type,
					img: req.body.img
				};
				Item.create(newItem, function (err, result) {
					if (err) {
						// throw err;
						res.status(400).send(err.message);
					} else {
						res.status(200);
						res.send("New item added successfully to the items collection");
					}
				});
			});


		}
	});
});

// 3.2.3 Search for an item in the items collection
// need to find the id from another table
router.get("/search/items", function (req, res, next) {
	console.log(req.query);
	if (req.query.name == undefined && req.query.type == undefined || req.query.type == "") {
		res.status(400);
		res.send("improperly formatted query ");
		return;
	}
	Type.find({ name: req.query.type }, function (err, result) {
		if (err) {
			res.status(400).send(err.message);
		} else if (result.length > 0) {
			console.log(result[0].id);
			let type = result[0].id;
			Item.find({ name: { "$regex": req.query.name, "$options": "i" }, type: type }, function (err, result) {
				// console.log(result);
				if (err) {
					// throw err;
					res.status(400).send(err.message);
				} else {
					res.status(200);
					res.send(result);
				}
			});
		} else {
			res.status(404).send();
		}
	});


});

module.exports = router;
