import React from 'react';
import { useNavigate } from 'react-router-dom';

function App() {

    const navigate = useNavigate(); //uses navigate for page routing

    const login = () => {
        navigate('/list');
    };

    const signup = () => {
        navigate('/list');
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
