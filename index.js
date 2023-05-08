

//npm packages
const express = require("express")
const dataStore = require("nedb")
const axios = require("axios")
const cookieParser = require("cookie-parser")

//custom dependancies
const config = require("./metaData")
const middlewares = require("./res/middlewares/main.js")
const functions = require("./res/functions.js")

//Database initialising
const usersDb = new dataStore({ filename: "./res/databases/users.json", timestampData: true })
const postsDb = new dataStore({ filename: "./res/databases/posts.json", timestampData: true })
const secretsDb = new dataStore({ filename: "./res/databases/secrets.json", timestampData: true })


usersDb.loadDatabase()
postsDb.loadDatabase()
secretsDb.loadDatabase()


importantObjects = {
    usersDb,
    postsDb,
    secretsDb
}


//setup express app
const app = express()
app.set("view engine", "ejs")

//set app level middlewares
app.use(express.static("public"))
app.use(express.json())
app.use(cookieParser())

//Custom middlewares
app.use((req,resp,next)=>{
    functions.checkifUserBanned(req, importantObjects)
    .then(userBanned => {
        if(userBanned.result == true){
            resp.send("You are banned")
            return
        }

        //console.log(req.cookies.smaToken)
        console.log(req.path)
        next()
    })
})


//App routing
require("./routes/GET")(app,importantObjects)
require("./routes/POST")(app,importantObjects)

//deploy app
app.listen(config.PORT, () => {
    console.log("App is running ")
})