const { resolve } = require("path")

function generatePost(author = generateUser(), title = "Hi", textContent = "Hi There") {
    postObject = {
        uniqueId: -1,
        title: title,
        textContent: textContent,
        uploadedOn:new Date().toLocaleString().substring(0, 10),
        url: `/users/${author.uniqueName}/posts/`,
        author: author
    }
    return postObject
}


function generateUser(displayName = "John Doe", pfp = "/../static/images/pfps/loggedout.jpg") {
    userObject = {
        displayName: displayName,
        uniqueName: `@${displayName.replace(" ","_")}`,
        uniqueId: -1,
        pfp: pfp,
        url: `/users/@${displayName.replace(" ","_")}`,
        joinDate: new Date().toLocaleString().substring(0, 10),
        postCount: 0,

        banned: false,
        admin: false,

        badges: []
    }
    return userObject
}

function generateSecret(tokenHash, passwordHash, user){
    tokenTemplate = {
        token: tokenHash,
        hashedPassword: passwordHash,
        user: user
    }
    return tokenTemplate
    
}


function validateUsernameLv1(username){
    username = username  || ""
    if(username.length < 3 || username.length > 20 ){
        return {
            success:false,
            message:"Username must be 3-20 characters in length"
        }
    }
    
    spaceRegex = new RegExp(/[^a-zA-Z0-9\_]/, "g")
    usernameSpaceMatches = [...username.matchAll(spaceRegex)] || []
    if(usernameSpaceMatches.length > 0 ){
        return {
            success:false,
            message:"Username can only contain numbers, letters and underscores."
        }
    }
    
    return {
        success:true,
        message:"Passed Lv1"
    }
}

function validatePasswordLv1(password){
    if(password.length < 5){
        return {
            success:false,
            message:"Password must be 5+ characters in length"
        }
    }
    
    spaceRegex = new RegExp(/[\s]/, "g")
    passwordSpaceMatches = [...password.matchAll(spaceRegex)] || []
    if(passwordSpaceMatches.length > 0 ){
        return {
            success:false,
            message:"Passwords cant have spaces."
        }
    }
    
    return {
        success:true,
        message:"Passed Lv1"
    }
}


function updateUserSettings(userToUpdate, updates, importantObjects){

    return new Promise((resolve,reject)=>{
        
        usersDb = importantObjects.usersDb
        secretsDb = importantObjects.secretsDb
        postsDb = importantObjects.postsDb

        allKeysToUpdate = Object.keys(updates)
        if(allKeysToUpdate.includes("uniqueName")){
            updates.url = `/users/${updates.uniqueName}`
        }
        
        usersDb.loadDatabase()
        usersDb.update({uniqueId:userToUpdate.uniqueId}, {$set: updates}, {multi:true, returnUpdatedDocs:true}, (err,num,doc)=>{
            if(err || doc.length < 1){
                console.log(err)
                resolve(null)
                return
            }

            updatedUser = doc[0]

            updateUserPostsCount(updatedUser, importantObjects)
            .then(_=>{

                secretsDb.loadDatabase()
                secretsDb.update({"user.uniqueId":updatedUser.uniqueId}, {$set: {user:updatedUser}}, {multi:true}, (err,num)=>{
        
                    postsDb.loadDatabase()
                    postsDb.update({"author.uniqueId":updatedUser.uniqueId},{$set: { author : updatedUser} }, {multi:true, returnUpdatedDocs:true}, (err,num, doc)=>{
                        for(updatedPost of doc){
                            postsDb.loadDatabase()
                            postsDb.update({"author.uniqueId":updatedUser.uniqueId, uniqueId:updatedPost.uniqueId}, {$set: {url : `/users/${updatedUser.uniqueName}/posts/${updatedPost.uniqueId}`}}, {multi:true, returnUpdatedDocs:true}, (err,num,doc)=>{
                                if(err){
                                    console.log(err)
                                    resolve(null)
                                    return
                                }
                            })
                            
                        }

                        resolve(updatedUser)
                        return
                    })
        
                })

            })
        })

    })

    
}

function updateUserPostsCount(updatedUser, importantObjects){
    return new Promise((resolve,reject)=>{

        importantObjects.postsDb.loadDatabase()
        importantObjects.postsDb.count({"author.uniqueId":updatedUser.uniqueId}, (err,count)=>{
            if(isNaN(Number(count))==false){
                importantObjects.usersDb.loadDatabase()
                importantObjects.usersDb.update({"uniqueId":updatedUser.uniqueId}, {$set: {postCount:count}}, (err,doc)=>{
                    if(err){
                        console.log(err)
                        resolve(null)
                        return 
                    }
                    resolve(null)
                    return
                })

            } else {
                resolve(null)
                return
            }
        })
    })
}


function fetchUser(handler, db){
    isNaN(Number(handler)) ? handlerParamIsNumber = false : handlerParamIsNumber = true 
    if(handlerParamIsNumber == true){
        db.loadDatabase()
        return new Promise((resolve,reject)=>{
            db.find({ uniqueId: Number(handler) },(err,doc)=>{
                if(err){
                    resolve(null)
                    return
                }
                
                if(doc.length < 1){resolve(null)}
                user = doc[0]
                resolve(user)
                return
            })
        })
    } else {

        db.loadDatabase()
        return new Promise((resolve,reject)=>{
            db.find({ uniqueName: handler },(err,doc)=>{
                if(err){
                    resolve(null)
                    return
                }
                
                if(doc.length < 1){resolve(null)}
                user = doc[0]
                resolve(user)
                return
            })
        })

    }
}


function fetchPost(obj, importantObjects){
    postId = obj.postId
    authorHandler = obj.userHandler

    postsDb = importantObjects.postsDb 
    usersDb = importantObjects.usersDb

    return new Promise((resolve,reject)=>{
        fetchUser(authorHandler, usersDb)
        .then(foundUser=>{
            if(foundUser == null){
                resolve(null)
                return
            }
            
            postsDb.loadDatabase()
            postsDb.find({ $and: [{ uniqueId: Number(postId) },{ "author.uniqueId": foundUser.uniqueId }]}, (err,doc)=>{
                if(err || doc.length < 1){
                    resolve(null)
                    return
                }
                resolve(doc[0])
                return
            })
            return null
        })
    })

}
function getCurrentUser(req,importantObjects){

    usersDb = importantObjects.usersDb
    secretsDb = importantObjects.secretsDb
    postsDb = importantObjects.postsDb

    secretsDb.loadDatabase()
    return new Promise((resolve,reject)=>{
        if(!Object.keys(req.cookies).includes("smaToken")){
            user = generateUser()
            user.bot = true
            resolve(user)
            return
        }

        secretsDb.find({token: req.cookies.smaToken },(err,doc)=>{
            if(err || doc.length < 1){
                user = generateUser()
                user.bot = true
                resolve(user)
                return
            }

            usersDb.loadDatabase()
            usersDb.find({uniqueName:doc[0].user.uniqueName},(err,newDoc)=>{
                if(err){
                    console.log(err)
                    doc[0].user.bot = false
                    resolve(doc[0].user)
                    return
                }
                newDoc[0].bot = false
                resolve(newDoc[0])
                return
            })
        })
    })
}

function getUserPosts(user,db){
    db.loadDatabase()
    return new Promise((resolve,reject)=>{
        db.find({ "author.uniqueName":user.uniqueName, $not:{"author.banned":true}}).sort({createdAt:-1}).exec((err,doc)=>{
            if(err){
                resolve([])
            }
            resolve(doc)
        })
    })
}

function createPost(req,resp,postContentObj,importantObjects){
    postsDb = importantObjects.postsDb
    usersDb = importantObjects.usersDb
    secretsDb = importantObjects.secretsDb
    obj = {
        success:false,
        message:""
    }

    getCurrentUser(req, importantObjects)
    .then((loggedInUser)=>{
        loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
        if(userLoggedIn == false){
            obj.message = "User not logged in."
            resp.send(obj)
            return
        }
        post = generatePost(loggedInUser, postContentObj.postTitle, postContentObj.postContent)

        postsDb.loadDatabase()
        postsDb.count({"author.uniqueName":loggedInUser.uniqueName}, (err,count)=>{
            if(err){
                obj.success = false
                obj.message = "An error occured"
                resp.send(obj)
                return
            }
            post.uniqueId = count+1
            post.url += (count+1).toString()

            postsDb.loadDatabase()
            postsDb.insert(post,(err,doc)=>{
                if(err){
                    obj.success = false
                    obj.message = "An error occured"
                    resp.send(obj)
                    return
                }


                usersDb.loadDatabase()
                usersDb.update({"uniqueName":loggedInUser.uniqueName}, {$set: {postCount:count+1}}, (err,doc)=>{
                    if(err){
                        console.log(err)
                        resp.send(obj)
                        return
                    }
                })
                obj.success = true
                obj.message = "Post created successfully"
                obj.createdPost = doc
                resp.send(obj)
                return
            })

        })
    })
}


function deletePost(req,resp,toDelete,importantObjects){
    obj = {
        success:false,
        message:""
    }


    getCurrentUser(req,importantObjects)
    .then(loggedInUser=>{
        loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
        if(userLoggedIn == false){
            obj.message = "User not logged in."
            resp.send(obj)
            return
        }

        if(loggedInUser.uniqueId != Number(body["author.uniqueId"]) && loggedInUser.admin == false){
            obj.message = "You dont have permission to delete this post."
            resp.send(obj)
            return
        }

        importantObjects.postsDb.loadDatabase()
        importantObjects.postsDb.remove(toDelete,{multi:true},(err,doc)=>{
            if(err){
                obj.success = false
                obj.message = "An error occured"
                resp.send(obj)
                return
            }
            fetchUser(toDelete["author.uniqueId"], importantObjects.usersDb).then(userToUpdate=>{
                updateUserPostsCount(userToUpdate, importantObjects).then(_=>{
                    obj.success = true 
                    obj.message = "Deleted successfully"
                    resp.send(obj)
                    return
                })
            })
        })

    })
}


function updatePost(req,resp,reqInfo, importantObjects){
    obj = {

    }
    getCurrentUser(req,importantObjects)
    .then(loggedInUser=>{
        loggedInUser.bot == false ? userLoggedIn=true : userLoggedIn = false
        if(userLoggedIn == false){
            obj.message = "User not logged in."
            obj.success = false
            resp.send(obj)
            return
        }

        if(loggedInUser.uniqueId != reqInfo.authorId && loggedInUser.admin == false){
            obj.message = "Forbidden!"
            obj.success = false
            resp.send(obj)
            return
        }

        importantObjects.postsDb.loadDatabase()
        importantObjects.postsDb.update({uniqueId:Number(reqInfo.postId), "author.uniqueId":Number(reqInfo.authorId)},{$set:{textContent:reqInfo.postContent , title:reqInfo.postTitle}},{returnUpdatedDocs:true},(err,doc,op)=>{
            if(err){
                obj.success = false
                obj.message = "An error occured"
                resp.send(obj)
                console.log(err)
                return
            }
            obj.success = true
            obj.message= "Successfully updated post."
            resp.send(obj)
            return
        })
    })
}


function checkifUserBanned(req, importantObjects){
    return new Promise((resolve,reject)=>{
        getCurrentUser(req, importantObjects)
        .then(loggedInUser=>{
            if(loggedInUser.banned == true){
                resolve({result:true});
                return
            }
            resolve({result:false})
            return
        })
    })
}

module.exports = {
    generatePost,
    generateUser,
    generateSecret,
    validateUsernameLv1,
    validatePasswordLv1,
    getCurrentUser,
    fetchUser,
    fetchPost,
    getUserPosts,
    createPost,
    deletePost,
    updateUserSettings,
    updatePost,
    checkifUserBanned
}