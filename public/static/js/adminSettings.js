


function updateAdminSettingsData(saveButton){
    allData = {
        userId:saveButton.getAttribute('data-pageOwner-id')
    }
    settingsUsernameErrorField = document.querySelector(".adminSettingsUsernameErrorField")
    settingsUsernameErrorField.textContent = ""
    
    updateAdminSettingsUsername().then(usernameToChange => {
        updateAdminSettingsPfp().then(pfpToChange => {

            displayNameToChange = updateAdminSettingsDisplayName()

            if(usernameToChange.success == true){
                allData.uniqueName = usernameToChange.username
            } else {
                if(usernameToChange.error != false ){
                    settingsUsernameErrorField.textContent = usernameToChange.message
                }
            }

            if(displayNameToChange.success == true){
                allData.displayName = displayNameToChange.displayName
            }

            if(pfpToChange.success == true){
                allData.pfp = pfpToChange.pfp
            } 

            console.log(allData)
            updateUserSettingsAdmin(allData)

        })
    })
}



function updateAdminSettingsUsername(){
    settingsUsernameInput = document.querySelector(".adminSettingsUniqueNameInput")
    settingsUsernameErrorField = document.querySelector(".adminSettingsUsernameErrorField")
    settingsUsernameErrorField.textContent = ""

    if(settingsUsernameInput){
        username = settingsUsernameInput.value
        if(username.length < 3){
            if(username.length < 1){
                return new Promise((resolve,reject)=>{
                    resolve(
                        {
                            success:false,
                            message:"Username must be 3+ characters long.",
                            error:false
                        }
                    )
                })
                
            }
            return new Promise((resolve,reject)=>{
                resolve(
                    {
                        success:false,
                        message:"Username must be 3+ characters long.",
                        error:true
                    }
                )
            })
        } else {
            return new Promise((resolve,reject)=>{
                validateUsername(username)
                    .then((usernameValidDb)=>{
                        if(usernameValidDb.success == false){
                            resolve({
                                success:false,
                                message:usernameValidDb.message,
                                error:true
                            })
                        }
                        resolve({
                            success:true,
                            username,
                        })

                    })
                })
        }

    } else {
        return {
            success: false,
            message:"No username input found."
        }
    }
}



function updateAdminSettingsDisplayName(){
    settingsDisplayInput = document.querySelector(".adminSettingsDisplayNameInput")
    if(settingsDisplayInput){
        displayName = settingsDisplayInput.value
        if(displayName.length < 1){
            return {
                success:false
            }
        } else {
            return {
                success:true,
                displayName,
            } 
        }
        
    } else {
        return {
            success: false
        }
    }
}

function updateAdminSettingsPfp(){
    settingsChoosenPfp = document.querySelector(".adminSettingsSelectedPfp")
    if(settingsChoosenPfp){
        pfp = settingsChoosenPfp.getAttribute("data-url")
        if( allowedSettingsPfpUrls.includes(pfp) ){
            return fetch(pfp, {method:"HEAD"})
                .then(urlExists=>{
                    if(!urlExists.ok){
                        return {
                           success:false,
                           message:"An error occured while setting up the image" 
                        }
                    }

                    return {
                        success:true,
                        pfp,
                    }

                })

        } else {
            return new Promise((resolve,reject)=>{
                resolve({
                    success:false,
                    message:"Pfp is unverified"
                })
            })
        }

    } else {
        return new Promise((resolve,reject)=>{
            resolve({
                success:false,
                message:"No pfp choosen"
            })
        })
    }
}




function selectAdminSettingsPfp(el){
    lastEl = document.querySelector(".adminSettingsSelectedPfp") || document.createElement("div")
    for(otherEl of document.querySelectorAll(".adminSettingsSelectedPfp")){
        otherEl.classList.remove("adminSettingsSelectedPfp")
    }
    if(lastEl.getAttribute("data-url") != el.getAttribute("data-url")){
        el.classList.add("adminSettingsSelectedPfp")
    }
}


function adminSettingMenuFormKeyboardEnter(evt){
    if(evt.which == 13){
        adminSaveButton = document.querySelector(".adminSettingMenuSaveButton")
        if(adminSaveButton==null){console.log("An error occured");return}
        updateAdminSettingsData(saveButton=adminSaveButton)
        return
    } else {
        return
    }
}

function managePageOwnerAdmin(userId, action, button){

    console.log(button)
    body = {
        userId:userId,
        action:action
    }
    options = {
        method:"POST",
        body:JSON.stringify(body),
        headers:{
            "Content-Type":"application/json"
        }
    }

    fetch("/admin/users/manage/admin", options)
    .then(resp=>resp.json())
    .then(data=>{
        if(data.success==true){
            if(data.user.admin == true){
                button.setAttribute("onclick", `managePageOwnerAdmin(userId=${data.user.uniqueId}, action="remove", button=this)`)
                button.innerText = "Take admin"
                newAlertBlock(`${data.user.uniqueName} is now an admin!`)
                location.reload()
                return
            } else {
                button.setAttribute("onclick", `managePageOwnerAdmin(userId=${data.user.uniqueId}, action="give", button=this)`)
                button.innerText = "Give admin"
                newAlertBlock(`${data.user.uniqueName} is no longer an admin!`)
                location.reload()
                return
            }
        } else {
            newAlertBlock(data.message)
            return
        }
    })

}
function manageAdminSettingsBan(userId, action, button){

    body = {
        userId:userId,
        action:action
    }
    options = {
        method:"POST",
        body:JSON.stringify(body),
        headers:{
            "Content-Type":"application/json"
        }
    }

    fetch("/admin/users/manage/ban", options)
    .then(resp=>resp.json())
    .then(data=>{
        if(data.success==true){
            if(data.user.banned == true){
                button.setAttribute("onclick", `manageAdminSettingsBan(userId=${data.user.uniqueId}, action="unban", button=this)`)
                button.innerText = "Unban"
                newAlertBlock('Banned User!')
                location.reload()
                return
            } else {
                button.setAttribute("onclick", `manageAdminSettingsBan(userId=${data.user.uniqueId}, action="ban", button=this)`)
                button.innerText = "Ban"
                newAlertBlock('Unbanned User!')
                location.reload()
                return
            }
        } else {
            newAlertBlock(data.message)
            return
        }
    })
}


function adminLoginAsUser(userId){
    body = {
        userId:userId,
    }
    options = {
        method:"POST",
        body:JSON.stringify(body),
        headers:{
            "Content-Type":"application/json"
        }
    }

    fetch("/admin/users/manage/login_as_user", options)
    .then(resp=>resp.json())
    .then(data=>{
        newAlertBlock(data.message)
        if(data.success == true){
            location.reload()
            return
        }

    })
}

var adminSettingMenu = document.querySelector(".adminSettingMenu") || null
if(adminSettingMenu != null) { 
    adminSettingMenu.onkeydown= adminSettingMenuFormKeyboardEnter

}


