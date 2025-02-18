import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();
    //State variables
    const [buttonVal, setButtonVal] = useState("create");  // To store the button value
    const [userList, setUserList] = useState("");           // To store the shopping list name
    const fetchedData = useRef(false);      //to know if the data has been fetched yet

    //creates a list and sets the list name
    const createList = async (event) => {
        event.preventDefault(); // Prevent form submission from reloading the page

        const input = document.querySelector( "#listname" ),
            json = { listname : input.value },
            body = JSON.stringify( json )

        const response = await fetch( "/api/createlist", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'  // Specify that the body is JSON
            },
            body
        })

        const text = await response.text()
        console.log( "text:", text )

        navigate('/editList');
    }

    //gets the current list data for the current user
    const getList = async () => {
        const response = await fetch("/api/getlist", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'  // body i s a json
            }
        });

        const res = await response.json();
        console.log("Got Current List: " + res);

        // if the user already created a list it should have a name
        if (res.name !== "") {
            setButtonVal("view");  // change button to say view
            const input = document.querySelector( "#listname" );

            if (!fetchedData.current) { //set the list name on first render
                setUserList(res.name); // set the list name
                input.value = res.name;
                fetchedData.current = true;
            }
        }
    }


    //calls get list when the page loads
    useEffect(() => {

        getList(); //get the list data

        console.log(userList); //log state of dynamic info
        console.log(buttonVal);

        //clean up
        return () => {
            console.log("Component unmounted, cleanup any side effects");
        };
    }, [userList, buttonVal]);


    return (
        <div>
            <h1 id="titlehead">Shopping List Manager</h1>
            <p id="welcome">Welcome to shopping list manager! Please create a shopping list to begin</p>
            <form id="createForm">
                <label htmlFor="listname">Shopping List Name: </label>
                <input
                    type="text"
                    id="listname"
                    placeholder="List Name Here"
                    onChange={(event) => {}} //on change does nothing
                />
                <button id="createbutton" onClick={createList}>{buttonVal}</button>
            </form>
        </div>
    );
}

export default App;
