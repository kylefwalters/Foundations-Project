const { GetCommand } = require("@aws-sdk/lib-dynamodb");
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

module.exports = {
    getEmployeeByID
};