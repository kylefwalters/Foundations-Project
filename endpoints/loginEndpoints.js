const jwt = require('jsonwebtoken');
const { getEmployeeByID, postEmployee } = require('../service/employeeService')
const { validateAccount } = require("../utility/accountUtilities");

const secretKey = "cd3fe888-85b1-4c9f-ae35-83816ea20e39";

function setupLogin(app) {
    app.post('/login', login);
}

async function login(req, res) {
    // Get login info
    const employeeID = req.body.employeeID;
    const employeePassword = req.body.password;

    // Check that credentials are valid
    const employee = await getEmployeeByID(employeeID);
    if (employee?.password == employeePassword) {
        const token = generateNewJWTToken(employee);

        res.status(200).append("employeeID", employeeID)
            .json(token);
    } else {
        res.status(400)
            .send("ID/Password is invalid");
    }
}

function generateNewJWTToken(employee) {
    const token = jwt.sign(
        {
            id: employee.employeeID,
            role: employee.role
        },
        secretKey,
        {
            expiresIn: "30m"
        }
    );
    return token;
}

function setupRegister(app) {
    app.post('/register', register);
}

async function register(req, res) {
    // Get account info
    const employeeID = req.body.employeeID;
    const employeePassword = req.body.password;

    // Send response
    const accountExists = await getEmployeeByID(employeeID) ? true : false;
    if (accountExists) {
        res.status(400)
            .send("Account already exists");
    } else {
        const newAccount = await postEmployee(employeeID, employeePassword, "employee");
        res.status(200)
            .json(newAccount);
    }
}

function setupAccountValidation(app) {
    app.use(['/login', '/register'], validateAccountCredentials);
}

function validateAccountCredentials(req, res, next) {
    const employeeID = req.body.employeeID;
    const employeePassword = req.body.password;

    if (!validateAccount(employeeID, employeePassword)) {
        res.status(400)
            .send("ID/Password is empty");
        return;
    }
    next();
}

module.exports = {
    setupLogin,
    setupRegister,
    login,
    register,
    setupAccountValidation,
    validateAccountCredentials
};