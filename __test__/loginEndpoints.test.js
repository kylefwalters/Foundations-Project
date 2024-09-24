const { login, register, validateAccountCredentials } = require('../endpoints/loginEndpoints');
const employeeService = require('../service/employeeService');

jest.mock('../service/employeeService');

// Mock data
const mockDatabase = [];
const mockEmployee = {
    employeeID: "mockEmployee1",
    password: "password",
    role: "employee"
};
const mockManager = {
    employeeID: "mockManager1",
    password: "admin",
    role: "manager"
};

function initializeMockDatabase() {
    mockDatabase.length = 0;
    mockDatabase.push(mockEmployee, mockManager);
}

beforeAll(() => {
    employeeService.getEmployeeByID.mockImplementation((employeeID) => {
        return mockDatabase.find((user) => employeeID == user.employeeID);
    });
    employeeService.postEmployee.mockImplementation((id, password, role) => {
        const employee = { employeeID: id, password, role };
        return mockDatabase[mockDatabase.push(employee) - 1];
    });
});

beforeEach(() => {
    initializeMockDatabase();
});

afterEach(() => {
    employeeService.getEmployeeByID.mockClear();
    employeeService.postEmployee.mockClear();
});

describe("loginEndpoints.login", () => {

    test("Logging in with valid username & password", async () => {
        const mockReq = {
            body: {
                ...mockEmployee
            }
        };
        const mockRes = {
            status: jest.fn((code) => mockRes),
            append: jest.fn(() => mockRes),
            send: jest.fn(() => mockRes),
            json: jest.fn(() => mockRes)
        };

        await login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toHaveBeenCalledWith("Login Successful!");
        expect(employeeService.getEmployeeByID).toHaveBeenCalledTimes(1);
        expect(employeeService.getEmployeeByID).toHaveBeenCalledWith(mockReq.body.employeeID);
    });

    test("Logging in with wrong username", async () => {
        const mockReq = {
            body: {
                employeeID: "mockEmployee1_wrong",
                password: "password"
            }
        };
        const mockRes = {
            status: jest.fn((code) => mockRes),
            append: jest.fn(() => mockRes),
            send: jest.fn(() => mockRes)
        };

        await login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toHaveBeenCalledWith("ID/Password is invalid");
        expect(employeeService.getEmployeeByID).toHaveBeenCalledTimes(1);
        expect(employeeService.getEmployeeByID).toHaveBeenCalledWith(mockReq.body.employeeID);
    });

    test("Logging in with wrong password", async () => {
        const mockReq = {
            body: {
                employeeID: "mockEmployee1",
                password: "wrongPassword"
            }
        };
        const mockRes = {
            status: jest.fn((code) => mockRes),
            append: jest.fn(() => mockRes),
            send: jest.fn(() => mockRes)
        };

        await login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toHaveBeenCalledWith("ID/Password is invalid");
        expect(employeeService.getEmployeeByID).toHaveBeenCalledTimes(1);
        expect(employeeService.getEmployeeByID).toHaveBeenCalledWith(mockReq.body.employeeID);
    });

    test("Logging in with empty username", async () => {
        const mockReq = {
            body: {
                employeeID: "",
                password: "password"
            }
        };
        const mockRes = {
            status: jest.fn((code) => mockRes),
            append: jest.fn(() => mockRes),
            send: jest.fn(() => mockRes)
        };
        const next = jest.fn();

        await validateAccountCredentials(mockReq, mockRes, next);

        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toHaveBeenCalledWith("ID/Password is empty");
        expect(next).toHaveBeenCalledTimes(0);
    });

    test("Logging in with empty password", async () => {
        const mockReq = {
            body: {
                employeeID: "mockEmployee1",
                password: ""
            }
        };
        const mockRes = {
            status: jest.fn((code) => mockRes),
            append: jest.fn(() => mockRes),
            send: jest.fn(() => mockRes)
        };
        const next = jest.fn();

        await validateAccountCredentials(mockReq, mockRes, next);

        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toHaveBeenCalledWith("ID/Password is empty");
        expect(next).toHaveBeenCalledTimes(0);
    });
});

describe("loginEndpoints.register", () => {
    test("Register with valid username & password", async () => {
        const expectedAccount = {
            employeeID: "mockEmployeeNew",
            password: "password",
            role: "employee"
        };
        const expectedMessage = expectedAccount;
        const mockReq = {
            body: {
                employeeID: expectedAccount.employeeID,
                password: expectedAccount.password
            }
        };
        const mockRes = {
            status: jest.fn((code) => mockRes),
            append: jest.fn(() => mockRes),
            send: jest.fn(() => mockRes),
            json: jest.fn(() => mockRes)
        };

        await register(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledTimes(1);
        expect(mockRes.json).toHaveBeenCalledWith(expectedMessage);
        expect(employeeService.getEmployeeByID).toHaveBeenCalledTimes(1);
        expect(employeeService.getEmployeeByID).toHaveBeenCalledWith(mockReq.body.employeeID);
        expect(employeeService.postEmployee).toHaveBeenCalledTimes(1);
        expect(employeeService.postEmployee).toHaveBeenCalledWith(...Object.values(expectedAccount));
    });

    test("Register with existing username", async () => {
        const mockReq = {
            body: {
                employeeID: mockEmployee.employeeID,
                password: mockEmployee.password
            }
        };
        const mockRes = {
            status: jest.fn((code) => mockRes),
            append: jest.fn(() => mockRes),
            send: jest.fn(() => mockRes)
        };

        await register(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toHaveBeenCalledWith("Account already exists");
        expect(employeeService.getEmployeeByID).toHaveBeenCalledTimes(1);
        expect(employeeService.getEmployeeByID).toHaveBeenCalledWith(mockReq.body.employeeID);
        expect(employeeService.postEmployee).toHaveBeenCalledTimes(0);
    });

    test("Register, then attempt to register the same account", async () => {
        const expectedAccount = {
            employeeID: "mockEmployeeNew",
            password: "password",
            role: "employee"
        };
        const mockReq = {
            body: {
                employeeID: expectedAccount.employeeID,
                password: expectedAccount.password
            }
        };
        const mockRes = {
            status: jest.fn((code) => mockRes),
            append: jest.fn(() => mockRes),
            send: jest.fn(() => mockRes),
            json: jest.fn(() => mockRes)
        };

        await register(mockReq, mockRes);
        await register(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledTimes(2);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toHaveBeenCalledWith("Account already exists");
        expect(employeeService.getEmployeeByID).toHaveBeenCalledTimes(2);
        expect(employeeService.getEmployeeByID).toHaveBeenNthCalledWith(1, mockReq.body.employeeID);
        expect(employeeService.getEmployeeByID).toHaveBeenNthCalledWith(2, mockReq.body.employeeID);
        expect(employeeService.postEmployee).toHaveBeenCalledTimes(1);
        expect(employeeService.postEmployee).toHaveBeenCalledWith(...Object.values(expectedAccount));
    });
});