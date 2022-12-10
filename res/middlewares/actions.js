
//npm packages
const express = require("express")
const dataStore = require("nedb")
const axios = require("axios")
const bcrypt = require("bcrypt")

//custom dependancies
const config = require("../../metaData")
const functions = require("../functions.js")
const middlewares = require("./main.js")


function login(req, resp) {
    username = req.body.username
    password = req.body.password

    obj = {
        success:false,
        message:""
    }

    usernameValidLv1 = functions.validateUsernameLv1(username)
    if(usernameValidLv1.success == false){
        obj.success = false
        obj.message = usernameValidLv1.message
        resp.send(obj)
        return 
    }
    
    importantObjects.usersDb.loadDatabase()
    importantObjects.usersDb.find({uniqueName: `@${username}`},(err,doc)=>{
        if(err){
            obj.success = false
            obj.message = "An error occured"
            resp.send(obj)
            return
        }
        if(doc.length < 1 ){
            obj.success = false
            obj.message = "No account found matching this username"
            resp.send(obj)
            return
        }
        
        passwordValidLv1 = functions.validatePasswordLv1(password)
        if(passwordValidLv1.success == false){
            obj.success = false
            obj.message = passwordValidLv1.message
            resp.send(obj)
            return 
        }
    
    
        importantObjects.secretsDb.loadDatabase()
        importantObjects.secretsDb.find({ "user.uniqueName" : `@${username}` }, (err,doc)=>{
            if(err){
                obj.success = false
                obj.message = "An error occured"
                resp.send(obj)
                return
            }
            
            if(doc.length < 1){
                obj.success = false
                obj.message = "No user found matching this username j"
                resp.send(obj)
                return
            }
            user = doc[0]

            
            passwordsSimilar = comparison = bcrypt.compareSync(password, user.hashedPassword)
            
            if(passwordsSimilar == true ){
                obj.success = true
                obj.message = "Logging in"
    
                tokenString = `${username}${user.user.uniqueId}${password}`
                hashedToken = bcrypt.hashSync(tokenString, config.hashedPasswordRounds)
                obj.loggedInUser = user.user
                resp.cookie("smaToken",user.token,{expires:new Date("01 12 2050"), path:"/"})
                resp.send(obj)
                return
            } else {
                obj.success = false
                obj.message = "Incorrect username or password"
                resp.send(obj)
            }
        })
        
    })
}

function signup(req, resp,importantObjects) {
    username = req.body.username
    password = req.body.password
    
    obj = {
        success: false,
        userCreated: false,
        message: ""
    }
    
    passwordValidLv1 = functions.validatePasswordLv1(password)
    if(passwordValidLv1.success == false){
        obj.success = false
        obj.userCreated= false
        obj.message = passwordValidLv1.message
        resp.send(obj)
        return
    }
    
    usernameValidLv1 = functions.validateUsernameLv1(username)
    if (usernameValidLv1.success == false) {
        obj.message = "Username didn't pass the validation phase"
        resp.send(obj)
        return
    }

    importantObjects.usersDb.loadDatabase()
    importantObjects.usersDb.count({ uniqueName: `@${username}` }, (err, count) => {
        if (err || req.body.password.length < 5) {
            obj.message = "An error occured."
            resp.send(obj)
            return
        }
        if (count < 1) {
            importantObjects.usersDb.count({},(err, totalCountOfUsers)=>{
                
                obj.success = true
                obj.message = "User created successfully"
                obj.userCreated = true
                userObj = functions.generateUser(username)
                userObj.displayName = username
                userObj.uniqueId = totalCountOfUsers

                importantObjects.usersDb.insert(userObj, (err, createdUser) => {
                    if (err) {
                        obj.success = false
                        obj.message = "An error occured."
                        resp.send(obj)
                        return
                    }
                    password = req.body.password
                    tokenString = `${req.body.username}${createdUser.uniqueId}${password}`
                    hashedPassword = bcrypt.hashSync(password, config.hashedPasswordRounds)
                    hashedToken = bcrypt.hashSync(tokenString, config.hashedPasswordRounds)

                    dbsecret = functions.generateSecret(hashedToken, hashedPassword, createdUser)
                    importantObjects.secretsDb.loadDatabase()
                    importantObjects.secretsDb.insert(dbsecret,(err,doc)=>{
                        if(err){
                            obj.message = "An error occured"
                            obj.success = false
                            console.log(err)
                            importantObjects.usersDb.remove({uniqueName:`/@${req.body.username}`},{multi:true})
                            resp.send(obj)
                            return
                        }

                        obj.loggedInUser = createdUser
                        resp.cookie("smaToken",dbsecret.token,{expires:new Date("01 12 2050"), path:"/"})
                        resp.send(obj)
                        return
                    })
                })
            })
        } else {
            obj.message = "An account with this username already exists"
            obj.success = false
            resp.send(obj)
            return
        }
    })


}

module.exports = {
    login,
    signup
}