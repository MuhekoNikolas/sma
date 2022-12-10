
//Signup
var usernameInputSignup;
var passwordInputSignup;
var confirmPasswordInputSignup;
var usernameFieldErrorSignup;
var passwordFieldErrorSignup;
var signupButton;

//Login
var loginButton;
var usernameInputLogin;
var passwordInputLogin;

//Home page
var homePostsWrapper;


//User Page
var userProfilePosts;


//Global
var sideMenu;
var usernameFieldErrorLogin;
var passwordFieldErrorLogin;
var postCreationMenu;
var settingsMenu;
var adminSettingMenu;

var allowedSettingsPfpUrls;

function defineVariables(){
    //Run startup functions
    setTheme()

    //Signup vars
    signupButton = document.querySelector(".signupButton")
    usernameInputSignup = document.querySelector("#signupForm > input.signupInput.usernameInput")
    passwordInputSignup = document.querySelector("#signupForm > input.signupInput.passwordInput")
    confirmPasswordInputSignup = document.querySelector("#signupForm > input.signupInput.confirmPasswordInput")

    //Login vars
    loginButton = document.querySelector(".loginButton")
    usernameInputLogin = document.querySelector("#loginForm > input.loginInput.usernameInput")
    passwordInputLogin = document.querySelector("#loginForm > input.loginInput.passwordInput")

    //Home vars
    homePostsWrapper = document.querySelector("#postsWrapper")

    //Userpage vars
    userProfilePosts = document.querySelector(".userProfilePosts")

    //Global
    sideMenu = document.querySelector("#sideMenu") || alert("None")
    usernameFieldErrorSignup = usernameFieldErrorLogin = document.querySelector(".usernameInputErrorField span")
    passwordFieldErrorSignup = passwordFieldErrorLogin = document.querySelector(".passwordInputErrorField span") 
    mainWrapper = document.getElementById("mainWrapper")
    postCreationMenu = document.querySelector("div.createPostMenu") 
    settingsMenu = document.querySelector("div.settingMenu")
    adminSettingMenu = document.querySelector(".adminSettingMenu") || null

    //Settings
    allowedSettingsPfpUrls = ["/static/images/pfps/fox.jpg","/static/images/pfps/demon.jpg","/static/images/pfps/ghosty.jpg","/static/images/pfps/green_pea.jpg","/static/images/pfps/hat_egg.jpg","/static/images/pfps/plate_egg.jpg","/static/images/pfps/red_thing.jpg","/static/images/pfps/robot.jpg","/static/images/pfps/sad_egg.jpg","/static/images/pfps/surprised_egg.jpg"]

   // randomisePosts()
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return {};
}

function setTheme(){
    theme = getCookie("smaTheme")
    try{
        theme = JSON.parse(theme)
        root = document.querySelector(":root")

        selectedTheme = theme
        for(colorProperty of Object.keys(selectedTheme)){
            root.style.setProperty(colorProperty, selectedTheme[colorProperty])
        }

    } catch (err){
        console.log(err)
    }
}

function randomisePosts(){
    if(!homePostsWrapper){return}
    topBar = document.querySelector(".topBar")
    old = new Array(...homePostsWrapper.children)
    old = old.splice(1, old.length)


    old.sort((a,b)=>{
        return 0.5 - Math.random()
    }) 

    homePostsWrapper.innerHTML = ""
    homePostsWrapper.insertBefore(topBar, homePostsWrapper.children.first)

    old.forEach(post=>{
        homePostsWrapper.insertBefore(post, homePostsWrapper.children.first)
    })

}