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
    return tickets
}

async function getTicketsWithParams(queryParams) {
    let FilterExpression = ''
    let ExpressionAttributeNames = {};
    let ExpressionAttributeValues = {};
    for (const property in queryParams) {
        FilterExpression += ` #${property} = :${property} AND `;
        ExpressionAttributeNames['#' + property] = property;
        ExpressionAttributeValues[':' + property] = queryParams[property];
    }

    FilterExpression = FilterExpression.slice(0, FilterExpression.length - 4);
    tickets =
        await ticketDAO.scanTickets(ExpressionAttributeNames, ExpressionAttributeValues, FilterExpression);
    return tickets;
}

async function postTicket({ ticketID, employeeID, status }) {
    const employee = { ticketID, password: employeeID, role: status };
    const newAccount = await ticketDAO.postTicket(employee);
    return newAccount;
}

module.exports = {
    getTicketByID,
    getTicketsByEmployee,
    getTicketsWithParams,
    postTicket
};