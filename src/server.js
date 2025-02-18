const express = require( "express" );
const app = express();
const path = require( "path" );
const dir = "public/";
const cors = require( "cors" );

app.use(cors());

app.get('/products:id', function (req, res, next){
    res.json({msg: 'This is CORS-enabled for all origins'});
})

app.listen(80, function () {
    console.log( "cors enabled on port 80");
})

//mongo db connection
const { MongoClient } = require('mongodb');
const uri =
    'mongodb+srv://salanz:YkS7gNoSRf7V6LQ2@mydatabases.ncnp9.mongodb.net/' //connection string
const dbClient = new MongoClient(uri);


//data base is here//////////////////////////////////
let list  = {
    user: "",
    pass: "",
    name : "",
    items : [],
    totalCost : 0}

let allLists = [];

//function to load server data
let loadData = async function() {

    let allShopLists;
    try {
        await dbClient.connect();
        const db = dbClient.db("WebwareC25");
        console.log(db);
        const coll = db.collection("ShopLists-A4");
        console.log("COLLECTION: \n",coll);

        allShopLists = await coll.find().toArray();

        console.log(allShopLists);
    }
    finally {
        await dbClient.close();
    }

    allLists = allShopLists;
}

loadData().then();  //load data then continue

//classes /////////////////////////////////////////
class Item {
    constructor (name, price, amount) {
        this.name = name;
        this.price = price;
        this.amount = amount;
    }
}
//class for shopping lists
class ShopList {
    constructor (user, pass, name, items, totalCost) {
        this.user = user;
        this.pass = pass;
        this.name = name;
        this.items = items;
        this.totalCost = totalCost;
    }
}
/////////////////////////////////////////////////



//middleware for parsing json
app.use(express.json());

//serve static files from public directory
app.use(express.static(dir));

//set up view engine
app.set("view engine", "html");

//route for serving index page
app.get('/', (req, res) => {
    res.sendFile(dir + 'index.html');
})

//when a user signs up
app.post('/createuser', async(req, res) => {

    let isUser = false;
    for (let i = 0; i < allLists.length; i++) {
        if (allLists[i].user === req.body.user && allLists[i].pass === req.body.pass) { //search for the users list in data
            isUser = true;  //is already a valid user
            break;
        }
    }
    if (!isUser) { //not a user so create new data
        list.user = req.body.user;
        list.pass = req.body.pass;
        list.name = "";
        list.items = [];
        list.totalCost = 0;
        let newShopList = new ShopList(list.user, list.pass, list.name, list.items, list.totalCost);
        allLists.push(newShopList);
        console.log("user created: " + list.user + " pass: " + list.pass);
        console.log("All Lists: ", allLists);

        await storeData(list); //registers new user in the database
    }

    res.json(isUser); //serve the new page
})

//when a user logs in
app.post('/login', (req, res) => {
    //find user and set their data
    let isUser = false;
    for (let i = 0; i < allLists.length; i++) {
        if (allLists[i].user === req.body.user && allLists[i].pass === req.body.pass) { //search for the users list in data
            list.user = allLists[i].user;
            list.pass = allLists[i].pass;
            list.name = allLists[i].name;
            list.items = allLists[i].items;
            list.totalCost = allLists[i].totalCost;
            isUser = true;  //is a valid user
            break;
        }
    }
    const userInfo = {isUser, userList: list};

    console.log(isUser);
    console.log(list);
    res.json(userInfo);


})

// Route for creating a new shopping list
app.post("/createlist", (req, res) => {
    // list.items = [];
    // list.totalCost = 0;
    list.name = req.body.listname;
    console.log("List created: " + list.name);
    res.json(list);
});

//route for adding items to the shopping list
app.post("/createitem", (req, res) => {
    const { name, price, amount } = req.body;
    const newItem = new Item(name, price, amount);
    list.items.push(newItem);
    console.log("Item added: ", newItem);
    res.json(list);
});

//route for deleting items from the shopping list
app.post("/deleteitem", (req, res) => {
    const { id, name } = req.body;
    console.log("Delete id: " + id);
    list.items.splice(id - 1, 1); //delete item at the given index
    console.log("Item deleted:" + name);

    res.json(list);
})

app.post("/savelist", async (req, res) => {
    const {cost} = req.body;
    list.totalCost = cost; //update total cost

    let updatedShopList;    //used for updating list

    for (let i = 0; i < allLists.length; i++) {
        if (allLists[i].user === list.user && allLists[i].pass === list.pass) { //search for the users list in data
            updatedShopList = new ShopList(list.user,list.pass,list.name,list.items,list.totalCost);
            allLists[i] = updatedShopList; //save the new list
            break;
        }
    }

    const dbSave = await storeData(list);
    console.log("Data stored");
    res.json(list); //send list back
    console.log("list saved: " + list.name);
    console.log("All Lists: ", allLists);
})

app.post("/logout", (req, res) => {

    res.send(list.user);
    list.user = "";
    list.pass = "";
    list.name = "";
    list.items = [];
    list.totalCost = 0;

    console.log("user logged out");
    console.log("All Lists: ", allLists);
})

//send over the list data when needed
app.get("/getList", (req, res) => {

    console.log("get list requested");
    const json = res.json(list); //return the list as a json
})

//stores data in the database
let storeData = async function(saveList) {
    try {
        await dbClient.connect();
        const db = dbClient.db("WebwareC25");
        const coll = db.collection("ShopLists");

        let shopList = {
            user: saveList.user,
            pass: saveList.pass,
            name : saveList.name,
            items : saveList.items,
            totalCost : saveList.totalCost
        }

        let result;

        //find the user
        const findData = await coll.findOne(
            {user: saveList.user, pass: saveList.pass});

       if (findData) { //if list already exists update it with new parameters( pass and user never change)
           await coll.updateOne(findData,  {
               $set: {name : saveList.name, items : saveList.items, totalCost : saveList.totalCost}
           })
       }
        else {
           result = await coll.insertOne(shopList);
       }

        console.log("database has been updated");
    } finally {
        // Ensures that the client will close when you finish/error
        await dbClient.close();
    }
}

//starts the server
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port ${process.env.PORT || 5000}`);
});