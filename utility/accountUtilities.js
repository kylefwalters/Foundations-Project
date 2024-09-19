function validateAccount(id, password) {
    const isString = typeof id === "string" && typeof password === "string";
    return isString && id.trim() && password.trim();
}

module.exports = {
    validateAccount
}