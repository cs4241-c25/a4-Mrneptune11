function App() {
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
        <button id="loginbutton">log in</button>
        <button id="signupbutton">sign up</button>
      </form>

      <script type="module" src="js/main.js" defer></script>


    </div>
  );
}

export default App;
