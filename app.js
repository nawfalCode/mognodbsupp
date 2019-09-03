let express = require("express");
let app = express();

let mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const url = "mongodb://" + process.argv[2] + ":27017/";
console.log("Connecting to MongoDB Server=" + url);

let db = null;
let col = null; // table

MongoClient.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function(err, client) {
    if (err) {
      console.log("Err  ", err);
    } else {
      console.log("Connected successfully to server");
      db = client.db("customersDB");
      col2 = db.createCollection("customers");
      col = db.collection("customers");
    }
  }
);

// bodyParser is used to parse the payload of the incoming POST requests.
let bodyParser = require("body-parser");

// viewPath is required for the response.sendFile function
//__dirname is the  directory name of the current module (i.e file/project).
let viewsPath = __dirname + "/views/";

/* Customer details
    firstName,
    lastName,
    email,
    phoneNumber
 */

//allow Express to understand the urlencoded format
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// Express should be able to render ejs templates
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// we have some static assets such as images in this project
app.use(express.static("public/img"));

/* 
          GET Requests
  */
//if a request to the home page (i.e. '/') arrives
app.get("/", function(req, res) {
  console.log("Homepage request");
  // generate the relative path
  let fileName = viewsPath + "index.html";
  // send index.html back to the client
  res.sendFile(fileName);
});

// a request to add a new customers
app.get("/addNewCustomer", function(req, res) {
  console.log("Add New Customer request");
  //Generate the relative path
  let fileName = viewsPath + "addcustomer.html";
  //send addcusotmer.html page back to the client
  res.sendFile(fileName);
});

//a request to get all customers
app.get("/getAllCustomers", function(req, res) {
  console.log("Homepage request");
  // the content of the page should be generated dynamically.
  col.find({}).toArray(function(err, result) {
    res.render("allcustomers", {
      customers: result,
    });
  });
});

// POST Requests

// when the user clicks on the submit button
app.post("/newCustomer", function(req, res) {
  console.log(req.body);
  col.insertOne(req.body);
  //bodyParser is responsible for generating the body object

  // after pushing the new customer to the database, redirect the client to allcustomer.html

  col.find({}).toArray(function(err, result) {
    res.render("allcustomers", {
      customers: result,
    });
  });
});

app.get("/deleteAll", function(req, res) {
  col.deleteMany({}, function(err, obj) {
    col.find({}).toArray(function(err, result) {
      res.render("allcustomers", {
        customers: result,
      });
    });
  });
});

app.listen(8080);
