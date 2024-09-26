const jwt = require("jsonwebtoken");
const { getEmployeeByID } = require('../service/employeeService');

const secretKey = "cd3fe888-85b1-4c9f-ae35-83816ea20e39";

async function authenticateManagerAccess(req, res, next) {
    async function hasManagerAccess(employee) {
        const employeeExists = await getEmployeeByID(employee.employeeID);
        return employeeExists && employee.role === "manager";
    }

    const hasAccess = await validateToken(req, hasManagerAccess);
    if (!hasAccess) {
        res.status(403)
            .send("User does not have manager access");
        return;
    }
    next();

}

async function authenticateEmployeeAccess(req, res, next) {
    async function hasEmployeeAccess(employee) {
        const employeeExists = await getEmployeeByID(employee.employeeID);
        return employeeExists && employee.role === "employee";
    }

    const hasAccess = await validateToken(req, hasEmployeeAccess);
    if (!hasAccess) {
        res.status(403)
            .send("User does not have employee access");
        return;
    }
    next();
}

function validateAccount(id, password) {
    const isString = typeof id === "string" && typeof password === "string";
    return isString && id.trim() && password.trim();
}

async function validateToken(req, validationCallback) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        return false;
    }
    const employee = await decodeJWT(token);

    return await validationCallback(employee);
}

async function decodeJWT(token){
    try{
        const employee = await jwt.verify(token, secretKey)
        return employee;
    }catch(err){
        console.error(err);
    }
}

module.exports = {
    validateAccount,
    authenticateManagerAccess,
    authenticateEmployeeAccess
}