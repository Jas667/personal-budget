//npm run devstart in terminal to launch

const express = require('express');
const app = express();

// Add middleware for handling CORS requests from index.html
const cors = require('cors');
app.use(cors());

//add middleware for handling CORS requests from index.html
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const categoryRouter = require('./categoryRouter.js');

app.use('/api/budget', categoryRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));