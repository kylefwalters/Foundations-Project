const { getEmployeeByID } = require('../dynamoDB/DAO/employeeDAO')

function setupLogin(app) {
    // Login with account credentials
    app.post('/login', async (req, res) => {
        // Get login info
        const employeeID = req.body.employeeID;
        const employeePassword = req.body.password;
        const employee = await getEmployeeByID(String(employeeID));

        // Check that credentials are valid
        if (typeof employeeID === "undefined" || typeof employeePassword === "undefined") {
            res.status(400)
                .send("ID/Password is empty");
        } else if (employee?.employeeID == employeeID && employee?.password == employeePassword) {
            res.status(200).append("employeeID", employeeID)
                .send("Login Successful!");
        } else {
            res.status(400)
                .send("ID/Password is invalid");
        }
    });
}

function setupRegister(app) {
    // Register new account
    app.post('/register', (req, res) => {
        // Get account info

        // Send response
    });
}

module.exports = {
    setupLogin,
    setupRegister
};