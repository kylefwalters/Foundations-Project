const {
    getEmployeeByID,
    postEmployee
} = require('../dynamoDB/DAO/employeeDAO');
const { validateAccount } = require("../utility/accountUtilities");

function setupLogin(app) {
    // Login with account credentials
    app.post('/login', async (req, res) => {
        // Get login info
        const employeeID = req.body.employeeID;
        const employeePassword = req.body.password;

        if(!validateAccount(employeeID, employeePassword)) {
            res.status(400)
                .send("ID/Password is empty");
                return;
        }

        // Check that credentials are valid
        const employee = await getEmployeeByID(String(employeeID));
        if (employee?.employeeID == employeeID && employee?.password == employeePassword) {
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
    app.post('/register', async (req, res) => {
        // Get account info
        const employeeID = req.body.employeeID;
        const employeePassword = req.body.password;

        if(!validateAccount(employeeID, employeePassword)) {
            res.status(400)
                .send("ID/Password is empty");
                return;
        }

        // Send response
        const accountExists = await getEmployeeByID(String(employeeID)) ? true : false;
        if (accountExists) {
            res.status(400)
                .send("Account already exists");
        } else {
            const newAccount = await postEmployee({ employeeID, password: employeePassword, role: "employee" });
            res.status(200)
                .send(JSON.stringify(newAccount));
        }
    });
}

module.exports = {
    setupLogin,
    setupRegister
};