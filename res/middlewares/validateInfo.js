





//npm packages
const express = require("express")
const dataStore = require("nedb")
const axios = require("axios")


//custom dependancies
const config = require("../../metaData")
const functions = require("../functions.js")
const { resolve } = require("path")



function validateUsername(username,resp, importantObjects={}, isApiCall=true){

    return new Promise((resolve,reject)=>{

        obj = {
            usernameTaken:false,
            success:false,
            message:"",
        }

        nameValidLv1 = functions.validateUsernameLv1(username)
        if(nameValidLv1.success == false){
            obj.message = nameValidLv1.message
            obj.success = false
            if(isApiCall == true){resp.send(obj)}
            resolve(obj)
            return
        }

        importantObjects.usersDb.loadDatabase()
        importantObjects.usersDb.count({ uniqueName: `@${username}` }, (err, count) => {
            if(err){
                obj.message = "An error occured."
                if(isApiCall == true){resp.send(obj)}
                resolve(obj)
                return
            }
            
            if(count < 1){
                obj.usernameTaken = false
                obj.success = true
                obj.message = "Username is not in use."
                if(isApiCall == true){resp.send(obj)}
                resolve(obj)
                return
            }
            
            obj.usernameTaken = true
            obj.success = false
            obj.message = "This username is already in use"
            if(isApiCall == true){resp.send(obj)}
            resolve(obj)
            return            
        })
    })
    
}


// function backendValidateUsername(username,importantObjects){
//     usersDb = importantObjects.usersDb
//     usersDb.loadDatabase()
//     usersDb.find({uniqueName:})
// }



module.exports = {
    validateUsername
}