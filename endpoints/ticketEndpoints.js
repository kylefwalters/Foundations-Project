const { getTicketByID, postTicket } = require('../service/ticketService');
const {authenticateManagerAccess} = require('../utility/accountUtilities');

function setupTickets(app) {
    // View all tickets
    app.get('/tickets', authenticateManagerAccess, (req, res) => {

    });

    // Submit ticket
    app.post('/tickets', (req, res) => {
        // Get body info
        const ticketID = req.body.ticketID;
        const employeeID = req.body.employeeID;
        const ticketStatus = "pending";

        // Send response

    });

    // Update ticket status
    app.put('/tickets/:ticketID', authenticateManagerAccess, validateTicket, (req, res) => {
        // Get body info

        // Get ticket

        // Update ticket status
    });
}

function validateTicket(req, res, next) {
    const ticketID = req.body.ticketID;
    const employeeID = req.body.employeeID;

    
    const isString = typeof ticketID === "string" && typeof employeeID === "string";
    const isValid = isString && ticketID.trim() && employeeID.trim();
    if (!isValid) {
        res.status(400)
            .send("TicketID/EmployeeID is empty");
        return;
    }
    next();
}

module.exports = {
    setupTickets
};