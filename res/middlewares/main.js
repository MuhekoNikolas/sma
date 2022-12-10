

var checkIfLoggedIn = require("./checkIfLoggedIn.js")
var actions = require("./actions.js")
var validateInfo = require("./validateInfo.js")
var validateUser = require("./validateUser.js")

module.exports = {
    actions,
    checkIfLoggedIn,
    validateUsername:validateInfo.validateUsername,
    validateUser,
}