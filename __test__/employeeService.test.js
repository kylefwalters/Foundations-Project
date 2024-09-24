const employeeService = require('../service/employeeService');
const employeeDAO = require('../DAO/employeeDAO');

jest.mock('../DAO/employeeDAO');

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

describe('employeeService', () => {
    beforeAll(() => {
        // Mock DAO
        employeeDAO.getEmployeeByID.mockImplementation((Key) => {
            return mockDatabase.find((user) => Key.employeeID == user.employeeID);
        });
        employeeDAO.postEmployee.mockImplementation((employee) => {
            return mockDatabase[mockDatabase.push(employee) - 1];
        });
    });

    beforeEach(() => {
        initializeMockDatabase();
    });

    afterEach(() => {
        employeeDAO.getEmployeeByID.mockClear();
        employeeDAO.postEmployee.mockClear();
    });

    test("Getting existing employee by ID", async () => {
        const expectedUser = mockEmployee;

        const result = await employeeService.getEmployeeByID(expectedUser.employeeID);

        expect(result).toBe(expectedUser);
        expect(employeeDAO.getEmployeeByID).toHaveBeenCalledTimes(1);
        expect(employeeDAO.getEmployeeByID).toHaveBeenCalledWith({ employeeID: expectedUser.employeeID });
    });

    test("Getting employee that doesn't exist", async () => {
        const mockID = "fakeID";

        const result = await employeeService.getEmployeeByID(mockID);

        expect(result).toBeFalsy();
        expect(employeeDAO.getEmployeeByID).toHaveBeenCalledTimes(1);
        expect(employeeDAO.getEmployeeByID).toHaveBeenCalledWith({ employeeID: mockID });
    });

    test("Posting a new user", async () => {
        const expectedUser = {
            employeeID: "mockEmployee2",
            password: "newPassword",
            role: "employee"
        };

        const result = await employeeService.postEmployee(expectedUser.employeeID, expectedUser.password, expectedUser.role);

        expect(result).toStrictEqual(expectedUser);
        expect(employeeDAO.postEmployee).toHaveBeenCalledTimes(1);
        expect(employeeDAO.postEmployee).toHaveBeenCalledWith(expectedUser);
    });
});