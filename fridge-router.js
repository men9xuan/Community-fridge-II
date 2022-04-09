// This module is cached as it has already been loaded
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
let router = express.Router();

let Type = require("./models/typeModel");
let Fridge = require("./models/fridgeModel");
let Item = require("./models/itemModel");

let db;
app.locals.db = db;


app.use(express.json()); // body-parser middleware
// 3.1.1 Retrieving information for all fridges
// based on requested format
router.get('/', (req, res) => {
	res.format({
		'text/html': () => {
			res.set('Content-Type', 'text/html');
			res.sendFile(path.join(__dirname, 'public', 'view_pickup.html'), (err) => {
				if (err) res.status(500).send('500 Server error');
			});
		},
		'application/json': () => {
			// res.set('Content-Type', 'application/json');  //?
			// res.json(req.app.locals.fridges);
			// console.log("find json");
			Fridge.find(function (err, results) {
				if (err) throw err;
				res.status(200);
				res.set("Content-Type", "application/json");
				res.json(results);
			});

		},
		'default': () => {
			res.status(406).send('Not acceptable');
		}
	})
});

//3.1.2 Retrieving data associated with a specific fridge
router.get("/:fid", function (req, res, next) {
	// console.log(req.params.fid);
	Fridge.find({ id: req.params.fid }, function (err, results) {
		if (err) throw err;
		if (results == undefined || results.length == 0) {
			res.status(404).send("fridgeID not found");
		} else {
			res.status(200);
			res.set("Content-Type", "application/json");
			res.json(results);
		}
	});
});

// 3.1.3 Adding a new fridge
// add a new fridge
router.post("/", function (req, res, next) {
	console.log("add new fridge");
	let newFridge = {
		id: req.body.id,
		name: req.body.name,
		canAcceptItems: req.body.canAcceptItems,
		acceptedTypes: req.body.acceptedTypes,
		contactInfo: req.body.contactInfo,
		address: req.body.address,
		items: req.body.items,
	};
	Fridge.findOne({ id: req.body.id }, function (err, result) {
		if (result != null) {
			res.status(400).send("Fridge id already existed");
		} else {
			Fridge.create(newFridge, function (err, result) {
				if (err) {
					// throw err;
					res.status(400).send(err.message);
				} else {
					res.status(200);
					res.send(result);
				}
			});
		}
	});


});

// 3.1.4 Updating information about a fridge
// router.put("/:fid", (req, res) => {  something different search more this keyword
router.put("/:fid", function (req, res, next) {
	console.log("====update fridge====");
	Fridge.findOne({ id: req.params.fid }, function (err, result) {
		console.log("result:");
		console.log(result);
		if (result == null) {
			res.status(404).send("Fridge not found");
		} else {
			let properties = ['name', 'numItemsAccepted', 'canAcceptItems', 'acceptedTypes', 'contactInfo', 'address'];
			for (property of properties) {
				if (req.body.hasOwnProperty(property)) {
					console.log("req body has:");
					console.log(property);
					result[property] = req.body[property];
				}
			}
			// console.log(results);
			result.save(function (err, result) {
				if (err) {
					res.status(400).send(err.message);
				} else {
					res.status(200);
					res.send(result);
				}
			});

		}

	});
});

// 3.1.5 Adding an item in the fridge
router.post("/:fridgeID/items", function (req, res, next) {
	console.log("add item to fridge");
	console.log(req.body.id);
	// find if item existed 
	Fridge.findOne({ id: req.params.fridgeID }, function (err, result) {
		if (result != null) {
			let index = result.items.findIndex(object => {
				return object.id == req.body.id;
			});
			console.log("index:" + index);
			if (index != -1) {
				res.status(409).send("Item existed");
			} else {
				let newItem = { id: req.body.id, quantity: 0 };
				result.items.push(newItem);
				result.save(function (err, result) {
					if (err) {
						res.status(400).send(err.message);
					} else {
						res.status(200);
						res.send("Item added successfully");
					}
				});
			}
		} else {
			res.status(404).send("Fridge not found");
		}
	});
});

// 3.1.6 Deleting an item from a fridge
router.delete("/:fid/items/:iid", function (req, res, next) {
	Fridge.findOne({ id: req.params.fid }, function (err, result) {
		if (result == null) {
			res.status(404).send("Fridge not found");
		} else {
			console.log(req.params.iid);
			// result.items.pull({ id: req.params.iid}, function (err, result2){
			// 	result.save();
			// });
			let index = result.items.findIndex(object => {
				return object.id === req.params.iid;
			});
			if (index == -1) {
				res.status(404).send("Item not found");
			} else {
				Fridge.updateMany({ id: req.params.fid }, { "$pull": { items: { id: req.params.iid } } }, function (err, result) {
					if (err) {
						res.status(400).send(err.message);
					}
					res.status(200);
					res.send("Delete successful ");
				});
			}
			// result.items.deleteOne({ id: req.params.iid }, function (err, result2){
			// 	if (err) throw err;

			// 	console.log(result2);
			// });
			console.log(index);
		}
	});
});

// 3.1.7 Delete a list of items from a fridge
router.delete("/:fid/items", (req, res) => {
	console.log("multi delete");
	console.log(req.query);
	console.log(req.query.hasOwnProperty('item'));
	Fridge.findOne({ id: req.params.fid }, function (err, result) {
		if (result == null) {
			res.status(404).send("Fridge not found");
		} else if (!req.query.hasOwnProperty('item') && result.items.length > 0) {
			result.items = [];
			result.save(function (err, result) {
				if (err) {
					res.status(400).send(err.message);
				} else {
					res.status(200);
					res.send("All items deleted successfully");
				}
			});
		} else {
			Fridge.updateMany({ id: req.params.fid }, { "$pull": { items: { id: { $in: req.query.item } } } }, { multi: true }, function (err, result) {
				if (err) {
					res.status(400).send(err.message);
					// return;
				} else {
					// console.log("delete result ");
					// console.log(result);
					if (result.modifiedCount > 0) {
						res.status(200);
						res.send("Delete successful");
					} else {
						res.status(404);
						res.send("Item not found");
					}
					// console.log("modified_count " + modified);
				}
			});

			// console.log("*modified_count " + modified);
			// if (modified > 0) {
			// 	res.status(200);
			// 	res.send("Delete successful");
			// 	// return;
			// } else {
			// 	res.status(404);
			// 	res.send("Item not found");
			// }


		}
	});
});

// 3.2.1 Updating quantity of an item in the fridge
router.put("/:fridgeID/items/:itemID", function (req, res, next) {
	// find if item exists
	Fridge.findOne({ id: req.params.fridgeID }, function (err, result) {
		if (result != null) {
			let index = result.items.findIndex(object => {
				return object.id == req.params.itemID;
			});
			console.log("index:" + index);
			if (index === -1) {
				res.status(404).send("Item not found");
			} else {
				// let newItem = { id: req.body.id, quantity: 0 };
				// result.items.push(newItem);
				result.items[index].quantity = parseInt(req.body.quantity); // schema check seems to be broken here = req.body.quantity
				result.save(function (err, result) {
					if (err) {
						res.status(400).send(err.message);
					} else {
						res.status(200);
						res.send("Item quantity updated successfully");
					}
				});
			}
		} else {
			res.status(404).send("Fridge not found");
		}
	});
});

// 3.2.2 Adding a new item into the items collection

// ?? routes? /fridges/items  or /items
router.post("/items", function (req, res, next) {
	console.log("add item to items");
	console.log(req.body);
	// find if item existed  ?? need to check if id exists ????
	Item.findOne({ name: req.body.name }, function (err, result) {
		if (result != null) {
			console.log("duplicate");
			res.status(409).send("Item duplicated");
		} else {
			let newItem = {
				id: req.body.id,
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
		}
	});
});

// 3.2.3 Search for an item in the items collection
// need to find the id from another table
router.get("/search/items", function (req, res, next) {
	console.log(req.query);
	if (req.query.name == undefined	|| req.query.type == undefined || req.query.type ==""){
		res.status(400);
		res.send("improperly formatted query ");
		return;
	}
	Type.find({name: req.query.type},  function(err, result){
		if (err){
			res.status(400).send(err.message);
		}else if (result.length >0){
			console.log(result[0].id);
			let type = result[0].id;
			Item.find({name:{ "$regex": req.query.name, "$options": "i" }, type: type}, function (err,result){
				// console.log(result);
				if (err) {
					// throw err;
					res.status(400).send(err.message);
				} else {
					res.status(200);
					res.send(result);
				}
			});
		}else{
			res.status(404).send();
		}
	});
	

});


// helper route, which returns the accepted types currently available in our application. This is used by the addFridge.html page
router.get("/types", function (req, res, next) {
	let types = [];
	Object.entries(req.app.locals.items).forEach(([key, value]) => {
		if (!types.includes(value["type"])) {
			types.push(value["type"]);
		}
	});
	res.status(200).set("Content-Type", "application/json").json(types);
});

// Middleware function: this function validates the contents of the request body associated with adding a new fridge into the application. At the minimimum, it currently validates that all the required fields for a new fridge are provided.
function validateFridgeBody(req, res, next) {
	let properties = ['name', 'canAcceptItems', 'accepted_types', 'contact_person', 'contact_phone', 'address'];

	for (property of properties) {
		// hasOwnProperty method of an object checks if a specified property exists in the object. If a property does not exist, then we return a 400 bad request error
		if (!req.body.hasOwnProperty(property)) {
			return res.status(400).send("Bad request");
		}
	}
	// if all the required properties were provided, then we move to the next set of middleware and continue program execution.
	next();
}
// Middleware function: this validates the contents of request body, verifies item data
function validateItemBody(req, res, next) {
	let properties = ['id', 'quantity'];
	for (property of properties) {
		if (!req.body.hasOwnProperty(property))
			return res.status(400).send("Bad request");
	}
	next();
}
// Adds a new fridge, returns newly created fridge
router.post('/', validateFridgeBody, (req, res) => {
	// Make local changes
	req.app.locals.fridges.push({ id: `fg-${req.app.locals.fridges.length + 1}`, ...req.body, items: [] });

	// Update 'database'
	fs.writeFile(path.join(__dirname, 'data', 'comm-fridge-data.json'), JSON.stringify(req.app.locals.fridges, null, 4), (err) => {
		if (err)
			return res.status(500).send("Database error");
		res.status(201).json({ id: `fg-${req.app.locals.fridges.length}`, ...req.body });
	});
});

// Get /fridges/{fridgeID}. Returns the data associated with the requested fridge.
// router.get("/:fridgeId", function (req, res, next) {
// 	const fridges = req.app.locals.fridges;
// 	const items = req.app.locals.items;

// 	// Find fridge in 'database'
// 	const fridgeFound = fridges.find(f => f.id == req.params.fridgeId);
// 	if (!fridgeFound) return res.status(404).send('Not Found');

// 	// Make deep copy of fridges data
// 	let fridge = { ...fridgeFound };

// 	// Populate items array with item data matched with itemID
// 	// TODO: IS THIS NEEDED??
// 	for (let i = 0; i < fridge.items.length; i++) {
// 		fridge.items[i] = { ...items[fridge.items[i].id], ...fridge.items[i] };
// 	}

// 	res.json(fridge);
// });

// Updates a fridge and returns the data associated.
// Should probably also validate the item data if any is sent, oh well :)
router.put("/:fridgeId", (req, res) => {
	const fridges = req.app.locals.fridges;
	const items = req.app.locals.items;

	// Find fridge in 'database'
	let indexFound = fridges.findIndex(f => f.id == req.params.fridgeId);
	if (indexFound < 0) return res.status(404).send('Not Found');
	req.app.locals.fridges[indexFound] = { ...req.app.locals.fridges[indexFound], ...req.body } // Should not need old attributes i.e. ...fridgeFound

	// Update 'database'
	fs.writeFile(path.join(__dirname, 'data', 'comm-fridge-data.json'), JSON.stringify(req.app.locals.fridges, null, 4), (err) => {
		if (err)
			return res.status(500).send("Database error");

		// Populate items array with item data matched with itemID
		// TODO: is this needed?
		let fridge = req.app.locals.fridges[indexFound];
		for (let i = 0; i < fridge.items.length; i++) {
			fridge.items[i] = { ...items[fridge.items[i].id], ...fridge.items[i] };
		}

		res.json(req.app.locals.fridges[indexFound]); // Status 200 is default
	});

});

// Adds an item to specified fridge
router.post("/:fridgeId/items", validateItemBody, (req, res) => {
	const fridges = req.app.locals.fridges;
	const items = req.app.locals.items;

	// Find fridge in 'database'
	let indexFound = fridges.findIndex(f => f.id == req.params.fridgeId);
	if (indexFound < 0) return res.status(404).send('Not Found');

	// Find item in 'database'
	if (!items.hasOwnProperty(req.body.id)) return res.status(404).send('Not Found');

	// Add item to fridge
	// ASSUMES ITEM DOES NOT EXIST IN ARRAY
	req.app.locals.fridges[indexFound].items.push(req.body)

	// Update 'database'
	fs.writeFile(path.join(__dirname, 'data', 'comm-fridge-data.json'), JSON.stringify(req.app.locals.fridges, null, 4), (err) => {
		if (err)
			return res.status(500).send("Database error");

		res.json(req.body);
	});

})

// Deletes an item from specified fridge
router.delete("/:fridgeId/items/:itemId", (req, res) => {
	const fridges = req.app.locals.fridges;
	const items = req.app.locals.items;

	// Find fridge in 'database'
	let indexFound = fridges.findIndex(f => f.id == req.params.fridgeId);
	if (indexFound < 0) return res.status(404).send('Not Found');

	// Find item in 'database'
	if (!items.hasOwnProperty(req.params.itemId)) return res.status(404).send('Not Found');

	// Remove item from fridge
	fridges[indexFound].items = fridges[indexFound].items.filter(item => item.id != req.params.itemId)

	// Update 'database'
	fs.writeFile(path.join(__dirname, 'data', 'comm-fridge-data.json'), JSON.stringify(req.app.locals.fridges, null, 4), (err) => {
		if (err)
			return res.status(500).send("Database error");

		res.status(204).send();
	});

})

router.delete("/:fridgeId/items", (req, res) => {
	const fridges = req.app.locals.fridges;

	// Find fridge in 'database'
	let indexFound = fridges.findIndex(f => f.id == req.params.fridgeId);
	if (indexFound < 0) return res.status(404).send('Not Found');

	// Delete all items in fridge
	if (!req.query.hasOwnProperty('id')) {
		fridges[indexFound].items = [];
	}
	// Remove specific items from fridge
	else {
		fridges[indexFound].items = fridges[indexFound].items.filter(item => !req.query.id.includes(item.id));
	}
	// Update 'database'
	fs.writeFile(path.join(__dirname, 'data', 'comm-fridge-data.json'), JSON.stringify(req.app.locals.fridges, null, 4), (err) => {
		if (err)
			return res.status(500).send("Database error");

		res.status(204).send();
	});
})


module.exports = router;
