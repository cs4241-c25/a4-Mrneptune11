import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import List from './List';
import EditList from './EditList';

function App() {
  return (
      <Router>
          <div>
              <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/list" element={<List />} />
                  <Route path="/editList" element={<EditList />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
