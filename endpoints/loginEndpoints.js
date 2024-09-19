const { getEmployeeByID, postEmployee } = require('../service/employeeService')
const { validateAccount } = require("../utility/accountUtilities");

function setupLogin(app) {
    app.post('/login', login);
}

async function login(req, res) {
    // Get login info
    const employeeID = req.body.employeeID;
    const employeePassword = req.body.password;

    if (!validateAccount(employeeID, employeePassword)) {
        res.status(400)
            .send("ID/Password is empty");
        return;
    }

    // Check that credentials are valid
    const employee = await getEmployeeByID(String(employeeID));
    if (employee?.password == employeePassword) {
        res.status(200).append("employeeID", employeeID)
            .send("Login Successful!");
    } else {
        res.status(400)
            .send("ID/Password is invalid");
    }
}

function setupRegister(app) {
    app.post('/register', register);
}

async function register(req, res) {
    // Get account info
    const employeeID = req.body.employeeID;
    const employeePassword = req.body.password;

    if (!validateAccount(employeeID, employeePassword)) {
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
        const newAccount = await postEmployee(employeeID, employeePassword, "employee");
        res.status(200)
            .send(JSON.stringify(newAccount));
    }
}

module.exports = {
    setupLogin,
    setupRegister,
    login,
    register
};