const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const employeeRoutes = require('./routes/employees');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/employees', employeeRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
