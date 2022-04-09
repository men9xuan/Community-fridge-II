let config = {};
config.db = {};

// create properties on the config.db object for the host and database names
const username = "snx"; // username for the MongoDB Atlas on cloud
const password = "COMP2406"; // password for the MongoDB on cloud
const dbname = "community-fridge-101216702"; // name of the database that we want to connect to

const connectionURL = `mongodb+srv://${username}:${password}@cluster0.pjddl.mongodb.net/${dbname}?retryWrites=true&w=majority`; // full URL for connecting to our MongoDB database; includes the database username, password, and the database name
// const connectionURL = `mongodb+srv://snx:COMP2406@cluster0.pjddl.mongodb.net/week11EXample?retryWrites=true&w=majority`
// create properties on the config.db object for the host and database names
config.db.host = connectionURL;
config.db.name = dbname;

module.exports = config;
