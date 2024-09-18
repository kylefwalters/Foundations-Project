const express = require('express');
const loginEndpoints = require('./loginEndpoints');
const ticketEndpoints = require('./ticketEndpoints');

const app = express();
const port = 3001;

function initialize() {
    app.listen(port);

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