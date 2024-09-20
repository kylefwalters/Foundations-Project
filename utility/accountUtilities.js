async function authenticateManagerAccess(req, res, next) {
    const employeeID = req.body.employeeID;
    const employee = await getEmployeeByID(employeeID);
    const hasManagerAccess = employee.role === "manager";
    if (!hasManagerAccess) {
        res.status(403)
            .send("User does not have manager access");
        return;
    }
    next();

}

async function authenticateEmployeeAccess(req, res, next) {
    const employeeID = req.body.employeeID;
    const employee = await getEmployeeByID(employeeID);
    const hasEmployeeAccess = employee.role === "employee" || employee.role === "manager";
    if (!hasEmployeeAccess) {
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

module.exports = {
    validateAccount,
    authenticateManagerAccess,
    authenticateEmployeeAccess
}