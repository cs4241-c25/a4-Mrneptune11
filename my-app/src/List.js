import React from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();

    const createList = () => {
        navigate('/editList');
    }
    return (
        <div>
            <h1 id="titlehead">Shopping List Manager</h1>
            <p id="welcome">Welcome to shopping list manager! Please create a shopping list to begin</p>
            <form id="createForm">
                <label htmlFor="listname">Shopping List Name: </label><input type="text" id="listname"
                                                                             placeholder="List Name Here"/>
                <button id="createbutton" onClick={createList}>create</button>
            </form>
        </div>
    );
}

export default App;