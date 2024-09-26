const accountUtilities = require('../utility/accountUtilities');
const employeeService = require('../service/employeeService');
const jwt = require("jsonwebtoken");

jest.mock('jsonwebtoken');
jest.mock('../service/employeeService');

describe('accountUtilities', () => {
    beforeAll(() => {
        employeeService.getEmployeeByID.mockImplementation((id) => {
            return true;
        });
    });

    test('validateAccount should only return true if both id and password are not empty strings or whitespace', () => {
        const mockIDValid = "ValidID";
        const mockIDWrong = " ";
        const mockPasswordValid = "ValidPassword";
        const mockPasswordWrong = " ";

        const resultValid = accountUtilities.validateAccount(mockIDValid, mockPasswordValid);
        const resultWrongID = accountUtilities.validateAccount(mockIDWrong, mockPasswordValid);
        const resultWrongPassword = accountUtilities.validateAccount(mockIDValid, mockPasswordWrong);

        expect(resultValid).toBeTruthy();
        expect(resultWrongID).toBeFalsy();
        expect(resultWrongPassword).toBeFalsy();
    });

    test('authenticateManagerAccess should return true if valid token with manager role is passed', async () => {
        const mockReq = {
            headers: {
                authorization: "Bearer validToken"
            }
        };
        const mockRes = {
            status: jest.fn((code) => mockRes),
            append: jest.fn(() => mockRes),
            send: jest.fn(() => mockRes),
            json: jest.fn(() => mockRes)
        };
        const mockNext = jest.fn();

        jwt.verify.mockImplementation((token, key) => {
            return {
                employeeID: "validID",
                role: "manager"
            };
        });
        await accountUtilities.authenticateManagerAccess(mockReq, mockRes, mockNext);
        jwt.verify.mockImplementation((token, key) => {
            return false;
        });
        await accountUtilities.authenticateManagerAccess(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('authenticateEmployeeAccess should return true if valid token with manager role is passed', async () => {
        const mockReq = {
            headers: {
                authorization: "Bearer validToken"
            }
        };
        const mockRes = {
            status: jest.fn((code) => mockRes),
            append: jest.fn(() => mockRes),
            send: jest.fn(() => mockRes),
            json: jest.fn(() => mockRes)
        };
        const mockNext = jest.fn();

        jwt.verify.mockImplementation((token, key) => {
            return {
                employeeID: "validID",
                role: "employee"
            };
        });
        await accountUtilities.authenticateEmployeeAccess(mockReq, mockRes, mockNext);
        jwt.verify.mockImplementation((token, key) => {
            return false;
        });
        await accountUtilities.authenticateEmployeeAccess(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });
});

describe('dynamoUtilities', () => {

});