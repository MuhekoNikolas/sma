

//npm packages
const express = require("express")
const dataStore = require("nedb")
const axios = require("axios")


//custom dependancies
const config = require("../metaData")
const functions = require("../res/functions.js")
const middlewares = require("../res/middlewares/main.js")



//Main GET routes function
function manageGETRoutes(app, importantObjects) {

    //Home Page
    app.get("/", (req, resp) => {
         functions.getCurrentUser(req,importantObjects)
            .then(loggedInUser=>{
                loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
                importantObjects.postsDb.loadDatabase()
                importantObjects.postsDb.find({}).sort({createdAt:-1}).exec((err,allPosts)=>{
                    if(err){
                        resp.send(err)
                        return
                    }

                    resp.render(config.HomePATH + "/public/mainSites/homepage.ejs", {
                        data: {
                            req,
                            config,
                            loggedInUser,
                            userLoggedIn,
                            posts:allPosts,
                            currentPage:"home"
                        }
                    })

                })
        })
    })


    //Admin Page
    app.get("/admin", (req, resp) => {
        functions.getCurrentUser(req,importantObjects)
            .then(loggedInUser=>{
                loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false

                if(userLoggedIn == false || loggedInUser.admin == false){
                    resp.redirect("/")
                    return
                }
                importantObjects.usersDb.loadDatabase()
                importantObjects.usersDb.find({}).sort({createdAt:-1}).exec((err,allUsers)=>{
                    if(err){
                        resp.send(err)
                        return
                    }

                    resp.render(config.HomePATH + "/public/mainSites/admin.ejs", {
                        data: {
                            req,
                            config,
                            loggedInUser,
                            userLoggedIn,
                            allUsers:allUsers,
                            currentPage:"admin"
                        }
                    })

                })
        })
    })


    //Support page
    app.get("/support", (req, resp) => {
        functions.getCurrentUser(req,importantObjects)
            .then(loggedInUser=>{
                loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
                resp.render(config.HomePATH + "/public/otherSites/support.ejs", {
                    data: {
                        req,
                        config,
                        currentPage:"support",
                        loggedInUser,
                        userLoggedIn
                    }
                })

        })
    })


    //Login Page
    app.get("/login", (req, resp) => {
        functions.getCurrentUser(req,importantObjects)
            .then(loggedInUser=>{
                loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
                if(userLoggedIn == true){
                    resp.redirect(loggedInUser.url)
                    return
                }
                
                resp.render(config.HomePATH + "/public/mainSites/login.ejs", {
                    data: {
                        req,
                        config,
                        currentPage:"login"
                    }
                })
        })
    })
    //Log out route
    app.get("/logout", (req, resp) => {
        resp.cookie("smaToken","None",{expires:new Date("01 12 2050")})
        resp.redirect("/login")
        return
    })

    
    //Signup Page
    app.get("/signup", (req, resp) => {
        functions.getCurrentUser(req,importantObjects)
            .then(loggedInUser=>{
                loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
                if(userLoggedIn == true){
                    resp.redirect(loggedInUser.url)
                    return
                }

                resp.render(config.HomePATH + "/public/mainSites/signup.ejs", {
                    data: {
                        req,
                        config,
                        currentPage:"signup"
                    }
                })
            })
    })

    //User profile Page
    app.get("/users/:userHandler", (req, resp) => {

        functions.getCurrentUser(req, importantObjects)
        .then(loggedInUser=>{
            loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
            if(req.params.userHandler == "@me"){
                if(userLoggedIn == true){
                    resp.redirect(`/users/${loggedInUser.uniqueName}`)
                    return
                } else {
                    resp.redirect(`/login`)
                    return
                }
            }

            functions.fetchUser(req.params.userHandler,importantObjects.usersDb)
                .then(pageOwner=>{
                    if(pageOwner == null){
                        resp.render(config.HomePATH+"/public/otherSites/404.ejs",{
                            data: {
                                req,
                                config,
                                currentPage:"404",
                                loggedInUser,
                                userLoggedIn
                            }
                        })
                        return
                    }
                    functions.getUserPosts(pageOwner,importantObjects.postsDb)
                        .then(ownerPosts=>{
                            pageOwner.posts = ownerPosts
                            resp.render(config.HomePATH+ "/public/mainSites/userProfile.ejs", {
                                data: {
                                    req,
                                    config,
                                    pageOwner,
                                    loggedInUser,
                                    userLoggedIn,
                                    currentPage:"userPage"
                                }
                            })        
                        }).catch(err=>{console.log(err)})
                }).catch(err=>{console.log(err)})
            })
    })

    //Post page
    app.get("/users/:userHandler/posts/:postId", (req,resp)=>{
        obj = {
            userHandler:req.params.userHandler,
            postId:req.params.postId
        }

        functions.getCurrentUser(req,importantObjects)
        .then(loggedInUser=>{
            loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false

            functions.fetchPost(obj,importantObjects)
            .then(pagePost=>{
                if(pagePost == null){
                    resp.render(config.HomePATH+"/public/otherSites/404.ejs",{
                        data: {
                            req,
                            config,
                            currentPage:"404",
                            loggedInUser,
                            userLoggedIn
                        }
                    })
                    return
                }
                resp.render( config.HomePATH+ "/public/mainSites/postPage.ejs", {
                    data: {
                        req,
                        config,
                        userLoggedIn,
                        loggedInUser,
                        pagePost
                    }
                })
            }).catch(err=>{console.log(err)})
        }).catch(err=>{console.log(err)})
        
    })


    //Image licences
    app.get("/licences", (req,resp)=>{
        imageLicenseFiles= {
            "":config.HomePATH+"/public/otherSites/licencePage.ejs",
            "unsplash":config.HomePATH+"/public/otherSites/unsplashGallery.ejs",
        }
        req.query.provider == undefined ? galleryToRender = imageLicenseFiles[""] : galleryToRender = imageLicenseFiles[req.query.provider] 
        if(galleryToRender == undefined){
            resp.render(config.HomePATH+"/public/otherSites/404.ejs",{
                data: {
                    req,
                    config,
                    currentPage:"404",
                    loggedInUser,
                    userLoggedIn
                }
            })
            return
        }
        

        functions.getCurrentUser(req,importantObjects)
        .then(loggedInUser=>{
            loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
            resp.render(galleryToRender, {
                data: {
                    req,
                    config,
                    currentPage:"license Gallery",
                    loggedInUser,
                    userLoggedIn
                }
            })

        })

    })


    //Edit posts route
    app.get("/users/:authorId/posts/:postId/edit", (req,resp)=>{
       functions.fetchUser(req.params.authorId,importantObjects.usersDb)
       .then(foundUser=>{
            if(foundUser == null){
                console.log("112")
                resp.render(config.HomePATH+"/public/otherSites/404.ejs",{
                    data: {
                        req,
                        config,
                        currentPage:"404",
                        loggedInUser,
                        userLoggedIn
                    }
                })
                return
            }
            req.params.authorId = foundUser.uniqueId

            functions.getCurrentUser(req, importantObjects).then(loggedInUser=>{
                loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
                if(userLoggedIn==false || loggedInUser.uniqueId != Number(req.params.authorId)){
                    if(loggedInUser.admin == false){
                        resp.send("Denied")
                        return
                    }
                }
                let {postId, authorId} = req.params
                obj={postId:Number(postId), userHandler:Number(authorId)}
                functions.fetchPost(obj, importantObjects).then(pagePost=>{
                    if(pagePost==null){
                        resp.render(config.HomePATH+"/public/otherSites/404.ejs",{
                            data: {
                                req,
                                config,
                                currentPage:"404",
                                loggedInUser,
                                userLoggedIn
                            }
                        })
                        return
                    }
            
                    resp.render(config.HomePATH+"/public/otherSites/editPost.ejs", {
                        data: {
                            req,
                            config,
                            currentPage:"Edit post page",
                            pagePost,
                            loggedInUser,
                            userLoggedIn
                        }
                    })
                })
            })

        })
    })

    //Other Routes
    app.get("/redirect",(req,resp)=>{
        console.log(req.headers.host)
        resp.redirect(`//${req.headers.host}${req.query.url}`)
    })


}



module.exports = manageGETRoutes