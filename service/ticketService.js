const ticketDAO = require('../DAO/ticketDAO');

const IndexMap = {
    employeeID: "employeeID-ticketID-index",
    status: "status-index"
}

async function getTicketByID(ticketID) {
    const Key = { ticketID: ticketID };
    const ticket = await ticketDAO.getTicketByID(Key);
    return ticket;
}

async function getTicketsByEmployee(employeeID) {
    const KeyCondition = "#employeeID = :employeeID";
    const ExpressionAttributeNames = {
        "#employeeID": "employeeID"
    };
    const ExpressionAttributeValues = {
        ":employeeID": { S: employeeID }
    };

    const tickets =
        await ticketDAO.queryTickets(IndexMap["employeeID"], KeyCondition, ExpressionAttributeNames, ExpressionAttributeValues);
    return tickets;
}

async function getTicketsWithParams(queryParams, page) {
    let FilterExpression = ''
    let ExpressionAttributeNames = {};
    let ExpressionAttributeValues = {};
    for (const property in queryParams) {
        FilterExpression += ` #${property} = :${property} AND `;
        ExpressionAttributeNames['#' + property] = property;
        ExpressionAttributeValues[':' + property] = queryParams[property];
    }

    if (FilterExpression.length == 0) {
        FilterExpression = null;
        ExpressionAttributeNames = null;
        ExpressionAttributeValues = null;
    }

    FilterExpression = FilterExpression?.slice(0, FilterExpression.length - 4);
    let data =
        await ticketDAO.scanTickets(ExpressionAttributeNames, ExpressionAttributeValues, FilterExpression);
    while (page > 0 && data.LastEvaluatedKey) {
        data =
            await ticketDAO.scanTickets(ExpressionAttributeNames, ExpressionAttributeValues,
                FilterExpression, data.LastEvaluatedKey);
        page--;
    }
    return data?.Items;
}

async function postTicket({ ticketID, employeeID, status, amount, description, date }) {
    const ticket = { ticketID, employeeID, status, amount, description, date };
    const newAccount = await ticketDAO.postTicket(ticket);
    return newAccount;
}

module.exports = {
    getTicketByID,
    getTicketsByEmployee,
    getTicketsWithParams,
    postTicket
};