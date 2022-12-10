
function startLoginProcess() {
    loginButton.classList.add("loading")
    username = usernameInputLogin.value
    password = passwordInputLogin.value

    validateUsername(username)
        .then(usernameValidDB=>{
            if(usernameValidDB.success == true){
                usernameFieldErrorLogin.parentNode.style.background = "#9F1D35"
                usernameFieldErrorLogin.textContent = "No account found matching this username"
                newAlertBlock(message="No account found matching this username", type="error")
                loginButton.classList.remove("loading")
                return 
            }
            if(usernameValidDB.usernameTaken !=  true){
                usernameFieldErrorLogin.parentNode.style.background = "#9F1D35"
                usernameFieldErrorLogin.textContent = usernameValidDB.message
                newAlertBlock(message=usernameValidDB.message, type="error")
                loginButton.classList.remove("loading")
                return 
            }
            usernameFieldErrorLogin.parentNode.style.background = "#32CD32"
            usernameFieldErrorLogin.textContent = ""
            
            passwordValid = validatePassword(password)
            if(passwordValid.success == false){
                passwordFieldErrorLogin.parentNode.style.background = "#9F1D35"
                passwordFieldErrorLogin.textContent = passwordValid.message
                newAlertBlock(message=passwordValid.message, type="error")
                loginButton.classList.remove("loading")
                return 
            }

            obj = {
                username,
                password
            }
            
            loginUser(obj)
            loginButton.classList.remove("loading")
    })
    loginButton.classList.remove("loading")
}


function loginFormKeyboardEnter(evt){
    if(evt.which == 13){
        startLoginProcess()
        return
    } else {
        return
    }
}

var loginForm = document.getElementById("loginForm") || null
if(loginForm != null) { loginForm.onkeydown= loginFormKeyboardEnter }