import React from 'react';
import { useNavigate } from 'react-router-dom';

function App() {

    const navigate = useNavigate(); //uses navigate for page routing

    const login = async (event) => {
        event.preventDefault();
        const inputUser = document.querySelector( "#username");
        const inputPassword = document.querySelector( "#password");

        const json = {user: inputUser.value,
            pass: inputPassword.value
        }

        const body = JSON.stringify( json );

        const response = await fetch("http://localhost:5000/login", {
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

    const signup = async ( event ) => {
        event.preventDefault();
        const inputUser = document.querySelector( "#username");
        const inputPassword = document.querySelector( "#password");

        const json = {user: inputUser.value,
            pass: inputPassword.value
        }

        const body = JSON.stringify( json );

        const response = await fetch("http://localhost:5000/createuser", {
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
