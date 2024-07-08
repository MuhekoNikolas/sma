
//Modules
const dataStore = require("nedb")
const axios = require("axios")
const cookieParser = require("cookie-parser")
const bcrypt = require("../dependecies/bcrypt.js")

//Custom modules
const functions = require("../functions.js")

//Database initialising
const usersDb = new dataStore({ filename: "../res/databases/users.json", timestampData: true })
const postsDb = new dataStore({ filename: "../res/databases/posts.json", timestampData: true })
const secretsDb = new dataStore({ filename: "../res/databases/secrets.json", timestampData: true })
usersDb.loadDatabase()
postsDb.loadDatabase()
secretsDb.loadDatabase()

//Variables
var signUps = ["/login", "/signup"]

function checkIfLoggedIn(req, resp, next) {
    userCookies = req.cookies
    loggedInObj = {
        loggedIn: false,
        loggedInUser: {}
    }
    
    if (!Object.keys(userCookies).includes("asmPrivateCookie")) {
        next()
        return
    }
    userToken = bcrypt.hashSync(userCookies.asmPrivateCookie)
    
    secretsDb.loadDatabase()
    secretsDb.find({ token: userToken }, (err, doc) => {
        if (err || doc.length < 1) {
            next()
            return
        }
        loggedInObj.loggedInUser = doc[0].user
        loggedInObj.loggedIn = true
        next()
        return
    })
}

module.exports = checkIfLoggedIn