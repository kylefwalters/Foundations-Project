const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { login, register } = require('../endpoints/loginEndpoints');

// for testing dynamodb mock, remove later
const { GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { runCommand } = require('../utility/dynamoUtilities');

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/lib-dynamodb');

const TableName = "Reimbursement_Employees";

describe('login', () => {
    test('logging in with valid credentials', async () => {
        // const reqMock;
        // const resMock;
        // login(reqMock, resMock);
        DynamoDBDocumentClient.from().__setResponse("Response");

        const Key = { employeeID: "13o3" };
        const command = new GetCommand({
            TableName,
            Key
        });
        const data = await runCommand(command);
        console.log(JSON.stringify(data));

        // expect(false).toBe(true);
    });

    test('logging in with wrong id', () => {

    });

    test('logging in with wrong password', () => {

    });

    test('logging in with empty username', () => {

    });
});