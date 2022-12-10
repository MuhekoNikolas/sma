

function updateSettingsData(redirectFlag="normal"){
    allData = {

    }
    settingsUsernameErrorField = document.querySelector(".settingsUsernameErrorField")
    settingsUsernameErrorField.textContent = ""
    
    updateSettingsUsername().then(usernameToChange => {
        updateSettingsPfp().then(pfpToChange => {

            displayNameToChange = updateSettingsDisplayName()

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

            updateUserSettings(allData, redirectFlag=redirectFlag)

        })
    })
}

function updateSettingsUsername(){
    settingsUsernameInput = document.querySelector(".settingsUniqueNameInput")
    settingsUsernameErrorField = document.querySelector(".settingsUsernameErrorField")
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

function updateSettingsDisplayName(){
    settingsDisplayInput = document.querySelector(".settingsDisplayNameInput")
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

function updateSettingsPfp(){
    settingsChoosenPfp = document.querySelector(".settingsSelectedPfp")
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

function selectSettingsPfp(el){
    lastEl = document.querySelector(".settingsSelectedPfp") || document.createElement("div")
    for(otherEl of document.querySelectorAll(".settingsSelectedPfp")){
        otherEl.classList.remove("settingsSelectedPfp")
    }
    if(lastEl.getAttribute("data-url") != el.getAttribute("data-url")){
        el.classList.add("settingsSelectedPfp")
    }
}



function settingMenuFormKeyboardEnter(evt){
    console.log(evt)
    if(evt.which == 13){
        updateSettingsData()
        return
    } else {
        return
    }
}

var settingMenu = document.querySelector(".settingMenu") || null
if(settingMenu != null) { settingMenu.onkeydown= settingMenuFormKeyboardEnter }

