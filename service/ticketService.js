const ticketDAO = require('../DAO/ticketDAO');

async function getTicketByID(ticketID) {
    const Key = { ticketID: ticketID };
    const ticket = await ticketDAO.getTicketByID(Key);
    return ticket;
}

async function postTicket(ticketID, employeeID, status) {
    const employee = { ticketID, password: employeeID, role: status };
    const newAccount = await ticketDAO.postTicket(employee);
    return newAccount;
}

module.exports = {
    getTicketByID,
    postTicket
};