const employeeDAO = require('../DAO/employeeDAO');

async function getEmployeeByID(employeeID) {
    const Key = { employeeID };
    const employee = await employeeDAO.getEmployeeByID(Key);
    return employee
}

async function postEmployee(id, password, role) {
    const employee = { employeeID: id, password, role };
    const newAccount = await employeeDAO.postEmployee(employee);
    return newAccount;
}

module.exports = {
    getEmployeeByID,
    postEmployee
};