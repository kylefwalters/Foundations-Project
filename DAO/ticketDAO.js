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

async function scanTickets(ExpressionAttributeNames, ExpressionAttributeValues, FilterExpression, ExclusiveStartKey = null) {
    const params = {
        TableName,
        Limit: ExclusiveStartKey && FilterExpression ? 4 : 3
    };
    params.ExpressionAttributeNames = ExpressionAttributeNames ?? params.ExpressionAttributeNames;
    params.ExpressionAttributeValues = ExpressionAttributeValues ?? params.ExpressionAttributeValues;
    params.FilterExpression = FilterExpression ?? params.FilterExpression;
    params.ExclusiveStartKey = ExclusiveStartKey ?? params.ExclusiveStartKey;
    const command = new ScanCommand(params);
    const data = await runCommand(command);
    return data;
}

module.exports = {
    getTicketByID,
    postTicket,
    queryTickets,
    scanTickets
};