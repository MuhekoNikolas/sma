



//npm packages
const express = require("express")
const dataStore = require("nedb")
const axios = require("axios")


//custom dependancies
const config = require("../metaData")
const functions = require("../res/functions.js")
const middlewares = require("../res/middlewares/main.js")
const { validateUsername } = require("../res/middlewares/main.js")
const { off } = require("process")




function managePOSTRoutes(app,importantObjects){

    //For logging in users
    app.post("/api/users/loginUser", (req,resp)=>{
        middlewares.actions.login(req,resp,importantObjects)
    })

    //For signing up users
    app.post("/api/users/signupUser", (req,resp)=>{
        middlewares.actions.signup(req,resp,importantObjects)
    
    })

    //For validating Usernames
    app.post("/api/users/validateUsername", (req,resp)=>{
            middlewares.validateUsername(req.body.username,resp,importantObjects)
    })

    //For creating posts
    app.post("/api/posts/create",(req,resp)=>{
        postTitle = req.body.postTitle
        postContent = req.body.postContent

        obj = {
            success:false,
            message:""
        }
        if(postTitle.length < 1){
            obj.message = "Title can't be blank."
            resp.send(obj)
            return
        } else if(postContent.length < 1){
            obj.message = "Content can't be blank."
            resp.send(obj)
            return
        }


        functions.createPost(req,resp,{postTitle,postContent}, importantObjects)
    })


    //For deleting posts
    app.post("/api/posts/delete", (req,resp)=>{
        oldBody = req.body
        body = {

        } 

        body["uniqueId"] = Number(oldBody.postId) || null
        body["author.uniqueId"] = Number(oldBody.authorId) 
        functions.deletePost(req,resp,body,importantObjects)
    })

    //For updating posts
    app.post("/api/posts/update",(req,resp)=>{
        postTitle = req.body.postTitle
        postContent = req.body.postContent
        authorId = req.body.authorId
        postId = req.body.postId

        obj = {
            success:false,
            message:""
        }
        if(postTitle.length < 1){
            obj.message = "Title can't be blank."
            resp.send(obj)
            return
        } else if(postContent.length < 1){
            obj.message = "Content can't be blank."
            resp.send(obj)
            return
        }

        functions.updatePost(req,resp,{authorId, postId, postTitle,postContent}, importantObjects)
    })


    //For updating user settings - Admin
    app.post("/api/users/updateSettingsAdmin", (req,resp)=>{
        obj = {
            success:false,
            message:"",
            errors:[]
        }
        functions.getCurrentUser(req,importantObjects)
        .then(loggedInUser=>{
            loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
            if(userLoggedIn !=true || loggedInUser.admin == false){
                obj.message = "You aren't authorised to do this action"
                resp.send(obj)
                return
            }

            if(loggedInUser.uniqueId == Number(req.body.userId) || loggedInUser.admin == true){
                body = req.body
                body.uniqueName = body.uniqueName || ""
                body.pfp = body.pfp || ""
                body.displayName = body.displayName || ""
        
                objToSend = {
                    errors:[]
                }
        
                objToUpdateTemp = {
        
                }
        
                allowedPfpUrls = ["/static/images/pfps/fox.jpg","/static/images/pfps/demon.jpg","/static/images/pfps/ghosty.jpg","/static/images/pfps/green_pea.jpg","/static/images/pfps/hat_egg.jpg","/static/images/pfps/plate_egg.jpg","/static/images/pfps/red_thing.jpg","/static/images/pfps/robot.jpg","/static/images/pfps/sad_egg.jpg","/static/images/pfps/surprised_egg.jpg"]
                middlewares.validateUsername(body.uniqueName,resp,importantObjects,isApiCall = false)
                .then(usernameValid=>{
                    if(usernameValid.success == true){
                        objToUpdateTemp.uniqueName = `@${body.uniqueName}`
                    } else {
                        objToSend.errors.push(usernameValid.message)
                    }
        
                    if(allowedPfpUrls.includes(body.pfp) || loggedInUser.admin){
                        objToUpdateTemp.pfp = body.pfp
                    } else {
                        objToSend.errors.push("Unrecognised pfp image")
                    } 
        
                    if(body.displayName.length > 1 && body.displayName.length < 20){
                        objToUpdateTemp.displayName = body.displayName
                    } else {
                        objToSend.errors.push("Display name must be between 3-20 characters")
                    }

                    functions.fetchUser(req.body.userId,importantObjects.usersDb)
                    .then(userToUpdate=>{
                        newImportantObjects = importantObjects
                        newImportantObjects.oldLoggedInUser = userToUpdate
                        if(userToUpdate != null){
                            seperateUpdates = ["uniqueId","joinedDate", "url", "postCount", "banned","admin","badges"]
                            objToUpdate = {
        
                            }
                            Object.keys(objToUpdateTemp).forEach(upTemp=>{
                                if(! seperateUpdates.includes(upTemp)){
                                    objToUpdate[upTemp] = objToUpdateTemp[upTemp]
                                }
                            })
        
                            functions.updateUserSettings(userToUpdate, objToUpdate, newImportantObjects).then(_=>{
                                objToSend.success = true
                                objToSend.updatedUser = _ 
                                resp.send(objToSend)
                                return
                            })
        
                        } else {
                            objToSend.success = false 
                            objToSend.message = "No user found."
                            resp.send(objToSend)
                            return
                        }
        
                    })

                })
            } else {
                obj.message = "You aren't authorised to do this action"
                resp.send(obj)
                return
            }

        })
    })

    //For updating user settings - Non admin
    app.post("/api/users/updateSettings", (req,resp)=>{
        body = req.body
        body.uniqueName = body.uniqueName || ""
        body.pfp = body.pfp || ""
        body.displayName = body.displayName || ""

        objToSend = {
            errors:[]
        }

        objToUpdateTemp = {

        }

        allowedPfpUrls = ["/static/images/pfps/fox.jpg","/static/images/pfps/demon.jpg","/static/images/pfps/ghosty.jpg","/static/images/pfps/green_pea.jpg","/static/images/pfps/hat_egg.jpg","/static/images/pfps/plate_egg.jpg","/static/images/pfps/red_thing.jpg","/static/images/pfps/robot.jpg","/static/images/pfps/sad_egg.jpg","/static/images/pfps/surprised_egg.jpg"]
        middlewares.validateUsername(body.uniqueName,resp,importantObjects,isApiCall = false)
        .then(usernameValid=>{
            if(usernameValid.success == true){
                objToUpdateTemp.uniqueName = `@${body.uniqueName}`
            } else {
                objToSend.errors.push(usernameValid.message)
            }

            if(allowedPfpUrls.includes(body.pfp)){
                objToUpdateTemp.pfp = body.pfp
            } else {
                objToSend.errors.push("Unrecognised pfp image")
            } 

            if(body.displayName.length > 1 && body.displayName.length < 20){
                objToUpdateTemp.displayName = body.displayName
            } else {
                objToSend.errors.push("Display name must be between 3-20 characters")
            }

            functions.getCurrentUser(req,importantObjects)
            .then(loggedInUser=>{
                loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
                newImportantObjects = importantObjects
                newImportantObjects.oldLoggedInUser = loggedInUser
                if(userLoggedIn == true){
                    seperateUpdates = ["uniqueId","joinedDate", "url", "postCount", "banned","admin","badges"]
                    objToUpdate = {

                    }
                    Object.keys(objToUpdateTemp).forEach(upTemp=>{
                        if(! seperateUpdates.includes(upTemp)){
                            objToUpdate[upTemp] = objToUpdateTemp[upTemp]
                        }
                    })

                    functions.updateUserSettings(loggedInUser, objToUpdate, newImportantObjects).then(_=>{
                        objToSend.success = true
                        objToSend.updatedUser = _ 
                        resp.send(objToSend)
                        return
                    })

                } else {
                    objToSend.success = false 
                    objToSend.message = "No logged in user found."
                    resp.send(objToSend)
                    return
                }

            })

        })
    })



    //Admin Make user admin
    app.post("/admin/users/manage/admin", (req,resp)=>{
        body = req.body 
        body.userId = body.userId || ""
        body.action = body.action || ""


        functions.getCurrentUser(req,importantObjects)
        .then(loggedInUser=>{
            loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
            if(userLoggedIn == false || loggedInUser.admin == false){
                obj = {
                    success:false,
                    message:"You are't permitted to perform this action"
                }
                resp.send(obj)
                return
            }

            functions.fetchUser(body.userId, importantObjects.usersDb)
            .then(foundUser=>{
                if(foundUser==null){
                    obj = {
                        success:"false",
                        message:"No user found."
                    }
                    resp.send(obj)
                    eturn
                }

                if(body.action.toLowerCase() == "give"){adminBoolean=true} else if(body.action.toLowerCase() == "remove"){adminBoolean=false} else {
                    obj={
                        success:false,
                        message:"Unknown action"
                    }
                    resp.send(obj)
                    return
                }
                if(adminBoolean == true && foundUser.admin == true){
                    obj = {
                        success:false,
                        message:"User is already an admin"
                    }
                    resp.send(obj)
                    return
                }

                if(adminBoolean == false && foundUser.admin == false){
                    obj = {
                        success:false,
                        message:"User isn't an admin."
                    }
                    resp.send(obj)
                    return
                }

                importantObjects.usersDb.loadDatabase()
                importantObjects.usersDb.update({uniqueId:foundUser.uniqueId}, {$set:{admin:adminBoolean}}, {multi:true, returnUpdatedDocs:true}, (err,num,docs)=>{
                    if(err || docs.length < 1){
                        obj = {
                            success:false,
                            message:"An error occured."
                        }
                        resp.send(obj)
                        return
                    }

                    adminBadge = 
                        {
                            name:"Admin",
                            icon:"fa-hammer",
                            cssColor:"cyan",
                            priority:100
                        }

                    updatedUser = docs[0]

                    userBadges = updatedUser.badges 
                    newUserBadges = {}
                    Object.keys(userBadges).forEach(badgeKey=>{
                        if(userBadges[badgeKey].icon != "fa-hammer"){
                            newUserBadges[Object.keys(newUserBadges).length]= userBadges[badgeKey]
                        }
                    })

                    if(updatedUser.admin == true){
                        newUserBadges[Object.keys(newUserBadges).length]= adminBadge
                    } 

                    importantObjects.usersDb.loadDatabase()
                    importantObjects.usersDb.update({uniqueId:foundUser.uniqueId}, {$set:{badges:newUserBadges}}, {multi:true, returnUpdatedDocs:true}, (err,num,docs)=>{
                        if(err){
                            updatedUser = updatedUser
                        } else {
                            updatedUser = docs[0]
                        }

                        updatedUser  = docs[0]

                        importantObjects.postsDb.loadDatabase()
                        importantObjects.postsDb.update({"author.uniqueId":foundUser.uniqueId}, {$set:{author:updatedUser}}, {multi:true, returnUpdatedDocs:true}, (err,num,docs)=>{
                            if(err){
                                obj = {
                                    success:false,
                                    message:"An error occured."
                                }
                                resp.send(obj)
                                return
                            }

                            importantObjects.secretsDb.loadDatabase()
                            importantObjects.secretsDb.update({"user.uniqueId":foundUser.uniqueId}, {$set:{user:updatedUser}}, {multi:true, returnUpdatedDocs:true}, (err,num,docs)=>{
                                if(err || docs.length < 1){
                                    obj = {
                                        success:false,
                                        message:"An error occured."
                                    }
                                    resp.send(obj)
                                    return
                                }

                                obj = {
                                    success:true,
                                    user:docs[0].user
                                }
                                resp.send(obj)

                            })

                        })

                        })
                    })
    
            })

        })
    })

    //Admin Ban User
    app.post("/admin/users/manage/ban", (req,resp)=>{
        body = req.body 
        body.userId = body.userId || ""
        body.action = body.action || ""
        functions.getCurrentUser(req,importantObjects)
        .then(loggedInUser=>{
            loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
            if(userLoggedIn == false || loggedInUser.admin == false){
                obj = {
                    success:false,
                    message:"You are't permitted to perform this action"
                }
                resp.send(obj)
                return
            }

            functions.fetchUser(body.userId, importantObjects.usersDb)
            .then(foundUser=>{
                if(foundUser==null){
                    obj = {
                        success:"false",
                        message:"No user found."
                    }
                    resp.send(obj)
                    eturn
                }

                if(body.action.toLowerCase() == "ban"){banBoolean=true} else if(body.action.toLowerCase() == "unban"){banBoolean=false} else {
                    obj={
                        success:false,
                        message:"Unknown action"
                    }
                    resp.send(obj)
                    return
                }
                if(banBoolean == true && foundUser.banned == true){
                    obj = {
                        success:false,
                        message:"User already banned"
                    }
                    resp.send(obj)
                    return
                }

                if(banBoolean == false && foundUser.banned == false){
                    obj = {
                        success:false,
                        message:"User isn't banned"
                    }
                    resp.send(obj)
                    return
                }

                importantObjects.usersDb.loadDatabase()
                importantObjects.usersDb.update({uniqueId:foundUser.uniqueId}, {$set:{banned:banBoolean}}, {multi:true, returnUpdatedDocs:true}, (err,num,docs)=>{
                    if(err || docs.length < 1){
                        obj = {
                            success:false,
                            message:"An error occured."
                        }
                        resp.send(obj)
                        return
                    }

                    bannedBadge = 
                        {
                            name:"Account Banned",
                            icon:"fa-ban",
                            cssColor:"red",
                            priority:1000
                        }

                    updatedUser = docs[0]

                    userBadges = updatedUser.badges 
                    newUserBadges = {}
                    Object.keys(userBadges).forEach(badgeKey=>{
                        if(userBadges[badgeKey].icon != "fa-ban"){
                            newUserBadges[Object.keys(newUserBadges).length]= userBadges[badgeKey]
                        }
                    })

                    if(updatedUser.banned == true){
                        newUserBadges[Object.keys(newUserBadges).length]= bannedBadge
                    } 

                    importantObjects.usersDb.loadDatabase()
                    importantObjects.usersDb.update({uniqueId:foundUser.uniqueId}, {$set:{badges:newUserBadges}}, {multi:true, returnUpdatedDocs:true}, (err,num,docs)=>{
                        if(err){
                            updatedUser = updatedUser
                        } else {
                            updatedUser = docs[0]
                        }

                        updatedUser  = docs[0]

                        importantObjects.postsDb.loadDatabase()
                        importantObjects.postsDb.update({"author.uniqueId":foundUser.uniqueId}, {$set:{author:updatedUser}}, {multi:true, returnUpdatedDocs:true}, (err,num,docs)=>{
                            if(err){
                                obj = {
                                    success:false,
                                    message:"An error occured."
                                }
                                resp.send(obj)
                                return
                            }

                            importantObjects.secretsDb.loadDatabase()
                            importantObjects.secretsDb.update({"user.uniqueId":foundUser.uniqueId}, {$set:{user:updatedUser}}, {multi:true, returnUpdatedDocs:true}, (err,num,docs)=>{
                                if(err || docs.length < 1){
                                    obj = {
                                        success:false,
                                        message:"An error occured."
                                    }
                                    resp.send(obj)
                                    return
                                }

                                obj = {
                                    success:true,
                                    user:docs[0].user
                                }
                                resp.send(obj)

                            })

                        })

                        })
                    })
    
            })

        })
    })

    //Admin login as user
    app.post("/admin/users/manage/login_as_user", (req,resp)=>{
        body = {
            userId:req.body.userId || ""
        }

        functions.getCurrentUser(req,importantObjects)
        .then(loggedInUser=>{
            loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
            if(userLoggedIn == false || loggedInUser.admin == false){
                obj = {
                    success:false,
                    message:"You are't permitted to perform this action"
                }
                resp.send(obj)
                return
            }

            functions.fetchUser(body.userId, importantObjects.usersDb)
            .then(foundUser=>{
                if(foundUser==null){
                    resp.send({
                        success:false,
                        message:"No user found."
                    })
                    return
                }

                importantObjects.secretsDb.loadDatabase()
                importantObjects.secretsDb.find({"user.uniqueId":foundUser.uniqueId},(err,doc)=>{
                    if(err){
                        resp.send({
                            success:false,
                            message:"An error occureds."
                        })
                        return
                    }
                    if(doc.length < 1){
                        resp.send({
                            success:false,
                            message:"No token found."
                        })
                        return
                    }

                    resp.cookie("smaToken", doc[0].token)
                    resp.send({
                        success:true,
                        message:`Logging in as ${doc[0].user.uniqueName}`
                    })

                })
            })

        })
    })

    //Other Routes
    app.post("/gethost",(req,resp)=>{
        resp.send({host:req.headers.host})
    })

    app.post("/settheme", (req,resp)=>{
        theme = req.theme
        resp.cookie["smaTheme"] = JSON.stringify(theme)
        resp.send({})
    })

    

}


module.exports = managePOSTRoutes