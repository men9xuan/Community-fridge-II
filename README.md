## Community fridge web application with MongoDB

This is my 4th course assignment of COMP 2406 Winter 22

It connects the Community fridge web application to a MongoDB database.

Upon server starts, all local JSON data is imported to a MongoDB database. 

You may need to change username password dbname in config.js to point to your own database.

All subsequent queries are handled by the MongoDB database.

This web application supports the following database queries:

| Request | URL                                                | Content type | Description                                                                        |  
|---------|----------------------------------------------------|--------------|------------------------------------------------------------------------------------|
| GET     | /fridges                                           | JSON         | Retrieving information for all fridges                                             |
| GET     | /fridges/:fridgeID                                 |              | Retrieving data associated with a specific fridge                                  |
| GET     | /search/items?type=TYPE&name=NAME                  |              | Search for an item in the items collection with type = TYPE and name contains NAME |
| POST    | /itemsJSON                                         |              | Adding a new item into the items collection                                        |
| PUT     | /fridges/:fridgeID                                 |              | Updating information about a fridge                                                |
| POST    | /fridges/:fridgeID/items                           | JSON         | Adding an item in the fridge                                                       |
| DELETE  | /fridges/:fridgeID/items/:itemID                   |              | Deleting an item from a fridge                                                     |
| DELETE  | /fridges/:fridgeID/items?item=itemId1&item=itemId2 |              | Delete itemId1 and itemId2 from fridgeID                                           |
| DELETE  | /fridges/:fridgeID/items                           |              | Delete all items from fridgeID                                                     |


### Setting up

```
npm install express mongodb mongoose

```

### Start server 

```
node server.js
```

### Interact with this web appliaction

Send requests to http://localhost:8000/ with Postman
