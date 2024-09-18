function setupLogin(app) {
    // Login with account credentials
    app.post('/login', (req, res) => {
        // Get query params
        const queriedEmployeeid = req.query.employeeid;
        // Get login info
        const logedInEmployee = '0';

        if (logedInEmployee.isManager() || queriedEmployeeid == logedInEmployee) {
            // Return ticket info
            
        } else {
            // Unsuccessful response
            res.status(401);
            if (typeof queriedEmployeeid !== 'undefined') {
                res.send(`You do not have access to the tickets of ${queriedEmployeeid}`);
            } else {
                res.send(`User does not have manager access`);
            }
        }
    });
}

function setupRegister(app) {
    // Register new account
    app.post('/register', (req, res) => {
        // Get account info


        // Send response
        res.send(`register`);
    });
}

module.exports = {
    setupLogin,
    setupRegister
};