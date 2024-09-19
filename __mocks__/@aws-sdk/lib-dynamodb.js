const libDynamoDB = jest.createMockFromModule('@aws-sdk/lib-dynamodb');

// class GetCommand{
//     constructor(getCommandInput) {}
// }
// libDynamoDB.GetCommand = GetCommand;
// libDynamoDB.PutCommand = GetCommand;
let response = null;
class DynamoDBDocumentClient {
    __setResponse(res) {
        response = res;
    }
    send() {
        return response;
    }
}
libDynamoDB.DynamoDBDocumentClient = {
    from: () => new DynamoDBDocumentClient(),
};


module.exports = libDynamoDB;