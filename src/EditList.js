import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();

    //state variables for list params
    const [items, setItems] = useState([]);  // To store the items in the list
    const [totalCost, setTotalCost] = useState(0);  // To store the total cost
    const [itemName, setItemName] = useState('');  // Item name input state
    const [itemPrice, setItemPrice] = useState(0);  // Item price input state
    const [itemAmount, setItemAmount] = useState(0);  // Item amount input state

    // Handle logout
    const logout = () => {
        navigate("/");
    };

    //add items to the list
    const appendItem = () => {
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
    const editItem = (item) => {
        //front end edit logic
        setItemName(item.name);
        setItemPrice(item.price);
        setItemAmount(item.amount);
        setItems(items.filter(i => i.id !== item.id));
        setTotalCost(totalCost - item.total);
    }

    //deleting items
    const deleteItem = (item) => {
        setItems(items.filter(i => i.id !== item.id));
        setTotalCost(totalCost - item.total);
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
                <h3 id="listHead">List Name</h3>

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
                            <td>{item.price.toFixed(2)}</td>
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
                        <td id="totalcost">{totalCost.toFixed(2)}</td>
                    </tr>
                    </tbody>
                </table>

                {/* Save Button */}
                <button id="savebutton" type="button">Save List</button>
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