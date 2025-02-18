import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();

    //state variables for list params
    const [items, setItems] = useState([]);  //the items in the list
    const [totalCost, setTotalCost] = useState(0);  //store the total cost
    const [itemName, setItemName] = useState('');  //item name input state
    const [itemPrice, setItemPrice] = useState(0);  //Item price input state
    const [itemAmount, setItemAmount] = useState(0);  // item amount input state
    const [listName, setListName] = useState('List Name');//stores the list name state

    //reference boolean
    let listFetched = useRef(false); //if list has already been fetched

    // Handle logout
    const logout = async (event) => {
        event.preventDefault();

        const wipeCheck = document.getElementById("wipecheck");

        const json = {};
        const body = JSON.stringify(json);

        const response = await fetch("http://localhost:5000/logout", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'  // Specify that the body is JSON
            },
            body
        })

        let text = await response.text();

        //check if user wants to save their login info in local storage
        if (!wipeCheck.checked) {
            window.localStorage.removeItem("user"); //clear local storage username and password
            window.localStorage.removeItem("pass");
        }
        navigate("/");
    };

    //add items to the list
    const appendItem = async (event) => {
        event.preventDefault()

        //get information from the inputs
        const inputName = document.querySelector( "#itemname");
        const inputPrice = document.querySelector( "#itemprice");
        const inputAmount = document.querySelector( "#itemamount");

        if(inputName.value === "" || inputPrice.value === 0 || inputAmount.value === 0) {

            alert("Item needs a name, a price, and an amount");
            return;
        }
        //store info as a json
        const json = {name : inputName.value,
            price : inputPrice.value,
            amount : inputAmount.value
        }

        //stringify that json for posting
        const body = JSON.stringify( json );
        //post the json to the server
        const response = await fetch("http://localhost:5000/createitem", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'  // Specify that the body is JSON
            },
            body
        })

        //response message
        const text = await response.text()
        console.log( "text:", text )

        if (itemName && itemPrice >= 0 && itemAmount >= 0) {
            const newItem = {
                id: items.length + 1,  // Unique ID for each item
                name: itemName,
                price: itemPrice,
                amount: itemAmount,
                total: itemPrice * itemAmount
            };

            //actually add item to list
            setItems(prevItems => [...prevItems, newItem]);

            //update total cost
            setTotalCost(prevTotal => prevTotal + newItem.total);

            //reset the input values
            setItemName('');
            setItemPrice(0);
            setItemAmount(0);
        }
    };

    // Handle the change of inputs
    const itemNameChange = (e) => setItemName(e.target.value);
    const itemPriceChange = (e) => setItemPrice(Number(e.target.value));
    const itemAmountChange = (e) => setItemAmount(Number(e.target.value));

    //editing items
    const editItem = async (item) => {

        //front end edit logic
        setItemName(item.name);
        setItemPrice(item.price);
        setItemAmount(item.amount);
        setItems(items.filter(i => i.id !== item.id));
        setTotalCost(totalCost - item.total);

        await deleteItem(item);
    }

    //deleting items
    const deleteItem = async (item) => {
        //console.log("item id: " + itemId);

        setItems(items.filter(i => i.id !== item.id));
        setTotalCost(totalCost - item.total);

        const json = {id: item.id, name: item.name};
        const body = JSON.stringify(json);


        //request to delete item
        const response = await fetch("http://localhost:5000/deleteitem", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'  // Specify that the body is JSON
            },
            body,
        })

        //response message
        const text = await response.text()
        console.log( "text:", text )
    }

    const getList = async () => {

        const response = await fetch("http://localhost:5000/getlist", {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'  // Specify that the body is JSON
            }
        })

        const res = await response.json();
        console.log ("Got Current List" + res);

        let idItems = []; //store items with ids

        for (let i= 0; i < res.items.length; i++){  //add ids to items
            res.items[i].id = i + 1;
            idItems.push(res.items[i]);
        }

        setItems(idItems);
        setListName(res.name);
        setTotalCost(res.totalCost);
    }

    useEffect(() => {

        if(!listFetched.current) {
            getList(); //load list state when page opens
            listFetched.current = true; //list has been fetched
        }
    },[]);

    let saveList = async function( event ) {
        event.preventDefault();

        const json = {cost : Number(document.getElementById("totalcost").innerText)};
        const body = JSON.stringify(json);
        const text = "Saved List"
        const response = await fetch("http://localhost:5000/savelist", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'  // Specify that the body is JSON
            },
            body
        })

        await response.text();
        console.log( "text:", text );

        alert("List Saved");
    }

    return (
        <div>
            <h1 id="titlehead">Shopping List Manager</h1>
            <form id="listForm">
                <div id="addItemContainer">
                    <label htmlFor="itemname">Item: </label>
                    <input
                        id="itemname"
                        type="text"
                        value={itemName}
                        onChange={itemNameChange}/>
                    <label htmlFor="itemprice">Price: </label>
                    <input
                        id="itemprice"
                        type="number"
                        value={itemPrice}
                        onChange={itemPriceChange}
                        min="0"/>
                    <label htmlFor="itemamount">Amount: </label>
                    <input
                        id="itemamount"
                        type="number"
                        value={itemAmount}
                        onChange={itemAmountChange}
                        min="0"/>
                    <br />
                    <button id="addbutton" className="add-button" type="button" onClick={appendItem}>
                        Add Item
                    </button>
                </div>

                {/* List Name */}
                <h3 id="listHead">{listName}</h3>

                {/* Item List */}
                <table id="itemlist">
                    <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price($)</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>

                    {/*items are dynamically added*/}
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{Number(item.price).toFixed(2)}</td>
                            <td>{item.amount}</td>
                            <td>
                                <button onClick={() => editItem(item)}>Edit</button>
                                <button onClick={() => deleteItem(item)}>Delete</button>
                            </td>
                        </tr>))}
                    </tbody>
                </table>

                {/* Total Cost Row */}
                <table>
                    <tbody>
                    <tr>
                        <td>Total Cost($)</td>
                        <td id="totalcost">{Number(totalCost).toFixed(2)}</td>
                    </tr>
                    </tbody>
                </table>

                {/* Save Button */}
                <button id="savebutton" type="button" onClick={saveList}>Save List</button>
                <br />
                {/* Logout Button */}
                <button id="logoutButton" className="logout" onClick={logout}>Logout</button>
                <input type="checkbox" id="wipecheck" />
                <label htmlFor="wipecheck">Save login data?</label>
            </form>
        </div>
    );
}

export default App;