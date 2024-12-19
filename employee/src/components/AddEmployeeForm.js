import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Import jsPDF
import 'jspdf-autotable';
import { validateEmail, validatePhone, validateDate } from '../utils/validation';

const AddEmployeeForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        employeeId: '',
        email: '',
        phone: '',
        department: '',
        dateOfJoining: '',
        role: '',
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [employeeList, setEmployeeList] = useState([]); // State to store employee details
    const [editingEmployee, setEditingEmployee] = useState(null); // Track employee being edited

    // Fetch employee details from the backend when the component loads
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/employees');
                setEmployeeList(res.data); // Assuming the backend sends the list of employees
            } catch (error) {
                console.error('Error fetching employee details:', error);
            }
        };
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const errs = {};
        if (!formData.name) errs.name = 'Name is required';
        if (!formData.employeeId) errs.employeeId = 'Employee ID is required';
        if (!validateEmail(formData.email)) errs.email = 'Invalid email format';
        if (!validatePhone(formData.phone)) errs.phone = 'Invalid phone number';
        if (!formData.department) errs.department = 'Department is required';
        if (!validateDate(formData.dateOfJoining)) errs.dateOfJoining = 'Date cannot be in the future';
        if (!formData.role) errs.role = 'Role is required';

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (editingEmployee) {
                // Update existing employee
                const res = await axios.put(`http://localhost:5000/api/employees/${formData.employeeId}`, formData);
                setMessage(res.data.message);

                // Update employee list locally after successful submission
                setEmployeeList((prevList) =>
                    prevList.map((employee) =>
                        employee.employeeId === formData.employeeId ? formData : employee
                    )
                );
            } else {
                // Add new employee
                const res = await axios.post('http://localhost:5000/api/employees/add', formData);
                setMessage(res.data.message);

                // Update employee list locally after successful submission
                setEmployeeList((prevList) => [...prevList, formData]);
            }

            // Reset form and errors
            setFormData({
                name: '',
                employeeId: '',
                email: '',
                phone: '',
                department: '',
                dateOfJoining: '',
                role: '',
            });
            setErrors({});
            setEditingEmployee(null); // Reset editing state
        } catch (error) {
            setMessage(error.response?.data?.message || 'Submission failed');
        }
    };

    // Export to PDF function
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Employee Details', 14, 10);

        const tableColumn = ['Name', 'Employee ID', 'Email', 'Phone', 'Department', 'Date of Joining', 'Role'];
        const tableRows = employeeList.map((employee) => [
            employee.name,
            employee.employeeId,
            employee.email,
            employee.phone,
            employee.department,
            employee.dateOfJoining,
            employee.role,
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save('employee_details.pdf');
    };

    const handleRemove = async (employeeId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/employees/${employeeId}`);
            alert(response.data.message); // Show success message

            setEmployeeList((prevList) => prevList.filter((employee) => employee.employeeId !== employeeId));
        } catch (error) {
            console.error('Error during deletion:', error);
            alert('Deletion failed');
        }
    };

    const handleEdit = (employee) => {
        // Set form data with employee details for editing
        setFormData(employee);
        setEditingEmployee(employee); // Set the employee being edited
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>

                {message && <p className="success-message">{message}</p>}

                <input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />
                {errors.name && <p>{errors.name}</p>}

                <input
                    name="employeeId"
                    placeholder="Employee ID"
                    value={formData.employeeId}
                    onChange={handleChange}
                    disabled={editingEmployee} // Disable editing employee ID during editing
                />
                {errors.employeeId && <p>{errors.employeeId}</p>}

                <input
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <p>{errors.email}</p>}

                <input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                />
                {errors.phone && <p>{errors.phone}</p>}

                <select name="department" value={formData.department} onChange={handleChange}>
                    <option value="">Select Department</option>
                    <option value="HR">HR</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                </select>
                {errors.department && <p>{errors.department}</p>}

                <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleChange}
                />
                {errors.dateOfJoining && <p>{errors.dateOfJoining}</p>}

                <input
                    name="role"
                    placeholder="Role"
                    value={formData.role}
                    onChange={handleChange}
                />
                {errors.role && <p>{errors.role}</p>}

                <button type="submit">{editingEmployee ? 'Update' : 'Submit'}</button>
                <button
                    type="reset"
                    onClick={() =>
                        setFormData({
                            name: '',
                            employeeId: '',
                            email: '',
                            phone: '',
                            department: '',
                            dateOfJoining: '',
                            role: '',
                        })
                    }
                >
                    Reset
                </button>
            </form>

            <div className="employee-list">
                <h3>Employee Details</h3>
                {employeeList.length > 0 && (
                    <>
                        <button onClick={exportToPDF}>Export as PDF</button>
                        <table border="1">
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
                                {employeeList.map((employee, index) => (
                                    <tr key={index}>
                                        <td>{employee.name}</td>
                                        <td>{employee.employeeId}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.phone}</td>
                                        <td>{employee.department}</td>
                                        <td>{employee.dateOfJoining}</td>
                                        <td>{employee.role}</td>
                                        <td>
                                            <button onClick={() => handleEdit(employee)}>Edit</button>
                                            <button onClick={() => handleRemove(employee.employeeId)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

export default AddEmployeeForm;
