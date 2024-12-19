const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Add a new employee
router.post('/add', async (req, res) => {
    const { name, employeeId, email, phone, department, dateOfJoining, role } = req.body;

    // Validation on backend
    if (!name || !employeeId || !email || !phone || !department || !dateOfJoining || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check for unique Employee ID and Email
        const [existingEmployee] = await db.promise().query(
            'SELECT * FROM employees WHERE employeeId = ? OR email = ?',
            [employeeId, email]
        );

        if (existingEmployee.length > 0) {
            return res.status(400).json({ message: 'Employee ID or Email already exists' });
        }

        // Insert new employee
        await db.promise().query(
            'INSERT INTO employees (name, employeeId, email, phone, department, dateOfJoining, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, employeeId, email, phone, department, dateOfJoining, role]
        );

        res.status(201).json({ message: 'Employee added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete an employee by employeeId
router.delete('/:id', async (req, res) => {
    const { id: employeeId } = req.params;
    console.log("Deleting employee with ID:", employeeId);
    
    // Validate employeeId
    if (!employeeId) {
        return res.status(400).json({ message: 'Employee ID is required' });
    }

    try {
        const [result] = await db.promise().query('DELETE FROM employees WHERE employeeId = ?', [employeeId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee removed successfully' });
    } catch (err) {
        console.error('Error occurred during deletion:', err);
        return res.status(500).json({ message: 'Deletion failed', error: err });
    }
});

// Update an employee's details by employeeId
router.put('/:id', async (req, res) => {
    const { id: employeeId } = req.params;
    const { name, email, phone, department, dateOfJoining, role } = req.body;

    // Validate employeeId and required fields
    if (!employeeId) {
        return res.status(400).json({ message: 'Employee ID is required' });
    }

    if (!name || !email || !phone || !department || !dateOfJoining || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Query to update employee details
        const query = `
            UPDATE employees 
            SET 
                name = ?,
                email = ?,
                phone = ?,
                department = ?,
                dateOfJoining = ?,
                role = ?
            WHERE employeeId = ?
        `;
        
        const values = [name, email, phone, department, dateOfJoining, role, employeeId];

        const [result] = await db.promise().query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee updated successfully' });
    } catch (err) {
        console.error('Error occurred during update:', err);
        return res.status(500).json({ message: 'Update failed', error: err });
    }
});

module.exports = router;
