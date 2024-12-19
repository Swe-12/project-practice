import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddEmployeeForm from "./components/AddEmployeeForm";
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddEmployeeForm />} />
      </Routes>
    </Router>
  );
}

export default App;
