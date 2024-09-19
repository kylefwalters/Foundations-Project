const employeeDAO = require('../dynamoDB/DAO/employeeDAO');

async function getEmployeeByID(employeeID) {
    const employee = await employeeDAO.getEmployeeByID(String(employeeID));
    return employee
}

async function postEmployee(id, password, role) {
    const newAccount = await employeeDAO.postEmployee({ employeeID: id, password, role });
    return newAccount;
}

module.exports = {
    getEmployeeByID,
    postEmployee
};