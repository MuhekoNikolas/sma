

function startSignupProcess() {
    signupButton.classList.add("loading")
    
    username = usernameInputSignup.value
    password = passwordInputSignup.value
    confirmPassword = confirmPasswordInputSignup.value
    
    validateUsername(username).then(usernameValid => {
        if( usernameValid.success == true ){
            usernameFieldErrorSignup.parentNode.style.background = "#32CD32"
            usernameFieldErrorSignup.textContent = ""
            
            passwordValid = validatePasswords(password, confirmPassword)
            if(passwordValid.success==true){
                passwordFieldErrorSignup.parentNode.style.background = "#32CD32"
                passwordFieldErrorSignup.textContent = ""
                obj = {
                    username,
                    password
                }
                signupUser(obj)
                signupButton.classList.remove("loading")
            } else {
                passwordFieldErrorSignup.parentNode.style.background = "#9F1D35"
                passwordFieldErrorSignup.textContent = passwordValid.message
                newAlertBlock(message=passwordValid.message, type="error")
                signupButton.classList.remove("loading")
            } 
            
        } else {
            usernameFieldErrorSignup.parentNode.style.background = "#9F1D35"
            usernameFieldErrorSignup.textContent = usernameValid.message
            newAlertBlock(message=usernameValid.message, type="error")
            signupButton.classList.remove("loading")
        }        
    })
}


function validatePasswords(password1, password2){
    if(password1 != password2){
        return {
            success:false,
            message:"Passwords must match"
        }
    }
    if(password1.length < 5){
        return {
            success:false,
            message:"Passwords must be 5+ characters in length"
        }
    }
    if(password1.match(new RegExp(/[\s]/).length > 0)){
        return {
            success:false,
            message:"Passwords cant have spaces"
        }
    }
    
    return {
            success:true,
            message:"Password passed checks"
    }
}



function signupFormKeyboardEnter(evt){
    if(evt.which == 13){
        startSignupProcess()
        return
    } else {
        return
    }
}

var signupForm = document.getElementById("signupForm") || null
if(signupForm != null) { signupForm.onkeydown= signupFormKeyboardEnter }

