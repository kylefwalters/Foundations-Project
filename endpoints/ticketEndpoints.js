const express = require('express');
const uuid = require('uuid');
const { getTicketByID, getTicketsByEmployee, getTicketsWithParams, postTicket } = require('../service/ticketService');
const { getEmployeeByID } = require('../service/employeeService');
const { authenticateManagerAccess, authenticateEmployeeAccess } = require('../utility/accountUtilities');

function setupTickets(app) {
    const ticketRouter = express.Router({ mergeParams: true });
    ticketRouter.get('/', authenticateManagerAccess, getAllTickets);
    ticketRouter.get('/:employeeID', authenticateEmployeeTicketAccess, getEmployeeTickets);
    ticketRouter.post('/', authenticateEmployeeAccess, validateNewTicket, submitTicket);
    ticketRouter.put('/:ticketID', authenticateManagerAccess, validateUpdatedTicket, updateTicketStatus);
    app.use('/tickets', ticketRouter);
}

async function getAllTickets(req, res) {
    const page = req.body.page ?? 0;
    const tickets = await getTicketsWithParams(req.query, page);
    if (tickets) {
        res.status(200).json(tickets);
    } else {
        res.status(400).send("Invalid query param(s)");
    }
}

async function authenticateEmployeeTicketAccess(req, res, next) {
    const employeeID = req.body.employeeID;
    const requestedEmployeeID = req.params.employeeID;
    const employee = await getEmployeeByID(employeeID);
    const hasAccess = employee.role === "manager" || employeeID === requestedEmployeeID;
    if (!hasAccess) {
        res.status(403)
            .send("User does not have access to this user's tickets");
        return;
    }
    next();
}

async function getEmployeeTickets(req, res) {
    const requestedEmployeeID = req.params.employeeID;

    const tickets = await getTicketsByEmployee(requestedEmployeeID);
    res.status(200)
        .json(tickets);
}

async function validateNewTicket(req, res, next) {
    let employeeID = req.body.employeeID;
    let description = req.body.description;
    let amount = req.body.amount;

    const isEmpIDString = typeof employeeID === "string";
    employeeID = isEmpIDString && employeeID.trim();
    const isDescrfiptionString = typeof description === "string";
    description = isDescrfiptionString && description.trim();
    amount = Number(amount);

    if (!employeeID || !amount || !description) {
        res.status(400)
            .send("One or more values are empty");
    } else if (amount <= 0 || !await getEmployeeByID(employeeID)) {
        res.status(400)
            .send("One or more values are invalid");
    } else {
        next();
    }
}

async function submitTicket(req, res) {
    const ticketID = uuid.v4();
    const employeeID = req.body.employeeID;
    const ticketStatus = "Pending";
    const ticketAmount = req.body.amount;
    const description = req.body.description;
    const ticketDate = Date.now();

    const newTicket = await postTicket(ticketID, employeeID, ticketStatus, ticketAmount, description, ticketDate);
    res.status(200)
        .json(newTicket);
}

async function validateUpdatedTicket(req, res, next) {
    const ticketID = req.body.ticketID;
    const ticketStatus = req.body.ticketStatus;

    const isString = typeof ticketID === "string" && typeof ticketStatus === "string";
    const isValid = isString && ticketID.trim() && ticketStatus.trim();
    const validTicket = await getTicketByID(ticketID);
    if (!isValid) {
        res.status(400)
            .send("Ticket ID/Ticket Status is empty");
    } else if (!validTicket) {
        res.status(400)
            .send("Ticket ID is invalid");
    } else if (validTicket.status != "Pending") {
        res.status(400)
            .send("Cannot change status of closed ticket");
    } else {
        next();
    }
}

async function updateTicketStatus(req, res) {
    const ticketID = req.body.ticketID;
    const ticketStatus = req.body.ticketStatus;

    // Update ticket
    const ticket = await getTicketByID(ticketID);
    ticket.status = ticketStatus;
    await postTicket(ticket);
    res.status(200)
        .send(`Ticket updated with stats: ${ticketStatus}`);
}

module.exports = {
    setupTickets,
    getAllTickets,
    authenticateManagerAccess,
    authenticateEmployeeTicketAccess,
    getEmployeeTickets,
    authenticateEmployeeAccess,
    validateNewTicket,
    submitTicket,
    authenticateManagerAccess,
    validateUpdatedTicket,
    updateTicketStatus
};