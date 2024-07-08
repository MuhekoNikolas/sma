

## About
This is a project I did as part of my highschool information technology project. SMA stands for "Social Media App", and its supposed to be some sort of blog/literature site, where users submit both text and media for others to read and view.

## Project plan and route structure
Project Idea.
    - A website where people can write text for others to read.

Pages.
    - Login Page (/login) https://sma.3525nikolas.repl.co/login
    - Signup page (/signup) https://sma.3525nikolas.repl.co/signup
    - Home Page (/) https://sma.3525nikolas.repl.co/
    - User profile page (/users/<@username>) https://sma.3525nikolas.repl.co/users/@niko
    - Post page (/users/< @username >/posts/< postId >) https://sma.3525nikolas.repl.co/users/@niko/posts/1
    - Admin page (/admin) https://sma.3525nikolas.repl.co/admin
    - Support page (/support) https://sma.3525nikolas.repl.co/support
    - Licenses page (/license) https://sma.3525nikolas.repl.co/licences
    - Unsplach license (/licences?provider=unsplash) https://sma.3525nikolas.repl.co/licences?provider=unsplash

/login and /signup are inaccesible by logged in users, /admin is accesible by only admins.

## Guide on how to setup this application locally:

1. Install nodejs from https://nodejs.org/dist/v18.12.1/node-v18.12.1-x64.msi. *Make sure you choose the `Add to Path` option during the installation process.* (Skip this step if you have nodejs already installed)
    - - -  To Check if you have node js installed, open the command prompt and run the "node" command. If a welcome text shows up, then proceed to the next step, else reinstall nodejs(https://nodejs.org/dist/v18.12.1/node-v18.12.1-x64.msi) and add it to path.

2. Open vscode and open the `TERMINAL`, navigate to the project folder with the `cd "[path/to/folder]"` command. 
3. Run index.js when you cd into the project folder. `node index.js`.
    - - - Run `npm install [package name]` command if a "MODULE NOT FOUND ERROR IS INVOKED" (refer to "requirements.txt")
3. Thats all, You can now visit the app at http://localhost.com:8080


* PLEASE REACH OUT IF YOU ENCOUNTER ANY ERRORS.
