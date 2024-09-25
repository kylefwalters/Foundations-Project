const uuid = require('uuid');
const ticketService = require('../service/ticketService');
const employeeService = require('../service/employeeService');
const { getAllTickets,
    authenticateManagerAccess,
    authenticateEmployeeTicketAccess,
    getEmployeeTickets,
    authenticateEmployeeAccess,
    validateNewTicket,
    submitTicket,
    validateUpdatedTicket,
    updateTicketStatus } = require('../endpoints/ticketEndpoints');

jest.mock('uuid');
jest.mock('../service/ticketService');
jest.mock('../service/employeeService');

// Mock data
const mockDatabase = [];
const mockPendingTicket = {
    ticketID: "mockPendingTicket",
    employeeID: "trhs56",
    status: "Pending",
    amount: 229.00,
    description: "Mock description"
};
const mockPendingTicket2 = {
    ticketID: "mockPendingTicket2",
    employeeID: "534hdsr",
    status: "Pending",
    amount: 229.00,
    description: "Mock description"
};
const mockApprovedTicket = {
    ticketID: "mockApprovedTicket",
    employeeID: "trhs56",
    status: "Approved",
    amount: 229.00,
    description: "Mock description"
};
const mockPendingTicket3 = {
    ticketID: "mockPendingTicket3",
    employeeID: "kewk53",
    status: "Pending",
    amount: 229.00,
    description: "Mock description"
};
const mockPendingTicket4 = {
    ticketID: "mockPendingTicket4",
    employeeID: "4jh4j6",
    status: "Pending",
    amount: 229.00,
    description: "Mock description"
};
const mockUUID = "111fff22-62a9-4d68-ba32-47b2fbc43d71";

function initializeMockDatabase() {
    mockDatabase.length = 0;
    mockDatabase.push(mockPendingTicket, mockPendingTicket2, mockApprovedTicket, mockPendingTicket3, mockPendingTicket4);
}
const mockRes = {
    status: jest.fn((code) => mockRes),
    append: jest.fn(() => mockRes),
    send: jest.fn(() => mockRes),
    json: jest.fn(() => mockRes)
};

describe('ticketEndpoints', () => {
    beforeAll(() => {
        // Mock ticketService
        ticketService.getTicketByID.mockImplementation((ticketID) => {
            return mockDatabase.find((entry) => entry.ticketID == ticketID);
        });
        ticketService.getTicketsByEmployee.mockImplementation((employeeID) => {
            return mockDatabase.filter((entry) => entry.employeeID == employeeID);
        });
        ticketService.postTicket.mockImplementation((ticketID, employeeID, status) => {
            return { ticketID, employeeID, status };
        });

        // Mock UUID
        uuid.v4.mockImplementation(() => {
            return mockUUID;
        });
    });

    beforeEach(() => {
        initializeMockDatabase();
    });

    afterEach(() => {
        ticketService.getTicketByID.mockClear();
        ticketService.postTicket.mockClear();
        ticketService.getTicketsByEmployee.mockClear();
        ticketService.getTicketsWithParams.mockClear();
        mockRes.status.mockClear();
        mockRes.append.mockClear();
        mockRes.send.mockClear();
        mockRes.json.mockClear();
    });

    test("getAllTickets should return all tickets if no query parameters were passed", async () => {
        ticketService.getTicketsWithParams.mockImplementation(() => mockDatabase);
        const mockReq = {
            body: {}
        };

        await getAllTickets(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockDatabase);
    });

    test("getAllTickets should return 400 if invalid/missing params", async () => {
        ticketService.getTicketsWithParams.mockImplementation(() => null);
        const mockReq = {
            body: {
                status: "FakeStatus"
            }
        };

        await getAllTickets(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test("authenticateEmployeeTicketAccess should only allow access if user has employee access or higher", async () => {
        const fakeID = "FakeID";
        const managerID = "ManagerID";
        const employeeID = "EmployeeID";
        employeeService.getEmployeeByID.mockImplementation((ID) => {
            switch (ID) {
                default:
                    return {
                        employeeID: ID,
                        role: "employee"
                    };
                case managerID:
                    return {
                        employeeID: employeeID,
                        role: "manager"
                    };
            }
        });

        const mockReqValid = {
            body: {
                employeeID: employeeID
            },
            params: {
                employeeID: employeeID
            }
        };
        const mockReqManager = {
            body: {
                employeeID: managerID
            },
            params: {
                employeeID: employeeID
            }
        };
        const mockReqWrong = {
            body: {
                employeeID: fakeID
            },
            params: {
                employeeID: employeeID
            }
        };
        const mockResValid = Object.assign(mockRes);
        const mockResManager = Object.assign(mockRes);
        const mockResWrong = Object.assign(mockRes);
        const mockNext = jest.fn();

        await authenticateEmployeeTicketAccess(mockReqValid, mockResValid, mockNext);
        await authenticateEmployeeTicketAccess(mockReqManager, mockResManager, mockNext);
        await authenticateEmployeeTicketAccess(mockReqWrong, mockResWrong, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(2);
        expect(mockResWrong.status).toHaveBeenCalledWith(403);
    });

    test("getEmployeeTickets should return all tickets with employeeID", async () => {
        const employeeID = mockPendingTicket.employeeID;
        const mockReq = {
            params: {
                employeeID
            }
        };

        await getEmployeeTickets(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith([mockPendingTicket, mockApprovedTicket]);
    });

    test("validateNewTicket should only pass if employeeID is valid", async () => {
        const employeeID = mockPendingTicket.employeeID;
        const amount = 22.32;
        const description = "Mock description"
        const employeeIDWrong = "FakeID";
        const employeeIDEmpty = "";
        const mockReqValid = {
            body: {
                employeeID,
                amount,
                description
            }
        };
        const mockReqWrong = {
            body: {
                employeeIDWrong
            }
        };
        const mockReqEmpty = {
            body: {
                employeeIDEmpty
            }
        };
        const mockResValid = Object.assign(mockRes);
        const mockResWrong = Object.assign(mockRes);
        const mockResEmpty = Object.assign(mockRes);
        const mockNext = jest.fn();

        await validateNewTicket(mockReqValid, mockResValid, mockNext);
        await validateNewTicket(mockReqWrong, mockResWrong, mockNext);
        await validateNewTicket(mockReqEmpty, mockResEmpty, mockNext);
        
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockResWrong.status).toHaveBeenCalledWith(400);
        expect(mockResEmpty.status).toHaveBeenCalledWith(400);
    });

    test("submitTicket should return new ticket as JSON", async () => {
        const employeeID = mockPendingTicket.employeeID;
        const mockReq = {
            body: {
                employeeID
            }
        };
        const expected = {
            ticketID : mockUUID,
            employeeID: employeeID,
            status: "Pending"
        }

        await submitTicket(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(expected);
    });

    test("validateUpdatedTicket should only accept if ticketID is valid and ticket is not already closed", async () => {
        const mockReqValid = {
            body: {
                ticketID: "mockPendingTicket",
                ticketStatus: "Accepted"
            }
        };
        const mockReqClosed = {
            body: {
                ticketID: "mockApprovedTicket",
                ticketStatus: "Accepted"
            }
        };
        const mockResValid = Object.assign(mockRes);
        const mockResClosed = Object.assign(mockRes);
        const mockNext = jest.fn();
        
        await validateUpdatedTicket(mockReqValid, mockResValid, mockNext);
        await validateUpdatedTicket(mockReqClosed, mockResClosed, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockResClosed.status).toHaveBeenCalledWith(400);
    });

    test("updateTicketStatus should return 200 with updated ticket status", async () => {
        const mockReqValid = {
            body: {
                ticketID: "mockPendingTicket",
                ticketStatus: "Accepted"
            }
        };

        await updateTicketStatus(mockReqValid, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
    });
});