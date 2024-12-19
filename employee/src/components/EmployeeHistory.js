import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeHistoryPage = () => {
  const [employees, setEmployees] = useState([]); // State to store employee details
  const [message, setMessage] = useState('');    // State to store feedback messages
  const navigate = useNavigate();

  // Fetch employee data from the backend when the component loads
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees'); // API endpoint for fetching employees
      setEmployees(res.data); // Set fetched employees to state
    } catch (err) {
      setMessage('Error fetching employee data');
    }
  };

  // Navigate to the Edit Employee page
  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  // Remove employee data
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`); // API call to delete employee
      setEmployees(employees.filter((emp) => emp.id !== id)); // Remove employee from state
      setMessage('Employee removed successfully');
    } catch (err) {
      setMessage('Error removing employee');
    }
  };

  // Add new employee
  const handleAddEmployee = () => {
    navigate('/add-employee');
  };

  return (
    <div className="employee-history-page" style={{ padding: '20px' }}>
      <h2>Employee History</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <button onClick={handleAddEmployee} style={{ marginBottom: '10px' }}>
        Add Employee
      </button>
      <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Date of Joining</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.employeeId}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.department}</td>
                <td>{emp.dateOfJoining}</td>
                <td>{emp.role}</td>
                <td>
                  <button
                    onClick={() => handleEdit(emp.id)}
                    style={{ marginRight: '5px', backgroundColor: 'yellow', border: 'none' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    style={{ backgroundColor: 'red', color: 'white', border: 'none' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>
                No employee data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeHistoryPage;
