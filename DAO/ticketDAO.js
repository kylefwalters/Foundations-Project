const { GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { runCommand } = require('../utility/dynamoUtilities')

const TableName = "Reimbursement_Tickets";

async function getTicketByID(Key) {
    const command = new GetCommand({
        TableName,
        Key
    });
    const data = await runCommand(command);
    return data.Item;
}

async function postTicket(ticket) {
    const command = new PutCommand({
        TableName,
        Item: ticket
    });
    await runCommand(command);
    return ticket;
}

module.exports = {
    getTicketByID,
    postTicket
};