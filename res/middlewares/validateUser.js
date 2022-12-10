
function validateUser(req,resp,next){
    userCookies = req.cookies

    obj = {
        userValid:false
    }
    
    if (!Object.keys(userCookies).includes("asmPrivateCookie")) {
        obj.message = "Not logged in."
        return obj
    }
    userToken = bcrypt.hashSync(userCookies.asmPrivateCookie)

    secretsDb.loadDatabase()
    secretsDb.find({ token: userToken }, (err, doc) => {
        if (err) {
            obj.message = "An errror occured"
            
            return obj
        }
        if( doc.length < 1 ){
            obj.message = "Incorrect secret key"
            return obj
        } 
        obj.userValid = true
        return obj
    })
    
}

module.exports = validateUser