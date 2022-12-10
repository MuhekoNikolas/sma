

function redirect(url) {
    fetch("/gethost", {method:"POST"}).then(data=>data.json()).then(data=>{
        if(location.hostname == "localhost"){
            window.location = `http://${data.host}/redirect?url=${url}`
        } else {
            window.location = `https://${data.host}/redirect?url=${url}`
        }
    })

}



function changeThemeColor(colorTheme){
    colors = {
        "Normal":{
            "--c1": "#216AF2",
            "--c2": "#0C52D3",
            "--c3": "#0A3FA3",
            "--c4": "#072D73",
            "--c5": "#051e4d",
            "--c5-light": "#04193f",
            "--c6": "#010713",
            "--c7": "#4021F2"
        },
        "Green-Gray":{
            "--c1":"#012626",
            "--c2":"#04BFAD",
            "--c3":"#038C7F",
            "--c4":"#027368",
            "--c5":"#01403A",
            "--c5-light":"#027e72",
            "--c6":"#66353C",
            "--c7":"#011e1b",  
        },
        "Spices":{
            "--c1":"#F2B705",
            "--c2":"#D97904",
            "--c3":"#4d6e02",
            "--c4":"#2b3e01",
            "--c5":"#344b02",
            "--c5-light":"#233201",
            "--c6":"#320501",
            "--c7":"#151e01",  
        },
        "Unwanted":{
            "--c1":"#3a6a89",
            "--c2":"#0CD3D0",
            "--c3":"#F0FF42",
            "--c4":"#4fd5e2",
            "--c5":"#80a9b9",
            "--c5-light":"#abfcf7",
            "--c6":"#157cac",
            "--c7":"#073F73",  
        }
    }
    if(!Object.keys(colors).includes(colorTheme)){return false}

    root = document.querySelector(":root")

    selectedTheme = colors[colorTheme]
    fetch("/setTheme", {method:"POST", body:JSON.stringify(selectedTheme), headers:{"Content-Type":"application/json"}})
    .then(data=>{ 
        for(colorProperty of Object.keys(selectedTheme)){
            root.style.setProperty(colorProperty, selectedTheme[colorProperty])
        }
    })
    document.cookie = `smaTheme=${JSON.stringify(selectedTheme)}; expires=Wed, 31 Aug 2050 21:00:00 UTC; path=/`

}

function manageDropDownMenu(cssQuery, clickedElementQuery) {
    caret = document.querySelector(`${clickedElementQuery} h1 span`)
    menu = document.querySelector(cssQuery)
    menu == null ? ()=>{} : (() => {
        menuHeight = Number((menu.style.height).substring(0, (menu.style.height).length - 2))

        if (menuHeight <= 199) {
            menu.style.opacity = "1"
            menu.style.height = "200px"

            caret.style.color = "#FF0800"
            caret.classList.remove("fa-caret-down")
            caret.classList.add("fa-caret-up")
            menu.classList.add("shown")
            menu.classList.remove("hidden")
        } else {
            menu.style.opacity = "0"
            menu.style.height = "0.1px"

            caret.style.color = "white"

            caret.classList.remove("fa-caret-up")
            caret.classList.add("fa-caret-down")
            setTimeout(() => {
                menu.classList.add("hidden")
                menu.classList.remove("shown")
            }, 500)
        }
    })()

}


function managePostCreationMenu(){
    slideIn = postCreationMenu.classList.contains("slideIn")
    if(slideIn == false){
        postCreationMenu.classList.add("slideIn")
        postCreationMenu.classList.remove("slideOut")

        mainWrapper.style["filter"] = "blur(20px)"
    } else {
        postCreationMenu.classList.add("slideOut")
        postCreationMenu.classList.remove("slideIn")

        
        mainWrapper.style["filter"] = "blur(0)"
    }
}

function isMobile(){
    root = document.querySelector(":root")
    device = window.getComputedStyle(root, null).getPropertyValue("--device")
    device == "mobile"? toReturn = true : toReturn = false
    return toReturn
}

function manageSideMenu(){
    sideMenuHidden = window.getComputedStyle(sideMenu, null).getPropertyValue("display") == "none"
    if(isMobile() == true || sideMenuHidden == true ){
        if(!sideMenuHidden){
            sideMenu.style.display = "none"
        } else {
            sideMenu.style.display = "flex"
        }
    }
}

function manageSettingsMenu(){
    slideIn = settingsMenu.classList.contains("slideIn")
    if(slideIn == false){
        settingsMenu.classList.add("slideIn")
        settingsMenu.classList.remove("slideOut")

        mainWrapper.style["filter"] = "blur(20px)"

    } else {
        settingsMenu.classList.add("slideOut")
        settingsMenu.classList.remove("slideIn")

        mainWrapper.style["filter"] = "blur(0)"
    }
}


function manageAdminSettingsMenu(settingsFor='2'){
    slideIn = adminSettingMenu.classList.contains("slideIn")
    if(slideIn == false){
        adminSettingMenu.classList.add("slideIn")
        adminSettingMenu.classList.remove("slideOut")

        mainWrapper.style["filter"] = "blur(20px)"

    } else {
        adminSettingMenu.classList.add("slideOut")
        adminSettingMenu.classList.remove("slideIn")

        mainWrapper.style["filter"] = "blur(0)"
    }
}

function managePostOptionMenu(button, menuToHide=null){
    if(menuToHide != null){
        menuToHide.classList.remove("showPostMenu")
        return
    }

    parent = button.parentNode
    menu = parent.children[1]
    menu.classList.contains("showPostMenu") == true ? menuHidden = false : menuHidden = true
    document.querySelectorAll(".showPostMenu").forEach(shownPostMenus=>{
        shownPostMenus.classList.remove("showPostMenu")
    })
    if(menuHidden == true){
        menu.classList.add("showPostMenu")
    }

}

function growTextArea(el) {
    el.style.height = "10px"
    el.style.height = (el.scrollHeight)+"px"
}


function newAlertBlock(message, type="error"){

    obj = {
        message,
        type:type,
        color:"red", 
        icon:"fa-exclamation"
    }
    if(type=="success"){
        obj.color = "green",
        obj.icon = "fa-circle-check"
    }

    alertDiv = document.createElement("div")
    alertDiv.setAttribute("class", `alertDiv showAlert fa-bounce`)
    icon = document.createElement("i")
    icon.setAttribute("class", `fa-solid ${obj.icon}`)
    icon.style.color = obj.color

    alertMessageP = document.createElement("p")
    alertMessageP.textContent = message

    alertDiv.appendChild(icon)
    alertDiv.appendChild(alertMessageP)

    //mainWrapper = document.querySelector("#mainWrapper") || document.createElement("div")
    document.body.append(alertDiv)

    setTimeout(()=>{
        alertDiv.classList.remove("showAlert")
        //alertDiv.classList.add("hideAlert")

        shownAlerts  = document.querySelectorAll(".showAlert")
        shownAlert = shownAlerts[shownAlerts.length - 1 ]

        if(shownAlert){
            document.body.removeChild(shownAlert)
        }
    }, 5000)
}


function uploadPost(path){
    
    postTitle = document.querySelector(".createPostMenuTitleInput").value
    postContent = document.querySelector(".createPostMenuContentInput").value
    obj = {
        postTitle,
        postContent,
    }
    options = {
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }
    fetch("/api/posts/create",options)
    .then(data=>data.json())
    .then(response=>{
        if(response.success == true){
            location.reload()
        } else {
            newAlertBlock(message=response.message, type="error")
            return
        }
    })
}


function editPost(postId, authorId, element){
    redirect(`/users/${authorId}/posts/${postId}/edit`)
}

function deletePost(postId, authorId, element){
    obj = {
        authorId, 
        postId
    }
    options = {
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }
    fetch("/api/posts/delete", options)
    .then(resp=>resp.json())
    .then(data=>{
        if(data.success == true){
            element.classList.add("slideOut")
            element.parentNode.removeChild(element)

            newAlertBlock(message=data.message, type="success")

        } else {
            newAlertBlock(message=data.message, type="error")
            return
        }

    })
}

function reportPost(postId, authorId, element){
    alert(`Reported post #${postId} by ${authorId}`)
}



function updateUserSettingsAdmin(allData){
    options = {
        method:"POST",
        body:JSON.stringify(allData),
        headers:{
            "Content-Type":"application/json"
        }
    }

    fetch("/api/users/updateSettingsAdmin",options)
    .then(response=> response.json())
    .then(data=>{
        if(data.success == true && data.errors.length < 3){
            redirect(data.updatedUser.url)
        } 

    })

}

function updateUserSettings(allData, redirectFlag="normal"){
    options = {
        method:"POST",
        body:JSON.stringify(allData),
        headers:{
            "Content-Type":"application/json"
        }
    }

    fetch("/api/users/updateSettings",options)
    .then(response=> response.json())
    .then(data=>{
        if(data.success == true && data.errors.length < 3){
            if(redirectFlag ==  "normal"){
                location.reload()
            } else if(redirectFlag == "myPage"){
                redirect(data.updatedUser.url)
            }
        } else {
            data.errors.forEach(err=>{
                newAlertBlock(err)
            })
        }

    })
}



function validateUsername(username){

    return checkUsername(username).then(usernameValidDB=>{
        if(usernameValidDB.success !=  false){
            return {
                success:true,
                message:usernameValidDB.message,
                usernameTaken:usernameValidDB.usernameTaken
            }
        }
     
        return {
                success:false,
                message:usernameValidDB.message,
                usernameTaken:usernameValidDB.usernameTaken
        }
    })

}


function validatePassword(password){
    obj = {
        success:false,
        message:""
    }
    
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
        message:"Passed"
    }
}


function checkUsername(username){
    obj = {
        username
    }
    options = {
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
          "Content-type":"application/json"
        }
    }
    
    return fetch("/api/users/validateUsername",options)
        .then(data=>data.json())
        .then(data=>{
            return data
    })    
    .catch(err=>{console.log(err)})
}




function signupUser(obj){
    username = obj.username
    password = obj.password
    
    options = {
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }
    fetch("api/users/signupUser", options)
        .then(data=>data.json())
        .then(response=>{
            if(!response.success){
                newAlertBlock(message=response.message, type="error")
                return
            }
            newAlertBlock(message=response.message, type="success")
            redirect(response.loggedInUser.url)        
    }) 
}

function loginUser(obj){
    username = obj.username
    password = obj.password

    options= {
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }
    fetch("/api/users/loginUser",options)
        .then(data=>data.json())
        .then(response=>{
            if(!response.success){
                newAlertBlock(message=response.message, type="error")
                return
            }
            newAlertBlock(message=response.message, type="success")
            redirect(response.loggedInUser.url)  
        })
}