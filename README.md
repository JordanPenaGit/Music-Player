# Music-Player


Materials Required
Considering the user has access to a laptop/desktop and internet connection in order to use our
web-application through Google Chrome or Safari, the user will also need some additional
software components and packages to run our source code.
The user will need to install:
• NodeJS version 16.13.2 or later (supposing backwards compatibility is maintained) in
their local machine
NodeJS will enable the installation of all other necessary crucial packages and dependencies
which will be installed using certain commands listed in the Build Instructions section.
Build Instructions
First, the user should clone the project source code from this github.
https://gitlab.com/cop-4331/music-player/-/tree/MP-53-add-song-page

• On one of the terminal windows, go to the server directory using cd server
• To establish a connection with our database, create a file named “.env” that contains the
following text:
MONGO_URI=mongodb+srv://houdaUser:houdaPassword@cluster0.cpw7z.mongodb.net/dev?retry
Writes=true&w=majority
PORT=3001
The user must ensure that the .env file is within the server directory.
• In the server directory, run the command npm install which will download all the server
dependencies listed in the package.json file
• Once the packages are done installing, the user can start the server using nodemon start
or npm run start
On the second terminal window, go to the client directory using the command cd client
• In the client directory, run the command npm install which will download all the client
dependencies listed in the package.json file
• Once the packages are done installing, the user can start the program using the command
npm start
