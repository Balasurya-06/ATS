const express = require('express');

const app = express();

app.use(express.json());

module.exports = app;

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from the router!');
});

app.use('/api', router);

// Add root route for GET /
app.get('/', (req, res) => {
    res.send('Welcome to the ACCUST backend API!');
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});