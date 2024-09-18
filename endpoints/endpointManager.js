const express = require('express');
const bodyParser = require('body-parser');
const loginEndpoints = require('./loginEndpoints');
const ticketEndpoints = require('./ticketEndpoints');

const app = express();
const port = 3001;

function initialize() {
    app.listen(port, (err) => {
        if(err) {console.log(err);}
        console.log(`Listening to port ${port}`);
    });

    app.use(bodyParser.json());

    // Create endpoints
    loginEndpoints.setupLogin(app);
    loginEndpoints.setupRegister(app);
    ticketEndpoints.setupTickets(app);

    // Place all endpoints before this
    setupDefault(app);
}

function setupDefault(app) {
    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 - URL Not Found');
    });
}

module.exports = {
    initialize
};