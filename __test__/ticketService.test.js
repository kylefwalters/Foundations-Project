const uuid = require('uuid');
const ticketService = require('../service/ticketService');
const ticketDAO = require('../DAO/ticketDAO');

jest.mock('uuid');
jest.mock('../DAO/ticketDAO');

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

describe('ticketService', () => {
    beforeAll(() => {
        // Mock DAO
        ticketDAO.getTicketByID.mockImplementation((Key) => {
            return mockDatabase.find((ticket) => Key.ticketID == ticket.ticketID);
        });
        ticketDAO.postTicket.mockImplementation((ticket) => {
            return ticket;
        });
        ticketDAO.queryTickets.mockImplementation((IndexName, KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues, FilterExpression) => {
            const employeeID = ExpressionAttributeValues[":employeeID"].S;
            return mockDatabase.filter((ticket) => employeeID == ticket.employeeID);
        });
        ticketDAO.scanTickets.mockImplementation((ExpressionAttributeNames, ExpressionAttributeValues, FilterExpression, ExclusiveStartKey = null) => {
            const ticketID = ExpressionAttributeValues && ExpressionAttributeValues[":ticketID"];
            const employeeID = ExpressionAttributeValues && ExpressionAttributeValues[":employeeID"];
            const status = ExpressionAttributeValues && ExpressionAttributeValues[":status"];
            let afterStartKey = !ExclusiveStartKey;
            let limit = 3;
            const resultSet = mockDatabase.filter((ticket) => {
                if (ticket.ticketID == ExclusiveStartKey?.ticketID) {
                    afterStartKey = true;
                }
                return afterStartKey && (ticket.ticketID == (ticketID ?? ticket.ticketID) &&
                    ticket.employeeID == (employeeID ?? ticket.employeeID) && ticket.status == (status ?? ticket.status)) && limit-- > 0;
            });

            return {
                Items: resultSet,
                LastEvaluatedKey: resultSet[resultSet.length - 1]
            };
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
        ticketDAO.getTicketByID.mockClear();
        ticketDAO.postTicket.mockClear();
        ticketDAO.queryTickets.mockClear();
        ticketDAO.scanTickets.mockClear();
    });

    test("Getting existing ticket by ticketID should return matching ticket", async () => {
        const expectedTicket = mockPendingTicket;

        const result = await ticketService.getTicketByID(expectedTicket.ticketID);

        expect(result).toBe(expectedTicket);
        expect(ticketDAO.getTicketByID).toHaveBeenCalledTimes(1);
        expect(ticketDAO.getTicketByID).toHaveBeenCalledWith({ ticketID: expectedTicket.ticketID });
    });

    test("Tring to get ticket that does not exist should return undefined", async () => {
        const mockTicketID = "fakeTicketID";

        const result = await ticketService.getTicketByID(mockTicketID);

        expect(result).toBeFalsy();
        expect(ticketDAO.getTicketByID).toHaveBeenCalledTimes(1);
        expect(ticketDAO.getTicketByID).toHaveBeenCalledWith({ ticketID: mockTicketID });
    });

    test("Getting ticket by employeeID should return all matching tickets", async () => {
        const expectedTicket = mockPendingTicket;
        const expectedTicket2 = mockApprovedTicket;

        const result = await ticketService.getTicketsByEmployee(expectedTicket.employeeID);

        expect(result).toStrictEqual([expectedTicket, expectedTicket2]);
        expect(ticketDAO.queryTickets).toHaveBeenCalledTimes(1);
        expect(ticketDAO.queryTickets).toHaveBeenCalledWith("employeeID-ticketID-index", "#employeeID = :employeeID", { "#employeeID": "employeeID" }, { ":employeeID": { S: expectedTicket.employeeID } });
    });

    test("Trying to get tickets with invalid employeeID should return empty array", async () => {
        const mockEmployeeID = "invalidID";

        const result = await ticketService.getTicketsByEmployee(mockEmployeeID);

        expect(result).toStrictEqual([]);
        expect(ticketDAO.queryTickets).toHaveBeenCalledTimes(1);
    });

    test("Getting ticket with query parameters should return only tickets that match params", async () => {
        const queryParamStatus = { status: mockPendingTicket.status };
        const queryParamEmployee = { employeeID: mockPendingTicket.employeeID };
        const queryParamBoth = { status: mockPendingTicket.status, employeeID: mockPendingTicket.employeeID };

        const queryByStatusresult = await ticketService.getTicketsWithParams(queryParamStatus, 0);
        const queryByEmployeeIDresult = await ticketService.getTicketsWithParams(queryParamEmployee, 0);
        const queryByBothresult = await ticketService.getTicketsWithParams(queryParamBoth, 0);

        expect(queryByStatusresult).toStrictEqual([mockPendingTicket, mockPendingTicket2, mockPendingTicket3]);
        expect(queryByEmployeeIDresult).toStrictEqual([mockPendingTicket, mockApprovedTicket]);
        expect(queryByBothresult).toStrictEqual([mockPendingTicket]);
        expect(ticketDAO.scanTickets).toHaveBeenCalledTimes(3);
    });

    test("Getting tickets without query params should return all tickets", async () => {
        const queryParamStatus = {};

        const queryResult = await ticketService.getTicketsWithParams(queryParamStatus, 0);

        expect(queryResult).toStrictEqual([mockPendingTicket, mockPendingTicket2, mockApprovedTicket]);
    });

    test("Getting tickets with different page counts should return different results", async () => {
        const queryParamStatus = {};

        const queryByStatusresult = await ticketService.getTicketsWithParams(queryParamStatus, 1);

        expect(queryByStatusresult).toStrictEqual([mockApprovedTicket, mockPendingTicket3, mockPendingTicket4]);
    });

    test("Trying to get tickets with invalid query params should return null", async () => {
        const queryParamStatus = { status: "FakeStatus" };

        const result = await ticketService.getTicketsWithParams(queryParamStatus, 0);

        expect(result).toStrictEqual([]);
    });

    test("Posting ticket should add it to the database", async () => {
        const newTicket = {
            ticketID: "wsg98gsrr",
            employeeID: "inhu34t",
            status: "Pending",
            amount: 229.00,
            description: "Mock description",
            date: "15392385628"
        };
        const { ticketID, employeeID, status, amount, description, date } = newTicket;
        const result = await ticketService.postTicket(ticketID, employeeID, status, amount, description, date );

        expect(result).toStrictEqual(newTicket);
    });
});