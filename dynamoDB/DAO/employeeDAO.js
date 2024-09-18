const { GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { runCommand } = require('../../utility/dynamoUtilities')

const TableName = "Reimbursement_Employees";

async function getEmployeeByID(employeeID) {
    const Key = { employeeID };
    const command = new GetCommand({
        TableName,
        Key
    });
    const data = await runCommand(command);
    return data.Item;
}

async function postEmployee(employee) {
    const command = new PutCommand({
        TableName,
        Item: employee
    });
    await runCommand(command);
    return employee;
}

module.exports = {
    getEmployeeByID,
    postEmployee
};