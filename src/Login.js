import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function App() {

    const navigate = useNavigate(); //uses navigate for page routing

    //handle logging in
    const login = async (event) => {
        event.preventDefault();
        const inputUser = document.querySelector( "#username");
        const inputPassword = document.querySelector( "#password");

        const json = {user: inputUser.value,
            pass: inputPassword.value
        }

        const body = JSON.stringify( json );

        const response = await fetch("../api/server/login", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'  // Specify that the body is JSON
            },
            body
        })

        const res = await response.json();
        console.log("login status: " + res.isUser);
        if (res.isUser) {
            window.localStorage.setItem("user", inputUser.value); //locally store the user and their password
            window.localStorage.setItem("pass", inputPassword.value);
            console.log("Local Storage - user: " + inputUser.value + "and pass: " + inputPassword.value);
            console.log(res.userList.name + " logged in");
            navigate('/list');
        }
        else {
            alert("User Not Found");
        }
    };

    //handle signing up
    const signup = async ( event ) => {
        event.preventDefault();
        const inputUser = document.querySelector( "#username");
        const inputPassword = document.querySelector( "#password");

        const json = {user: inputUser.value,
            pass: inputPassword.value
        }

        const body = JSON.stringify( json );

        const response = await fetch("../api/server/createuser", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'  // Specify that the body is JSON
            },
            body
        })

        const res = await response.json()
        console.log( "user status: ", res)
        if (res) {                          //check if already a user
            alert("user already exists");
        }
        else {
            window.localStorage.setItem("user", inputUser.value); //locally store the user and their password
            window.localStorage.setItem("pass", inputPassword.value);
            console.log("Local Storage - user: " + inputUser.value + "and pass: " + inputPassword.value);
            console.log("New user signed up");
            navigate('/list');
        }
    };

    //handle checking local storage
    const storageCheck = () => {
        const userInput = document.querySelector("#username");
        const passInput = document.querySelector("#password");

        //if username and password are in local storage autofill with them
        if (localStorage.getItem("user") !== null && localStorage.getItem("pass") !== null) {
            userInput.value = localStorage.getItem("user");
            passInput.value = localStorage.getItem("pass");
        }
    }

    //when window loads
    useEffect(() => {
        storageCheck();
    },[]);

    return (
        <div>
            <h1>Shopping List Manager</h1>
            <p id="welcome">Welcome to shopping list manager! Please create login to begin</p>
            <form id="loginform">
                <label htmlFor="username"></label>
                <input type="text" id="username" placeholder="Username"/>
                <br/>
                <label htmlFor="password"></label>
                <input type="text" id="password" placeholder="Password"/>
                <br/>
                <button id="loginbutton" onClick={login}>log in</button>
                <button id="signupbutton" onClick={signup}>sign up</button>
            </form>
        </div>
    );
}

export default App;
