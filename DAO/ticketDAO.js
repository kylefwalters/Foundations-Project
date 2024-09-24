const { GetCommand, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { runCommand } = require('../utility/dynamoUtilities');
const { QueryCommand } = require("@aws-sdk/client-dynamodb");

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

async function queryTickets(IndexName, KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues, FilterExpression) {
    const command = new QueryCommand({
        TableName, 
        IndexName,
        KeyConditionExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        FilterExpression
    });
    const data = await runCommand(command);
    return data?.Items;
}

async function scanTickets(ExpressionAttributeNames, ExpressionAttributeValues, FilterExpression) {
    const command = new ScanCommand({
        TableName, 
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        FilterExpression
    });
    const data = await runCommand(command);
    return data?.Items;
}

module.exports = {
    getTicketByID,
    postTicket,
    queryTickets,
    scanTickets
};