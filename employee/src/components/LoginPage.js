import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Initialize navigate hook

  // Fetch employee data if logged in
  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      setEmployees(res.data); // Update state with employee data
    } catch (err) {
      setMessage('Error fetching employee data');
    }
  };

  // Handle input change for login form
  const handleLoginChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for login
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Example simple login validation
    if (formData.username === 'admin' && formData.password === 'password') {
      setIsLoggedIn(true);
      fetchEmployees(); // Fetch employee data after login
      setMessage('Login successful!');
    } else {
      setMessage('Invalid username or password');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchEmployees(); // Fetch employee data when logged in
    }
  }, [isLoggedIn]);

  // Handle navigation to Add Employee page
  const handleAddEmployeeClick = () => {
    navigate('/add-employee'); // Navigate to Add Employee page
  };

  return (
    <div className="login-page">
      <h2>Login</h2>

      <form onSubmit={handleLoginSubmit}>
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleLoginChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleLoginChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}

      {/* Display Employee Details if logged in */}
      {isLoggedIn && (
        <div className="employee-table">
          <h3>Employee Details</h3>
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Date of Joining</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.employeeId}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.department}</td>
                  <td>{emp.dateOfJoining}</td>
                  <td>{emp.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Button */}
      <button onClick={handleAddEmployeeClick} style={{ marginTop: '20px' }}>
        Add Employee
      </button>
    </div>
  );
};

export default LoginPage;
